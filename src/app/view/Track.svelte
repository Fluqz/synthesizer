

<script lang="ts">

    import type { Track } from "../track";

    import type { Node as _Node } from "../nodes";

    import Node from "./Node.svelte";
    import Knob from "./Knob.svelte"
    import { createEventDispatcher, onMount } from "svelte";
    import type { Instrument } from "../nodes";

    export let track: Track
    export let instrument: Instrument
    export let nodes: _Node[]

    const dispatch = createEventDispatcher()


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

    const onDelete = (e) => {

        dispatch('delete', track)
    }

    const onEdit = (e) => {

        dispatch('edit', track)
    }

</script>



<div class="track-wrapper">

    <div class="node track-options">

        { track.number } { track.id } { track.instrument.name }

        <Knob 
            name="Volume" 
            value={track.volume}
            min={-70} 
            max={6} 
            on:onChange={onVolumeChange} />

        <div 
            on:click={onMute}
            class="btn" 
            class:active={track.isMuted}>M</div>

        <div 
            on:click={onSolo}
            class="btn" 
            class:active={track.isSolo}>S</div>

        <div 
            on:click={onHold}
            class="btn" 
            class:active={track.holdEnabled}>H</div>


        <div on:click={onDelete}>x</div>
        <div on:click={onEdit}>e</div>

    </div>

    <Node node={instrument} />

    {#each nodes as node, i}

        <Node node={node} />

    {/each}

    <div class="node add-node-button node">+</div>

</div>


<style>


.track-wrapper {

    display: flex;
    height: 90px;

    /* padding: 5px; */

    background-color: var(--c-g);
    color: var(--c-w);
    
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}

.track-wrapper .track-options {

    width: 250px;
    height: 100%;

    display: inline-flex;
    align-items: center;

    background-color: var(--c-y);
    color: var(--c-b);
}





</style>