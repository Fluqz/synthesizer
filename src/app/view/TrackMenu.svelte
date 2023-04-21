



<script lang="ts">
    import { createEventDispatcher } from "svelte";


    import { Synthesizer } from "../synthesizer";
    import { Track } from "../track";

    export let synthesizer: Synthesizer
    export let track: Track

    const dispatch = createEventDispatcher()

    $: synthesizer 

    const add = () => {

        console.log('add track')
        synthesizer.addTrack(getNewTrack())

        synthesizer = synthesizer

        dispatch('update')
    }

    const remove = () => {

        console.log('remove track')
        synthesizer.removeTrack(track)

        synthesizer = synthesizer

        dispatch('update')
    }
    const getNewTrack = () => {

        return new Track()
    }

</script>



<div class="track-menu">

    <div class="category">

        <div class="option" on:click={add}>ADD TRACK</div>

        {#if track != null }

            <div class="option" on:click={remove}>DELETE TRACK</div>

        {/if}

    </div>
            

    {#if track != null }
        
        <div class="option category">

            <div>SET SOURCE</div>

        </div>

        <div class="option category">

            <div>ADD EFFECT</div>
            
        </div>

    {/if}

</div>



<style>

.track-menu {

    position: absolute;

    top: 0px;
    left: 0px;

    background-color: blue;

    mix-blend-mode: color;

    z-index: 10;
}

.option {

    cursor: pointer;
}

</style>