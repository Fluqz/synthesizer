import * as Tone from 'tone'
import type { Node } from '../node'

/** Tremolo node */
export class Tremolo extends Tone.Tremolo implements Node {
    
    enabled: boolean

    constructor(wet, frequency, depth) {

        super(frequency, depth)

        this.enabled = true

        this.frequency.value = frequency
        this.depth.value = depth
    }
    
    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['frequency']) this.frequency.value = o['frequency']
        if(o['depth']) this.depth.value = o['depth']
    }

    serializeOut() {

        return {

            enabled: this.enabled,
            frequency: this.frequency,
            depth: this.depth
        }
    }
 }