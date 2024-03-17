
<script lang="ts">
    import * as Tone from "tone";
    import { onDestroy, onMount } from "svelte";

    export let output: Tone.ToneAudioNode

    let connectedOuput: Tone.ToneAudioNode

    let scheduleID

    let analyser: AnalyserNode
    let bufferLength: number
    let dataArray: Uint8Array
    let pointsString = ''
    
    let active = false

    let container: HTMLElement

    let w 
    let h


    $: {

      if(connectedOuput !== output) {

        console.log('yooooooo.------')

        disconnect()

        output = output

        connect()
      }
    }

    // let peak: number = 0

    const draw = () => {

      if (active) {

        if (analyser) {
          
          analyser.getByteTimeDomainData(dataArray)
          
          w = container.clientWidth
          h = container.clientHeight
          
          var sliceWidth = w / bufferLength
          var x = 0
          
          pointsString = ''
          
          for (var i = 0; i < bufferLength; i++) {
            
            var v = dataArray[i] / 128.0
            var y = v * (h / 2)
            
            // peak = Math.max(y, peak)
            
            pointsString += `${x}, ${y} `

            x += sliceWidth

            // G.osc.set(x, y)
          }
        }
      }
    }

    const connect = () => {

      analyser = Tone.context.createAnalyser()
      analyser.fftSize = 2048//4096
      bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      active = true

      output.connect(analyser)

      output = output

      if(scheduleID != undefined) Tone.Transport.clear(scheduleID)

      scheduleID = Tone.Transport.scheduleRepeat(draw, 1 / 30)

      console.log('Oscill')

      connectedOuput = output
    }

    const disconnect = () => {

      if(scheduleID != undefined) Tone.Transport.clear(scheduleID)

      // output.disconnect(analyser)

      if(analyser) analyser.disconnect()

      connectedOuput = null
    }


    onMount(() => {

      if(container && output) { 

        w = container.clientWidth
        h = container.clientHeight

        connect()
      }
    })

    onDestroy(() => {

      if(output) disconnect()
    })

</script>


<div id="oscilloscope" title="Oscilloscope" bind:this={container}>

    <svg xmlns="http://www.w3.org/2000/svg">

      <!-- MAKES IT SINGLETON SOMEHOW. ALL WAVES LOOK THE SAME -->
        <!-- <defs> -->
          <polyline id="wave" stroke="#fed33a" stroke-width="1px" points={pointsString} />
        <!-- </defs> -->
  
        <!-- <use href="#wave" x="0"  y="0"/> -->
        <!-- <use href="#wave" x="0"  y="-5" style="opacity: .2" /> -->
        <!-- <use href="#wave" x="0"  y="5" style="opacity: .2" /> -->

    </svg>

</div>



<style>

    #oscilloscope,
    svg {

        mix-blend-mode: difference;

        width: 100px;
        height: 50px;
    }

    svg { mix-blend-mode: unset; }

</style>