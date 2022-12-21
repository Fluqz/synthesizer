import * as Tone from 'tone'
import type { Node } from '../node'

export class Distortion extends Tone.Distortion implements Node {

    enabled: boolean

    declare public instance: Tone.Distortion

    constructor(wet, distortion) {

        super(distortion)

        this.enabled = true

        this.distortion = distortion
    }
    
    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['distortion']) this.distortion = o['distortion']
    }

    serializeOut() {

        return {

            enabled: this.enabled,
            distortion: this.distortion
        }
    }
}