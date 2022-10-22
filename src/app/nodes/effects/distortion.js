import * as Tone from 'tone'
import { Knob } from '../../view/knob';

import { Effect } from './effect';


export class Distortion extends Effect {

    /** Amound of distortion */
    gain


    constructor(wet, gain) {

        super('distortion', wet)

        this.gain = gain

        this.instance = new Tone.Distortion(this.gain)

        this.setWet(this.wet)
        let wetKnob = new Knob('Wet', this.wet, 0, 1)
        this.dom.appendChild(wetKnob.dom)
        wetKnob.onChange.subscribe(v => this.setWet(v))
        this.knobs.push(wetKnob)
        
        this.setGain(this.gain)
        let gainKnob = new Knob('Volume', this.gain, 0, 20)
        this.dom.appendChild(gainKnob.dom)
        gainKnob.onChange.subscribe(v => this.setGain(v))
        this.knobs.push(gainKnob)
    }

    setGain(g) {

        this.gain = g

        this.instance.distortion = this.gain
    }

    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.setWet(o['wet'])
        if(o['gain']) this.setGain(o['gain'])
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
            gain: this.gain
        }
    }
}