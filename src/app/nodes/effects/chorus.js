import * as Tone from 'tone'

import { Node } from "../node"
import { Knob } from "../../view/knob"



/** Chorus node */
export class Chorus extends Node {

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
        let wetKnob = new Knob('Wet', this.wet, 0, 1)
        this.dom.appendChild(wetKnob.dom)
        wetKnob.onChange.subscribe(v => this.setWet(v))
        this.knobs.push(wetKnob)

        this.setFeedback(this.feedback)
        let feedbackKnob = new Knob('Feedback', this.feedback, 0, 1)
        this.dom.appendChild(feedbackKnob.dom)
        feedbackKnob.onChange.subscribe(v => this.setFeedback(v))
        this.knobs.push(feedbackKnob)

        this.setDelayTime(this.delayTime)
        let delayTimeKnob = new Knob('Delay Time', this.delayTime, 0, 20, 1)
        this.dom.appendChild(delayTimeKnob.dom)
        delayTimeKnob.onChange.subscribe(v => this.setDelayTime(v))
        this.knobs.push(delayTimeKnob)

        this.setDepth(this.depth)
        let depthKnob = new Knob('Depth', this.depth, 0, 1)
        this.dom.appendChild(depthKnob.dom)
        depthKnob.onChange.subscribe(v => this.setDepth(v))
        this.knobs.push(depthKnob)
    }

    setWet(w) {

        this.wet = w

        this.instance.wet.setValueAtTime(this.wet, Tone.context.currentTime)
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

        this.instance.feedback.setValueAtTime(this.feedback, Tone.context.currentTime)
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