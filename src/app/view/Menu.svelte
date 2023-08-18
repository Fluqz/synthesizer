



<script lang="ts">

    import { createEventDispatcher } from "svelte";

    
    export let active:boolean = false

    const dispatch = createEventDispatcher()

    const toggleMenu = () => {

        active = !active

        dispatch('close')
    }

</script>


<div id="menu-wrapper">

    <div class="btn" title="Menu On/Off" on:click={toggleMenu} style="float:right;"></div>


    <div>

        Manual
            Introduction
                Interface
                Synth
                Sequencer
                Channel
                Midi Info
            Epilepsy 
            Keybindings (Show in Introduction?)
        Settings
        Credits
        Links

    </div>

</div>


<style>

    #menu-wrapper, 
    #menu-wrapper {

        position: absolute;

        top: 0px;
        left: 0px;

        width: 100%;
        height: 100vh;

        background-color: var(--c-b);

        -webkit-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;
    }


</style>