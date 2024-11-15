
import { Component, Input } from "@angular/core";
import * as Tone from "tone";

@Component({

    selector: 'sy-dc-meter',
    standalone: true,
    template: `
        
    <div id="dc-meter" title="DC Meter">

        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            
            <polyline stroke="#fed33a" stroke-width="3px" points={tailString} />

        </svg>

    </div>

    
    `,
    styles: `
            
        :host {

            width: auto;
            height: auto;
        }
        #dc-meter {

            width: 50px;
            height: 50px;
        }

        svg polyline { 
            
            mix-blend-mode: unset; 
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

    `,

})
export class DCMeterComponent {

        
    // var ctx = canvas.getContext('2d');
    // ctx.fillStyle = '#f00';
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(100,50);
    // ctx.lineTo(50, 100);
    // ctx.lineTo(0, 90);
    // ctx.closePath();
    // ctx.fill();

    _output: Tone.ToneAudioNode
    @Input('output') 
    set output(o: Tone.ToneAudioNode) {

        if(o != this._output) {

            this._output = o

            this.connect()
        }
    }

    private scheduleID

    private meter: Tone.DCMeter = new Tone.DCMeter()

    private value:number

    private tails: number[] = []
    private tailString = ''
    private maxTails: number = 10
    
    private IID

    connect = () => {

        if(this.output) this.output.connect(this.meter)
    }

    getValue = () => {

        this.value = this.meter.getValue()

        if(this.tails.length > this.maxTails) this.tails.shift()

        this.tails.push(this.value)

        this.tailString = ''
        for(let i = 0; i < this.tails.length; i++) {

            if(i == 0) continue

            // this.tailString += `${(i - 1) * 10}, ${10 * tails[i - 1]} ${i * 10}, ${10 * tails[i]}` // TRIANGLE METER 

            this.tailString += `${(i - 1) * 10}, ${(10 * this.tails[i - 1]) + 50} ${i * 10}, ${(10 * this.tails[i]) + 50} ` // CORRECT
        }
    }

    ngAfterViewInit() {

        if(this.output != undefined) {
            
            this.connect()
            
            if(this.scheduleID != undefined) Tone.getTransport().clear(this.scheduleID)
            
                this.scheduleID = Tone.getTransport().scheduleRepeat((t) => {
                
                Tone.Draw.schedule(this.getValue.bind(this), t)
                    
            }, 1 / 24, Tone.getContext().currentTime, 1000000)
        }
    }

    ngOnDestroy() {

        if(this.output != undefined) {

            if(this.scheduleID != undefined) Tone.getTransport().clear(this.scheduleID)

            this.meter.disconnect()
            this.meter.dispose()
        }
    }
}