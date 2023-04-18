



import * as Tone from 'tone'

import { Node } from "../node"
import { Knob } from '../../view/templates/knob';



/** Effect node */
export class Effect extends Node {

    /** Bypass ratio. 1 = wet, 0 = dry. */
    private _wet

    constructor(name, wet) {

        super(name)

        this.last = this.first = this.instance

        this._wet = wet
    }

    set enabled(e) { 

        this._enabled = e 
        
        this.wet = e ? this.wet : 0
    }
    get enabled() { return this._enabled }

    get wet() { return this._wet }
    set wet(w) {

        this._wet = w

        if(this.instance) this.instance['wet'].setValueAtTime(this._wet, Tone.context.currentTime)
    }

    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.wet = o['wet']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
        }
    }
 }