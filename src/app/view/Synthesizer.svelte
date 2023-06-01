


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
    import { Synthesizer, type Channel } from '../synthesizer'
    import { writable } from 'svelte/store';
    import { G } from '../core/globals';
    import { DEFAULT_SESSION } from '../presets';
    import { Visual } from '../p5/visual';

    export let synthesizer: Synthesizer

    export let tracks: _Track[]

    let keyboardVisible = true

    let sequencersCollapsed: boolean = false

    let tracksStore = writable(tracks)

    let presets: string[] = []

    let unsubscribeSynthStore = synthesizer.store.subscribe((s: Synthesizer) => {

        synthesizer = s
        tracksStore.set(s.tracks)

        presets = [  ]
        for(let p of synthesizer.presetManager.getPresets()) presets.push(p.name)
    })

    onMount(() => {


        // Events
        document.addEventListener('keydown', onKeyDown, false)
        document.addEventListener('keyup', onKeyUp, false)

        // savePreset.addEventListener('keydown', (e) => {

        //     e.stopPropagation()

        //     if(e.key == 'Enter' && e.target.value != null) {

        //         synthesizer.presetManager.savePreset(e.target.value)
        //     }
        // })


        // let presetDropdown = new Dropdown(ps, undefined, false, true)
        // presetDropdown.onSelectOption.subscribe((o) => {

        //     synthesizer.loadPreset(o)
        // })
        // presetDropdown.onDeleteOption.subscribe((o) => {

        //     synthesizer.removePreset(o)
        // })
        // loadPreset.appendChild(presetDropdown.dom)

        // synthesizer.onSavePreset.subscribe((p) => {

        //     presetDropdown.add(p.name)
        // })
        // synthesizer.onRemovePreset.subscribe((p) => {

        //     presetDropdown.remove(p.name)
        // })
    })

    const addTrack = () => {

        synthesizer.addTrack(new _Track(synthesizer, Synthesizer.nodes.sources.Oscillator()))

        tracksStore.set(synthesizer.tracks)

        synthesizer = synthesizer

        scrollToBottom()
    }

    const deleteTrack = (e) => {

        synthesizer.removeTrack(e.detail)

        tracksStore.set(synthesizer.tracks)

        synthesizer = synthesizer
    }

    const addSequencer = () => {

        synthesizer.addSequencer(new _Sequencer(synthesizer))

        synthesizer.store.set(synthesizer)

        scrollToBottom()
    }
    
    const deleteSequencer = (e) => {

        synthesizer.removeSequencer(e.detail)
    }
    
    const scrollToBottom = () => {

        setTimeout(() => {

            window.scrollTo({
                top: G.h,
                left: 0,
                behavior: 'smooth',
                
            });

        }, 0)
    }

    const onChannel = (e) => {

        if(!e.shiftKey) synthesizer.channel++
        if(e.shiftKey) synthesizer.channel--

        if(synthesizer.channel >= Synthesizer.maxChannelCount) synthesizer.channel = 0
        else if(synthesizer.channel < 0) synthesizer.channel = (Synthesizer.maxChannelCount - 1) as Channel
    }

    const octaveDown = () => {

        synthesizer.setOctave(synthesizer.octave - 1)
    }
    const octaveUp = () => {

        synthesizer.setOctave(synthesizer.octave + 1)
    }


    const onArpChange = (e) => {

        synthesizer.toggleArpMode(e.target.checked)
    }


    let isRecording = false
    // Toggle recording button
    const toggleRecording = (e) => {

        synthesizer.toggleRecording()
    }
    synthesizer.onRecordingStart.subscribe(() => {

        isRecording = synthesizer.isRecording
    })
    synthesizer.onRecordingEnd.subscribe(() => {

        isRecording = synthesizer.isRecording
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

        synthesizer.store.set(synthesizer)
    }

    /** Reset synthesizer button */
    const mute = (e) => {

        synthesizer.mute(!synthesizer.isMuted)
    }


    /** Keydown event */
    const onKeyDown = (e) => {

        if(!e) return
        if(e.repeat) return

        // console.log('onKeyDown: key', e.key)

        if(e.key == 'ArrowRight') synthesizer.setOctave(synthesizer.octave + 1)
        if(e.key == 'ArrowLeft') synthesizer.setOctave(synthesizer.octave - 1)
        if(e.key == ' ') synthesizer.toggleRecording()
    }

    /** Keyup event */
    const onKeyUp = (e) => {

        // if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return
    }

    let presetInputValue: string

    const onPresetInput = (e) => {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

            synthesizer.presetManager.savePreset(presetInputValue)
        }

        synthesizer.store.set(synthesizer)
    }

    const onChangePresets = (e) => {

        synthesizer.presetManager.loadPresetFromName(e.detail.target.value)

        synthesizer.store.set(synthesizer)

        scrollToBottom()
    }

    const onDeletePresetOption = (e) => {

        synthesizer.presetManager.removePreset(e.detail.target.value)

        synthesizer.store.set(synthesizer)
    }

    const togglePlayStop = () => {

        if(!synthesizer.isPlaying) {
            Tone.start()
            Tone.Transport.start()
        }
        else {
            Tone.Transport.stop()
        }

        synthesizer.isPlaying = !synthesizer.isPlaying
    }

    onDestroy(() => {

        unsubscribeSynthStore()
    })

</script>


{#if !G.fullScreenmode }

    <div class="synthesizer">

        <slot></slot>

        <div class="synthesizer-menu">

            <div class="add-track btn" title="Add Track" on:click={addTrack}>&#x2b;</div>

            <div id="mute" class="btn" class:active={synthesizer.isMuted} title="Mute" on:click={mute}>M</div>

            <!-- <div id="bpm" title="Shift + A">
                <label for="bpm">BPM</label>
                <input type="number" pattern="[0-1]" min="1" max="300" name="bpm"/>
            </div> -->

            <div id="play-btn" class="btn" title="Play" class:active={synthesizer.isPlaying} on:click={togglePlayStop}>{ synthesizer.isPlaying ? '-' : '>'}</div>

            <div id="bpm-btn" class="btn" title="BPM"><input type="number" bind:value={ synthesizer.bpm } step="1" min="1" max="400" /></div>

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

                        <label for="loadPreset">Load</label>
                        
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



            <Oscilloscope output={synthesizer.gain} />

            <DCMeter output={synthesizer.gain} />

            
            <div id="volume" title="Master volume">
                
                <Knob 
                name=""
                value={synthesizer.volume}
                min={0} 
                max={1} 
                on:onChange={(e) => synthesizer.setVolume(e.detail)} />
            </div>
            <LevelMeter output={synthesizer.gain} value={synthesizer.gain.gain.value} />
            
            <div id="reset" class="btn" title="ALT - Delete; Click: SHIFT -> DEFAULT, META -> RESET PRESETS" on:click={reset}>&#x2715;</div>


        </div>

        <div class="mixer">

            <div class="tracks">

                {#each tracks as track}
                    
                    <div class="track">

                        <Track bind:track={track} on:delete={deleteTrack} />

                    </div>

                {/each}

            </div>

        </div>


        {#if !sequencersCollapsed }
            
            <div class="sequencers">

                
                {#each synthesizer.sequencers as sequencer, i}
                    
                    <div>{i}</div>

                    <Sequencer sequencer={sequencer} on:deleteSequencer={deleteSequencer} />

                {/each}

                <div class="add-sequencer-btn" on:click={addSequencer}>&#x2b;</div>

            </div>
            
        {/if}

        
        <div class="keys">
            
            {#if keyboardVisible }

                {#each Synthesizer.keys as key }

                    <Key key={key} />
                    
                {/each}
                
            {/if}

            <!-- <div on:click={() => keyboardVisible = !keyboardVisible}>:</div> -->

        </div>

    </div>

{/if}





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

.synthesizer > .mixer > .tracks{
    width: 100%;
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

.sequencers {

    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: 100%;
    height: 75px;
    border-top: 1px solid var(--c-b);
    border-top: .5px solid var(--c-b);

    background-color: var(--c-b);



    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}

.sequencers .add-sequencer-btn {

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