<script lang="ts">

    import * as Tone from 'tone'

    import { onDestroy, onMount } from 'svelte';
    
    import Key from './Key.svelte'
    import Track from './Track.svelte'
    import Sequencer from "./Sequencer.svelte"

    import Knob from "./Knob.svelte"
    import LevelMeter from "./LevelMeter.svelte"
    import Oscilloscope from "./Oscilloscope.svelte"
    import DCMeter from "./DCMeter.svelte"
    import Dropdown from './Dropdown.svelte';

    import { Track as _Track } from '../track'
    import { Sequencer as _Sequencer } from '../sequencer'
    import { Instrument, Node as _Node } from '../nodes/'
    import { Synthesizer, type Channel, type Component } from '../synthesizer'
    import { writable } from 'svelte/store';
    import { G } from '../globals';
    import { DEFAULT_SESSION } from '../presets';
    import { Visual } from '../p5/visual';
    import { Storage } from '../core/storage';
  import { BeatMachine } from '../beat-machine';

    export let synthesizer: Synthesizer

    let presets: string[] = []

    let keyboardVisible = true

    let sequencersCollapsed: boolean = false

    $: {

        presets = presets

        setPresets()

        synthesizer.tracks = synthesizer.tracks

        synthesizer.components = synthesizer.components

        synthesizer = synthesizer
    }

    onMount(() => {

        setPresets()

        // Events
        document.addEventListener('keydown', onKeyDown, false)
        document.addEventListener('keyup', onKeyUp, false)
    })

    const addTrack = () => {

        const t = new _Track(synthesizer, Synthesizer.nodes.sources.Oscillator())
        synthesizer.addTrack(t)

        synthesizer = synthesizer

        scrollToBottom()

        saveUndo()

        return t
    }

    const deleteTrack = (e) => {

        console.log('s delete track', e.detail.id)

        synthesizer.removeTrack(e.detail)

        synthesizer = synthesizer

        saveUndo()
    }

    const duplicateTrack = (e) => {

        if(!e.detail) return

        let duplicate = addTrack()

        duplicate.serializeIn(e.detail.serializeOut())

        synthesizer = synthesizer

        saveUndo()
    }

    const addSequencer = () => {

        const s = new _Sequencer(synthesizer)
        synthesizer.addSequencer(s)

        synthesizer = synthesizer

        scrollToBottom()

        saveUndo()

        return s
    }
    
    const deleteSequencer = (e) => {

        synthesizer.removeSequencer(e.detail)

        synthesizer = synthesizer

        saveUndo()
    }
    
    const duplicateSequencer = (e) => {

        if(!e.detail) return

        let duplicate = addSequencer()

        duplicate.serializeIn(e.detail.serializeOut())

        scrollToBottom()

        synthesizer = synthesizer

        saveUndo()
    }

    const startAllSequencers = (e) => {

        // BeatMachine.stop()
        
        // Tone.Transport.position = 0

        _Sequencer.startTime = Tone.now()

        for(let seq of synthesizer.sequencers) seq.start()

        synthesizer = synthesizer
        synthesizer.sequencers = synthesizer.sequencers
        synthesizer.components = synthesizer.components
    }

    const stopAllSequencers = (e) => {

        // BeatMachine.stop()
        
        // Tone.Transport.position = 0

        _Sequencer.startTime = undefined

        for(let seq of synthesizer.sequencers) seq.stop()

        synthesizer = synthesizer
        synthesizer.sequencers = synthesizer.sequencers
        synthesizer.components = synthesizer.components
    }
    

    
    const scrollToBottom = () => {

        // setTimeout(() => {

        //     window.scrollTo({
        //         top: 1000000000,
        //         left: 0,
        //         behavior: 'smooth',
                
        //     });

        // }, 0)
    }

    const onChannel = (e) => {

        if(!e.shiftKey) synthesizer.channel++
        if(e.shiftKey) synthesizer.channel--

        if(synthesizer.channel >= Synthesizer.maxChannelCount) synthesizer.channel = 0
        else if(synthesizer.channel < 0) synthesizer.channel = (Synthesizer.maxChannelCount - 1) as Channel

        synthesizer = synthesizer

        saveUndo()
    }

    const octaveDown = () => {

        synthesizer.setOctave(synthesizer.octave - 1)

        synthesizer = synthesizer

        saveUndo()
    }
    const octaveUp = () => {

        synthesizer.setOctave(synthesizer.octave + 1)

        synthesizer = synthesizer

        saveUndo()
    }


    const onArpChange = (e) => {

        synthesizer.toggleArpMode(e.target.checked)

        synthesizer = synthesizer
    }


    let isRecording = false
    // Toggle recording button
    const toggleRecording = (e) => {

        synthesizer.toggleRecording()
        synthesizer = synthesizer
    }
    synthesizer.onRecordingStart.subscribe(() => {

        isRecording = synthesizer.isRecording
        synthesizer = synthesizer
    })
    synthesizer.onRecordingEnd.subscribe(() => {

        isRecording = synthesizer.isRecording
        synthesizer = synthesizer
    })


    /** Reset synthesizer button */
    const reset = (e) => {

        synthesizer.reset()

        if(e.shiftKey) {

            console.log('RESET - SHIFT -> LOAD DEFAULT')

            synthesizer.presetManager.loadPreset(synthesizer.presetManager.default)

            scrollToBottom()
        }
        else if (e.metaKey) {

            console.log('RESET - META -> RESET PRESETS')

            synthesizer.presetManager.reset()
        }

        synthesizer = synthesizer

        saveUndo()
    }

    /** Reset synthesizer button */
    const mute = (e) => {

        synthesizer.mute(!synthesizer.isMuted)
        synthesizer = synthesizer
    }


    /** Keydown event */
    const onKeyDown = (e) => {

        if(!e) return
        if(e.repeat) return
        if(e.target instanceof HTMLInputElement) return

        // console.log('onKeyDown: key', e.key)

        if(e.key == 'ArrowRight') synthesizer.setOctave(synthesizer.octave + 1)
        if(e.key == 'ArrowLeft') synthesizer.setOctave(synthesizer.octave - 1)
        if(e.key == ' ') synthesizer.toggleRecording()

        // TODO Triggers everytime..
        synthesizer = synthesizer
    }

    /** Keyup event */
    const onKeyUp = (e) => {

        // if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return
    }

    const setPresets = () => {

        if(presets == undefined) presets = []
        presets.length = 0
        for(let p of synthesizer.presetManager.getPresets()) presets.push(p.name)
    }

    let presetInputValue: string

    const onPresetInput = (e) => {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

            synthesizer.presetManager.savePreset(presetInputValue)
        }

        synthesizer = synthesizer

        setPresets()

        synthesizer = synthesizer
    }

    const onChangePresets = (e) => {

        const isMuted = synthesizer.isMuted

        synthesizer.mute(true)

        setTimeout(() => {

            synthesizer.presetManager.loadPresetFromName(e.detail.target.value)
            
            synthesizer = synthesizer

            synthesizer.presetManager = synthesizer.presetManager

            scrollToBottom()

            setTimeout(() => {
                
                synthesizer.mute(isMuted)

            }, 200)
            
        }, 200)

        saveUndo()
    }

    const onDeletePresetOption = (e) => {

        synthesizer.presetManager.removePreset(e.detail.target.value)

        synthesizer = synthesizer

        setPresets()

        saveUndo()
    }

    const togglePlayStop = () => {

        if(!G.isPlaying) {
            Tone.start()
            Tone.Transport.start()
            console.log('START', Tone.Transport.now())
        }
        else {
            Tone.Transport.stop()
        }

        G.isPlaying = !G.isPlaying
        synthesizer = synthesizer
    }

    const getTrack = (c: Component) => {

        for(let t of synthesizer.tracks) {

            if(t == c) return t
        }
    }

    const getSequencer = (c: Component) => {

        for(let s of synthesizer.sequencers) {

            if(s == c) return s
        }
    }

    const saveUndo = () => {

        Storage.saveUndo(JSON.stringify(synthesizer.serializeOut()))
    }

    onDestroy(() => {

        // unsubscribeSynthStore()
    })

</script>


<!-- {#if !G.fullScreenmode } -->

    <div class="synthesizer">

        <slot></slot>

        <div class="synthesizer-menu">

            <div class="add-track btn" title="Add Track" on:click={addTrack}>&#x2b;</div>

            <div class="add-sequencer btn" title="Add Sequencer" on:click={addSequencer}>&#x2b;</div>

            <div class="start-all-sequencer btn" title="Start all Sequencers" on:click={startAllSequencers}>{'>>'}</div>
            <div class="stop-all-sequencer btn" title="Stop all Sequencers" on:click={stopAllSequencers}>{'<<'}</div>

            <div id="mute" class="btn" class:active={synthesizer.isMuted} title="Mute" on:click={mute}>M</div>

            <div id="play-btn" class="btn" title="Play | Stop" class:active={G.isPlaying} on:click={togglePlayStop}>{ G.isPlaying ? '-' : '>'}</div>

            <div id="bpm-btn" class="btn" title="BPM"><input type="number" bind:value={ synthesizer.bpm } pattern="[0-1]" step="1" min="1" max="400" /></div>

            <div id="channel-btn" class="btn" title="Channel - Key: Arrow Up / Down | Click to increase | Click with SHIFT to decrease" on:click={onChannel}>{ synthesizer.channel }</div>

            <div>
                <div id="octave-down" class="btn" title="Octave Down - Key: Arrow Left" on:click={octaveDown}>{'<'}</div>
                <div id="octave" class="btn deactivated" title="Octave">{synthesizer.octave}</div>
                <div id="octave-up" class="btn" title="Octave Up - Key: Arrow Right" on:click={octaveUp}>{'>'}</div>
            </div>

            <!-- <div id="arpeggiator" class="btn" title="Arpeggiator" on:click={onArpChange}>Arp</div> -->

            <div id="record" class="btn" title="Toggle recording - Key: Space" on:click={toggleRecording} class:recording={isRecording}>&#x2609;</div>
            

            <div id="presets">

                <div>
                    <!-- <label for="savePreset">Save Preset</label> -->
                    <input id="save-preset" type="text" placeholder="Save Preset" name="savePreset" bind:value={presetInputValue} on:keydown={onPresetInput}/>
                </div>

                {#if presets.length > 0 }
                
                    <div id="load-preset">

                        <!-- <label for="loadPreset">Load</label> -->
                        
                        <!-- Presets -->
                        <Dropdown
                            name={''}
                            value={''}
                            options={presets}
                            deletableOptions={true}
                            on:onSelect={onChangePresets} 
                            on:onDeleteOption={onDeletePresetOption}
                            />
                    </div>

                {/if}

            </div>



            <Oscilloscope output={synthesizer.volume} />

            <!-- <DCMeter output={synthesizer.volume} /> -->

            
            <div id="volume" title="Master volume">
                
                <Knob 
                name=""
                value={synthesizer.volume.volume.value}
                min={-70} 
                max={6} 
                on:onChange={(e) => synthesizer.setVolume(e.detail)} />
            </div>
            
            <LevelMeter output={synthesizer.volume} value={synthesizer.volume.volume.value} />
            
            <div id="reset" class="btn" title="ALT - Delete; Click: SHIFT -> DEFAULT, META -> RESET PRESETS" on:click={reset}>&#x2715;</div>


        </div>

        
        <!-- <div class="mixer">

            <div class="tracks">

                {#each synthesizer.tracks as track}
                    
                    <div class="track">

                        <Track bind:track={track} on:delete={deleteTrack} on:duplicate={duplicateTrack} />

                    </div>

                {/each}

            </div>


            {#if !sequencersCollapsed }
                
                <div class="sequencers">

                    
                    {#each synthesizer.sequencers as sequencer, i}
                        
                        <Sequencer sequencer={sequencer} on:deleteSequencer={deleteSequencer} on:duplicate={duplicateSequencer}/>

                    {/each}


                </div>
                
            {/if}

        </div> -->






        <div class="mixer">

            {#each synthesizer.components as component}

                {#if component.name == 'track' }
                    
                    <div class="track">

                        <Track track={getTrack(component)} on:delete={deleteTrack} on:duplicate={duplicateTrack} />

                    </div>

                {/if}

                {#if component.name == 'sequencer' }

                    <Sequencer sequencer={getSequencer(component)} on:deleteSequencer={deleteSequencer} on:duplicate={duplicateSequencer}/>

                {/if}

            {/each}

        </div>










        
        {#if synthesizer.tracks.length > 0 }

            <div class="keys">
                
                {#if keyboardVisible }

                    {#each Synthesizer.keys as key }

                        <Key key={key} />
                        
                    {/each}
                    
                {/if}

                <!-- <div on:click={() => keyboardVisible = !keyboardVisible}>:</div> -->

            </div>

        {/if}

    </div>

<!-- {/if} -->





<style>

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

</style>