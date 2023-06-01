
<script lang="ts">
    import type * as Tone from "tone";
    import { onDestroy, onMount } from "svelte";

    export let output: Tone.ToneAudioNode
    export let id:number = -1

    let analyser: AnalyserNode
    let bufferLength: number
    let dataArray: Uint8Array
    let pointsString = ''
    
    let active = false

    let container: HTMLElement

    let w 
    let h

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

    let IID: any
    const connect = () => {

      analyser = output.context.createAnalyser()
      analyser.fftSize = 2048//4096
      bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      active = true

      output.connect(analyser)

      console.log('OSC', id)

      IID = setInterval(draw, 1000 / 30)
    }

    const disconnect = () => {

      clearInterval(IID)

      // output.disconnect(analyser)

      analyser.disconnect()
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

        <defs>
          <polyline id="wave" stroke="#fed33a" stroke-width="1px" points={pointsString} />
        </defs>
  
        <use href="#wave" x="0"  y="0"/>
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