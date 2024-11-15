import * as Tone from 'tone'

import { Node } from "../node";



/** LFO filter node */
export class LFOFilter extends Node {

    declare instance: Tone.LFO

    constructor(wet, time, feedback) {

        super('LFO')


    }

    serializeIn(o) {

        super.serializeIn(o)

        if(o.enabled != undefined) this.enabled = o.enabled
    }

    serializeOut() {

        let no = super.serializeOut()

        return {

            ...no,
            name: this.name,
            enabled: this.enabled,
        }
    }
}