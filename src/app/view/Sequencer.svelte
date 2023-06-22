<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type Notation } from "../sequencer";
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
        sequencer.setSubdivision(currentNotation)

        sequencer = sequencer
    }

    const onInput = (e) => {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

            sequencer.stop()

            // Sequencer.parse(e.target.value)

            console.log('PARSE', e.target.value)
            let input = JSON.parse(e.target.value)

            sequencer.sequence = input
        }

        sequencer = sequencer
    }

    const onChangeNote = (e, i:number, i2?:number) => {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

            const note = e.target.value

            console.log(sequencer.toneSequence.events, i, i2)

            if(i2 == undefined && Number.isInteger(i)) sequencer.toneSequence.events[i] = note
            else if(Number.isInteger(i2)) {

                sequencer.toneSequence.events[i][i2] = note
                // sequencer.sequence = sequencer.toneSequence.events
                sequencer.toneSequence.events[i] = sequencer.toneSequence.events[i]
                sequencer.toneSequence.events = sequencer.toneSequence.events
                sequencer.toneSequence = sequencer.toneSequence
                console.log('ww', sequencer.toneSequence.events[i][i2], sequencer.toneSequence.events)

            }
        }

        sequencer = sequencer
    }

    const toggleStartStop = () => {

        if(!sequencer.isPlaying) sequencer.start()
        else sequencer.stop()

        sequencer = sequencer
    }

    const activateChannel = (channel: Channel, val: boolean) => {

        // Toggle
        val = !val

        channels[channel] = val

        console.log(channel,val)

        if(val) sequencer.addChannel(channel)
        else sequencer.removeChannel(channel)

        sequencer = sequencer
    }

    const onDelete = () => {

        dispatch('deleteSequencer', sequencer)

        sequencer = sequencer
    }
    
    const placeholder = `["F#2","D3", ["DB3","C#2"], "E3"]`

</script>


{#if sequencer != undefined } 

    <div class="sequencer-wrapper">

        <div class="notations">

            {#each notations as notation }

                <div class="btn notation" class:active={currentNotation == notation} on:click={() => changeNotation(notation)}>{notation}</div>

            {/each}

        </div>
            
        <div class="sequence">

            <!-- <input on:keydown={onInput} placeholder={placeholder}/> -->

            <div class="sequence-wrapper">

                {#each sequencer.sequence as bar, i }

                    <div class="bar">

                        {#if bar instanceof Array } 
                        
                            {#each bar as note, i2 }

                                <div class="note">
            
                                    <input bind:value={ note } on:keydown={(e) => onChangeNote(e, i, i2)}/>
            
                                </div>
                                
                            {/each}

                        {:else}

                            <div class="note">
                
                                <input bind:value={ bar } on:keydown={(e) => onChangeNote(e, i)}/>
        
                            </div>

                        {/if}

                    </div>

                {/each}

            </div>

        </div>



        <div class="btn" class:active={sequencer.isPlaying} title="Play" on:click={toggleStartStop}>{ !sequencer.isPlaying ? 'Play' : 'Stop'}</div>


        <div>

            {#each channels as cc, i}
                
                <div class="btn" class:active={cc} title="Channels to sequence" on:click={() => activateChannel(i, cc)}>{ i }</div>

            {/each}

        </div>

        <div class="btn delete" on:click={onDelete}>&#x2715;</div>

    </div>

{/if}




<style>

.sequencer-wrapper {

    display: inline-flex;
    justify-content: center;
    align-items: center;

    height: 75px;
    min-width: 400px;

    background-color: var(--c-b);

    border: none;

}

.sequencer-wrapper .sequence {

    display: inline-flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
}

.sequencer-wrapper .sequence-wrapper {

    width: 100%;
    height: 100%;

    display: inline-flex;

    justify-content: center;
    align-items: center;
}

.sequencer-wrapper .sequence .bar {

    width: 50px;
    height: 50px;

    background-color: var(--c-bl);

}

.sequencer-wrapper .sequence .bar .note {

    /* width: 25px; */

    background-color: var(--c-y);
    color: var(--c-b);

    display: inline-flex;

    justify-content: center;
    align-items: center;
}

.sequencer-wrapper .sequence .bar .note input {

    min-width: unset;
    width: 50px;
    height: 25px;
    line-height: 25px;

    padding: 0px 5px;

    border: none;

    font-size: 1rem;
}

.sequencer-wrapper .sequence input {

    min-width: 200px;
    height: 25px;
    line-height: 25px;

    padding: 0px 5px;

    border: none;

    font-size: 1rem;
    /* font-family: 'Courier'; */
}

</style>