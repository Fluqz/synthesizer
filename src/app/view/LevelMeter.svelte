
<script lang="ts">
    import * as Tone from "tone";
    import { M } from "../core/math";
    import { writable } from "svelte/store";

    export let output: Tone.ToneAudioNode

    export let value: number = 0

    let meter: Tone.Meter

    let min = -70
    let max = 6

    let percentage = 0

    let tails: number[] = []
    let tailsStore = writable(tails)
    let maxTails: number = 5

    $: {
        value = meter.getValue() as number

        tails = []
    }   

    let IID

    const getValue = () => {

        value = meter.getValue() as number

        value = Math.min(value, max)
        value = Math.max(value, min)

        percentage = M.map(min, max, 0, 100, value)

        if(tails.length > maxTails) tails.shift()

        tails.push(percentage)

        tailsStore.set(tails)

        console.log(meter.getValue(), meter.getLevel())
    }

    if(output != undefined) {

        meter = new Tone.Meter()

        output.connect(meter)

        IID = setInterval(getValue, 80)
    }

</script>



{#if output != undefined }
    
    <div class="btn level-meter shifting-GIF">

        {#if value != min }

            <div class="level shifting-GIF" style={`height:${percentage}%;`} class:clipping={value > max}></div>

            
            {#each $tailsStore as tail }
                
                <div class="level shifting-GIF" style={`height:${tail}%;`} class:clipping={value > max}></div>
                
            {/each}


            <div id="level-value">{ value.toFixed(0) }</div>
            
        {/if}

    </div>

{/if}



<style>

.level-meter {

    border-top-left-radius: 100%;
    border-top-right-radius: 100%;

    border-radius: 100%;

    overflow: hidden;

    cursor: default;

    width: 50px;
    height: 50px;
    line-height: 50px;

    padding: 0px;
    margin: 0px;

    position: relative;

    background-color: var(--c-bl);
    color: var(--c-y);

    transition: .2s background-color;
}
.level-meter:active,
.level-meter:hover {
    
    background-color: var(--c-bl);
    color: var(--c-y);
}


.level {

    background-blend-mode: difference;

    border-top-left-radius: 100%;
    border-top-right-radius: 100%;

    display: block;
    width: 100%;
    height: 0%;

    position: absolute;

    left: 0px;
    bottom: 0px;

    background-color: var(--c-w);

    mix-blend-mode: luminosity;

}
.level.clipping {

    background-color: var(--c-o);
}

#level-value {

    position: relative;
    z-index: 10;

    mix-blend-mode: unset;

    color: #fff;
}



</style>