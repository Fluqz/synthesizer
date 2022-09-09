import * as Tone from 'tone'

import { Node } from "../node"
import { Knob } from '../../view/knob';



/** Tremolo node */
export class Tremolo extends Node {

    /** Intensity */
    wet
    /** Tremolo amplitude */
    frequency 
    /** Trempolo depth */
    depth


    constructor(wet, frequency, depth) {

        super('tremolo')

        this.wet = wet
        this.frequency = frequency
        this.depth = depth
        
        this.instance = new Tone.Tremolo(this.frequency, this.depth)

        let wetKnob = new Knob(this.wet, 0, 1)
        this.dom.appendChild(wetKnob.dom)
        wetKnob.onChange.subscribe(v => this.setWet(v))

        let frequencyKnob = new Knob(this.frequency, 0, 20)
        this.dom.appendChild(frequencyKnob.dom)
        frequencyKnob.onChange.subscribe(v => this.setFrequency(v))

        let depthKnob = new Knob(this.depth, 0, 1)
        this.dom.appendChild(depthKnob.dom)
        depthKnob.onChange.subscribe(v => this.setDepth(v))

    }


    setWet(w) {

        this.wet = w

        this.instance.wet.set(this.wet)
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