import * as Tone from 'tone'

import { Track } from '../synthesizer/track'
import { Sequencer as _Sequencer, Sequencer } from '../synthesizer/sequencer'
import { Node as _Node } from '../synthesizer/nodes/'
import { Synthesizer, type Channel, type ComponentType } from '../synthesizer/synthesizer'
import { G } from '../globals';
import { Storage } from '../core/storage';
import { AfterContentInit, AfterViewInit, Component, HostListener, Input } from '@angular/core'
import { DropdownComponent } from './Dropdown.component'
import { KnobComponent } from './Knob.component'
import { TrackComponent } from './Track.component'
import { SequencerComponent } from './Sequencer.component'
import { KeyComponent } from './Key.component'
import { CommonModule } from '@angular/common'
import { Key } from '../synthesizer/key'

@Component({
    selector: 'sy-synthesizer',
    imports: [CommonModule, DropdownComponent, KnobComponent, TrackComponent, SequencerComponent, KeyComponent],
    template: `


@if (synthesizer != undefined) {
    

    <div class="synthesizer">

        <slot></slot>

        <div class="synthesizer-menu">

            <div class="add-track btn" title="Add Track" (click)="addTrack()">&#x2b;</div>

            <div class="add-sequencer btn" title="Add Sequencer" (click)="addSequencer()">&#x2b;</div>

            <div class="start-all-sequencer btn" title="Start all Sequencers" (click)="startAllSequencers()">{{'>>'}}</div>
            <div class="stop-all-sequencer btn" title="Stop all Sequencers" (click)="stopAllSequencers()">{{'<<'}}</div>

            <div id="mute" class="btn" [class.active]="synthesizer.isMuted" title="Mute" (click)="mute()">M</div>

            <div id="play-btn" class="btn" title="Play | Stop" [class.active]="isPlaying" (click)="togglePlayStop()">{{ isPlaying ? '-' : '>'}}</div>

            <div id="bpm-btn" class="btn" title="BPM"><input type="number" [value]="synthesizer.bpm" pattern="[0-1]" step="1" min="1" max="400" /></div>

            <div id="channel-btn" class="btn" title="Channel - Key: Arrow Up / Down | Click to increase | Click with SHIFT to decrease" (click)="onChannel($event)">{{ synthesizer.channel }}</div>

            <div>
                <div id="octave-down" class="btn" title="Octave Down - Key: Arrow Left" (click)="octaveDown()">{{'<'}}</div>
                <div id="octave" class="btn deactivated" title="Octave">{{synthesizer.octave}}</div>
                <div id="octave-up" class="btn" title="Octave Up - Key: Arrow Right" (click)="octaveUp()">{{'>'}}</div>
            </div>

            <!-- <div id="arpeggiator" class="btn" title="Arpeggiator" (click)={onArpChange}>Arp</div> -->

            <div id="record" class="btn" title="Toggle recording - Key: Space" (click)="toggleRecording($event)" [class.recording]="isRecording">&#x2609;</div>
            

            <div id="presets">

                <div>
                    <!-- <label for="savePreset">Save Preset</label> -->
                    <input id="save-preset" type="text" placeholder="Save Preset" name="savePreset" [value]="presetInputValue" (keydown)="onPresetInput($event)"/>
                </div>
                
                    <div *ngIf="presets.length > 0" id="load-preset">

                        <!-- <label for="loadPreset">Load</label> -->
                        
                        <!-- Presets -->
                        <sy-dropdown
                            [name]="''"
                            [value]="''"
                            [options]="presets"
                            [deletableOptions]="true"
                            (onSelect)="onChangePresets($event)" 
                            (onDeleteOption)="onDeletePresetOption($event)"
                            />
                    </div>

            </div>



            <!-- <Oscilloscope output={synthesizer.volume} /> -->

            <!-- <DCMeter output={synthesizer.volume} /> -->

            
            <div id="volume" title="Master volume">
                
                <sy-knob 
                    [name]="''"
                    [value]="synthesizer.volume.volume.value"
                    [min]="-70" 
                    [max]="6" 
                    (onChange)="synthesizer.setVolume($event)" />
            </div>
            
            <!-- <LevelMeter output={synthesizer.volume} value={synthesizer.volume.volume.value} /> -->
            
            <div id="reset" class="btn" title="ALT - Delete; Click: SHIFT -> DEFAULT, META -> RESET PRESETS" (click)="reset($event)">&#x2715;</div>


        </div>


        <div class="mixer">

            @for(component of components; track component) {

                <div *ngIf="component.name == 'track'" class="track">

                    <sy-track [track]="getTrack(component)" (onDelete)="deleteTrack($event)" (onDuplicate)="duplicateTrack($event)" />

                </div>

                <div *ngIf="component.name == 'sequencer'" class="sequencer">

                    <sy-sequencer [sequencer]="getSequencer(component)" (onDeleteSequencer)="deleteSequencer($event)" (onDuplicate)="duplicateSequencer($event)"/>

                </div>

            }

        </div>


        
        <div *ngIf="synthesizer.tracks.length > 0" class="keys">

            <div *ngIf="keyboardVisible">

                @for(key of keys; track key) {

                    <sy-key [key]="key" />

                }

            <!-- <div (click)={() => keyboardVisible = !keyboardVisible}>:</div> -->

            </div>

        </div>

    </div>


}

`,
    styles: `

    .synthesizer {

        z-index: 1;

        width: 100%;
        height: auto;

        -webkit-user-select: none;  
        -moz-user-select: none;    
        -ms-user-select: none;      
        user-select: none;
    }

    .synthesizer > .mixer {

        width: 100%;
    }

    .synthesizer > .mixer-menu {

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .synthesizer-menu {

        padding: 5px 0px;

        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }


    #presets>div {
        display: inline-block;
    }
    #record.recording {

        background-color: red;
    }

    .track {

        width: 100%;

        min-width: 75px;
        height: 75px;
    }

    #volume .knob-wrapper {

        margin: 0;
    }

    /** Level meter - make global to overwrite defaults */
    :global(.synthesizer-menu .level-meter) {

        border: 2px solid var(--c-y);

        width: 50px;
        height: 50px;
        line-height: 50px;
    }

    .mixer .add-sequencer-btn {

        width: 75px;
        min-width: 75px;
        height: 75px;
        line-height: 75px;

        cursor: pointer;

        text-align: center;

        background-color: var(--c-w);
        color: var(--c-b);
    }
`
})
export class SynthesizerComponent implements AfterViewInit, AfterContentInit {

    @Input('synthesizer') synthesizer: Synthesizer

    components: ComponentType[]

    presets: string[] = []

    keyboardVisible = true
    isRecording = false

    sequencersCollapsed: boolean = false

    presetInputValue: string

    keys: Key[]

    get isPlaying() : boolean { return G.isPlaying }


    constructor() {

    }

    ngAfterViewInit() {

        this.keys = Synthesizer.keys

        this.synthesizer.onComponentsChange.subscribe((c) => {

            this.components = c
        })

        // this.setPresets()
        
        // Events
        // document.addEventListener('keydown', onKeyDown, false)
        // document.addEventListener('keyup', onKeyUp, false)
    }

    ngAfterContentInit(): void {

        this.setPresets()
    }

    addTrack() {

        const t = new Track(this.synthesizer, Synthesizer.nodes.sources.Oscillator())
        this.synthesizer.addTrack(t)

        this.scrollToBottom()

        this.saveUndo()



        return t
    }

    deleteTrack(e) {

        console.log('s delete track', e.detail.id)

        this.synthesizer.removeTrack(e.detail)

        this.saveUndo()
    }

    duplicateTrack(e) {

        if(!e.detail) return

        let duplicate = this.addTrack()

        duplicate.serializeIn(e.detail.serializeOut())

        this.saveUndo()
    }

    addSequencer() {

        const s = new _Sequencer(this.synthesizer)
        this.synthesizer.addSequencer(s)

        this.scrollToBottom()

        this.saveUndo()

        return s
    }
    
    deleteSequencer(e) {

        this.synthesizer.removeSequencer(e.detail)

        this.saveUndo()
    }
    
    duplicateSequencer(e) {

        if(!e.detail) return

        let duplicate = this.addSequencer()

        duplicate.serializeIn(e.detail.serializeOut())

        this.scrollToBottom()

        this.saveUndo()
    }

    startAllSequencers() {

        // BeatMachine.stop()
        
        _Sequencer.startTime = Tone.getContext().currentTime
        console.log('Transport pos',Tone.getTransport().position)
        console.log('Transport prog',Tone.getTransport().progress)

        // Tone.getTransport().position = '0:0:0'
        // Tone.getTransport().loop = true

        for(let seq of this.synthesizer.sequencers) seq.start()

        this.synthesizer = this.synthesizer
        this.synthesizer.sequencers = this.synthesizer.sequencers
        this.synthesizer.components = this.synthesizer.components
    }

    stopAllSequencers() {

        // BeatMachine.stop()
        
        // Tone.getTransport().position = 0

        _Sequencer.startTime = undefined

        for(let seq of this.synthesizer.sequencers) seq.stop()
    }
    
    scrollToBottom() {

        // setTimeout(() => {

        //     window.scrollTo({
        //         top: 1000000000,
        //         left: 0,
        //         behavior: 'smooth',
                
        //     });

        // }, 0)
    }

    onChannel(e) {

        if(!e.shiftKey) this.synthesizer.channel++
        if(e.shiftKey) this.synthesizer.channel--

        if(this.synthesizer.channel >= Synthesizer.maxChannelCount) this.synthesizer.channel = 0
        else if(this.synthesizer.channel < 0) this.synthesizer.channel = (Synthesizer.maxChannelCount - 1) as Channel

        this.saveUndo()
    }

    octaveDown() {

        this.synthesizer.setOctave(this.synthesizer.octave - 1)

        this.saveUndo()
    }
    octaveUp() {

        this.synthesizer.setOctave(this.synthesizer.octave + 1)

        this.saveUndo()
    }


    onArpChange(e) {

        // this.synthesizer.toggleArpMode(e.target.checked)
    }


    // Toggle recording button
    toggleRecording(e) {

        this.synthesizer.onRecordingStart.subscribe(() => {

            this.isRecording = this.synthesizer.isRecording
        })
        this.synthesizer.onRecordingEnd.subscribe(() => {

            this.isRecording = this.synthesizer.isRecording
        })

        this.synthesizer.toggleRecording()
    }


    /** Reset synthesizer button */
    reset(e) {

        this.synthesizer.reset()

        if(e.shiftKey) {

            console.log('RESET - SHIFT -> LOAD DEFAULT')

            this.synthesizer.presetManager.loadPreset(this.synthesizer.presetManager.default)

            this.scrollToBottom()
        }
        else if (e.metaKey) {

            console.log('RESET - META -> RESET PRESETS')

            this.synthesizer.presetManager.reset()
        }

        this.synthesizer = this.synthesizer

        this.saveUndo()
    }

    /** Reset synthesizer button */
    mute() {

        this.synthesizer.mute(!this.synthesizer.isMuted)
    }


    @HostListener('document:keydown', ['$event'])
    /** Keydown event */
    onKeyDown(e) {

        console.log('YOOO', e.key == ' ')
        if(!e) return
        if(e.repeat) return
        if(e.target instanceof HTMLInputElement) return

        // console.log('onKeyDown: key', e.key)

        if(e.key == 'ArrowRight') this.synthesizer.setOctave(this.synthesizer.octave + 1)
        if(e.key == 'ArrowLeft') this.synthesizer.setOctave(this.synthesizer.octave - 1)
        if(e.key == ' ') this.toggleRecording(e)
    }

    @HostListener('document:keyup', ['$event'])
    /** Keyup event */
    onKeyUp(e) {

        // if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return
    }

    setPresets() {

        if(this.presets == undefined) this.presets = []
        this.presets.length = 0
        for(let p of this.synthesizer.presetManager.getPresets()) this.presets.push(p.name)
    }


    onPresetInput(e) {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

            this.synthesizer.presetManager.savePreset(this.presetInputValue)
        }

        this.synthesizer = this.synthesizer

        this.setPresets()

        this.synthesizer = this.synthesizer
    }

    onChangePresets(e) {

        const isMuted = this.synthesizer.isMuted

        this.synthesizer.mute(true)

        setTimeout(() => {

            this.synthesizer.presetManager.loadPresetFromName(e.detail.target.value)
            
            this.synthesizer = this.synthesizer

            this.synthesizer.presetManager = this.synthesizer.presetManager

            this.scrollToBottom()

            setTimeout(() => {
                
                this.synthesizer.mute(isMuted)

            }, 200)
            
        }, 200)

        this.saveUndo()
    }

    onDeletePresetOption(e)  {

        this.synthesizer.presetManager.removePreset(e.detail.target.value)

        this.synthesizer = this.synthesizer

        this.setPresets()

        this.saveUndo()
    }

    togglePlayStop() {

        if(!G.isPlaying) {
            G.start()
            console.log('START', Tone.getTransport().now())
        }
        else {
            Tone.getTransport().stop()
        }

        G.isPlaying = !G.isPlaying
    }

    getTrack(c: ComponentType) {

        if(c == null || !(c instanceof Track)) return null

        for(let t of this.synthesizer.tracks) {

            if(t == c) return t
        }

        return null
    }

    getSequencer(c: ComponentType) {

        if(c == null || !(c instanceof Sequencer)) return null

        for(let s of this.synthesizer.sequencers) {

            if(s == c) return s
        }

        return null
    }

    saveUndo() {

        Storage.saveUndo(JSON.stringify(this.synthesizer.serializeOut()))
    }
}