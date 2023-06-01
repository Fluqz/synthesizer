<script lang="ts">
    
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";
    import { Sequencer, type Notation } from "../sequencer";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()

    export let sequencer: Sequencer

    let channelCount: boolean[] = []
    let channel: Channel = 0

    for(let i = 0; i < Synthesizer.maxChannelCount; i++) channelCount.push(false)

    channelCount[0] = true

    let inputValue: string

    const notations: Notation[] = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64']
    let currentNotation: Notation = notations[0]

    let sequence: { note: Tone.Unit.Frequency, length: Notation }[] = []

    const onInput = (e) => {

        e.stopPropagation()

        if(e.key == ' ' && e.target.value != null) {

            console.log('Space', e.target.value)

            // PARSE TEXT AND ADD TO SEQUENCE

            // e.target.value = ''
            // e.preventDefault()
        }


        if(e.key == 'Enter' && e.target.value != null) {

            sequencer.stop()

            // Sequencer.parse(e.target.value)

            console.log('PARSE', e.target.value)
            let input = JSON.parse(e.target.value)

            sequencer.sequence = input
        }

        sequencer = sequencer
    }

    const toggleStartStop = () => {

        if(!sequencer.isPlaying) sequencer.start()
        else sequencer.stop()

        sequencer = sequencer
    }

    const onChannel = (e) => {

        if(!e.shiftKey) channel++
        if(e.shiftKey) channel--

        if(channel >= Synthesizer.maxChannelCount) channel = 0
        else if(channel < 0) channel = (Synthesizer.maxChannelCount - 1) as Channel

        sequencer = sequencer
    }

    const activateChannel = (channel: Channel, val: boolean) => {

        // Toggle
        val = !val

        channelCount[channel] = val

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

                <div class="btn notation" class:active={currentNotation == notation} on:click={() => currentNotation = notation}>{notation}</div>

            {/each}

        </div>
            
        <div class="sequence">
<!-- 
            <div class="notes">

                {#each sequencer.sequence as note }
                    
                    <div class="note">


                    </div>

                {/each}

            </div> -->

            <input on:keydown={onInput} placeholder={placeholder}/>

        </div>



        <div class="btn" class:active={sequencer.isPlaying} title="Play" on:click={toggleStartStop}>{ !sequencer.isPlaying ? 'Play' : 'Stop'}</div>


        <div>

            {#each channelCount as cc, i}
                
                <div class="btn" class:active={cc} title="Channels to sequence" on:click={() => activateChannel(i, cc)}>{ i }</div>

            {/each}

        </div>

        <!-- <div id="channel-btn" class="btn" title="Channel - Key: Arrow Up / Down | Click to increase | Click with SHIFT to decrease" on:click={onChannel}>{ channel }</div> -->
        <!-- <div class="btn" title="" on:click={}></div> -->
        <!-- <div class="btn" title="" on:click={}>+</div> -->


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


.sequencer-wrapper .sequence .notes {

    display: inline-flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
}

.sequencer-wrapper .sequence .notes .note {

    width: 25px;
    height: 25px;
    background-color: var(--c-b);
}

.sequence input {

    min-width: 200px;
    height: 25px;
    line-height: 25px;

    padding: 0px 5px;

    border: none;

    font-size: 1rem;
    /* font-family: 'Courier'; */
}

</style>