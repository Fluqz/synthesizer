import * as Tone from 'tone'

import { Effect } from "./effect"
import { Knob } from "../view/knob"



/** Chorus effect */
export class Chorus extends Effect {

    /** How much of the chorus is misxed into the output */
    wet
    /** Frequency of the LFO for modulating */
    frequency
    /** Delay of the signal 2-20ms */
    delayTime 
    /** Chorus depth */
    depth
    /** Amount of input */
    feedback

    constructor(wet, frequency, delayTime, depth, feedback) {

        super('chorus')

        this.wet = wet
        this.frequency = frequency
        this.delayTime = delayTime
        this.depth = depth
        this.feedback = feedback

        this.instance = new Tone.Chorus(this.frequency, this.delayTime, this.depth)
        
        this.setWet(this.wet)

        let wetKnob = new Knob(this.wet, 0, 1)
        this.dom.appendChild(wetKnob.dom)
        wetKnob.onChange.subscribe(v => this.setWet(v))

        let feedbackKnob = new Knob(this.feedback, 0, 1)
        this.dom.appendChild(feedbackKnob.dom)
        feedbackKnob.onChange.subscribe(v => this.setFeedback(v))

        let delayTimeKnob = new Knob(this.delayTime, 0, 20, 1)
        this.dom.appendChild(delayTimeKnob.dom)
        delayTimeKnob.onChange.subscribe(v => this.setDelayTime(v))

        let depthKnob = new Knob(this.depth, 0, 1)
        this.dom.appendChild(depthKnob.dom)
        depthKnob.onChange.subscribe(v => this.setDepth(v))

    }

    setWet(w) {

        this.wet = w

        this.instance.wet.value = this.wet
    }

    setDelayTime(t) {

        this.delayTime = t

        this.instance.delayTime = this.delayTime
    }

    setDepth(d) {

        this.depth = d

        this.instance.depth = this.depth
    }

    setFeedback(f) {

        this.feedback = f

        this.instance.feedback.value = this.feedback
    }


    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.setWet(o['wet'])
        if(o['delayTime']) this.setDelayTime(o['delayTime'])
        if(o['depth']) this.setDepth(o['depth'])
        if(o['feedback']) this.setFeedback(o['feedback'])
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
            delayTime: this.delayTime,
            depth: this.depth,
            feedback: this.feedback
        }
    }
}