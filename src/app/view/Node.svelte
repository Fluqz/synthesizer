

<script lang="ts">
    import type { InputNode } from "tone";


    import { InputType, type Node, type NodeInput } from "../nodes";
    import Knob from "./Knob.svelte"
    import Dropdown from "./Dropdown.svelte"

    export let node: Node

    const nodeInputs: NodeInput[] = [...node.props.values()]

    const groupNodes = (nodeInputs: NodeInput[]) => {

        const groups: Map<number, NodeInput[]> = new Map()

        let nodeInput: NodeInput

        for(let i = 0; i < nodeInputs.length; i++) {

            nodeInput = nodeInputs[i]

            const groupID = nodeInput.group

            let array: NodeInput[] = groups.get(groupID)

            if(array == null) array = []

            array.push(nodeInput)

            groups.set(groupID, array)
        }

        return groups
    }

    const groups = Array.from(groupNodes(nodeInputs).values())

    // const nodes: NodeInput[] = [...node.props.values()].sort((a: NodeInput, b:NodeInput) => {

    //     if(a.group > b.group) return 1
    //     if(a.group < b.group) return -1
    //     if(a.group == b.group) return 0
    // })



    
        console.log('node props', node.name, groups)
    
</script>



<div class="node">

    <div class="node-title">{ node.name[0].toUpperCase() + node.name.substr(1) }</div>

    <div class="delete" on:click={node.delete}>x</div>



    {#each groups as g}

        <div class="node-group">

            {#each g as n}

                {#if n.type == InputType.KNOB}
                    
                    <Knob
                        name={n.name.charAt(0).toUpperCase() + n.name.slice(1)}
                        min={n.min}
                        max={n.max}
                        value={n.get()}
                        on:onChange={(e) => n.set(e.detail) } 
                    />

                {/if}


                {#if n.type == InputType.DROPDOWN}
                    
                    <Dropdown
                        name={n.name.charAt(0).toUpperCase() + n.name.slice(1)}
                        value={n.get()}
                        options={n.options}
                        on:onSelect={(e) => n.set(e.detail) } 
                    />

                {/if}


                
            {/each}

        </div>

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