
<script lang="ts">

    import * as Tone from 'tone'
    import { WebMidi, type NoteMessageEvent } from "webmidi";

    import { onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    import { Synthesizer as Synth, type ISynthesizerSerialization } from './app/synthesizer'
    import { Storage } from './app/util/storage'
    import { G } from './app/core/globals'
    
    import { Visual } from './app/p5/visual'
    import { Track } from './app/track';
    import { Vec2 } from './app/util/math';

    import { DEFAULT_SESSION } from './app/presets';
    import { Midi } from './app/core/midi';


    // Init globals
    G.init()
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()

    // Create Visuals
    let activeVisual = Visual.moire()

    Tone.start()


    // On document ready
    onMount(() => {

        Tone.start()

        Midi.init((e: NoteMessageEvent) => {

            synthesizer.triggerNote(e.note.identifier, Tone.now(), synthesizer.channel, e.note.velocity)
            
        },
        (e) => {
    
            synthesizer.releaseNote(e.note.identifier, Tone.now(), synthesizer.channel)
        })

        // Scroll to bottom
        setTimeout(() => {
            Tone.start()

            window.scrollTo({
                top: 1000,
                left: 0,
                behavior: 'smooth',
            })

        }, 1500)

        /**
         * 
         *  RGB
         * 
'rgb(128, 122, 255)',
'rgb(255, 121, 159)',
'rgb(128, 255, 255)',
'rgb(255, 255, 159)',
'rgb(21, 111, 74)',
'rgb(105, 22, 22)',
'rgb(22, 22, 74)',
'rgb(22, 22, 22)',
'rgb(105, 111, 22)',
'rgb(105, 22, 74)',
'rgb(21, 111, 23)',
         */

        let i = 0
        let colors = [
            
            // '#FFFFFF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF0000', '#00FF00',
    
            //   Cyan        Black      Red      blue
            '#166f4a', '#161616', '#691616', '#16164a',
            'rgb(128, 122, 255)',
            'rgb(255, 121, 159)',
            'rgb(128, 255, 255)',
            'rgb(255, 255, 159)',
            'rgb(21, 111, 74)',
            'rgb(105, 22, 22)',
            'rgb(22, 22, 74)',
            'rgb(22, 22, 22)',
            'rgb(105, 111, 22)',
            'rgb(105, 22, 74)',
            'rgb(21, 111, 23)',
        ]

        /** LOAD FROM LOCAL STORAGE */
        const storageData = Storage.load()

        if(storageData) serializeIn(storageData, true)

        else serializeIn(DEFAULT_SESSION, false)



        // synthesizer.startSequence(0, ['F#2', 'D1', 'F#2', 'C#3'])

        // synthesizer.startSequence(1, ['A3', 'D3', 'E3', 'B3'])

        // synthesizer.startSequence(2, [['A3', 'E4'], 'A4', 'E4', 'D3'])

        // synthesizer.startSequence(3, [['A3', 'E4'], ['D3', 'B4'], ['D3', 'A4'], ['E3', 'B4']])




        colors.sort(() =>  Math.ceil((Math.random() * 2) - 1) )

        setInterval(() => {

            if(i >= colors.length) { 
                
                i = 0 
                colors.sort(() =>  Math.ceil((Math.random() * 2) - 1) )
            }

            document.body.style.backgroundColor = colors[i]

            i++

        }, 10000)
    })
    
    // Serialize
    const serializeIn = (file: any, isString: boolean = false) => {

        // file = ''
        if(file == undefined) return
    
        let o: ISynthesizerSerialization

        if(isString) o = JSON.parse(file)
        else o = file
    
        synthesizer.serializeIn(o)

        synthesizer = synthesizer
    }
    
    const serializeOut = () => {
    
        let o = synthesizer.serializeOut()

        // {
        //     synthesizer: o,
            // eppilepsyMessage: 
        // }
    
        return JSON.stringify(o)
    }
    
    // ON CHANGE TAB
    
    const toggleActive = (active:boolean) => {

        let nsd = Tone.Transport.nextSubdivision('8n')

        
        if (active) {
            // console.log('activate')
            
            synthesizer.mute(false)
            
            // Tone.Transport.start(nsd)
            
            Visual.visualsEnabled = true
            
        }
        else {
            // console.log('deactivate')
            
            // synthesizer.releaseKeys()
            synthesizer.mute(true)
            
            // Tone.Transport.pause(nsd)
            // Tone.Transport.stop(nsd)
            // Tone.Transport.cancel(nsd)

            // TODO - NOT RELEASING KEYS


            Visual.visualsEnabled = false
        }
    }
    document.addEventListener('visibilitychange', (e) => {
        
        if (document.visibilityState == "visible") {
            
            toggleActive(true)
        }
        else {

            toggleActive(false)
        }
    })
    window.addEventListener('focus', () => toggleActive(true))
    window.addEventListener('blur', () => toggleActive(false))

    
    window.addEventListener('resize', () => {
    
        G.w = window.innerWidth
        G.h = window.innerHeight
    })
    
    // ON UNLOAD
    window.onbeforeunload = () => {

        Storage.save(serializeOut())

        synthesizer.mute(true)
    
        // synthesizer.dispose()
    }


    const addTrack = (e) => {

        synthesizer.addTrack(new Track(synthesizer, Synth.nodes.sources.Oscillator()))

        synthesizer = synthesizer
    }

    const removeTrack = (e) => {

        synthesizer.removeTrack(e.detail)

        synthesizer = synthesizer
    }

    const deleteTrack = (e) => {

        synthesizer.removeTrack(e.detail)

        synthesizer = synthesizer
    }
    

    const toggleVisuals = (e) => {

        Visual.visualsEnabled = !Visual.visualsEnabled
    }
    
    const saveVisuals = (e) => {

        Visual.visualsEnabled = false

        G.saveVisuals()

        Visual.visualsEnabled = true
    }

    const collapseVisuals = (e) => {

        Visual.collapsed = !Visual.collapsed

        if(Visual.activeVisual) {

            if(Visual.collapsed) Visual.activeVisual.remove()
            else Visual.activeVisual.restart()
        }
        else Visual.moire()

        console.log('COLL', Visual.collapsed)
    }


    document.addEventListener('click', () => {

        Tone.start()

    })


</script>


{#if !G.fullScreenmode }

<div class="main-ui">

    <div class="btn" on:click={collapseVisuals}>&#x2715;</div>
    <div class="btn" on:click={saveVisuals}>I</div>
    <div class="btn" on:click={toggleVisuals}>V</div>

</div>

{/if}

<div class="synthesizer-wrapper" class:screen-offset={!Visual.collapsed}>

    <Synthesizer synthesizer={synthesizer} 
                    tracks={synthesizer.tracks} 
                    on:add={addTrack} 
                    on:remove={removeTrack} 
                    on:delete={deleteTrack} 
    >
    <!-- on:mousemove={onMouseMove} -->

    <!-- 
        
        <svg class="svg-line">
            
            <line x1={mousePosition.x} y1={mousePosition.y} x2={elementPosition.x} y2={elementPosition.y} stroke="#FFFFFF"></line>
        </svg> -->
        
        
    </Synthesizer>

</div>


<style>

    .main-ui {


    }

    .synthesizer-wrapper {

        position: absolute;

        top: 25px;
        left: 0px;

        width: 100%;
    }

    .synthesizer-wrapper.screen-offset {

        top: 100vh;
    }

    .svg-line {

        position: absolute;
        left: 0px;
        top: 0px;

        display: block;

        width: 100%;
        height: 100%;
    }

</style>

