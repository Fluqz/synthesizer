import * as Tone from 'tone'

import { Effect } from './effect'



/** Chorus node */
export class Chorus extends Effect {

    public chorus: Tone.Chorus
    
    /** Frequency of the LFO for modulating */
    _frequency
    /** Delay of the signal 2-20ms */
    _delayTime 
    /** Chorus depth */
    _depth
    /** Amount of input */
    _feedback

    constructor(wet, frequency, delayTime, depth, feedback) {

        super('Chorus', wet)

        this.chorus = new Tone.Chorus(this.frequency, this.delayTime, this.depth)

        this.input = this.output = this.chorus

        this.wet = wet
        this.frequency = frequency
        this.delayTime = delayTime
        this.depth = depth
        this.feedback = feedback

        this.props.set('delayTime', { name: 'Delay Time', get: () =>  this.delayTime })
        this.props.set('depth', { name: 'Depth', get: () =>  this.depth })
        this.props.set('feedback', { name: 'Feedback', get: () =>  this.feedback })
    }

    get wet() { return 0 }
    set wet(w: any) {
    }

    get frequency() { return this._frequency }
    set frequency(t) {

        this._frequency = t

        this.chorus.frequency.setValueAtTime(this._frequency, Tone.now())
    }

    get delayTime() { return this._delayTime }
    set delayTime(t) {

        this._delayTime = t

        this.chorus.delayTime = this._delayTime
    }

    get depth() { return this._depth }
    set depth(d) {

        this._depth = d

        this.chorus.depth = this._depth
    }

    get feedback() { return this._feedback }
    set feedback(f) {

        this._feedback = f

        this.chorus.feedback.setValueAtTime(this._feedback, Tone.now())
    }


    serializeIn(o) {

        if(o.enabled) this.enabled = o.enabled
        if(o.wet) this.wet = o.wet
        if(o.delayTime) this.delayTime = o.delayTime
        if(o.depth) this.depth = o.depth
        if(o.feedback) this.feedback = o.feedback
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