import * as Tone from 'tone'

import { Knob } from "../../view/templates/knob"
import { Effect } from './effect'



/** Chorus node */
export class Chorus extends Effect {

    declare public instance: Tone.Chorus
    
    /** Frequency of the LFO for modulating */
    _frequency
    /** Delay of the signal 2-20ms */
    _delayTime 
    /** Chorus depth */
    _depth
    /** Amount of input */
    _feedback

    constructor(wet, frequency, delayTime, depth, feedback) {

        super('chorus', wet)

        this.instance = new Tone.Chorus(this.frequency, this.delayTime, this.depth)

        this.last = this.first = this.instance

        this.wet = wet
        this.frequency = frequency
        this.delayTime = delayTime
        this.depth = depth
        this.feedback = feedback
    }

    get frequency() { return this._frequency }
    set frequency(t) {

        this._frequency = t

        this.instance.frequency.setValueAtTime(this._frequency, Tone.context.currentTime)
    }

    get delayTime() { return this._delayTime }
    set delayTime(t) {

        this._delayTime = t

        this.instance.delayTime = this._delayTime
    }

    get depth() { return this._depth }
    set depth(d) {

        this._depth = d

        this.instance.depth = this._depth
    }

    get feedback() { return this._feedback }
    set feedback(f) {

        this._feedback = f

        this.instance.feedback.setValueAtTime(this._feedback, Tone.context.currentTime)
    }


    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.wet = o['wet']
        if(o['delayTime']) this.delayTime = o['delayTime']
        if(o['depth']) this.depth = o['depth']
        if(o['feedback']) this.feedback = o['feedback']
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