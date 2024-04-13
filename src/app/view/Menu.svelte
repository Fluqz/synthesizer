


<script lang="ts">

    import Settings from './Settings.svelte';
    import Manual from './Manual.svelte';

    import { createEventDispatcher } from "svelte";

    import type { MenuNavigation } from '../core/definitions';


    const dispatch = createEventDispatcher()
    
    export let active:boolean = false

    let navigation: MenuNavigation = 'MANUAL'




    const selectManuals = () => {

        navigation = 'MANUAL'
    }

    const selectSettings = () => {

        navigation = 'SETTINGS'
    }

    const toggleMenu = () => {

        // active = !active

        console.log('TOGGLE FROM INSIDE MENU')

        dispatch('close')
    }

</script>


<div class="menu-wrapper" class:active={active}>

    <div class="btn" title="Menu On/Off" on:click={toggleMenu} style="float:right;"></div>

    <div class="menu-nav">

        <div class:active={navigation == 'MANUAL'} on:click={selectManuals}>MANUAL</div>
        <div class:active={navigation == 'SETTINGS'} on:click={selectSettings}>SETTINGS</div>

    </div>


    {#if navigation == 'SETTINGS' }
        
        <Settings></Settings>

    {/if}

    {#if navigation == 'MANUAL' }

        <Manual></Manual>

    {/if}

</div>


<style>

    .menu-wrapper {

        position: relative;

        overflow: hidden;

        width: 100%;

        height: 0px;

        background-color: var(--c-y);

        -webkit-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;

        transition: height 1s cubic-bezier(0.215, 0.610, 0.355, 1);
    }

    .menu-wrapper.active {

        /* min-height: 100vh; */
        /* height: auto; */
        height: 100vh;
    }

    .menu-wrapper .menu-nav {

        position: absolute;
        left: 0px;
        top: 0px;

        width: 5%;
        height: 50px;
        line-height: 50px;

        text-align: center;
    }

    .menu-wrapper .menu-nav div {

        width: 100%;
        height: 100%;
    }

    .menu-wrapper .menu-nav div.active,
    .menu-wrapper .menu-nav div.active:active {

        background-color: var(--c-w);
        color: var(--c-b);
    }

    .menu-wrapper .menu-nav div:hover {

        background-color: var(--c-w);
        color: var(--c-b);
    }

    .menu-wrapper .btn {

        position: relative;

        z-index: 10;
    }


    :global(canvas.active) {

        opacity: 0;
    }

</style>