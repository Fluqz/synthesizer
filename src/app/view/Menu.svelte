



<script lang="ts">

    import { createEventDispatcher } from "svelte";
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

    const dispatch = createEventDispatcher()
    
    export let active:boolean = false



	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});


    const toggleMenu = () => {

        // active = !active

        console.log('TOGGLE FROM INSIDE MENU')

        dispatch('close')
    }



</script>


<div id="menu-wrapper" class:active={active}>

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


        Welcome

        

        Warning to everyone with Epilepsy. Please disable the visuals in the top left corner!


        Left Arrow - Octave Down
        Right Arrow - Octave Up
        Space bar - Play / Stop

        SHIFT + Space bar - Record / Stop recording

        Hallodri
        https://soundcloud.com/fluqz
        https://www.instagram.com/hallodri.art/

    </div>

</div>


<style>

    #menu-wrapper {

        position: absolute;

        top: 0px;
        left: 0px;

        width: 100%;
        height: 100vh;

        background-color: aqua;

        transform-origin: bottom left;
        transform: rotate(-90deg);

        transition: transform .4s;

        -webkit-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;
    }

    #menu-wrapper.active {

        transform: rotate(0deg);
    }

    :global(canvas.active) {

        opacity: 0;
    }


</style>