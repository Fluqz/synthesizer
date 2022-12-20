



<script lang="ts">
    import { onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    // @ts-ignore
    import * as P5 from 'p5'
    
    import { Synthesizer as Synth } from './app/synthesizer'
    import { Storage } from './app/core/storage'
    import { G } from './app/core/globals'
    import { moireShader } from './app/p5/moire-shader'
    import { keyVisualizer } from './app/p5/background'
    import { sinewave } from './app/p5/sine-wave'
    import { envelope } from './app/p5/envelope'
    import { worms } from './app/p5/worms'
    
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()
    
    onMount(() => {
    
        console.log('MOUNT')
        

      G.w = window.innerWidth
      G.h = window.innerHeight
    
      // Processing
      new P5(moireShader)
      new P5(moireShader)
      // new P5(keyVisualizer)
      // new P5(envelope)
      // new P5(sinewave)
    //   new P5(worms)
    
    
      // serializeIn(Storage.load())
    })
    
    
    // Serialize
    const serializeIn = file => {
    
        // file = ''
        if(!file) return
    
        let o = JSON.parse(file)
    
        synthesizer.serializeIn(o)
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
    
        // Storage.save(serializeOut())
    
        synthesizer.dispose()
    }


</script>











<!-- 


<div id="track-menu">
            
    <div class="category">
        ADD TRACK
        DELETE TRACK
    </div>
    <div class="category">
        SET SOURCE
    </div>
    <div class="category">
        ADD EFFECT
    </div>

</div> -->



<Synthesizer synthesizer={synthesizer}/>


