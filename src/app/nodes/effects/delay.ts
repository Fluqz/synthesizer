import * as Tone from 'tone'
import { Knob } from '../../view/templates/knob';

import { Effect } from "./effect"



/** Delay node */
export class Delay extends Effect {
  
    feedbackDelay: Tone.FeedbackDelay

    /** How fast the delay is played in seconds */
    _delayTime 
    /** How long the delay is played. [0-1] */
    _feedback

    constructor(wet, delayTime, feedback) {

        super('delay', wet)

        this.feedbackDelay = new Tone.FeedbackDelay(this.delayTime, this.feedback)

        this.input = this.feedbackDelay
        this.output = this.feedbackDelay

        this.wet = wet
        this.delayTime = delayTime ? delayTime : 3
        this.feedback = feedback ? feedback : .5
        
        this.props.set('delayTime', { name: 'Delay Time', value: this.delayTime })
        this.props.set('feedback', { name: 'Feedback', value: this.feedback })
    }

    get wet() { return 0 }
    set wet(w: any) {
    }

    get delayTime() { return this._delayTime }
    set delayTime(t) {

        this._delayTime = t

        this.feedbackDelay.delayTime.linearRampToValueAtTime(this._delayTime, Tone.now())
    }

    get feedback() { return this._feedback }
    set feedback(f) {

        this._feedback = f

        this.feedbackDelay.feedback.setValueAtTime(this._feedback, Tone.now())
    }
    

    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.wet = o['wet']
        if(o['delayTime']) this.delayTime = o['delayTime']
        if(o['feedback']) this.feedback = o['feedback']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
            delayTime: this.delayTime,
            feedback: this.feedback
        }
    }
}