<script lang="ts">
    
    import * as Tone from "tone";
    import { Sequencer, type NoteLength, type SequenceObject } from "../sequencer";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { Storage } from "../core/storage";
    import { BeatMachine } from "../beat-machine";
    import type { Subscription } from "rxjs";
    import { writable } from "svelte/store";
    import Note from "./Note.svelte";


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

    let currentLinePos = 0

    let timelineObserver: Subscription

    let rows: number = 1

    let noteHeight: number = 100

    let wrapperHeight: number = 100

    $: {

        timelineRect = timelineRect
        onResizeTimeline()
        getRows()
        getNoteHeight()
        updateWrapperHeight()
        sequence.set(sequencer.sequence)
        if(selectedNote) getSequenceObject(selectedNote)
        alteredSequenceObject.time = alteredSequenceObject.time
    }

    onMount(() => {

        onResizeTimeline()

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

    /** DblClick Timeline event */
    const onTimelineDblClick = (e: MouseEvent) => {

        console.log('onTimelineDblClick')

        timelineRect = timeline.getBoundingClientRect()

        const bars = sequencer.bars
        const width = timelineRect.width
        const posX = e.clientX - timelineRect.left 

        let xInPercent = posX / width

        let time = Math.round(bars * xInPercent * 1000) / 1000

        dispatch('addNote', time)

        sequence.set(sequencer.sequence)
        sequencer = sequencer

        saveUndo()
    }

    /** Touching note right now */

    /** Pointerdown Timeline event */
    const onTimelineClick = (e: MouseEvent) => {

        console.log('onTimelineClick')

        selectedNote = null
    }

    /** Timeline HTML element ref */
    let timeline: HTMLElement
    /** Timeline's client rect object */
    let timelineRect: DOMRect
    /** Resize Timeline event - need to get clientRect from timeline */
    const onResizeTimeline = (e?) => {

        console.log('onResizeTimeline')

        // if(e instanceof Event) timelineRect = (e.target as HTMLElement).getBoundingClientRect()
        // else timelineRect = e.getBoundingClientRect()

        if(timeline == undefined) return

        timelineRect = timeline.getBoundingClientRect()
    }
    
    /** DblClick Note Event  */
    const removeNote = (note: SequenceObject) => {

        if(isDragNoteResize) return

        sequencer.removeNote(note.id)

        updateWrapperHeight()

        sequence.set(sequencer.sequence)

        sequencer = sequencer

        saveUndo()
    }


    let isPointerDown = false
    let isNoteDrag = false
    let selectedNote: SequenceObject
    let noteEle: HTMLElement
    let clickOffsetX: number = 0
    let clickOffsetY: number = 0
    let alteredSequenceObject: SequenceObject
    let newIndex: number
    let noteRect: DOMRect
    const notePointerDown = (e, note: SequenceObject) => {

        console.log('notePointerDown')

        e.stopPropagation()

        if(e.target instanceof HTMLInputElement) return
        
        noteEle = e.target.closest('.note')

        if (!noteEle) return

        noteRect = noteEle.getBoundingClientRect()

        isPointerDown = true

        selectedNote = note
        clickOffsetX = e.pageX - noteRect.left
        clickOffsetY = e.clientY - noteRect.top

        alteredSequenceObject = {

            id: selectedNote.id,
            note: selectedNote.note,
            time: selectedNote.time,
            length: selectedNote.length,
            velocity: selectedNote.velocity
        }
    }

    const notePointerMove = (e) => {
        
        if(!isPointerDown) return
        if(!noteEle) return
        if(isDragNoteResize) return
        if(!selectedNote) return

        isNoteDrag = true
        console.log('notePointerMove', e.clientY - clickOffsetY)

        const bars = sequencer.bars
        const width = timelineRect.width
        const stop = timelineRect.right
        const start = 0

        const noteHeight = getNoteHeight()
        const noteY = getNoteY(selectedNote)

        // Vertical drag
        let posY = e.clientY - timelineRect.top - clickOffsetY

        // if(posY > noteY) {

        //     const i = sequencer.sequence.indexOf(selectedNote)

        //     // If not exist Or first element
        //     if(i != -1 && i != 0) {

        //         newIndex = i - 1
                
        //         console.log('ABOVE', posY, noteY, posY > noteY, selectedNote.id, i, newIndex)

        //         // Remove
        //         sequencer.sequence.splice(i, 1)
        //         // Insert
        //         sequencer.sequence.splice(newIndex, 0, selectedNote)
        //         // Update
        //         sequence.set(sequencer.sequence)
        //     }
        // }
        // else if(posY < noteY + noteHeight) {

        //     const i = sequencer.sequence.indexOf(selectedNote)

        //     // If not exist Or first element
        //     if(i != -1 && i != sequencer.sequence.length) {

        //         newIndex = i + 1
                
        //         console.log('BELOW', posY, noteY + noteHeight, posY < noteY + noteHeight, selectedNote.id, i, newIndex)
                
        //         // Remove
        //         sequencer.sequence.splice(i, 1)
        //         // Insert
        //         sequencer.sequence.splice(newIndex, 0, selectedNote)
        //         // Update
        //         sequence.set(sequencer.sequence)
        //     }
        // }
        // else {

        //     console.log('NOTHING')
        // }

        newIndex = null

        // Horizontal drag
        let posX = e.clientX - timelineRect.left - clickOffsetX

        // Right boundary
        if(timelineRect.left + posX + noteRect.width > stop) posX = stop - noteRect.width - timelineRect.left
        
        let xInPercent = posX / width

        let time = Math.round(bars * xInPercent * 1000) / 1000
        
        // Left boundary
        if(time < start) time = start

        alteredSequenceObject.time = time

        updateWrapperHeight()

        sequence.set(sequencer.sequence)
        
        sequencer = sequencer
    }

    const notePointerUp = (e) => {

        console.log('notePointerUp')

        isPointerDown = false
        
        if(selectedNote && selectedNote.id == alteredSequenceObject.id) {

            if(selectedNote.time != alteredSequenceObject.time) {

                sequencer.updateNote(
                    alteredSequenceObject.id, 
                    alteredSequenceObject.note, 
                    alteredSequenceObject.time, 
                    alteredSequenceObject.length, 
                    alteredSequenceObject.velocity
                )
                
                updateWrapperHeight()
                
                sequence.set(sequencer.sequence)
                
                sequencer = sequencer
                
                saveUndo()
            }
        }

        if(isNoteDrag) {

            selectedNote = null
            alteredSequenceObject = null
            
            clickOffsetX = 0
            clickOffsetY = 0
            
            noteRect = null
            
            newIndex = null

            isNoteDrag = false
        }
    }


    let isDragNoteResize = false
    let startTime: number = 0
    let endTime: number = 0
    let dragOffset: number = 0
    let handle = 0
    /** Resizing note - Mouse down event */
    const resizeNoteStartHandler = (e, note: SequenceObject, which: 'start' | 'end') => {
        console.log('resizeNoteStartHandler', note)

        e.stopPropagation()

        isDragNoteResize = true

        selectedNote = note

        alteredSequenceObject = {

            id: selectedNote.id,
            note: selectedNote.note,
            time: selectedNote.time,
            length: selectedNote.length,
            velocity: selectedNote.velocity
        }

        startTime = Tone.Time(selectedNote.time).toSeconds()
        endTime = startTime + Tone.Time(selectedNote.length).toSeconds()

        dragOffset = e.pageX - e.target.getBoundingClientRect().left

        handle = which == 'start' ? 0 : 1
    }

    /** Resizing note - Mouse move event */
    const resizeNoteMoveHandler = (e) => {

        // e.stopPropagation()

        if(!isDragNoteResize) return
        
        if(!selectedNote) return
        
        // console.log('move')

        const bars = sequencer.bars
        const width = timelineRect.width
        const posX = e.clientX - timelineRect.left + (handle == 0 ? -dragOffset : dragOffset)

        let xInPercent = posX / width

        let time = Math.round(bars * xInPercent * 1000) / 1000

        let l: Tone.Unit.Time
        if(handle == 0) {

            if(time < 0) time = 0
            
            l = endTime - time
            
            if(l < 0) time = endTime
            
        }
        else {

            if(time < 0) time = 0

            endTime = time

            l = endTime - startTime

            time = Tone.Time(selectedNote.time).toSeconds()
        }

        alteredSequenceObject.time = time
        alteredSequenceObject.length = l
    }

    /** Resizing note - Mouse up event */
    const resizeNoteEndHandler = (e) => {
        console.log('resizeNoteEndHandler', selectedNote, alteredSequenceObject)
        
        // e.stopPropagation()

        if(selectedNote && selectedNote.id == alteredSequenceObject.id) {

            console.log('resizeNoteEndHandler update !!PONASFO')
            sequencer.updateNote(
                alteredSequenceObject.id, 
                alteredSequenceObject.note, 
                alteredSequenceObject.time, 
                alteredSequenceObject.length, 
                alteredSequenceObject.velocity
            )
            
            updateWrapperHeight()
            
            sequence.set(sequencer.sequence)
            
            sequencer = sequencer
            
            saveUndo()
        }


        if(isDragNoteResize) {

            isDragNoteResize = false
            
            selectedNote = null
            alteredSequenceObject = null
            
            dragOffset = 0
            
            startTime = 0
            endTime = 0
        }
    }


    /** The Note component is filled with a SequenceObject. On some events like dragndrop 
     * the selected sequenceObject is replaced with an temporal sequenceObject to visualize the process
     * without manipulating the real sequence of the sequencer. */
    const getSequenceObject = (note: SequenceObject) : SequenceObject => {

        if(alteredSequenceObject && alteredSequenceObject.id == note.id) return alteredSequenceObject
        return note
    }


    const getRows = () => {

        // rows = getMaxDifferentNotes(sequencer.sequence).length

        rows = sequencer.sequence.length

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

        // sequencer.sequence.sort((a, b) => {

        //     return Tone.Frequency(a.note).toFrequency() - Tone.Frequency(b.note).toFrequency() 
        // })

        let i = sequencer.sequence.indexOf(note)

        // console.log('y', note.note, i, wrapperHeight, rows,(wrapperHeight / rows) * i)
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


    const saveUndo = () => {

        Storage.saveUndo(JSON.stringify(sequencer.synthesizer.serializeOut()))
    }

</script>

{#if sequencer != undefined }

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="timeline"
            bind:this={timeline}
            style:height={wrapperHeight+'px'}
            on:pointerdown={onTimelineClick}
            on:dblclick={onTimelineDblClick}
            on:resize={onResizeTimeline}
            use:onResizeTimeline>
        
        {#if timelineRect != undefined } 

            <div class="timeline-ui">

                {#if sequencer.isPlaying == true } 

                    <div class="current-line" style:left={currentLinePos + 'px'}></div>

                {/if}

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

                    <Note note={getSequenceObject(note)}
                            on:pointerdown={(e) => notePointerDown(e, note)}
                            sequencer={sequencer}
                            timelineRect={timelineRect}
                            yPos={getNoteY(note)}
                            height={getNoteHeight()}
                            on:delete={ (e) => removeNote(e.detail) } >
                        
                                        
                        <div class="drag-handle drag-start"
                                on:pointerdown={(e) => resizeNoteStartHandler(e, note, 'start')}></div>
                                
                        <div class="drag-handle drag-end"
                                on:pointerdown={(e) => resizeNoteStartHandler(e, note, 'end')}></div>


                    </Note>

                {/each}

            </div>

        {/if}

    </div>

{/if}


<svelte:body 
        on:pointerup={(e) => notePointerUp(e)}
        on:pointermove={(e) => notePointerMove(e)}
        on:pointerup={(e) => resizeNoteEndHandler(e)}
        on:pointermove={(e) => resizeNoteMoveHandler(e)} />


<style>

    .timeline {

        mix-blend-mode: color-dodge;
        mix-blend-mode: unset;

        position: relative;

        width: 100%;
        height: 100px;
    }

    .timeline .timeline-notes,
    .timeline .timeline-ui {

        position: absolute;

        width: 100%;
        height: 100%;
    }


    .timeline .bar {

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
    .timeline .bar-line {

        z-index: 1;
        position: absolute;
        left: -.5px;
        top: 0px;
        height: 100%;
        width: 1px;

        background-color: var(--c-y);
    }
    .timeline .note-line {

        z-index: 1;
        position: absolute;
        left: -.5px;
        top: 0px;
        height: 100%;
        width: 1px;
        opacity: .3;

        background-color: var(--c-y);
    }

    .timeline .current-line {

        z-index: 1;
        position: absolute;
        left: 1px;
        top: 0px;
        height: 100%;
        width: 2px;
        opacity: 1;

        background-color: #fff;
    }
    .timeline .add-remove-cont {

        height: 100%;
        width: 50px;
    }
    
    .timeline .remove-bar,
    .timeline .add-bar {

        display: inline-flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        width: 50px;
        height: 50%;
        background-color: var(--c-w);
        color: var(--c-b);
    }

    .timeline .remove-bar:hover,
    .timeline .add-bar:hover {

        background-color: var(--c-b);
        color: var(--c-y);
    }


</style>