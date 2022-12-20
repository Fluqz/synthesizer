import * as Tone from 'tone'
import { Knob } from '../../view/templates/knob';

import { Node } from "../node";



/** LFO filter node */
export class LFOFilter extends Node {

    constructor(wet, time, feedback) {

        super('lfo')
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}