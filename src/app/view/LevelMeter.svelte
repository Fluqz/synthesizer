
<script lang="ts">
    import * as Tone from "tone";
    import { M } from "../util/math";
    import { onDestroy, onMount } from "svelte";

    export let output: Tone.ToneAudioNode

    export let value: number = 0

    let scheduleID

    let meter: Tone.Meter = new Tone.Meter()

    let min = -70
    let max = 6

    let percentage = 0

    let IID

    const getValue = () => {

        value = meter.getValue() as number

        value = /*Math.round(*/value/* * 100) / 100*/

        value = Math.min(value, max)
        value = Math.max(value, min)

        percentage = Math.round(M.map(min, max, 0, 100, value))
    }



    onMount(() => {

        if(output != undefined) {

            output.connect(meter)

            if(scheduleID != undefined) Tone.Transport.clear(scheduleID)

            scheduleID = Tone.Transport.scheduleRepeat(getValue, 1 / 30, Tone.now(), 100000000)
        }
    })

    onDestroy(() => {

        if(output != undefined) {

        if(scheduleID != undefined) Tone.Transport.clear(scheduleID)


            meter.disconnect()
            meter.dispose()
        }
    })


</script>



{#if output != undefined }
    
    <div class="btn level-meter shifting-GIF">

        {#if value != min }

            <div class="level shifting-GIF" style={`height:${percentage}%;background-color:#FF00FF;`} class:clipping={value > max}></div>

            <div id="level-value">{ value.toFixed(0) }</div>
            
        {/if}

    </div>

{/if}



<style>

.level-meter {

    margin: 0px 5px;

    border-top-left-radius: 100%;
    border-top-right-radius: 100%;

    border-radius: 100%;
    /* border: 2px solid var(--c-y); */

    overflow: hidden;

    cursor: default;

    /* width: 50px; */
    /* height: 50px; */
    /* line-height: 50px; */

    width: 30px;
    height: 30px;
    line-height: 30px;


    padding: 0px;
    margin: 0px;

    position: relative;

    background-color: var(--c-bl);
    color: var(--c-y);

    transition: .2s background-color;

    mix-blend-mode: unset;

}
.level-meter:active,
.level-meter:hover {
    
    background-color: var(--c-bl);
    color: var(--c-y);
}

.level {

    background-blend-mode: hue;

    border-top-left-radius: 100%;
    border-top-right-radius: 100%;

    display: block;
    width: 100%;
    height: 0%;

    position: absolute;

    left: 0px;
    bottom: 0px;

    background-color: var(--c-bl);

    mix-blend-mode: difference;

}
.level.clipping {

    background-color: var(--c-o);
}

#level-value {

    position: relative;
    z-index: 10;

    mix-blend-mode: unset;

    color: var(--c-y);
}



</style>