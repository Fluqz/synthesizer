


<script lang="ts">

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()
    
    export let active:boolean = true

    const toggleMenu = () => {

        // active = !active

        console.log('TOGGLE FROM INSIDE MENU')

        dispatch('close')
    }

</script>


<div class="settings-wrapper" class:active={active}>

    <div class="h-1">Settings</div>

    Disable visuals

    Disable animations

    Disable changing colors

    Mute on leaving browser window

    Delete all presets

    Show keyboard

</div>


<style>

    .settings-wrapper {

        position: relative;

        overflow: hidden;

        width: 85%;
        height: 0px;

        margin: 0 auto;

        font-size: 1.4rem;

        background-color: transparent;

        -webkit-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;

        transition: height 1s cubic-bezier(0.215, 0.610, 0.355, 1);
    }

    .settings-wrapper.active {

        /* min-height: 100vh; */
        /* height: auto; */
        height: 100vh;
    }

    .settings-wrapper .btn {

        position: relative;

        z-index: 10;
    }


    :global(canvas.active) {

        opacity: 0;
    }

    .settings-wrapper .h-1,
    .settings-wrapper .h-2,
    .settings-wrapper .h-3,
    .settings-wrapper .h-4 {

        margin-top: 15px;
        margin-bottom: 5px;
    }


    .settings-wrapper .h-1 {

        font-size: 2rem;
        font-weight: 600;
    }

    .settings-wrapper .h-2 {
        
        font-size: 1.8rem;
        font-weight: 500;
    }

    .settings-wrapper .h-3 {
        
        font-size: 1.6rem;
        font-weight: 400;
    }

    .settings-wrapper .h-4 {
        
        font-size: 1.4rem;
        font-weight: 300;
    }

    .settings-wrapper .text-1 {
        
        font-size: 1rem;
    }

</style>