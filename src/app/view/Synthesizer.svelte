


<script lang="ts">

    import { onDestroy, onMount } from 'svelte';
    
    import Key from './Key.svelte'
    import Track from './Track.svelte'
    import Knob from "./Knob.svelte"

    import { Track as _Track } from '../track'
    import { Instrument, Node as _Node } from '../nodes/'
    import { Synthesizer } from '../synthesizer'
    import { writable } from 'svelte/store';
    import { G } from '../core/globals';
    import Dropdown from './Dropdown.svelte';
    import { DEFAULT_SESSION } from '../presets';

    export let synthesizer: Synthesizer

    export let tracks: _Track[]


    let tracksStore = writable(tracks)

    let presets: string[] = []

    let unsubscribeSynthStore = synthesizer.store.subscribe((s: Synthesizer) => {

        synthesizer = s
        tracksStore.set(s.tracks)

        presets = [  ]
        for(let p of synthesizer.presetManager.presets) presets.push(p.name)
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

        synthesizer.store.set(synthesizer)

        scrollToBottom()
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

    onDestroy(() => {

        unsubscribeSynthStore()
    })

</script>



<div class="synthesizer">

    <slot></slot>

    <div class="synthesizer-menu">

        <div class="add-track btn" on:click={addTrack}>+</div>


        <div id="presets">
            <div>
                <label for="savePreset">Save Preset</label>
                <input id="save-preset" type="text" placeholder="Preset" name="savePreset" bind:value={presetInputValue} on:keydown={onPresetInput}/>
            </div>

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
        </div>




        <div id="volume" title="Shift + A">

            <Knob 
                name="Volume" 
                value={synthesizer.volume}
                min={0} 
                max={1} 
                on:onChange={(e) => synthesizer.setVolume(e.detail)} />
        </div>
        
        <!-- <div id="bpm" title="Shift + A">
            <label for="bpm">BPM</label>
            <input type="number" pattern="[0-1]" min="1" max="300" name="bpm"/>
        </div> -->

        <div id="octave-down" class="btn" title="ArrowLeft" on:click={octaveDown}>{'<'}</div>
        <div id="octave-up" class="btn" title="ArrowRight" on:click={octaveUp}>{'>'}</div>

        <div id="arpeggiator" title="Shift + A">
            <label for="arp">Arp</label>
            <input type="checkbox" name="arp" on:change={onArpChange}/>
        </div>

        <div id="record" class="btn" title="Space" on:click={toggleRecording} class:recording={isRecording}>&#x2609;</div>
        
        <div id="reset" class="btn" title="ALT - Delete; Click: SHIFT -> DEFAULT, META -> RESET PRESETS" on:click={reset}>R</div>

        <div id="mute" class="btn" title="ALT - M" on:click={mute}>M</div>


    </div>


    

    <div class="mixer">

        <div class="tracks">

            {#each $tracksStore as track}
                
                <div class="track">

                    <Track bind:track={track} on:delete />

                </div>

            {/each}

        </div>

    </div>




    <div class="keys">

        {#each Synthesizer.keys as key, i}

            <Key key={key} />
            
        {/each}

    </div>



</div>









<style>

.synthesizer {

    z-index: 1;

    position: absolute;
    top: 100vh;
    width: 100%;

    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;
}

.synthesizer > .keys {

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

</style>