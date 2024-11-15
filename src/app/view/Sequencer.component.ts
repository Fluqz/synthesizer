

import * as Tone from "tone";


import { Synthesizer, type Channel } from "../synthesizer/synthesizer";
import { type NoteLength, type SequenceObject, Sequencer } from "../synthesizer/sequencer";
import { Storage } from "../core/storage";
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { TimelineComponent } from "./Timeline.component";
import { getChannelColor } from "../core/colors";
import { CommonModule } from "@angular/common";


export const convertNoteLength = (n: NoteLength) => {

    switch(n) {

        case '1': return '1n'
        case '1/2': return '2n'
        case '1/4': return '4n'
        case '1/8': return '8n'
        case '1/16': return '16n'
        case '1/32': return '32n'
        case '1/64': return '64n'
    }
}


@Component({


    selector: 'sy-sequencer',
    standalone: true,
    imports: [ CommonModule, TimelineComponent ],
    template: `

    <div *ngIf="sequencer != undefined" class="sequencer-wrapper">

        <div class="sequencer-menu">

            <div class="btn delete" (click)="onDelete()">&#x2715;</div>
            
            <div class="btn duplicate" (click)="onDuplicateHandler($event)">D</div>

            <div class="btn play" [class.active]="sequencer.isPlaying" title="Play" (click)="toggleStartStop()">{{ !sequencer.isPlaying ? 'Play' : 'Stop'}}</div>

            <div class="btn noteLength" (click)="onNoteLength($event)">{{sequencer.noteLength}}</div>

            @for(cc of channels; track cc; let i = $index) {

                <div class="btn" 
                        [class.active]="cc"
                        [style]="cc ? 'background-color:' + getChannelColor(i) : ''" 
                        title="Channels to sequence" 
                        (click)="activateChannel(i, cc)">{{ i }}</div>
            }

        </div>
            
        <div class="sequence">

            <div class="sequence-wrapper">

                <sy-timeline [sequencer]="sequencer" [sequence]="sequencer.sequence" [bars]="bars" (onAddNote)="addNote($event)" />

                <div class="add-remove-cont">

                    <div class="add-bar" (click)="addBar($event)">+</div>
                    <div class="remove-bar" (click)="removeBar($event)">-</div>

                </div>

            </div>

        </div>

    </div>

`,
    styles: `


    .sequencer-wrapper {

        display: inline-flex;
        align-items: center;

        /* height: 75px; */
        min-width: 400px;
        width: 100%;
        height: auto;

        background-color: var(--c-b);

        border: .5px solid var(--c-b);

    }

    .sequencer-menu {

        width: 250px;

        display: inline-block;
    }

    .sequencer-wrapper .sequence {

        width: calc(100% - 250px);
        height: 100%;
    }

    .sequencer-wrapper .sequence-wrapper {

        position: relative;

        width: 100%;
        height: 100%;

        display: inline-flex;

        justify-content: center;
        align-items: center;
    }

    .sequencer-wrapper .sequence .add-remove-cont {

        width: 50px;
        align-self: stretch;
    }
    
    .sequencer-wrapper .sequence .remove-bar,
    .sequencer-wrapper .sequence .add-bar {

        display: inline-flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        width: 50px;
        height: 50%;
        background-color: var(--c-w);
        color: var(--c-b);
    }

    .sequencer-wrapper .sequence .remove-bar:hover,
    .sequencer-wrapper .sequence .add-bar:hover {

        background-color: var(--c-b);
        color: var(--c-y);
    }


`,
})
export class SequencerComponent implements AfterViewInit, OnDestroy {

    private _sequencer: Sequencer
    @Input('sequencer') 
    set sequencer(s: Sequencer) {

        this._sequencer = s

        this.updateBars()
        this.updateChannel()
    }
    get sequencer() : Sequencer { return this._sequencer }

    bars: number = 0

    @Input('channelColors') channelColors: string

    @Output('onDuplicate') onDuplicate: EventEmitter<Sequencer> = new EventEmitter()
    @Output('onDeleteSequencer') onDeleteSequencer: EventEmitter<Sequencer> = new EventEmitter()
    
    /** Array of activated channels. Sequencer can play through all 8 channels simultaniously. */
    channels: boolean[] = []
    /** Set default note length*/
    noteLengths: NoteLength[] = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64']


    constructor() {
    }

    ngAfterViewInit() {

        this.updateChannel()
        this.updateBars()
    }

    ngOnDestroy() {
        Tone.Transport.cancel()
    }

    getChannelColor(i) {

        return getChannelColor(i)
    }

    updateChannel() {

        // Fill channels array with booleans
        for(let i = 0; i < Synthesizer.maxChannelCount; i++) this.channels.push(false)

        // Reactive - update channel array
        for(let i = 0; i < Synthesizer.maxChannelCount; i++) this.channels[i] = false
        for(let c of this.sequencer.channels) this.channels[c] = true
    }

    updateBars() {

        this.bars = this.sequencer.bars
    }

    onNoteLength(e: MouseEvent) {

        let i = this.noteLengths.indexOf(this.sequencer.noteLength)

        if(i == -1) return this.sequencer.noteLength = this.noteLengths[0]

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i >= this.noteLengths.length) i = 0
        else if(i < 0) i = (this.noteLengths.length - 1)

        this.sequencer.noteLength = this.noteLengths[i]

        this.saveUndo()
    }

    /** Add a new bar to sequencer */
    addBar(e) {
        
        this.sequencer.addBar()
        
        this.updateBars()

        this.saveUndo()
    }

    /** Remove one bar from sequencer */
    removeBar(e) {
        
        this.sequencer.removeBar()
        
        const notesToDelete = this.getNotesInBar(this.sequencer.bars)
        
        for(let n of notesToDelete) this.sequencer.removeNote(n.id)
            
        this.updateBars()

        this.saveUndo()
    }
    
    getNotesInBar(bar: number) {
        console.log('getNotesInBar', bar, this.sequencer.bars)
        
        const notes: SequenceObject[] = []
        
        for(let s of this.sequencer.sequence) {
            
            console.log('s', Tone.Time(s.time).toSeconds(), bar)
            if(Tone.Time(s.time).toSeconds() > bar) notes.push(s)
        }
        
        return notes
    }
    
    
    /** Toggle sequencer on/off */
    toggleStartStop() {
        
        if(!this.sequencer.isPlaying) {
            
            this.sequencer.start()
        }
        else this.sequencer.stop()
    }
    
    /** Activate or deactivate channels. Channelnumber and bool */
    activateChannel(channel: Channel, active: boolean) {
        
        // Toggle
        active = !active
        
        this.channels[channel] = active
        
        if(active) this.sequencer.activateChannel(channel)
            else this.sequencer.deactivateChannel(channel)
        
        this.updateChannel()

        this.saveUndo()
    }
    
    /** Duplicate Sequence */
    onDuplicateHandler(e) {
        
        this.onDuplicate.next(this.sequencer)
    }
    
    /** Delete sequencer */
    onDelete() {
        
        this.onDeleteSequencer.next(this.sequencer)
    }
    
    saveUndo() {
        
        Storage.saveUndo(JSON.stringify(this.sequencer.synthesizer.serializeOut()))
    }
}