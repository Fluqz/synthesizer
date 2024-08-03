
<script lang="ts">
    import { onMount } from "svelte";
    import type { Key } from "../key";


    /** Key instance passed down from Synthesizer */
    export let key: Key

    /** Event callback for keydown, pointerdown */
    const onTrigger = () => {
        key.trigger()
        key = key
    }
    /** Event callback for keyup, pointerup, pointerleave */
    const onRelease = () => {
        key.release()
        key = key
    }

    /** Keydown event */
    const onKeyDown = (e) => {

        if(!e) return
        if(e.repeat) return
        if(e.target instanceof HTMLInputElement) return

        if(key.mapping === e.key || key.mapping === e.key.toLowerCase()) {

            onTrigger()
        }

        key = key
    }

    /** Keyup event */
    const onKeyUp = (e) => {

        // if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return
        if(e.target instanceof HTMLInputElement) return

        if(key.mapping === e.key || key.mapping === e.key.toLowerCase()) {

            onRelease()
        }

        key = key
    }

    // On document ready
    onMount(() => {

        // Events
        document.addEventListener('keydown', onKeyDown, false)
        document.addEventListener('keyup', onKeyUp, false)

        // On destroy
        return () => {

            document.removeEventListener('keydown', onKeyDown, false)
            document.removeEventListener('keyup', onKeyUp, false)
        }
    })

</script>


<div 
    class="key" 
    class:black={key.note[1] == '#' || key.note[1] === 'b'}
    class:pressed={key.isPressed} 
    style={key.isPressed ? 'transform: scale(1.1); transform-origin: center;' : ''}>
    
    <!-- on:pointerdown={onTrigger}  -->
    <!-- on:pointerup={onRelease}  -->
    <!-- on:pointerleave={onRelease} -->

    <div class="key-text key-mapping">{@html key.mapping.toLocaleUpperCase() + '<br/>' }</div>

    <div class="key-text key-note">{ key.note + (key.octave != undefined ? key.octave.toString() : '') }</div>

</div>



<style>

.key {

    display: inline-block;
    /* align-items: center;
    justify-content: center; */

    width: calc(100% / 36);
    /* height: calc(100vw / 36); */
    height: 70px;

    background-color: var(--c-y);

    font-size: .7rem;
    color: var(--c-b);
    text-align: center;

    /* border-radius: 3px; */

    transition: .4s transform;
    z-index: 0;

    border: .5px solid var(--c-b);

}
.key.black {
    background-color: #0000FF55;
    color: var(--c-w);
}
.key .key-text {
    height: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.key.black .key-note {
}
.key.pressed {

    background-color: var(--c-bl);
    color: var(--c-y);
    z-index: 1;
}

</style>