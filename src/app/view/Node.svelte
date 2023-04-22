

<script lang="ts">

    import { ParamType, type Node, type NodeParameter, type NodeParameterGroup, type GroupID } from "../nodes";
    import Knob from "./Knob.svelte"
    import Dropdown from "./Dropdown.svelte"

    export let node: Node

    const nodeParameters: NodeParameter[] = [...node.props.values()]


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

    const groups = Array.from(groupNodeParameter(nodeParameters).values())

    console.log('node props', node.name, groups)
    
</script>



<div class="node">

    { node.id }

    <div class="node-title">{ node.name[0].toUpperCase() + node.name.substr(1) }</div>

    <div class="delete" on:click={node.delete}>x</div>

    <div class="parameters">

        {#each groups as g}

            <div class="parameters-group">

                {#each g as n}

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


                    
                {/each}

            </div>

        {/each}

    </div>

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
  cursor: pointer;
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


</style>