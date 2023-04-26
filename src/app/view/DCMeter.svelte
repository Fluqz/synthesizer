
<script lang="ts">
    import { writable } from "svelte/store";
    import * as Tone from "tone";

    export let output: Tone.ToneAudioNode

    let meter: Tone.DCMeter

    let analyser: AnalyserNode
    let bufferLength: number
    let dataArray:Uint8Array

    let active = false

    let value:number

    let tails: number[] = []
    let tailsStore = writable(tails)
    let tailString = ''
    let maxTails: number = 10
    
    let IID

    // $:

    const getValue = () => {

        value = meter.getValue()

        if(tails.length > maxTails) tails.shift()

        tails.push(value)

        tailString = ''
        for(let i = 0; i < tails.length; i++) {

            if(i == 0) continue

            tailString += `${(i - 1) * 10}, ${10 * tails[i - 1]} ${i * 10}, ${10 * tails[i]}`
        }

        // console.log(tailString)

        tailsStore.set(tails)

        // console.log('dc',100 * meter.getValue())
    }

    if(output != undefined) {

        meter = new Tone.DCMeter()

        output.connect(meter)

        clearInterval(IID)
        IID = setInterval(getValue, 80)
    }

</script>


<div id="dc-meter">

    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<!-- 
        {#each $tailsStore as tail, i }

            {#if i != 0} -->
                
                <polyline stroke="#fed33a" stroke-width="4px" points={tailString}/>
<!--             
            {/if}
            
        {/each} -->

    </svg>

</div>



<style>

    #dc-meter {

        width: 50px;
        height: 50px;
    }

    svg polyline { 
        
        mix-blend-mode: unset; 
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

</style>