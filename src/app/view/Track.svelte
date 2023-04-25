

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
    const effects: number[] | string[] = Object.keys(Synth.nodes.effects)


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
    
    const addNode = (name?: string) => {

        if(!effects.includes(name)) return

        if(name != undefined) track.addNode(Synth.nodes.effects[name]())
        else track.addNode(Synth.nodes.effects.Delay())
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

        // if(!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) e.preventDefault()

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
            title="Mute" 
            class:active={track.isMuted}>M</div>

        <!-- Solo -->
        <div 
            on:click={onSolo}
            class="btn"
            title="Solo" 
            class:active={track.isSolo}>S</div>

        <!-- Hold -->
        <div 
            on:click={onHold}
            class="btn"
            title="Hold" 
            class:active={track.holdEnabled}>H</div>


        <!-- Delete -->
        <div 
            class="btn"
            title="Delete" 
            on:click={onDelete}>&#x2715;</div>

    </div>

    <!-- Node -->
    <!-- Instrument -->
    <Node node={track.instrument} />

    <!-- Nodes -->
    {#each $nodesStore as node }

        <Node bind:node={node} collapsed={node.collapsed} on:shiftForward={shiftForward} on:shiftBack={shiftBack} on:deleteNode={deleteNode} />

    {/each}

    <!-- Add node -->
    <div class="add-node-btn node" on:click={addNode}>

        <div class="addable-nodes">

            {#each effects as e }
            
                <div class="addable-node" on:click={() => addNode(e)}>

                    <!-- <div class="addable-node-inner"> -->

                        { e.substring(0, 2) }

                    <!-- </div> -->

                </div>

            {/each}

        </div>

    </div>

</div>


<style>

.track-wrapper {

    display: flex;

    min-width: inherit;
    height: inherit;

    /* padding: 5px; */

    background-color: var(--c-g);
    color: var(--c-w);
    
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;

    border: .5px solid var(--c-b);
}

.track-wrapper .track-options {

    width: 250px;
    height: 100%;

    display: inline-flex;
    align-items: center;

    background-color: var(--c-y);
    color: var(--c-b);
}

.track-wrapper .add-node-btn {

    min-width: inherit;
    width: auto;

    height: inherit;
    line-height: inherit;

    background-color: var(--c-w);
    color: var(--c-b);
    transition: .4s background-color, .4s color;

    cursor: pointer;
}
.track-wrapper .add-node-btn:hover {

    color: var(--c-b);
    background-color: var(--c-y);
}

.track-wrapper .add-node-btn .addable-nodes {
    
    position: absolute;
    left: 0px;
    top: 0px;
    width: auto;
    height: 100%;

    display: flex;
    justify-content: start;
    align-items: center;
}

.track-wrapper .add-node-btn .addable-nodes .addable-node {

    display: flex;
    justify-content: center;
    align-items: center;

    width: 75px;
    height: 75px;
    line-height: 75px;
    text-align: center;

    background-color: var(--c-w);
    color: var(--c-b);

    transition: .2s background-color, .2s color;

    cursor: pointer;
}

.track-wrapper .add-node-btn .addable-nodes .addable-node:hover {


    background-color: var(--c-b);
    color: var(--c-y);
}



/* 
.track-wrapper .add-node-btn .addable-nodes .addable-node .addable-node-inner {

    width: 100%;
    height: 100%;
    line-height: inherit;
    text-align: center;

    transition: .2s background-color, .2s color, .2s border-radius, .2s line-height, .2s height, .2s width;

    cursor: pointer;
} */


/* 

.track-wrapper .add-node-btn .addable-nodes .addable-node:hover .addable-node-inner {

    background-color: var(--c-b);
    color: var(--c-y);

    border-radius: 100%;

    width: 50px;
    height: 50px;
    line-height: 50px;
} 

*/


</style>