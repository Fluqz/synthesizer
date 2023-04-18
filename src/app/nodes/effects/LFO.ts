import * as Tone from 'tone'
import type { ToneWithContextOptions } from 'tone/build/esm/core/context/ToneWithContext';

import { Node } from "../node";



/** LFO filter node */
export class LFOFilter extends Node {

    declare instance: Tone.LFO

    constructor(wet, time, feedback) {

        super('lfo')

        this.last = this.first = this.instance

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