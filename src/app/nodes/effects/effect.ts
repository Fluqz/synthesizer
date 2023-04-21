



import * as Tone from 'tone'

import { Node } from "../node"



/** Effect node */
export abstract class Effect extends Node {

    /** Bypass ratio. 1 = wet, 0 = dry. */
    protected _wet: number
    abstract get wet()
    abstract set wet(w) 

    constructor(name, wet) {

        super(name)

        this._wet = wet
    }

    set enabled(e) { 

        this._enabled = e 
        
        this.wet = e ? this.wet : 0
    }
    get enabled() { return this._enabled }


    serializeIn(o) {

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.wet != undefined) this.wet = o.wet
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
        }
    }
 }