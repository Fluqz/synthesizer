import * as Tone from 'tone'
import type { Node } from '../node'


/** LFO filter node */
export class LFOFilter extends Tone.LFO implements Node {
    
    enabled: boolean

    constructor() {

        super()
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
    }

    serializeOut() {

        return {

            enabled: this.enabled,
        }
    }
}