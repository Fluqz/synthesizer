

<script lang="ts">

    import type { Track } from "../track";

    import type { Node as _Node } from "../nodes";

    import Node from "./Node.svelte";
    import Knob from "./Knob.svelte"
    import { onMount } from "svelte";
    import type { Instrument } from "../nodes";

    export let track: Track
    export let instrument: Instrument
    export let nodes: _Node[]

    onMount(() => {
    })

    const changeVolume = (e) => {

        track.volume = e.detail
        track = track
    }

    const onMute = (e) => {

        console.log('track', track.id)

        track.mute(!track.isMuted)
        track = track
    }

    const onHold = (e) => {

        track = track
    }



</script>


<div class="track">

    { track.id }

    <div class="track-options">

        <Knob 
        name="Volume" 
        value={track.volume}
        min={0} 
        max={1} 
        on:onChange={changeVolume} />

        <div 
            on:click={onMute}
            class="btn" 
            class:active={track.isMuted}>Mute</div>

        <div 
            on:click={onHold}
            class="btn" 
            class:active={track.holdEnabled}>Hold</div>

    </div>

    <Node node={instrument} />

    {#each nodes as node, i}

        <Node node={node} />

    {/each}

</div>


<style>


.track {

    display: inline-block;

    height: 70px;

    padding: 5px;
    margin: 0px 5px;

    background-color: var(--c-g);
    color: var(--c-w);
}

.track .track-options {

    display: inline-flex;
    align-items: center;

    background-color: var(--c-y);
    color: var(--c-b);
}

</style>