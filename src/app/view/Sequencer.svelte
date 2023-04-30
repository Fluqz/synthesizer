<script lang="ts">
    import * as Tone from "tone";
    import { Synthesizer, type Channel } from "../synthesizer";


    export let notes: Tone.Unit.Frequency[] = []


    let isPlaying = false

    let channelCount: number[] = []
    let channel: Channel = 0

    for(let i = 0; i < Synthesizer.maxChannelCount; i++) channelCount.push(i + 1)


    let inputValue: string

    const onInput = (e) => {

        e.stopPropagation()

        if(e.key == 'Enter' && e.target.value != null) {

        }
    }

    const toggleStartStop = () => {

        isPlaying = !isPlaying
    }

    const onChannel = (e) => {

        if(!e.shiftKey) channel++
        if(e.shiftKey) channel--

        if(channel >= Synthesizer.maxChannelCount) channel = 0
        else if(channel < 0) channel = (Synthesizer.maxChannelCount - 1) as Channel
    }
    const activateChannel = (e) => {
    }


    
</script>



<div class="sequencer-wrapper">

        
    <div>

        <input on:keydown={onInput}/>

    </div>

    <div>

        {#each notes as note }
            
            <div>

                {note}

            </div>

        {/each}

    </div>

    <div class="btn" title="" on:click={toggleStartStop}>{ !isPlaying ? 'Play' : 'Stop'}</div>

    {#each channelCount as i}
        
        <div class="btn" title="Channel - Key: Arrow Up / Down | Click to increase | Click with SHIFT to decrease" on:click={activateChannel}>{ i }</div>

    {/each}

    <!-- <div id="channel-btn" class="btn" title="Channel - Key: Arrow Up / Down | Click to increase | Click with SHIFT to decrease" on:click={onChannel}>{ channel }</div> -->
    <!-- <div class="btn" title="" on:click={}></div> -->
    <!-- <div class="btn" title="" on:click={}>+</div> -->



</div>

<style>

.sequencer-wrapper {

    display: inline-flex;
    justify-content: center;
    align-items: center;

    min-width: 400px;
}

</style>