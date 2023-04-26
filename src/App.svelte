
<script lang="ts">

    import * as Tone from 'tone'
    import { onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    import { Synthesizer as Synth, type ISynthesizerSerialization } from './app/synthesizer'
    import { Storage } from './app/core/storage'
    import { G } from './app/core/globals'
    
    import { Visual } from './app/p5/visual'
    import { Track } from './app/track';
    import { Vec2 } from './app/core/math';

    import { DEFAULT_SESSION } from './app/presets';
    import { Midi } from './app/core/midi';


    // Init globals
    G.init()
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()

    // Create Visuals
    Visual.moire()


    // On document ready
    onMount(() => {


        Midi.init()

        // Scroll to bottom
        setTimeout(() => {

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
    
        return JSON.stringify(o)
    }
    
    // ON CHANGE TAB
    
    const toggleActive = (active:boolean) => {
        
        if (active) {
            // console.log('activate')
            
            synthesizer.mute(false)
            
            Tone.Transport.start(Tone.now() + .5)
            
            Visual.visualsEnabled = true
            
        }
        else {
            // console.log('deactivate')
            
            synthesizer.releaseKeys()
            synthesizer.mute(true)
            
            Tone.Transport.stop(Tone.now() + .5)
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
    
        synthesizer.dispose()
    }

    const storageData = Storage.load()

    if(storageData) serializeIn(storageData, true)

    else serializeIn(DEFAULT_SESSION, false)



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
    
    const saveImage = (e) => {

        Visual.visualsEnabled = false

        G.saveVisuals()

        Visual.visualsEnabled = true
    }

</script>


{#if !G.fullScreenmode }

    <div class="btn" on:click={toggleVisuals}>V</div>
    <div class="btn" on:click={saveImage}>I</div>

{/if}


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




<style>

    .svg-line {

        position: absolute;
        left: 0px;
        top: 0px;

        display: block;

        width: 100%;
        height: 100%;
    }

</style>

