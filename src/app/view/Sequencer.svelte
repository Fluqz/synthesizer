

<script lang="ts">
    
    import * as Tone from "tone";

    import Timeline from './Timeline.svelte'


    import { Synthesizer, type Channel } from "../synthesizer";
    import { type NoteLength, type SequenceObject, Sequencer } from "../sequencer";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { Storage } from "../core/storage";
    import { writable } from "svelte/store";
    import { getChannelColor } from "../core/colors";

    export const convertNoteLength = (n: NoteLength) => {

        switch(n) {

            case '1': return '1n'
            case '1/2': return '2n'
            case '1/4': return '4n'
            case '1/8': return '8n'
            case '1/16': return '16n'
            case '1/32': return '32n'
            case '1/64': return '64n'
        }
    }


    const dispatch = createEventDispatcher()
    
    export let sequencer: Sequencer
    export let channelColors: string
    
    const sequence = writable(sequencer.sequence)

    /** Array of activated channels. Sequencer can play through all 8 channels simultaniously. */
    let channels: boolean[] = []
    // let channels: Channel = 0

    // Fill channels array with booleans
    for(let i = 0; i < Synthesizer.maxChannelCount; i++) channels.push(false)

    // Reactive - update channel array
    $: {
        for(let i = 0; i < Synthesizer.maxChannelCount; i++) channels[i] = false
        for(let c of sequencer.channels) channels[c] = true
    }

    onMount(() => {

    })

    onDestroy(() => {

        Tone.Transport.cancel()
    })

    /** Set default note length*/
    const noteLengths: NoteLength[] = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64']


    const onNoteLength = (e: MouseEvent) => {

        let i = noteLengths.indexOf(sequencer.noteLength)

        if(i == -1) return sequencer.noteLength = noteLengths[0]

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i >= noteLengths.length) i = 0
        else if(i < 0) i = (noteLengths.length - 1)

        sequencer.noteLength = noteLengths[i]

        sequencer.noteLength = sequencer.noteLength

        sequencer = sequencer

        saveUndo()
    }

    /** Add a new bar to sequencer */
    const addBar = (e) => {

        sequencer.addBar()

        sequencer = sequencer

        saveUndo()
    }

    /** Remove one bar from sequencer */
    const removeBar = (e) => {

        sequencer.removeBar()

        const notesToDelete = getNotesInBar(sequencer.bars)

        for(let n of notesToDelete) sequencer.removeNote(n.id)

        sequencer = sequencer

        saveUndo()
    }

    /** Add new note to sequencer */
    const addNote = (time: Tone.Unit.Time, note?: Tone.Unit.Frequency) => {

        if(note == undefined) {

            if(Synthesizer.lastNotePlayed != undefined) note = Synthesizer.lastNotePlayed
            else note = 'F3'
        }

        sequencer.addNote(note, time, convertNoteLength(sequencer.noteLength), 1)

        sequence.set(sequencer.sequence)

        saveUndo()
    }

    const getNotesInBar = (bar: number) => {
        console.log('getNotesInBar', bar, sequencer.bars)

        const notes: SequenceObject[] = []

        for(let s of sequencer.sequence) {

            console.log('s', Tone.Time(s.time).toSeconds(), bar)
            if(Tone.Time(s.time).toSeconds() > bar) notes.push(s)
        }

        return notes
    }


    /** Toggle sequencer on/off */
    const toggleStartStop = () => {

        if(!sequencer.isPlaying) {

            sequencer.start()
        }
        else sequencer.stop()

        sequencer = sequencer

        sequencer.isPlaying = sequencer.isPlaying
    }

    /** Activate or deactivate channels. Channelnumber and bool */
    const activateChannel = (channel: Channel, active: boolean) => {

        // Toggle
        active = !active

        channels[channel] = active

        if(active) sequencer.activateChannel(channel)
        else sequencer.deactivateChannel(channel)

        sequencer = sequencer

        saveUndo()
    }

    /** Duplicate Sequence */
    const onDuplicate = () => {

        dispatch('duplicate', sequencer)
    }

    /** Delete sequencer */
    const onDelete = () => {

        dispatch('deleteSequencer', sequencer)

        sequencer = sequencer
    }

    const saveUndo = () => {

        Storage.saveUndo(JSON.stringify(sequencer.synthesizer.serializeOut()))
    }

</script>


{#if sequencer != undefined } 

    <div class="sequencer-wrapper">

        <div class="sequencer-menu">

            <div class="btn delete" on:click={onDelete}>&#x2715;</div>
            
            <div class="btn duplicate" on:click={onDuplicate}>D</div>

            <div class="btn play" class:active={sequencer.isPlaying} title="Play" on:click={toggleStartStop}>{ !sequencer.isPlaying ? 'Play' : 'Stop'}</div>

            <div class="btn noteLength" on:click={onNoteLength}>{sequencer.noteLength}</div>

            <div>

                {#each channels as cc, i }
                    
                    {#if i == 7 }
                        <br />  
                    {/if}

                    <div class="btn" 
                            class:active={cc} 
                            style="{ cc ? 'background-color:' + getChannelColor(i) : '' }" 
                            title="Channels to sequence" 
                            on:click={() => activateChannel(i, cc)}>{ i }</div>

                {/each}

            </div>

        </div>
            
        <div class="sequence">

            <div class="sequence-wrapper">

                <Timeline sequencer={sequencer} isPlaying={sequencer.isPlaying} on:addNote={(e) => { addNote(e.detail)}} />

                <div class="add-remove-cont">

                    <div class="add-bar" on:click={(e) => addBar(e)}>+</div>
                    <div class="remove-bar" on:click={(e) => removeBar(e)}>-</div>

                </div>

            </div>

        </div>

    </div>

{/if}


<style>

    .sequencer-wrapper {

        display: inline-flex;
        align-items: center;

        /* height: 75px; */
        min-width: 400px;
        width: 100%;
        height: auto;

        background-color: var(--c-b);

        border: .5px solid var(--c-b);

    }

    .sequencer-menu {

        width: 250px;

        display: inline-block;
    }

    .sequencer-wrapper .sequence {

        width: calc(100% - 250px);
        height: 100%;
    }

    .sequencer-wrapper .sequence-wrapper {

        position: relative;

        width: 100%;
        height: 100%;

        display: inline-flex;

        justify-content: center;
        align-items: center;
    }

    .sequencer-wrapper .sequence .add-remove-cont {

        width: 50px;
        align-self: stretch;
    }
    
    .sequencer-wrapper .sequence .remove-bar,
    .sequencer-wrapper .sequence .add-bar {

        display: inline-flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        width: 50px;
        height: 50%;
        background-color: var(--c-w);
        color: var(--c-b);
    }

    .sequencer-wrapper .sequence .remove-bar:hover,
    .sequencer-wrapper .sequence .add-bar:hover {

        background-color: var(--c-b);
        color: var(--c-y);
    }

</style>