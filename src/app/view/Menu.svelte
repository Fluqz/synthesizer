


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


<div class="menu-wrapper" class:active={active}>

    <div class="btn" title="Menu On/Off" on:click={toggleMenu} style="float:right;"></div>


    <div class="menu-content">

        <div class="h-1">Manual</div>

            <div class="text-1">This is a short manual for this website.</div>

            <div class="h-2">Introduction</div>

                <div class="text-1">This tool is a sort of synthesizer builder playable by keys or sequencers.</div>        
                <div class="text-1">All running with ToneJS.</div>

                <div class="h-3">Interface</div>

                <div class="h-4">Plus</div>
                <div class="text-1">The Menu bar lets you create Tracks and Sequencers.</div>

                <div class="h-4">Tracks</div>
                <div class="text-1">All tracks have a source instrument. This can be a several Oscillator, Prebuild Synthesizers, a Sampler or Noise.</div>

                <div class="h-4">Sequencer</div>
                <div class="text-1">Sequencers will let you play notes or samples automatically. </div>
                <div class="text-1">You can build chains of notes to make a melody or a drum beat.</div>


                <div class="h-4">Synth</div>
                <div class="h-4">Hold mode</div>
                <div class="h-4">Sequencer</div>
                <div class="h-4">Channel</div>
                <div class="h-4">Midi Info</div>
            <div class="h-4">Keybindings (Show in Introduction?)</div>
        <div class="h-4">Settings</div>
        <div class="h-4">Credits</div>
        <div class="h-4">Links</div>

        <div class="h-4">Epilepsy</div>

        <div class="h-4">Welcome</div>

        <div class="text-1">Works & looks best in firefox</div>

        <div class="text-1">Warning to everyone with Epilepsy. Please disable the visuals in the top left corner!</div>


        <div class="text-1">Left Arrow - Octave Down</div>
        <div class="text-1">Right Arrow - Octave Up</div>
        <div class="text-1">Space bar - Play / Stop</div>

        <div class="text-1">SHIFT + Space bar - Record / Stop recording</div>

        <div class="text-1">Hallodri</div>
        <div class="text-1">https://soundcloud.com/fluqz</div>
        <div class="text-1">https://www.instagram.com/hallodri.art/</div>

    </div>

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

        min-height: 100vh;
        height: auto;
    }

    .menu-wrapper .btn {

        position: relative;

        z-index: 10;
    }


    :global(canvas.active) {

        opacity: 0;
    }


    .menu-wrapper .menu-content {

        width: 90%;

        margin: 0 auto;

        font-size: 1.4rem;
    }

    .menu-wrapper .menu-content .h-1,
    .menu-wrapper .menu-content .h-2,
    .menu-wrapper .menu-content .h-3,
    .menu-wrapper .menu-content .h-4 {

        margin-top: 15px;
        margin-bottom: 5px;
    }


    .menu-wrapper .menu-content .h-1 {

        font-size: 2rem;
        font-weight: 600;
    }

    .menu-wrapper .menu-content .h-2 {
        
        font-size: 1.8rem;
        font-weight: 500;
    }

    .menu-wrapper .menu-content .h-3 {
        
        font-size: 1.6rem;
        font-weight: 400;
    }

    .menu-wrapper .menu-content .h-4 {
        
        font-size: 1.4rem;
        font-weight: 300;
    }

    .menu-wrapper .menu-content .text-1 {
        
        font-size: 1rem;
    }

</style>