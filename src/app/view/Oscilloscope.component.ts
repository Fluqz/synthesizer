
import * as Tone from "tone";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({

  selector: 'sy-oscilloscope',
  standalone: true,
  template: `
    
  <div id="oscilloscope" title="Oscilloscope" #container>

      <svg xmlns="http://www.w3.org/2000/svg">

        <!-- MAKES IT SINGLETON SOMEHOW. ALL WAVES LOOK THE SAME -->
          <!-- <defs> -->
            <polyline id="wave" stroke="#fed33a" stroke-width="1px" [points]="pointsString" />
          <!-- </defs> -->
    
          <!-- <use href="#wave" x="0"  y="0"/> -->
          <!-- <use href="#wave" x="0"  y="-5" style="opacity: .2" /> -->
          <!-- <use href="#wave" x="0"  y="5" style="opacity: .2" /> -->

      </svg>

  </div>

`,
  styles: `
    #oscilloscope,
    svg {

        mix-blend-mode: difference;

        width: 100px;
        height: 50px;
    }

    svg { mix-blend-mode: unset; }

`,

})
export class OscilloscopeComponent {

  @ViewChild('container') 
  private _container: ElementRef<HTMLElement>
  get container() {

    if(this._container == undefined) return null
    return this._container. nativeElement
  }

  _output: Tone.ToneAudioNode
  @Input('output') 
  set output(o: Tone.ToneAudioNode) {

      if(o != this.connectedOuput) {

          this._output = o

          this.disconnect()

          this.connect()
      }
  }
  private connectedOuput: Tone.ToneAudioNode

  private scheduleID

  private analyser: AnalyserNode
  private bufferLength: number
  private dataArray: Uint8Array
  private pointsString = ''
  
  private active = false

  private w 
  private h

  draw = () => {

    if (this.active) {

      if (this.analyser) {
        
        this.analyser.getByteTimeDomainData(this.dataArray)
        
        if(this.container == null) return

        this.w = this.container.clientWidth
        this.h = this.container.clientHeight
        
        var sliceWidth = this.w / this.bufferLength
        var x = 0
        
        this.pointsString = ''
        
        for (var i = 0; i < this.bufferLength; i++) {
          
          var v = this.dataArray[i] / 128.0
          var y = v * (h / 2)
          
          // peak = Math.max(y, peak)
          
          this.pointsString += `${x}, ${y} `

          x += sliceWidth

          // G.osc.set(x, y)
        }
      }
    }
  }

  connect = () => {

    this.analyser = Tone.context.createAnalyser()
    this.analyser.fftSize = 2048//4096
    this.bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
    this.analyser.getByteTimeDomainData(this.dataArray)

    this.active = true

    this.output.connect(this.analyser)

    this.output = this.output

    if(this.scheduleID != undefined) Tone.getTransport().clear(this.scheduleID)

      this.scheduleID = Tone.getTransport().scheduleRepeat((t) => {

      Tone.Draw.schedule(this.draw, t)

    }, 1 / 24)

    this.connectedOuput = this.output
  }

  disconnect = () => {

    if(this.scheduleID != undefined) Tone.getTransport().clear(this.scheduleID)

    // output.disconnect(analyser)

    if(this.analyser) this.analyser.disconnect()

    this.connectedOuput = null
  }

  ngAfterViewInit() {

    if(this.container && this.output) { 
      
      this.w = this.container.clientWidth
      this.h = this.container.clientHeight
      
      this.connect()
    }
  }

  ngOnDestroy() {

    if(this.output) this.disconnect()
  }
}