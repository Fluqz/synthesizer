<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type SequenceObject } from "../sequencer";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { Storage } from "../core/storage";
    import { writable } from "svelte/store";


    const dispatch = createEventDispatcher()


    export let note: SequenceObject
    export let isSelected: boolean = false
    export let timelineRect: DOMRect
    export let yPos: number = 0
    export let height: number = 0
    export let sequencer: Sequencer

    let width = 0
    
    const sequence = writable(sequencer.sequence)
    const noteStore = writable(note)

    let velocity = .7
    
    let rows: number = 1

    let wrapperHeight: number = 100

    $: {

        timelineRect = timelineRect
        sequencer.sequence = sequencer.sequence

        width = ((Tone.Time(note.length).toSeconds() / sequencer.bars) * timelineRect.width)
    }

    onMount(() => {

        if(sequencer == undefined) return 
    })


    /** DblClick Note Event 
     * TODO _------ -PUT IN TIMELINE!!!!!!
     */
    const onNoteDblClick = (e, note: SequenceObject) => {

        console.log('note dbl')

        e.stopPropagation()

        dispatch('delete', note)
    }

    let currentNote: string
    let currentOctave: string

    const getNote = (note: SequenceObject) => {

        let n = Tone.Frequency(note.note).toNote().toString()

        const o = n[n.length - 1]

        n = n.replace(o, '')

        return n
    }

    const getOctave = (note: SequenceObject) => {

        let n = Tone.Frequency(note.note).toNote().toString()

        const o = n[n.length - 1]

        return o
    }

    const onNoteClick = (e, note: SequenceObject) => {

        e.stopPropagation()

        currentNote = Tone.Frequency(note.note).toNote().toString()

        currentOctave = currentNote[currentNote.length - 1]

        currentNote = currentNote.replace(currentOctave, '')

        let i = Synthesizer.notes.indexOf(currentNote)

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i > Synthesizer.notes.length - 1) i = 0
        else if(i < 0) i = Synthesizer.notes.length - 1

        note.note = Synthesizer.notes[i] + currentOctave

        sequencer = sequencer

        saveUndo()
    }

    const onOctaveClick = (e, note: SequenceObject) => {

        e.stopPropagation()

        currentNote = Tone.Frequency(note.note).toNote().toString()

        currentOctave = currentNote[currentNote.length - 1]

        currentNote = currentNote.replace(currentOctave, '')

        let i = Synthesizer.octaves.indexOf(+currentOctave)

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i > Synthesizer.octaves.length - 1) i = 0
        else if(i < 0) i = Synthesizer.octaves.length - 1

        console.log('octave', i, Synthesizer.octaves[i])

        note.note = currentNote + Synthesizer.octaves[i]

        sequencer = sequencer

        saveUndo()
    }

    const onDelete = () => {

        dispatch('deleteSequencer', sequencer)

        sequencer = sequencer
    }

    const saveUndo = () => {

        Storage.saveUndo(JSON.stringify(sequencer.synthesizer.serializeOut()))
    }

</script>


{#if sequencer != undefined } 

    {#if width < 30 }

        <div class="edit-note"
                style:top={yPos + 'px'}
                style:left={((Tone.Time(note.time).toSeconds() / sequencer.bars) * timelineRect.width) + 'px'}>

            <div class="btn" 
                    title="Note - Click to increase; Shift - Click to decrease" 
                    on:dblclick|stopPropagation={e => {}} 
                    on:click|stopPropagation={e => onNoteClick(e, note)}>{ getNote(note) }</div>
            <div class="btn" 
                    title="Octave - Click to increase; Shift - Click to decrease" 
                    on:dblclick|stopPropagation={e => {}} 
                    on:click|stopPropagation={e => onOctaveClick(e, note)}>{ getOctave(note) }</div>
        
        </div>
        
    {/if}

    <div class="note" 
            class:selected={isSelected == true}
            on:dblclick|self={(e) => { onNoteDblClick(e, note) }}
            on:pointerdown
            style:top={yPos + 'px'}
            style:height={height + 'px'}
            style:left={((Tone.Time(note.time).toSeconds() / sequencer.bars) * timelineRect.width) + 'px'}
            style:width={width + 'px'} >

        
        <slot />
        
        
        <div class="btn" 
                title="Note - Click to increase; Shift - Click to decrease" 
                on:dblclick|stopPropagation={e => {}} 
                on:click|stopPropagation={e => onNoteClick(e, note)}>{ getNote(note) }</div>
        <div class="btn" 
                title="Octave - Click to increase; Shift - Click to decrease" 
                on:dblclick|stopPropagation={e => {}} 
                on:click|stopPropagation={e => onOctaveClick(e, note)}>{ getOctave(note) }</div>
        
        <div class="velocity" class:changed={ velocity < 1 } style:height={velocity * 100 + '%'}>
                            
        <!-- <div class="drag-handle drag-velocity" 
                on:pointerdown={(e) => onResizeHandlesDown(e, note, 'end')}
                on:pointermove={(e) => onResizeHandlesMove(e)}
                on:pointerup={(e) => onResizeHandlesUp(e)}></div> -->

        </div>
        
    </div>

{/if}


<style>

    .note {
        z-index: 2;

        /* width: 25px; */
        position: absolute;

        width: 50px;
        min-width: 2px;
        height: 100%;

        background-color: var(--c-y);
        color: var(--c-o);

        /* opacity: .5; */

        text-align: center;

        display: inline-flex;
        justify-content: center;
        align-items: end;

        cursor: grab !important;

        mix-blend-mode: unset;
        /* border: .5px solid var(--c-w); */

        overflow: hidden;
    }

    .note.selected {
        background-color: var(--c-o);
        cursor: grabbing !important;
        z-index: 4;
    }

    .note.note.selected input {

        cursor: grabbing !important;
    }

    .note input {

        z-index: 2;

        min-width: unset;
        width: 50px;
        height: 25px;

        border: none;

        font-size: 1rem;

        text-align: center;

        background-color: transparent;

        padding: 0px;
        margin: 0px;
    }

    .note .btn {

        width: 15px;
        min-width: 15px;
        z-index: 2;
        background-color: transparent;
    }
    .note .btn:hover,
    .note .btn:active {

        background: unset;
        background-color: transparent;
        color: var(--c-b);
    }

    .note :global(.drag-handle)  {

        z-index: 3;

        position: absolute;
        top: 0px;

        width: 10px;
        height: 100%;

        cursor: ew-resize;

        background-color: #fff;

        opacity: .3;
    }

    .note :global(.drag-start)  {

        left: 0px;

    }

    .note :global(.drag-end) {

        right: 0px;
    }

    .note :global(.drag-velocity)  {

        left: 0px;

        width: 100%;
        height: 10px;

        cursor: row-resize;
    }

    .note :global(.velocity) {

        position:absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .note :global(.velocity.changed) {

        background-color: #fff;
        opacity: .7;
    }

    .edit-note {

        width: 50px;
        height: 25px;
    }

</style>