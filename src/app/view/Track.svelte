

<script lang="ts">

    import type { Track } from "../track";
    import { Synthesizer as Synth } from "../synthesizer";
    import type { Instrument, Node as _Node } from "../nodes";

    import Node from "./Node.svelte";
    import Knob from "./Knob.svelte"
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import Synthesizer from "./Synthesizer.svelte";
    import Dropdown from "./Dropdown.svelte";

    export let track: Track
    // export let instrument: Instrument
    // export let nodes: _Node[]

    const dispatch = createEventDispatcher()

    let instrumentStore = writable(track.instrument)
    let nodesStore = writable(track.nodes)

    $: nodesStore.set(track.nodes)
    $: instrumentStore.set(track.instrument)

    let unsubscribe = track.store.subscribe((t: Track) => {

        track = t
        instrumentStore.set(t.instrument)
        nodesStore.set(t.nodes)
    })

    const sources: number[] | string[] = Object.keys(Synth.nodes.sources)


    onMount(() => {})
    onDestroy(() => {

        unsubscribe()
    })

    const onVolumeChange = (e) => {

        track.volume = e.detail
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
    
    const addNode = (e) => {

        track.addNode(Synth.nodes.effects.Delay())
    }

    const deleteNode = (e) => {

        track.removeNode(e.detail)
    }

    /** Shift node forward in array */
    const shiftForward = (e) => {

        track.shiftNodeForward(e.detail)

        track.connectNodes()
    }

    /** Shift node back in array */
    const shiftBack = (e) => {

        track.shiftNodeBackward(e.detail)

        track.connectNodes()
    }

    // Change Tracks Instrument
    const onChangeInstrument = (e) => {

        const ele = e.detail.target

        const source = ele.value

        if(!Object.hasOwn(Synth.nodes.sources, source)) return

        const instrument: Instrument = Synth.nodes.sources[source]()

        track.setInstrument(instrument)

        ele.blur()
    }


    const onScroll = (e) => {

        if(!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) e.preventDefault()

        console.log('scroll', track.id)
    }

</script>



<div class="track-wrapper" on:wheel={onScroll}>

    <div class="node track-options">

        <!-- { track.number } { track.id } { track.instrument.name } -->

        <!-- Instrument select -->
        <Dropdown
            name={''}
            value={track.instrument.name}
            options={sources}
            on:onSelect={onChangeInstrument} 
        />

        <!-- Volume Knob -->
        <Knob 
            name="Volume" 
            value={track.volume}
            min={-70} 
            max={6} 
            on:onChange={onVolumeChange} />

        <!-- Mute -->
        <div 
            on:click={onMute}
            class="btn" 
            class:active={track.isMuted}>M</div>

        <!-- Solo -->
        <div 
            on:click={onSolo}
            class="btn" 
            class:active={track.isSolo}>S</div>

        <!-- Hold -->
        <div 
            on:click={onHold}
            class="btn" 
            class:active={track.holdEnabled}>H</div>


        <!-- Delete -->
        <div on:click={onDelete}>x</div>

    </div>

    <!-- Node -->
    <!-- Instrument -->
    <Node node={track.instrument} />

    <!-- Nodes -->
    {#each $nodesStore as node, i}

        <Node bind:node={node} on:shiftForward={shiftForward} on:shiftBack={shiftBack} on:deleteNode={deleteNode} />

    {/each}

    <!-- Add node -->
    <div class="add-node-button node" on:click={addNode}>+</div>

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

.track-wrapper .add-node-button {

    background-color: var(--c-w);
    color: var(--c-b);
    transition: .4s background-color, .4s color;
}
.track-wrapper .add-node-button:hover {

    color: var(--w);
    background-color: var(--c-g2);
}

</style>