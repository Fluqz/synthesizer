import * as Tone from 'tone'

import { Knob } from "../../view/templates/knob"
import type { Node } from '../node'



/** Chorus node */
export class Chorus extends Tone.Chorus implements Node {

    enabled: boolean

    constructor(frequency, delayTime, depth, feedback) {

        super(frequency, delayTime, depth)

        this.frequency.value = frequency
        this.delayTime = delayTime
        this.depth = depth
        this.feedback.value = feedback
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['delayTime']) this.delayTime = o['delayTime']
        if(o['depth']) this.depth = o['depth']
        if(o['feedback']) this.feedback.value = o['feedback']
    }

    serializeOut() {

        return {

            enabled: this.enabled,
            delayTime: this.delayTime,
            depth: this.depth,
            feedback: this.feedback
        }
    }
}