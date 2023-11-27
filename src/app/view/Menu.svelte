



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

            This is a short manual for this website.

            Introduction

                This tool is a sort of synthesizer builder playable by keys or sequencers.                
                All running with ToneJS.

                Interface

                #Plus
                The Menu bar lets you create Tracks and Sequencers. 

                #Tracks
                All tracks have a source instrument. This can be a several Oscillator, Prebuild Synthesizers, a Sampler or Noise.

                #Sequencer
                Sequencers will let you play notes or samples automatically. 
                You can build chains of notes to make a melody or a drum beat.


                Synth
                Hold mode
                Sequencer
                Channel
                Midi Info
            Keybindings (Show in Introduction?)
        Settings
        Credits
        Links

        Epilepsy

        Welcome

        Works & looks best in firefox

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

    #menu-wrapper.active {

        height: 100vh;
    }

    #menu-wrapper .btn {

        position: relative;

        z-index: 10;
    }


    :global(canvas.active) {

        opacity: 0;
    }


</style>