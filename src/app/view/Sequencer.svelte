<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type NoteLength, type SequenceObject } from "../sequencer";
    import { createEventDispatcher } from "svelte";


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

    // Update position of timeline line
    let currentLinePos
    Tone.Transport.scheduleRepeat((time) => {

        // if(sequencer.isPlaying) console.log('pos', ((Tone.immediate() - Sequencer.startTime) % sequencer.bars))
        // if(sequencer.isPlaying) console.log('pos',((((Tone.now() - Sequencer.startTime) % sequencer.bars)), (timelineRect.width / sequencer.bars)) - 1)
        if(sequencer.isPlaying) currentLinePos = ((((Tone.immediate() - Sequencer.startTime) % sequencer.bars)) * (timelineRect.width / sequencer.bars))
        else currentLinePos = 0

    }, 1 / 60, Tone.now(), Number.POSITIVE_INFINITY)


    /** Set default note length*/
    const noteLengths: NoteLength[] = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64']
    /** Currently selected note length */
    let currentNoteLength: NoteLength = sequencer.noteLength

    /** Set default note length */
    const changeNoteLength = (noteLength: NoteLength) => {

        currentNoteLength = noteLength

        sequencer = sequencer
    }

    /** Add a new bar to sequencer */
    const addBar = (e) => {

        sequencer.addBar()

        sequencer.sequence = sequencer.sequence

        sequencer = sequencer
    }

    /** Remove one bar from sequencer */
    const removeBar = (e) => {

        sequencer.removeBar()

        sequencer.sequence = sequencer.sequence

        sequencer = sequencer
    }

    /** Add new note to sequencer */
    const addNote = (time: Tone.Unit.Time) => {

        sequencer.addNote('C3', time, convertNoteLength(currentNoteLength), 1)

        sequencer.sequence = sequencer.sequence

        sequencer = sequencer
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
    }

    /** Pointerdown Timeline event */
    const onTimelineClick = (e: MouseEvent) => {

        selectedNote = null
    }

    /** Timeline HTML element ref */
    let timeline: HTMLElement
    /** Timeline's client rect object */
    let timelineRect: DOMRect
    /** Resize Timeline event - need to get clientRect from timeline */
    const onResizeTimeline = (e) => {

        if(e instanceof Event) timelineRect = (e.target as HTMLElement).getBoundingClientRect()
        else timelineRect = e.getBoundingClientRect()
        
        timelineRect = timelineRect
    }
    
    /** DblClick Note Event  */
    const onNoteDblClick = (e, note: SequenceObject) => {

        if(isDrag) return

        e.stopPropagation()

        sequencer.removeNote(note.id)

        sequencer.sequence = sequencer.sequence
        sequencer = sequencer
    }


    let isNoteMouseDown = false
    let selectedNote: SequenceObject
    let clickOffset: number = 0
    let time: Tone.Unit.Time
    const noteMouseDown = (e, note: SequenceObject) => {

        e.stopPropagation()

        if(e.target instanceof HTMLInputElement) return

        isNoteMouseDown = true

        selectedNote = note
        time = selectedNote.time

        clickOffset = e.pageX - e.target.getBoundingClientRect().left
    }

    const noteMouseMove = (e) => {

        if(!isNoteMouseDown) return

        if(isDrag) return

        if(!selectedNote) return
        // console.log('mousemove')

        const bars = sequencer.bars
        const width = timelineRect.width
        const posX = e.clientX - timelineRect.left - clickOffset

        let xInPercent = posX / width

        time = Math.round(bars * xInPercent * 1000) / 1000

        if(time < 0) time = 0

        sequencer.updateNote(selectedNote.id, selectedNote.note, time, selectedNote.length, selectedNote.velocity)

        sequencer = sequencer

        sequencer.sequence = sequencer.sequence
    }

    const noteMouseUp = (e) => {

        isNoteMouseDown = false
        
        if(selectedNote) {

            // sequencer.removeNote(selectedNote.id)
            // sequencer.addNote(selectedNote.note, selectedNote.time, selectedNote.length, selectedNote.velocity)
            sequencer.updateNote(selectedNote.id, selectedNote.note, time, selectedNote.length, selectedNote.velocity)


            sequencer.sequence = sequencer.sequence
            sequencer = sequencer
        }

        // selectedNote = null

        clickOffset = 0
    }


    
    let isDrag = false
    let resizeNote: SequenceObject
    let startTime: number = 0
    let endTime: number = 0
    let dragOffset: number = 0
    let handle = 0
    const handleHorizontalDown = (e, note: SequenceObject, which: 'start' | 'end') => {
        // console.log('handle down', note)

        e.stopPropagation()

        isDrag = true

        resizeNote = note

        startTime = Tone.Time(resizeNote.time).toSeconds()
        endTime = startTime + Tone.Time(resizeNote.length).toSeconds()

        dragOffset = e.pageX - e.target.getBoundingClientRect().left

        handle = which == 'start' ? 0 : 1
    }

    const handleHorizontalMove = (e) => {

        // e.stopPropagation()

        if(!isDrag) return
        
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

        sequencer = sequencer

        sequencer.sequence = sequencer.sequence
    }

    const handleHorizontalUp = (e) => {
        // console.log('up')
        
        // e.stopPropagation()

        isDrag = false

        resizeNote = null

        dragOffset = 0

        startTime = 0
        endTime = 0
    }


    let velocity = .7


    let currentNote: string
    const onNoteClick = (e, note: SequenceObject) => {

        currentNote = Tone.Frequency(note.note).toNote().toString()

        const octave = currentNote[currentNote.length - 1]

        currentNote = currentNote.replace(octave, '')

        let i = Synthesizer.notes.indexOf(currentNote)

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i > Synthesizer.notes.length - 1) i = 0
        else if(i < 0) i = Synthesizer.notes.length - 1

        note.note = Synthesizer.notes[i] + octave

        sequencer = sequencer
    }

    const onOctaveClick = (e, note: SequenceObject) => {

        e.stopPropagation()

        currentNote = Tone.Frequency(note.note).toNote().toString()

        const octave = currentNote[currentNote.length - 1]

        currentNote = currentNote.replace(octave, '')

        let i = Synthesizer.octaves.indexOf(+octave)

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i > Synthesizer.octaves.length - 1) i = 0
        else if(i < 0) i = Synthesizer.octaves.length - 1

        console.log('octave', i, Synthesizer.octaves[i])

        note.note = currentNote + Synthesizer.octaves[i]

        sequencer = sequencer
    }








    /** Toggle sequencer on/off */
    const toggleStartStop = () => {

        if(!sequencer.isPlaying) {

            Tone.Transport.scheduleOnce((time) => {



            }, 0)

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

        console.log(channel, active)

        if(active) sequencer.addChannel(channel)
        else sequencer.removeChannel(channel)

        sequencer = sequencer
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

</script>


{#if sequencer != undefined } 

    <div class="sequencer-wrapper">

        <div class="sequencer-menu">

            <div class="btn delete" on:click={onDelete}>&#x2715;</div>
            
            <div class="btn duplicate" on:click={onDuplicate}>D</div>

            <div class="btn play" class:active={sequencer.isPlaying} title="Play" on:click={toggleStartStop}>{ !sequencer.isPlaying ? 'Play' : 'Stop'}</div>


            <div>

                {#each channels as cc, i}
                    
                    {#if i == 7 } 
                        <br />  
                    {/if}

                    <div class="btn" class:active={cc} title="Channels to sequence" on:click={() => activateChannel(i, cc)}>{ i }</div>

                {/each}

            </div>


            <div class="noteLengths">

                {#each noteLengths as noteLength }

                    <div class="btn noteLength" class:active={currentNoteLength == noteLength} on:click={() => changeNoteLength(noteLength)}>{noteLength}</div>

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

                        {#each sequencer.sequence as note, i }

                            <div class="note" 
                                    class:selected={selectedNote == note}
                                    on:pointerdown={(e) => noteMouseDown(e, note)}
                                    on:dblclick={(e) => { onNoteDblClick(e, note) }}
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

                                
                                <input bind:value={ note.note } />
                                
                                
                                <div class="btn" title="Note - Click to increase; Shift - Click to decrease" on:click={e => onNoteClick(e, note)}></div>
                                <div class="btn" title="Octave - Click to increase; Shift - Click to decrease" on:click={e => onOctaveClick(e, note)}></div>
                                
                                <div class="velocity" class:changed={ velocity < 1 } style:height={velocity * 100 + '%'}>
                                
                                    <div class="drag-handle drag-velocity" 
                                            on:pointerdown={(e) => handleHorizontalDown(e, note, 'end')}
                                            on:pointermove={(e) => handleHorizontalMove(e)}
                                            on:pointerup={(e) => handleHorizontalUp(e)}></div>

                                </div>
                                
                            </div>

                        {/each}

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

    display: inline-flex;
    justify-content: center;
    align-items: center;

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
    position: relative;

    display: inline-flex;
    width: 100%;
    height: 100%;

    overflow: hidden;
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
    left: -1px;
    top: 0px;
    height: 100%;
    width: 2px;

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

    opacity: .5;

    text-align: center;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    cursor: grab !important;

    /* border: 1px solid var(--c-o); */
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
    opacity: .2;
}

</style>