



<script lang="ts">
    import { onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    import * as P5 from 'p5'
    
    import { Synthesizer as Synth } from './app/synthesizer'
    import { Storage } from './app/core/storage'
    import { G } from './app/core/globals'
    
    import { Visuals } from './app/p5/visual'
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()
    
    onMount(() => {

        G.w = window.innerWidth
        G.h = window.innerHeight

        Visuals.moireShader()

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
    
        }
        else {
            synthesizer.stopAll()
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

    serializeIn(Storage.load())

</script>






<Synthesizer synthesizer={synthesizer} tracks={synthesizer.tracks} />



<style>

</style>

