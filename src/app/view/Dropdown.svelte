


<script lang="ts">

    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    /** Name of Knob */
    export let name: string = ''
    /** value */
    export let value: string | number = ''
    /** Options */
    export let options: string[] | number[] = []

    export let deletableOptions: boolean = true

    if(value == undefined && options && options.length > 0) value = options[0]

    const initValue = value


    /** Output emitter */
    let dispatch = createEventDispatcher()

    const reset = () => {

        value = initValue
    }

    const onChange = (e) => {

        dispatch('onSelect', e)

        e.target.blur()
    }

    const onDeleteOption = (e) => {

        dispatch('onDeleteOption', e)
    }

</script>



<div class="dropdown-wrapper">

    <!-- <label for="dropdown">{ name }</label> -->

    <div class="dropdown-options">

        <select class="dropdown-select" name="dropdown" bind:value={value} on:change="{onChange}">

            {#each options as o}
                    
                <option class="dropdown-option" value={o}>

                    <div class="dropdown-option-text">{ o }</div>

                    <div class="btn delete" on:click={onDeleteOption}>&#x2715;</div>

                </option>

            {/each}

        </select>

    </div>

</div>



<style>


.dropdown-wrapper {

    display: inline-block;
    text-align: center;

    font-size: 0.7rem;
    /* margin: 5px 5px 0px 5px; */

    min-width: 50px;
    height: 25px;

    cursor: pointer;
}

.dropdown-options {

    width: 100%;
    height: 100%;
}

.dropdown-select {

    width: auto;
    height: inherit;

    /* padding: 0px 5px; */

    -webkit-appearance:none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;

    border: none;

    border-radius: 0px;

    /* background-color: transparent; */
    color: --c-w;

    text-align: center;

    font-size: inherit;
}

.dropdown-option {
    
    width: 100%;
    height: 100%;

    padding: 0px 10px;
}

</style>