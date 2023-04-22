



<script lang="ts">
    import { createEventDispatcher } from "svelte";


    import { Track } from "../track";
    import type { Vec2 } from "../core/math";

    export let track: Track
    export let position: Vec2

    const dispatch = createEventDispatcher()


    const add = () => {

        dispatch('add')
    }

    const remove = () => {

        dispatch('remove', track)
    }

</script>



<div class="track-menu" style={'top:' + 0 + 'px;left:' + position.x + 'px'}>

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

    position: relative;
    mix-blend-mode: normal;

    z-index: 10;
}

.option {

    cursor: pointer;
}

</style>