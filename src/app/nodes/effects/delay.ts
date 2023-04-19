import * as Tone from 'tone'
import { Knob } from '../../view/templates/knob';

import { Effect } from "./effect"



/** Delay node */
export class Delay extends Effect {
    get wet(): any {
        throw new Error('Method not implemented.');
    }
    set wet(w: any) {
        throw new Error('Method not implemented.');
    }

    declare public instance: Tone.FeedbackDelay
    /** How fast the delay is played in seconds */
    _delayTime 
    /** How long the delay is played. [0-1] */
    _feedback

    constructor(wet, delayTime, feedback) {

        super('delay', wet)

        this.instance = new Tone.FeedbackDelay(this.delayTime, this.feedback)

        this.wet = wet
        this.delayTime = delayTime ? delayTime : 3
        this.feedback = feedback ? feedback : .5
        
        this.props.set('delayTime', { name: 'Delay Time', value: this.delayTime })
        this.props.set('feedback', { name: 'Feedback', value: this.feedback })
    }

    get delayTime() { return this._delayTime }
    set delayTime(t) {

        this._delayTime = t

        this.instance.delayTime.linearRampToValueAtTime(this._delayTime, Tone.context.currentTime)
    }

    get feedback() { return this._feedback }
    set feedback(f) {

        this._feedback = f

        this.instance.feedback.setValueAtTime(this._feedback, Tone.context.currentTime)
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