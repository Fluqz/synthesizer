


<script lang="ts">

    import { onMount } from 'svelte';

    import Key from './Key.svelte'
    import Track from './Track.svelte'
    
    import { Synthesizer } from '../synthesizer'
    import { Knob } from './templates/knob';

    export let synthesizer: Synthesizer


    onMount(() => {

        // Events
        document.addEventListener('keydown', onKeyDown, false)
        document.addEventListener('keyup', onKeyUp, false)


        // Volume Button
        const volume = document.querySelector('#volume')
        const volumeKnob = new Knob('Volume', synthesizer.volume, 0, 1)
        volumeKnob.onChange.subscribe((v) => { synthesizer.setVolume(v) })
        volume.append(volumeKnob.dom)
        

        // Save preset input
        const savePreset: HTMLInputElement = document.querySelector('#save-preset')
        savePreset.value = ''
        savePreset.addEventListener('keydown', (e) => {

            e.stopPropagation()

            if(e.key == 'Enter' && e.target.value != null) {

                synthesizer.savePreset(e.target.value)
            }
        })

        // Load preset select
        const loadPreset = document.querySelector('#load-preset')

        let ps = []
        for(let p of synthesizer.presets) ps.push(p.name)

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


        // Set octave buttons events
        const octaveDown = document.querySelector('#octave-down')
        const octaveUp = document.querySelector('#octave-up')

        octaveDown.addEventListener('click', () => {

            synthesizer.setOctave(synthesizer.octave - 1)
        })

        octaveUp.addEventListener('click', () => {

            synthesizer.setOctave(synthesizer.octave + 1)
        })



        // Arpeggiator
        const arpeggiator = document.querySelector('#arpeggiator')

        arpeggiator.querySelector('input').checked = false
        arpeggiator.addEventListener('change', (e) => {

            synthesizer.toggleArpMode(e.target.checked)
        })

        // Toggle recording button
        const record = document.querySelector('#record')

        record.addEventListener('mousedown', (e) => {

            synthesizer.toggleRecording()
        })

        synthesizer.onRecordingStart.subscribe(() => {

            record.classList[synthesizer.isRecording ? 'add' : 'remove']('recording')
        })
        synthesizer.onRecordingEnd.subscribe(() => {

            record.classList[synthesizer.isRecording ? 'add' : 'remove']('recording')
        })



        // Reset synthesizer button
        const reset = document.querySelector('#reset')

        reset.addEventListener('mousedown', (e) => {

            synthesizer.reset()
        })

    })


    /** Keydown event */
    const onKeyDown = (e) => {

        if(!e) return
        if(e.repeat) return

        console.log('onKeyDown: key', e.key)

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

    
</script>




<div class="synthesizer">

    <div class="keys">

        {#each Synthesizer.keys as key, i}
            <Key key={key} />
            {#if Math.round(Synthesizer.keys.length / 2) - 2 == i}
                <br />
            {/if}
        {/each}

    </div>




    <div class="synthesizer-menu">


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
        </div>
        <!-- <div id="bpm" title="Shift + A">
            <label for="bpm">BPM</label>
            <input type="number" pattern="[0-1]" min="1" max="300" name="bpm"/>
        </div> -->

        <div id="octave-down" class="btn" title="ArrowLeft">{'<'}</div>
        <div id="octave-up" class="btn" title="ArrowRight">{'>'}</div>

        <div id="arpeggiator" title="Shift + A">
            <label for="arp">Arp</label>
            <input type="checkbox" name="arp"/>
        </div>

        <div id="record" class="btn" title="Space">Record</div>
        
        <div id="reset" class="btn">Reset</div>

    </div>


    

    <div class="mixer">

        <div class="tracks">

            {#each synthesizer.tracks as track}
                
                <Track track={track} />

            {/each}

        </div>

    </div>

</div>



<style>

.synthesizer {

    z-index: 1;

    position: absolute;
    bottom: 0px;
    margin: 0 auto;

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


#presets>div {
    display: inline-block;
}
#record.recording {

    background-color: red;
}

</style>