

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


    onMount(() => {})

    const onVolumeChange = (e) => {

        track.volume = e.detail
        track = track
    }

    const onMute = (e) => {

        track.mute(!track.isMuted)
        track.isMuted = track.isMuted
    }

    const onSolo = (e) => {

        track.solo(!track.isSolo)
        track.isSolo = track.isSolo
    }

    const onHold = (e) => {


    }


</script>



<div class="track">

    { track.number } { track.id } { track.instrument.name }

    <div class="track-options">

        <Knob 
        name="Volume" 
        value={track.volume}
        min={0} 
        max={1} 
        on:onChange={onVolumeChange} />

        <div 
            on:click={onMute}
            class="btn" 
            class:active={track.isMuted}>Mute</div>

        <div 
            on:click={onSolo}
            class="btn" 
            class:active={track.isSolo}>Solo</div>

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

    position: relative;

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