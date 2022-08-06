import * as Tone from 'tone'
import { Knob } from '../knob';

import { Effect } from "./effect";




export class Distortion extends Effect {

    /** Intensity */
    wet
    /** Amoung of distortion */
    gain


    constructor(wet, gain) {

        super('distortion')

        this.wet = wet
        this.gain = gain

        this.instance = new Tone.Distortion(this.gain)

        let wetKnob = new Knob(this.wet, 0, 1)
        this.dom.appendChild(wetKnob.dom)

        wetKnob.onChange.subscribe(v => this.setWet(v))

        let gainKnob = new Knob(this.gain, 0, 20)
        this.dom.appendChild(gainKnob.dom)

        gainKnob.onChange.subscribe(v => this.setGain(v))

    }


    setWet(w) {

        this.wet = w

        this.instance.wet.value = this.wet
    }

    setGain(g) {

        this.gain = g

        this.instance.distortion = this.gain
    }

    serializeIn(o) {

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