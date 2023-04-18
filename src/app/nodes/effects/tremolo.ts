import * as Tone from 'tone'

import { Effect } from "./effect"



/** Tremolo node */
export class Tremolo extends Effect {

    declare instance: Tone.Tremolo

    /** Tremolo amplitude */
    private _frequency 
    /** Trempolo depth */
    private _depth


    constructor(wet, frequency, depth) {

        super('tremolo', wet)

        this.instance = new Tone.Tremolo(this.frequency, this.depth)

        this.last = this.first = this.instance

        this.wet = wet
        this.frequency = frequency
        this.depth = depth
    }

    get frequency() { return this._frequency }
    set frequency(f) {

        this._frequency = f

        this.instance.frequency.set(this._frequency)
    }

    get depth() { return this._depth }
    set depth(d) {

        this._depth = d

        this.instance.depth.set(this._depth)
    }
    
    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.setWet(o['wet'])
        if(o['frequency']) this.frequency = o['frequency']
        if(o['depth']) this.depth = o['depth']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
            frequency: this.frequency,
            depth: this.depth
        }
    }
 }