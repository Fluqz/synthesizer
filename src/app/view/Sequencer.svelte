<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type Notation, getNotationLength } from "../sequencer";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()

    export let sequencer: Sequencer

    let channels: boolean[] = []
    // let channels: Channel = 0

    for(let i = 0; i < Synthesizer.maxChannelCount; i++) channels.push(false)

    $: {
        for(let i = 0; i < Synthesizer.maxChannelCount; i++) channels[i] = false
        for(let c of sequencer.channels) channels[c] = true
    }

    let inputValue: string

    const notations: Notation[] = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64']
    let currentNotation: Notation = notations[0]

    // let sequence: { note: Tone.Unit.Frequency, length: Notation }[] = []

    const changeNotation = (notation: Notation) => {


        console.log('NOTATION',notation)

        currentNotation = notation
        // sequencer.setSubdivision(currentNotation)

        sequencer = sequencer
    }
    
    const addNoteToBar = (e, i: number) => {

        // sequencer.addNote('D2', i)
    }

    const onNoteInput = (e) => {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

            // sequencer.stop()

            // // Sequencer.parse(e.target.value)

            // console.log('PARSE', e.target.value)
            // let input = JSON.parse(e.target.value)

            // sequencer.sequence = input
        }
    }

    const addBar = (e) => {

        sequencer.addBar()

        // sequencer.start()

        sequencer.sequence = sequencer.sequence

        sequencer = sequencer
    }

    const onTimelineDblClick = (e: MouseEvent) => {

    }

    const onTimelineClick = (e: MouseEvent) => {

        timelineRect = timeline.getBoundingClientRect()

        const bars = sequencer.bars
        const width = timelineRect.width
        const posX = e.clientX - timelineRect.left 

        let xInPercent = posX / width

        let time = Math.round(bars * xInPercent * 1000) / 1000

        sequencer.addNote('C3', time, '4n', 1)

        // sequencer.start()

        sequencer = sequencer

        console.log('seq',sequencer.sequence)
    }

    const onNoteClick = (e) => {

        e.stopPropagation()
    }

    const onNoteDblClick = (e, note, i) => {

        e.stopPropagation()

        sequencer.removeNote(i, note)

        sequencer = sequencer
    }

    



    const toggleStartStop = () => {

        if(!sequencer.isPlaying) sequencer.start()
        else sequencer.stop()

        sequencer = sequencer
    }

    const activateChannel = (channel: Channel, active: boolean) => {

        // Toggle
        active = !active

        channels[channel] = active

        console.log(channel, active)

        if(active) sequencer.addChannel(channel)
        else sequencer.removeChannel(channel)

        sequencer = sequencer
    }

    const onDelete = () => {

        dispatch('deleteSequencer', sequencer)

        sequencer = sequencer
    }


    let timeline: HTMLElement
    let timelineRect: DOMRect
    const onResizeTimeline = (e) => {

        console.log('YOOO CREATED', e, timeline)

        if(e instanceof Event) timelineRect = (e.target as HTMLElement).getBoundingClientRect()
        else timelineRect = e.getBoundingClientRect()
        
        timelineRect = timelineRect
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


            <div class="notations">

                {#each notations as notation }

                    <div class="btn notation" class:active={currentNotation == notation} on:click={() => changeNotation(notation)}>{notation}</div>

                {/each}

            </div>

        </div>
            
        <div class="sequence">

            <div class="sequence-wrapper">
                
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="timeline" bind:this={timeline} on:click={onTimelineClick} on:dblclick={onTimelineDblClick} on:resize={onResizeTimeline} use:onResizeTimeline>
                    
                    {#if timelineRect != undefined } 

                        {#each Array(sequencer.bars) as _, bar }

                            <div class="bar" style:width={timelineRect.width+'px'} style:height={timelineRect.height+'px'}>


                            </div>


                            <div class="bar-line" style:left={(((timelineRect.width / (sequencer.bars)) * bar) - 1) + 'px'}></div>

                        {/each}

                        <div class="bar-line" style:right={'-1px'} style:left="unset"></div>

                        {#each sequencer.sequence as note, i }

                            <div class="note" 
                                    on:click={onNoteClick}
                                    on:dblclick={(e) => { onNoteDblClick(e, note, i) }}
                                    style:left={((Tone.Time(note.time).toSeconds() / sequencer.bars) * timelineRect.width) + 'px'} >

                                    <input bind:value={ note.note } on:keydown={(e) => onNoteInput(e)}/>
 
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
    justify-content: center;
    align-items: center;

    /* height: 75px; */
    min-width: 400px;
    width: 100%;

    background-color: var(--c-b);

    border: none;
}

.sequencer-menu {

    display: flex;
    justify-content: center;
    align-items: center;
}

.sequencer-wrapper .sequence {

    display: inline-flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100px;
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

    display: inline-flex;
    width: 100%;
    height: 100%;
}

.sequencer-wrapper .sequence .bar {

    position: relative;
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

    min-width: unset;
    width: 100%;
    height: 100%;

    border: none;

    font-size: 1rem;

    text-align: center;
}

</style>