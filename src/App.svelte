



<script lang="ts">

    import * as Tone from 'tone'
    import { onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    import { Synthesizer as Synth } from './app/synthesizer'
    import { Storage } from './app/core/storage'
    import { G } from './app/core/globals'
    
    import { Visuals } from './app/p5/visual'
    import { Track } from './app/track';
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()
    
    G.w = window.innerWidth
    G.h = window.innerHeight

    Visuals.moireShader()

    onMount(() => {

        Tone.start()

        Tone.Transport.start()

        console.log('scroll')

        setTimeout(() => {

            window.scrollTo({
                top: 1000,
                left: 0,
                behavior: 'smooth',
                
            });
        }, 1000)

    })
    
    // Serialize
    const serializeIn = file => {
    
        // file = ''
        if(!file) return
    
        let o = JSON.parse(file)
    
        synthesizer.serializeIn(o)

        synthesizer = synthesizer
    }
    
    const serializeOut = () => {
    
        let o = synthesizer.serializeOut()
    
        return JSON.stringify(o)
    }
    
    // ON CHANGE TAB
    document.addEventListener('visibilitychange', (e) => {
    
        if (document.visibilityState == "visible") {
            console.log('visible')
    
            synthesizer.mute(false)

        }
        else {
            synthesizer.stopAll()
            console.log('not visible')

            synthesizer.mute(true)
        }  // TODO - NOT WORKING?????
    
        
    })
    
    window.addEventListener('resize', () => {
    
        G.w = window.innerWidth
        G.h = window.innerHeight
    })
    
    // ON UNLOAD
    window.onbeforeunload = () => {
    
        Storage.save(serializeOut())
    
        synthesizer.dispose()
    }

    // serializeIn(Storage.load())



    const addTrack = (e) => {

        console.log('add')

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


</script>






<Synthesizer synthesizer={synthesizer} 
                tracks={synthesizer.tracks} 
                on:add={addTrack} 
                on:remove={removeTrack} 
                on:delete={deleteTrack} />



<style>

</style>

