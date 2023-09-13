

<script lang="ts">

    import * as Tone from "tone"

    import { Track } from "../track";
    import { Synthesizer as Synth, type Channel } from "../synthesizer";
    import { Instrument, type Node as _Node } from "../nodes";

    import Node from "./Node.svelte";
    import Knob from "./Knob.svelte"
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import Synthesizer from "./Synthesizer.svelte";
    import Dropdown from "./Dropdown.svelte";
    import LevelMeter from "./LevelMeter.svelte";
    import Oscilloscope from "./Oscilloscope.svelte";

    export let track: Track

    const dispatch = createEventDispatcher()

    const sources: number[] | string[] = Object.keys(Synth.nodes.sources)
    const effects: number[] | string[] = Object.keys(Synth.nodes.effects)


    onMount(() => {

        track.volume = track.volume
        track = track
    })
    onDestroy(() => {

        // unsubscribe()

        console.log('DESTROY TRACK COMPONENT', track.id)
    })

    const onVolumeChange = (e) => {

        track.volume = e.detail

        track.volumeNode.volume.value = track.volume

        track = track

        track.volumeNode = track.volumeNode
    }

    const onChannel = (e) => {

        if(!e.shiftKey) track.channel++
        if(e.shiftKey) track.channel--

        if(track.channel >= Synth.maxChannelCount) track.channel = 0
        else if(track.channel < 0) track.channel = (Synth.maxChannelCount - 1) as Channel

        track.setChannel(track.channel)

        track = track
    }

    const onMute = (e) => {

        track.mute(!track.isMuted)
        track.isMuted = track.isMuted
        track = track
    }

    const onSolo = (e) => {

        track.solo(!track.soloEnabled)
        track.soloEnabled = track.soloEnabled
        track = track
    }

    const onHold = (e) => {

        if(track.hold == 'OFF') {

            track.hold = 'PLAY'
        } 
        else if(track.hold == 'PLAY') {

            track.hold = 'HOLD'
        }
        else {

            track.hold = 'OFF'
        }
        track = track
    }

    const onDuplicate = () => {

        dispatch('duplicate', track)
    }

    const onDelete = (e) => {

        dispatch('delete', track)

        // track = track
    }
    
    const addNode = (e, name?: string) => {

        if(!effects.includes(name)) return

        if(name != undefined) track.addNode(Synth.nodes.effects[name]())
        else track.addNode(Synth.nodes.effects.Delay())

        track = track
    }

    const deleteNode = (e) => {

        track.removeNode(e.detail)

        track = track
    }

    /** Shift node forward in array */
    const shiftForward = (e) => {

        track.shiftNodeForward(e.detail)

        track.connectNodes()

        track = track
    }

    /** Shift node back in array */
    const shiftBack = (e) => {

        track.shiftNodeBackward(e.detail)

        track.connectNodes()

        track = track
    }

    // Change Tracks Instrument
    const onChangeInstrument = (e) => {

        const ele = e.detail.target

        const source = ele.value

        if(!Object.hasOwn(Synth.nodes.sources, source)) return


        const instrument: Instrument = Synth.nodes.sources[source]()

        track.setInstrument(instrument)

        ele.blur()

        track = track
    }


    const onScroll = (e) => {

        // if(!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) e.preventDefault()

        console.log('scroll', track.id)

    }


    const onClick = (e) => {

        // if(!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) e.preventDefault()

        // console.log('click', track.id, track.volumeNode, track.volumeNode.volume.value)

    }

</script>



<div class="track-wrapper" on:wheel={onScroll} on:click={onClick}>

    <div class="node track-options" class:playing={false}> <!-- todo - not reactive -->

        <!-- { track.number } -->
        <!-- { track.id } -->
        <!-- { track.instrument.name } -->

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

        <LevelMeter output={track.volumeNode} />

        <Oscilloscope output={track.volumeNode} />


        <div class="track-btns">

            <!-- Channel Nr -->
            <div 
                on:click={onChannel}
                class="btn"
                title="Channel">{track.channel}</div>

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
                class:active={track.soloEnabled}>S</div>

            <!-- Hold -->
            <div 
                on:click={onHold}
                class="btn"
                title="Hold Mode - OFF: Play as usual; PLAY - Play keys to hold; HOLD: Will play activated keys endlessly"
                class:play={track.hold == 'PLAY'}
                class:hold={track.hold == 'HOLD'}>{track.hold.charAt(0)}</div>

            <!-- Duplicate -->
            <div 
                on:click={onDuplicate}
                title="Duplicate"
                class="btn">D</div>

            <!-- Delete -->
            <div 
                class="btn"
                title="Delete" 
                on:click={onDelete}>&#x2715;</div>
        </div>

    </div>

    <!-- Node -->
    <!-- Instrument -->
    <Node node={track.instrument} index={0} />

    <!-- Nodes -->
    {#each track.nodes as node, i }

        <Node bind:node={node} collapsed={node.collapsed} index={i + 1} on:shiftForward={shiftForward} on:shiftBack={shiftBack} on:deleteNode={deleteNode} />

    {/each}

    <!-- Add node -->
    <div class="add-node-btn">

        <div class="addable-nodes">

            {#each effects as ef }
            
                <div class="addable-node" title={ef} on:click={(e) => addNode(e, ef)}>

                    <!-- <div class="addable-node-inner"> -->

                        { ef.substring(0, 2) }

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

    min-width: 250px;
    height: 100%;

    display: inline-flex;
    align-items: center;

    background-color: var(--c-y);
    color: var(--c-b);
}

.track-wrapper .track-options.playing {
    background-color: var(--c-o);
}

.track-wrapper .track-options .track-btns {

    display: inline-block;
    width: 100px;
}

.track-wrapper .add-node-btn {

    position: relative;

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

.btn.play {

    background-color: var(--c-o);
}

.btn.hold {

    background-color: var(--c-bl);
    color: var(--c-w);
}

</style>