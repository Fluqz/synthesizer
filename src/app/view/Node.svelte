

<script lang="ts">

    import { ParamType, type Node, type NodeParameter, type NodeParameterGroup, type GroupID, Instrument, Effect } from "../nodes";
    import Knob from "./Knob.svelte"
    import Dropdown from "./Dropdown.svelte"
    import { createEventDispatcher, onDestroy } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import { max, min } from "rxjs";

    const dispatch = createEventDispatcher()


    export let node: Node

    export let isClosed: Boolean = false




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

    const toggleShrinking = () => {

        isClosed = !isClosed
    }

    const onDelete = () => {

        dispatch('deleteNode', node)
    }

    const isInstrument = node instanceof Instrument ? true : false
    const isEffect = node instanceof Effect ? true : false

    let isEnabled: boolean = true
    let wet: number
    const enable = () => {

        if(isInstrument) return

        const e = (node as Effect)

        if(isEnabled) wet = e.wet

        isEnabled = !isEnabled

        e.wet = isEnabled ? wet : 0
    }




    const unsubscribeNodeStore = node.store.subscribe((v) => {

        nodeStore.set(v)
        groups.set(Array.from(groupNodeParameter($nodeParameters).values()))
    })


    onDestroy(() => {

        unsubscribeNodeStore()
    })
    
</script>



<div class="node">

    
    {#if !isInstrument && !isClosed }
        
        <div class="shift-forward shift arrow-left" on:click={shiftForward}>&#x27A4</div>

    {/if}

    <!-- { node.id } -->

    <div class="node-title">{ node.name[0].toUpperCase() + node.name.substr(1) }</div>

    <div class="toggle-shrink-btn" on:click={toggleShrinking}>&#x2689;</div>
    
    {#if isEffect }
        
        <div class="enabled-btn" on:click={enable} class:enabled={isEnabled}></div>
    
    {/if}

    <div class="delete" on:click={onDelete}>&#x2715;</div>

    {#if !isClosed }

        <div class="parameters">

            <!-- Each group of Parameters -->
            {#each $groups as g}

                <div class="parameters-group">

                    <!-- Each parameter -->
                    {#each g as n}

                        {#if n && n.get() != undefined }
                            
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
                                    on:onSelect={(e) => n.set(e.detail.target.value) } 
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
  height: 20px;
  line-height: 20px;
}
.node .delete {

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: 15px;
    top: 0px;
    cursor: pointer;

    width: 20px;
    height: 20px;

    z-index: 100;

    transition: .4s background-color, .4s color;
}
.node .delete:hover {
  color: var(--c-b);
  background-color: var(--c-y);
}

.toggle-shrink-btn {

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    left: 15px;
    top: 0px;
    cursor: pointer;

    width: 20px;
    height: 20px;

    z-index: 100;

    transition: .4s background-color, .4s color;
}

.enabled-btn {

    display: block;

    width: 8px;
    height: 8px;

    position: absolute;
    left: 35px;
    top: 0px;

    cursor: pointer;
    
    border-radius: 100%;

    z-index: 100;

    transition: .4s background-color, .4s color;

    background-color: var(--c-o);
    margin: 6px;
}
.enabled-btn.enabled {

    background-color: var(--c-bl);
}



.node .delete:hover {
  color: var(--c-b);
  background-color: var(--c-bl);
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

    transition: .4s background-color, .4s color, .4s opacity;

    z-index: 10;
}

.node .shift:hover {

    background-color: var(--c-y);
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


.parameters {

    display: flex;

    justify-content: center;
    align-items: center;
}

</style>