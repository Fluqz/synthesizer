import * as Tone from 'tone'

import { Effect } from "./effect"
import { Knob } from '../../view/knob';



/** Tremolo node */
export class Tremolo extends Effect {

    /** Tremolo amplitude */
    frequency 
    /** Trempolo depth */
    depth


    constructor(wet, frequency, depth) {

        super('tremolo', wet)

        this.frequency = frequency
        this.depth = depth
        
        this.instance = new Tone.Tremolo(this.frequency, this.depth)

        this.setWet(this.wet)
        let wetKnob = new Knob('Wet', this.wet, 0, 1)
        this.dom.appendChild(wetKnob.dom)
        wetKnob.onChange.subscribe(v => this.setWet(v))
        this.knobs.push(wetKnob)
        
        this.setFrequency(this.frequency)
        let frequencyKnob = new Knob('Frequency', this.frequency, 0, 20)
        this.dom.appendChild(frequencyKnob.dom)
        frequencyKnob.onChange.subscribe(v => this.setFrequency(v))
        this.knobs.push(frequencyKnob)

        this.setDepth(this.depth)
        let depthKnob = new Knob('Depth', this.depth, 0, 1)
        this.dom.appendChild(depthKnob.dom)
        depthKnob.onChange.subscribe(v => this.setDepth(v))
        this.knobs.push(depthKnob)
    }

    setFrequency(f) {

        this.frequency = f

        this.instance.frequency.set(this.frequency)
    }

    setDepth(d) {

        this.depth = d

        this.instance.depth.set(this.depth)
    }
    
    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.setWet(o['wet'])
        if(o['frequency']) this.setFrequency(o['frequency'])
        if(o['depth']) this.setDepth(o['depth'])
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
            frequency: this.frequency,
            depth: this.depth
        }
    }
 }