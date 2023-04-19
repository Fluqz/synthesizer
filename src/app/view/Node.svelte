

<script lang="ts">

    import type { Node, NodeProperty } from "../nodes";
    import Knob from "./Knob.svelte"

    export let node: Node

    const nodes: NodeProperty[] = [...node.props.values()]

</script>



<div class="node">

    <div class="node-title">{ node.name[0].toUpperCase() + node.name.substr(1) }</div>

    <div class="delete" on:click={node.delete}>x</div>


    {#each nodes as p}
                  
        <Knob
            name={p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            min={p.min}
            max={p.max}
            value={p.get()}
            on:onChange={(e) => p.set(e.detail) } 
        />
        
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