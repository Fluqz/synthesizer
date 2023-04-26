
<script lang="ts">
    import type * as Tone from "tone";
    import { Vec2 } from "../core/math";
    import { onMount } from "svelte";

    export let output: Tone.ToneAudioNode

    let analyser: AnalyserNode
    let bufferLength: number
    let dataArray: Uint8Array
    let pointsString = ''
    
    let active = false
    let IID

    let container: HTMLElement

    let w 
    let h

    // let peak: number = 0



    const draw = () => {

      if (active) {

        if (analyser) analyser.getByteTimeDomainData(dataArray)

        if (output) {

          var sliceWidth = w / bufferLength
          var x = 0

          pointsString = ''

          for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0
            var y = v * h / 2

            // peak = Math.max(y, peak)

            pointsString += `${x}, ${y} `

            x += sliceWidth
          }
        } 
      }
    }

    const connect = () => {

      analyser = output.context.createAnalyser()
      analyser.fftSize = 2048//4096
      bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      active = true

      output.connect(analyser)

      setInterval(draw, 50)
    }

    onMount(() => {

      if(container && output) { 

        w = container.clientWidth
        h = container.clientHeight

        connect()
      }
    })

</script>


<div id="oscilloscope" bind:this={container}>

    <svg xmlns="http://www.w3.org/2000/svg">

        <defs>
          <polyline id="wave" stroke="#fed33a" stroke-width="2px" points={pointsString}/>
        </defs>
  
        <use href="#wave" x="0"  y="0" />
        <!-- <use href="#wave" x="0"  y="-5" />
        <use href="#wave" x="0"  y="5" /> -->

    </svg>

</div>



<style>

    #oscilloscope,
    svg {

        width: 100px;
        height: 75px;
    }

    svg { mix-blend-mode: unset; }

</style>