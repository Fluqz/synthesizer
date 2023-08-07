<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type NoteLength } from "../sequencer";
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

    /** Set default note length*/
    const noteLengths: NoteLength[] = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64']
    let currentNoteLength: NoteLength = noteLengths[4]

    /** Set default note length */
    const changeNoteLength = (noteLength: NoteLength) => {

        currentNoteLength = noteLength

        const l = convertNoteLength(currentNoteLength)

        console.log('CHANGE LENGTH', l)
        for(const s of sequencer.sequence) {

            s.length = l
        }

        sequencer = sequencer
    }

    /** Add new bar to sequencer */
    const addBar = (e) => {

        sequencer.addBar()

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
    }

    /** Click Timeline event */
    const onTimelineClick = (e: MouseEvent) => {

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
    
    /** Click Note Event  */
    const onNoteClick = (e) => {

        e.stopPropagation()
    }

    /** DblClick Note Event  */
    const onNoteDblClick = (e, note, i) => {

        e.stopPropagation()

        sequencer.removeNote(i, note)

        sequencer = sequencer
    }

    /** Toggle sequencer on/off */
    const toggleStartStop = () => {

        if(!sequencer.isPlaying) sequencer.start()
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

            <div class="btn play" class:active={sequencer.isPlaying} title="Play" on:click={toggleStartStop}>{ !sequencer.isPlaying ? 'Play' : 'Stop'}</div>


            <div>

                {#each channels as cc, i}
                    
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
                <div class="timeline" bind:this={timeline} on:click={onTimelineClick} on:dblclick={onTimelineDblClick} on:resize={onResizeTimeline} use:onResizeTimeline>
                    
                    {#if timelineRect != undefined } 

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
                                    on:click={onNoteClick}
                                    on:dblclick={(e) => { onNoteDblClick(e, note, i) }}
                                    style:left={((Tone.Time(note.time).toSeconds() / sequencer.bars) * timelineRect.width) + 'px'} >

                                    <input bind:value={ note.note } />
 
                            </div>

                        {/each}

                    {/if}

                </div>

                <div class="add-bar" on:click={(e) => addBar(e)}>+</div>


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
    height: 100px;

    background-color: var(--c-b);

    border: none;
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

    background-color: var(--c-bl);
}
.sequencer-wrapper .sequence .bar-line {

    position: absolute;
    left: -1px;
    top: 0px;
    height: 100%;
    width: 2px;

    background-color: var(--c-y);
}
.sequencer-wrapper .sequence .note-line {

    position: absolute;
    left: -.5px;
    top: 0px;
    height: 100%;
    width: 1px;
    opacity: .3;

    background-color: var(--c-y);
}

.sequencer-wrapper .sequence .add-bar,
.sequencer-wrapper .sequence .add-note-to-bar {

    display: inline-flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}

.sequencer-wrapper .sequence .note {

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
}

.sequencer-wrapper .sequence .note input {

    z-index: 1;

    min-width: unset;
    width: 100%;
    height: 25px;

    border: none;

    font-size: 1rem;

    text-align: center;

    background-color: transparent;

    padding: 0px;
    margin: 0px;

    color: aliceblue;
}

</style>