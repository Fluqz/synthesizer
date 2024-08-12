<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type NoteLength, type SequenceObject } from "../sequencer";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { Storage } from "../core/storage";
    import { BeatMachine } from "../beat-machine";
    import type { Subscription } from "rxjs";
  import { writable } from "svelte/store";


    const dispatch = createEventDispatcher()

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


    
    export let sequencer: Sequencer
    
    const sequence = writable(sequencer.sequence)

    /** HTMLElement reference */
    const notes = []

    /** Array of activated channels. Sequencer can play through all 8 channels simultaniously. */
    let channels: boolean[] = []
    // let channels: Channel = 0

    let currentLinePos

    let timelineObserver: Subscription

    let velocity = .7
    
    let rows: number = 1

    let noteHeight: number = 100

    let wrapperHeight: number = 100

    $: {

        timelineRect = timelineRect
        onResizeTimeline()
        getRows()
        getNoteHeight()
        sequencer.sequence = sequencer.sequence
    }

    // Fill channels array with booleans
    for(let i = 0; i < Synthesizer.maxChannelCount; i++) channels.push(false)

    // Reactive - update channel array
    $: {
        for(let i = 0; i < Synthesizer.maxChannelCount; i++) channels[i] = false
        for(let c of sequencer.channels) channels[c] = true
    }

    onMount(() => {

        onResizeTimeline()

        console.log('onmoun', sequencer)
        if(sequencer == undefined) return 

        // Update position of timeline line
        timelineObserver = BeatMachine.subscribeTimeLine((t) => {

            const startTime = sequencer.startTime
            // console.log('starttime', Sequencer.startTime, sequencer.startTime, startTime)

            if(!Number.isNaN(startTime)) {

                Tone.Draw.schedule(() => {

                    if(sequencer.isPlaying) currentLinePos = ((((Tone.immediate() - startTime) % sequencer.bars)) * (timelineRect.width / sequencer.bars))
                    else currentLinePos = 0

                }, t)
            }
        })

        updateWrapperHeight()
    })

    onDestroy(() => {

        timelineObserver.unsubscribe()

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

        onResizeTimeline()

        saveUndo()
    }

    /** Remove one bar from sequencer */
    const removeBar = (e) => {

        sequencer.removeBar()

        onResizeTimeline()

        saveUndo()
    }

    /** Add new note to sequencer */
    const addNote = (time: Tone.Unit.Time, note?: Tone.Unit.Frequency) => {

        if(note == undefined) {

            if(Synthesizer.lastNotePlayed != undefined) note = Synthesizer.lastNotePlayed
            else note = 'F3'
        }

        sequencer.addNote(note, time, convertNoteLength(sequencer.noteLength), 1)

        updateWrapperHeight()

        sequence.set(sequencer.sequence)

        saveUndo()
    }

    /** DblClick Timeline event */
    const onTimelineDblClick = (e: MouseEvent) => {

        timelineRect = timeline.getBoundingClientRect()

        const bars = sequencer.bars
        const width = timelineRect.width
        const posX = e.clientX - timelineRect.left 

        let xInPercent = posX / width

        let time = Math.round(bars * xInPercent * 1000) / 1000

        addNote(time)

        sequencer.sequence = sequencer.sequence
        sequencer = sequencer

        saveUndo()
    }

    /** Touching note right now */
    let touchNote = false

    /** Pointerdown Timeline event */
    const onTimelineClick = (e: MouseEvent) => {

        selectedNote = null
    }

    /** Timeline HTML element ref */
    let timeline: HTMLElement
    /** Timeline's client rect object */
    let timelineRect: DOMRect
    /** Resize Timeline event - need to get clientRect from timeline */
    const onResizeTimeline = (e?) => {

        // if(e instanceof Event) timelineRect = (e.target as HTMLElement).getBoundingClientRect()
        // else timelineRect = e.getBoundingClientRect()

        if(timeline == undefined) return

        timelineRect = timeline.getBoundingClientRect()
    }
    
    /** DblClick Note Event  */
    const onNoteDblClick = (e, note: SequenceObject) => {

        if(isDragNoteResize) return

        e.stopPropagation()

        sequencer.removeNote(note.id)

        updateWrapperHeight()

        sequence.set(sequencer.sequence)

        sequencer = sequencer

        saveUndo()
    }


    let isNoteMouseDown = false
    let selectedNote: SequenceObject
    let noteEle: HTMLElement
    let clickOffset: number = 0
    let time: Tone.Unit.Time = 0
    const noteMouseDown = (e, note: SequenceObject) => {

        e.stopPropagation()

        if(e.target instanceof HTMLInputElement) return
        
        noteEle = e.target.closest('.note')

        isNoteMouseDown = true
        touchNote = true

        selectedNote = note
        time = selectedNote.time
        clickOffset = e.pageX - noteEle.getBoundingClientRect().left
    }

    const noteMouseMove = (e) => {

        if(!isNoteMouseDown) return
        if(!noteEle) return
        if(isDragNoteResize) return
        if(!selectedNote) return

        const eleRect = noteEle.getBoundingClientRect()

        const bars = sequencer.bars
        const width = timelineRect.width
        const stop = timelineRect.right

        let posX = e.clientX - timelineRect.left - clickOffset

        if(timelineRect.left + posX + eleRect.width > stop) posX = stop - eleRect.width - timelineRect.left
        
        let xInPercent = posX / width

        time = Math.round(bars * xInPercent * 1000) / 1000
        
        if(time < 0) time = 0

        sequencer.updateNote(selectedNote.id, selectedNote.note, time, selectedNote.length, selectedNote.velocity)

        updateWrapperHeight()

        sequence.set(sequencer.sequence)
        
        sequencer = sequencer
    }

    const noteMouseUp = (e) => {

        isNoteMouseDown = false
        touchNote = false
        
        if(selectedNote) {

            // sequencer.removeNote(selectedNote.id)
            // sequencer.addNote(selectedNote.note, selectedNote.time, selectedNote.length, selectedNote.velocity)
            sequencer.updateNote(selectedNote.id, selectedNote.note, time, selectedNote.length, selectedNote.velocity)

            updateWrapperHeight()

            sequence.set(sequencer.sequence)

            sequencer = sequencer

            saveUndo()
        }

        // selectedNote = null

        clickOffset = 0

    }


    
    let isDragNoteResize = false
    let resizeNote: SequenceObject
    let startTime: number = 0
    let endTime: number = 0
    let dragOffset: number = 0
    let handle = 0
    /** Resizing note - Mouse down event */
    const handleHorizontalDown = (e, note: SequenceObject, which: 'start' | 'end') => {
        // console.log('handle down', note)

        e.stopPropagation()

        isDragNoteResize = true
        touchNote = true

        resizeNote = note

        startTime = Tone.Time(resizeNote.time).toSeconds()
        endTime = startTime + Tone.Time(resizeNote.length).toSeconds()

        dragOffset = e.pageX - e.target.getBoundingClientRect().left

        handle = which == 'start' ? 0 : 1
    }

    /** Resizing note - Mouse move event */
    const handleHorizontalMove = (e) => {

        // e.stopPropagation()

        if(!isDragNoteResize) return
        
        if(!resizeNote) return
        
        // console.log('move')
        // console.log('move')


        selectedNote = null

        const bars = sequencer.bars
        const width = timelineRect.width
        const posX = e.clientX - timelineRect.left + (handle == 0 ? -dragOffset : dragOffset)

        let xInPercent = posX / width

        time = Math.round(bars * xInPercent * 1000) / 1000

        let l: Tone.Unit.Time
        if(handle == 0) {

            if(time < 0) time = 0
            
            l = endTime - time
            
            if(l < 0) time = endTime
            
            sequencer.updateNote(resizeNote.id, resizeNote.note, time, l, resizeNote.velocity)
        }
        else {

            if(time < 0) time = 0

            endTime = time

            l = endTime - startTime

            if(l < 0) time = endTime

            sequencer.updateNote(resizeNote.id, resizeNote.note, resizeNote.time, l, resizeNote.velocity)
        }

        updateWrapperHeight()

        sequencer = sequencer

        sequencer.sequence = sequencer.sequence
    }

    /** Resizing note - Mouse up event */
    const handleHorizontalUp = (e) => {
        // console.log('up')
        
        // e.stopPropagation()

        isDragNoteResize = false
        touchNote = false

        resizeNote = null

        dragOffset = 0

        startTime = 0
        endTime = 0
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

        if(isDragNoteResize) return

        if(touchNote) return

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

        if(isDragNoteResize) return

        if(touchNote) return

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

    const getRows = () => {

        // rows = getMaxDifferentNotes(sequencer.sequence).length

        rows = sequencer.sequence.length

        console.log('rows',rows)
        return rows
    }

    /** Returns the maximal amount of overlaps of the array */
    const getMaxDifferentNotes = (notes: SequenceObject[]) => {

        let _notes = []
        for(let n of notes) {

            if(_notes.indexOf(n.note) == -1) _notes.push(n.note)
        }

        return _notes
    }    

    /** Returns an array with all notes (including the passed in note) that overlap with the passed in note. */
    const getYOverlappingNotesByNote = (() => {

        let t1: number,
            t2: number,
            l1: number,
            l2: number
    
        return (note: SequenceObject) => {
        
            const notes: SequenceObject[] = [ note ]

            t1 = Tone.Time(note.time).toSeconds()
            l1 = Tone.Time(note.length).toSeconds()

            for(let n2 of sequencer.sequence) {

                t2 = Tone.Time(n2.time).toSeconds()
                l2 = Tone.Time(n2.length).toSeconds()

                if(t1 > t2 && t1 < t2 + l2 || t1 + l1 > t2 && t1 + l1 < t2 + l2) {

                    notes.push(n2)
                }
            }

            return notes
        }
    })()

    /** Returns the Y position for the passed in note. Y position is for HTML */
    const getNoteY = (note: SequenceObject) => {

        // const diffNotes = getMaxDifferentNotes(sequencer.sequence)

        // diffNotes.sort((a, b) => {

        //     return Tone.Frequency(a.note).toFrequency() - Tone.Frequency(b.note).toFrequency() 
        // })

        // let i = diffNotes.indexOf(note.note)

        // console.log('y', note.note, i, wrapperHeight, rows,(wrapperHeight / rows) * i)
        // return (wrapperHeight / rows) * i

        sequencer.sequence.sort((a, b) => {

            return Tone.Frequency(a.note).toFrequency() - Tone.Frequency(b.note).toFrequency() 
        })

        let i = sequencer.sequence.indexOf(note)

        console.log('y', note.note, i, wrapperHeight, rows,(wrapperHeight / rows) * i)
        return (wrapperHeight / rows) * i
    }

    /** Returns the HTML height for the passed in note */
    const getNoteHeight = () => {

        getRows()

        return noteHeight = wrapperHeight / rows
    }

    const updateWrapperHeight = () => {

        getRows()
        if(rows < 3) return wrapperHeight = 100
        wrapperHeight = rows * 33
    }



    /** Toggle sequencer on/off */
    const toggleStartStop = () => {

        if(!sequencer.isPlaying) {

            sequencer.start()
        }
        else sequencer.stop()

        sequencer = sequencer
    }

    /** Activate or deactivate channels. Channelnumber and bool */
    const activateChannel = (channel: Channel, active: boolean) => {

        // Toggle
        active = !active

        channels[channel] = active

        if(active) sequencer.addChannel(channel)
        else sequencer.removeChannel(channel)

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

    <div class="sequencer-wrapper" style:height={wrapperHeight+'px'}>

        <div class="sequencer-menu">

            <div class="btn delete" on:click={onDelete}>&#x2715;</div>
            
            <div class="btn duplicate" on:click={onDuplicate}>D</div>

            <div class="btn play" class:active={sequencer.isPlaying} title="Play" on:click={toggleStartStop}>{ !sequencer.isPlaying ? 'Play' : 'Stop'}</div>

            <div class="btn noteLength" on:click={onNoteLength}>{sequencer.noteLength}</div>

            <div>

                {#each channels as cc, i}
                    
                    {#if i == 7 } 
                        <br />  
                    {/if}

                    <div class="btn" class:active={cc} title="Channels to sequence" on:click={() => activateChannel(i, cc)}>{ i }</div>

                {/each}

            </div>

        </div>
            
        <div class="sequence">

            <div class="sequence-wrapper">
                

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="timeline"
                        bind:this={timeline}
                        on:pointerdown={onTimelineClick}
                        on:dblclick={onTimelineDblClick}
                        on:resize={onResizeTimeline}
                        use:onResizeTimeline>
                    
                    {#if timelineRect != undefined } 

                        <div class="timeline-ui">

                            <div class="current-line" style:left={currentLinePos + 'px'}></div>

                            {#each Array(sequencer.bars) as _, bar }

                                <div class="bar" 
                                        style:width={(timelineRect.width / sequencer.bars)+'px'} 
                                        style:left={(((timelineRect.width / sequencer.bars) * bar) - 1) + 'px'}>

                                    {#each Array(16) as _, noteLine }

                                        <div class="note-line" style:left={((((timelineRect.width / sequencer.bars) / 16) * noteLine) - .5) + 'px'}></div>

                                    {/each}

                                </div>

                                <div class="bar-line" style:left={(((timelineRect.width / sequencer.bars) * bar) - 1) + 'px'}></div>

                            {/each}

                            <div class="bar-line" style:right={'-1px'} style:left="unset"></div>

                        </div>

                        <div class="timeline-notes">

                            {#each $sequence as note, i }

                                <div class="note" 
                                        bind:this={notes[i]}
                                        class:selected={selectedNote == note}
                                        on:pointerdown={(e) => noteMouseDown(e, note)}
                                        on:dblclick|self={(e) => { onNoteDblClick(e, note) }}
                                        style:top={getNoteY(note) + 'px'}
                                        style:height={noteHeight + 'px'}
                                        style:left={((Tone.Time(note.time).toSeconds() / sequencer.bars) * timelineRect.width) + 'px'}
                                        style:width={((Tone.Time(note.length).toSeconds() / sequencer.bars) * timelineRect.width) + 'px'} >

                                        
                                    <div class="drag-handle drag-start" 
                                            on:pointerdown={(e) => handleHorizontalDown(e, note, 'start')}
                                            on:pointermove={(e) => handleHorizontalMove(e)}
                                            on:pointerup={(e) => handleHorizontalUp(e)}></div>
                                    <div class="drag-handle drag-end" 
                                            on:pointerdown={(e) => handleHorizontalDown(e, note, 'end')}
                                            on:pointermove={(e) => handleHorizontalMove(e)}
                                            on:pointerup={(e) => handleHorizontalUp(e)}></div>

                                    
                                    <!-- <input bind:value={ note.note } /> -->
                                    
                                    
                                    <div class="btn" 
                                            title="Note - Click to increase; Shift - Click to decrease" 
                                            on:dblclick|stopPropagation={e => {}} 
                                            on:click|stopPropagation={e => onNoteClick(e, note)}>{ getNote(note) }</div>
                                    <div class="btn" 
                                            title="Octave - Click to increase; Shift - Click to decrease" 
                                            on:dblclick|stopPropagation={e => {}} 
                                            on:click|stopPropagation={e => onOctaveClick(e, note)}>{ getOctave(note) }</div>
                                    
                                    <div class="velocity" class:changed={ velocity < 1 } style:height={velocity * 100 + '%'}>
    <!--                                 
                                        <div class="drag-handle drag-velocity" 
                                                on:pointerdown={(e) => handleHorizontalDown(e, note, 'end')}
                                                on:pointermove={(e) => handleHorizontalMove(e)}
                                                on:pointerup={(e) => handleHorizontalUp(e)}></div> -->

                                    </div>
                                    
                                </div>

                            {/each}

                        </div>

                    {/if}

                </div>

                <div class="add-remove-cont">

                    <div class="add-bar" on:click={(e) => addBar(e)}>+</div>
                    <div class="remove-bar" on:click={(e) => removeBar(e)}>-</div>

                </div>

            </div>

        </div>

    </div>

{/if}


<svelte:body 
        on:pointerup={(e) => noteMouseUp(e)}
        on:pointermove={(e) => noteMouseMove(e)}
        on:pointerup={(e) => handleHorizontalUp(e)}
        on:pointermove={(e) => handleHorizontalMove(e)} />


<style>

    .sequencer-wrapper {

        display: inline-flex;
        align-items: center;

        /* height: 75px; */
        min-width: 400px;
        width: 100%;
        height: 100px;

        background-color: var(--c-b);

        border: .5px solid var(--c-b);

        overflow: hidden;
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

    .sequencer-wrapper .sequence .timeline {

        mix-blend-mode: color-dodge;
        mix-blend-mode: unset;

        position: relative;

        overflow: hidden;
        
        width: 100%;
        height: 100%;
    }

    .sequencer-wrapper .sequence .timeline .timeline-notes,
    .sequencer-wrapper .sequence .timeline .timeline-ui {

        position: absolute;

        width: 100%;
        height: 100%;
    }


    .sequencer-wrapper .sequence .bar {

        position: absolute;
        left: 0px;
        top: 0px;

        max-width: 2000px;
        min-width: 40px;
        height: 100%;

        text-align: center;
    /* 
        background-color: var(--c-w);
        opacity: .01; */
    }
    .sequencer-wrapper .sequence .bar-line {

        z-index: 1;
        position: absolute;
        left: -.5px;
        top: 0px;
        height: 100%;
        width: 1px;

        background-color: var(--c-y);
    }
    .sequencer-wrapper .sequence .note-line {

        z-index: 1;
        position: absolute;
        left: -.5px;
        top: 0px;
        height: 100%;
        width: 1px;
        opacity: .3;

        background-color: var(--c-y);
    }

    .sequencer-wrapper .sequence .current-line {

        z-index: 1;
        position: absolute;
        left: 1px;
        top: 0px;
        height: 100%;
        width: 2px;
        opacity: 1;

        background-color: #fff;
    }
    .sequencer-wrapper .sequence .add-remove-cont {

        height: 100%;
        width: 50px;
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

    .sequencer-wrapper .sequence .note {
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
        border: .5px solid var(--c-w);
    }

    .sequencer-wrapper .sequence .note.selected {
        background-color: var(--c-o);
        cursor: grabbing !important;
        z-index: 4;
    }

    .sequencer-wrapper .sequence .note.note.selected input {

        cursor: grabbing !important;
    }

    .sequencer-wrapper .sequence .note input {

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

    .sequencer-wrapper .sequence .note .btn {

        z-index: 2;

        background-color: transparent;
    }
    .sequencer-wrapper .sequence .note .btn:hover,
    .sequencer-wrapper .sequence .note .btn:active {

        background-color: transparent;
        color: var(--c-b);
    }

    .sequencer-wrapper .sequence .drag-handle {

        z-index: 3;

        position: absolute;
        top: 0px;

        width: 10px;
        height: 100%;

        cursor: ew-resize;

        /* background-color: #fff; */

        /* opacity: .3; */
    }

    .sequencer-wrapper .sequence .drag-start {

        left: 0px;

    }

    .sequencer-wrapper .sequence .drag-end {

        right: 0px;
    }

    .sequencer-wrapper .sequence .drag-velocity {

        left: 0px;

        width: 100%;
        height: 10px;

        cursor: row-resize;
    }

    .sequencer-wrapper .sequence .velocity {

        position:absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .sequencer-wrapper .sequence .velocity.changed {

        background-color: #fff;
        opacity: .7;
    }

</style>