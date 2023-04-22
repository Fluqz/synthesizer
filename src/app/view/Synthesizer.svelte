


<script lang="ts">

    import { onMount } from 'svelte';
    
    import Key from './Key.svelte'
    import Track from './Track.svelte'
    import TrackMenu from './TrackMenu.svelte'
    import Knob from "./Knob.svelte"

    import { Track as _Track } from '../track'
    import { Synthesizer } from '../synthesizer'
    import { Vec2 } from '../core/math';
    import { start } from 'tone';

    export let synthesizer: Synthesizer

    export let tracks: _Track[]

    let currentTrack: _Track


    onMount(() => {

        currentTrack = tracks[0]


        // Events
        document.addEventListener('keydown', onKeyDown, false)
        document.addEventListener('keyup', onKeyUp, false)


        // // Save preset input
        // const savePreset: HTMLInputElement = document.querySelector('#save-preset')
        // savePreset.value = ''
        // savePreset.addEventListener('keydown', (e) => {

        //     e.stopPropagation()

        //     if(e.key == 'Enter' && e.target.value != null) {

        //         synthesizer.presetManager.savePreset(e.target.value)
        //     }
        // })

        // // Load preset select
        // const loadPreset = document.querySelector('#load-preset')

        // let ps = []
        // for(let p of synthesizer.presetManager.presets) ps.push(p.name)

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

        // synthesizer.addTrack(new _Track(synthesizer, Synthesizer.nodes.sources.Oscillator()))
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


        // for(let k of Synthesizer.keys) {

        //     if(k.mapping === e.key || k.mapping === e.key.toLowerCase()) {

        //         k.trigger()
        //     }
        // }
    }

    /** Keyup event */
    const onKeyUp = (e) => {

        // if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return

        // for(let k of Synthesizer.keys) {

        //     if(k.mapping === e.key || k.mapping === e.key.toLowerCase()) {

        //         k.release()
        //     }
        // }
    }



    /** Menu */

    let isMenuOpen = false
    let mousePosition: Vec2 = new Vec2()
    let selectedTrack: _Track


    const onClick = (e, track: _Track) => {

        e.stopPropagation()

        const ct = e.currentTarget

        const client = e.currentTarget.getBoundingClientRect()

        console.log('rect',client)

        mousePosition.set(client.x , client.y)

        selectedTrack = track
        
        isMenuOpen = selectedTrack ? true : false
    }

    const onEdit = (e) => {

        console.log('edit')

        selectedTrack = e.detail

        isMenuOpen = selectedTrack ? true : false

        mousePosition.set(0, 0)
    }

    const closeTrackMenu = (e) => {

        e.stopPropagation()

        console.log('close trackmenu')

        selectedTrack = null

        isMenuOpen = false
    }

    /** Menu End*/

</script>



<div class="synthesizer">

    <div class="synthesizer-menu">

        <div class="add-track btn" on:click={addTrack}>+</div>


        <div id="presets">
            <div>
                <label for="savePreset">Save Preset</label>
                <input id="save-preset" type="text" name="savePreset"/>
            </div>

            <div id="load-preset">
                <label for="loadPreset">Load Preset</label>
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

        <div id="record" class="btn" title="Space" on:click={toggleRecording} class:recording={isRecording}>Record</div>
        
        <div id="reset" class="btn" on:click={reset}>Reset</div>

        <div id="mute" class="btn" on:click={mute}>Mute</div>


    </div>


    

    <div class="mixer">
<!-- 
        {#if isMenuOpen }
            
            <TrackMenu track={selectedTrack} position={mousePosition} on:add on:remove/>

        {/if} -->

        <div class="tracks" on:click={closeTrackMenu}>

            {#each tracks as track}
                
                <div class="track">

                    <Track track={track} instrument={track.instrument} nodes={track.nodes} on:delete on:edit={onEdit} />

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

    /* position: relative; */
/* 
    display: inline-flex;
    align-items: center;
    justify-content: flex-start; */

    width: 100%;
/* 
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none; */
}

</style>