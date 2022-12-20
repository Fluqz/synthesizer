

<script lang="ts">

    import type { Node } from "../nodes/node";
    import { Effect } from "../nodes/effects/effect";
    import { Instrument } from "../nodes/source/instrument";
    import { NodeInputsArray } from "../nodes/node-inputs";
    import Knob from "./templates/Knob.svelte";

    export let node: Node

    // console.log('props', Object.getOwnPropertyNames(node.constructor.prototype), node.hasOwnProperty('wet'))

    // const nodeInputs = () => {

    //     for()
    // }


    const getInstance = () => {
        if(node instanceof Effect) return (node as Effect)
        else if(node instanceof Instrument) return (node as Instrument)
        return node
    }

</script>



<div class="node">

    <div class="node-title">{ node.name[0].toUpperCase() + node.name.substr(1) }</div>

    <div class="delete" on:click={node.delete}>x</div>


    {#each NodeInputsArray as n}

        {#each Object.getOwnPropertyNames(getInstance().constructor.prototype) as p}

            {#if n === p}
                  
                <Knob
                name={p.charAt(0).toUpperCase() + p.slice(1)}
                value={node[p]}
                min={0}
                max={1}
                on:onChange={(e) => node[p] = e.detail} />
  
            {/if}

        {/each}
        
    {/each}


</div>



<style>


/* Nodes */
.node {

    display: inline-flex;

    align-items: flex-end;
    justify-content: bottom;

    position: relative;

    min-width: 100px;
    height: 100%;

    margin-left: 5px;
    padding: 0px;

    /* background-color: var(--c-g2); */
    color: var(--c-w);
}
.node:first-child { margin-left: 0px; }
.node .node-title {

    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    text-align: center;
    font-size: .8rem;
}
.node .delete {

    position: absolute;
    right: 4px;
    top: 0px;
    cursor: pointer;
}
.node .delete:hover {
    color: var(--c-o);
}


</style>