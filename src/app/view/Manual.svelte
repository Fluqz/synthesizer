



<script lang="ts">

    import Settings from './Settings.svelte';

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()
    
    export let active:boolean = true


    const toggleMenu = () => {

        // active = !active

        console.log('TOGGLE FROM INSIDE MENU')

        dispatch('close')
    }

</script>


<div class="manual-wrapper" class:active={active}>

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


<style>

    .manual-wrapper {

        width: 85%;
        height: 0px;

        margin: 0 auto;

        font-size: 1.4rem;

        position: relative;

        overflow: hidden;

        background-color: transparent;

        -webkit-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;

        transition: height 1s cubic-bezier(0.215, 0.610, 0.355, 1);
    }

    .manual-wrapper.active {

        /* min-height: 100vh; */
        /* height: auto; */
        height: 100vh;
    }

    .manual-wrapper .btn {

        position: relative;

        z-index: 10;
    }


    :global(canvas.active) {

        opacity: 0;
    }


    .manual-wrapper .h-1,
    .manual-wrapper .h-2,
    .manual-wrapper .h-3,
    .manual-wrapper .h-4 {

        margin-top: 15px;
        margin-bottom: 5px;
    }


    .manual-wrapper .h-1 {

        font-size: 2rem;
        font-weight: 600;
    }

    .manual-wrapper .h-2 {
        
        font-size: 1.8rem;
        font-weight: 500;
    }

    .manual-wrapper .h-3 {
        
        font-size: 1.6rem;
        font-weight: 400;
    }

    .manual-wrapper .h-4 {
        
        font-size: 1.4rem;
        font-weight: 300;
    }

    .manual-wrapper .text-1 {
        
        font-size: 1rem;
    }

</style>