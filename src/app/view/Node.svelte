

<script lang="ts">

    import { ParamType, type Node, type NodeParameter, type NodeParameterGroup, type GroupID, Instrument } from "../nodes";
    import Knob from "./Knob.svelte"
    import Dropdown from "./Dropdown.svelte"
    import { createEventDispatcher, onDestroy } from "svelte";
    import { writable, type Writable } from "svelte/store";

    const dispatch = createEventDispatcher()


    export let node: Node


    $: {
        
        $nodeParameters = [...node.props.values()]
        
        groups.set(Array.from(groupNodeParameter($nodeParameters).values()))
    }

    let nodeStore = writable(node)

    let nodeParameters: Writable<NodeParameter[]> = writable([...node.props.values()])

    /** Groupes nodeParamter by sorting them*/
    const groupNodeParameter = (_nodeParameters: NodeParameter[]) : NodeParameterGroup => {

        const groups: NodeParameterGroup = new Map()

        let param: NodeParameter

        for(let i = 0; i < _nodeParameters.length; i++) {

            param = _nodeParameters[i]

            const groupID: GroupID = param.groupID

            let groupParams: NodeParameter[] = groups.get(groupID)

            if(groupParams == null) groupParams = []

            groupParams.push(param)

            groups.set(groupID, groupParams)
        }

        return groups
    }


    let groups: Writable<NodeParameter[][]> = writable(Array.from(groupNodeParameter($nodeParameters).values()))





    // console.log('node props', node.name, groups)

    const shiftForward = () => {

        dispatch('shiftForward', node)

        groups.set(Array.from(groupNodeParameter($nodeParameters).values()))
    }

    const shiftBack = () => {

        dispatch('shiftBack', node)

        groups.set(Array.from(groupNodeParameter($nodeParameters).values()))
    }

    const onDelete = () => {

        dispatch('deleteNode', node)
    }

    const isInstrument = node instanceof Instrument ? true : false



    const unsubscribeNodeStore = node.store.subscribe((v) => {

        nodeStore.set(v)
        groups.set(Array.from(groupNodeParameter($nodeParameters).values()))
    })


    onDestroy(() => {

        unsubscribeNodeStore()
    })
    
</script>



<div class="node">

    {#if !isInstrument }
        
        <div class="shift-forward shift arrow-left" on:click={shiftForward}>&#x27A4</div>

    {/if}


    <!-- { node.id } -->

    <div class="node-title">{ node.name[0].toUpperCase() + node.name.substr(1) }</div>

    <div class="delete" on:click={onDelete}>x</div>

    <div class="parameters">

        <!-- Each group of Parameters -->
        {#each $groups as g}

            <div class="parameters-group">

                <!-- Each parameter -->
                {#each g as n}

                    {#if n && n.get() }
                        
                        {#if n.type == ParamType.KNOB}
                            
                            <Knob
                                name={n.name.charAt(0).toUpperCase() + n.name.slice(1)}
                                min={n.min}
                                max={n.max}
                                value={n.get()}
                                on:onChange={(e) => n.set(e.detail) } 
                            />

                        {/if}


                        {#if n.type == ParamType.DROPDOWN}
                            
                            <Dropdown
                                name={n.name.charAt(0).toUpperCase() + n.name.slice(1)}
                                value={n.get()}
                                options={n.options}
                                on:onSelect={(e) => n.set(e.detail) } 
                            />

                        {/if}


                    {/if}

                    
                {/each}

            </div>

        {/each}

    </div>

    {#if !isInstrument }

        <div class="shift-back shift" on:click={shiftBack}>&#x27A4</div>

    {/if}


</div>



<style>

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
  cursor: context-menu;

  z-index: 100;
}
.node .delete:hover {
  color: var(--c-o);
}

.node .parameter-group {


    color: inherit;
}

.node .parameter-group {

    display: flex;


    color: inherit;
}

.node .shift {

    display: flex;
    justify-content: center;
    align-items: center;

    position:absolute;
    top:0px;
    height: 100%;
    width: 15px;

    text-align: center;
    cursor: pointer;

    color: var(--c-b);
    background-color: var(--c-w);

    font-size: 1.2rem;
}

.node .shift.arrow-left {

    transform: rotate(180deg);
}

.node .shift-forward {
    left: 0px;
}
.node .shift-back {

    right:0px;
}

</style>