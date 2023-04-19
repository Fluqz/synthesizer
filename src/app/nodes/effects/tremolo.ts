import * as Tone from 'tone'

import { Effect } from "./effect"



/** Tremolo node */
export class Tremolo extends Effect {

    tremolo: Tone.Tremolo

    /** Tremolo amplitude */
    private _frequency 
    /** Trempolo depth */
    private _depth


    constructor(wet, frequency, depth) {

        super('Tremolo', wet)

        this.tremolo = new Tone.Tremolo(this.frequency, this.depth)

        this.input = this.output = this.tremolo

        this.wet = wet
        this.frequency = frequency
        this.depth = depth

        this.props.set('frequency', { name: 'Frequency', get: () =>  this.frequency })
        this.props.set('depth', { name: 'Depth', get: () =>  this.depth })

    }

    get wet() { return 0 }
    set wet(w: any) {
    }

    get frequency() { return this._frequency }
    set frequency(f) {

        this._frequency = f

        this.tremolo.frequency.set(this._frequency)
    }

    get depth() { return this._depth }
    set depth(d) {

        this._depth = d

        this.tremolo.depth.set(this._depth)
    }
    
    serializeIn(o) {

        if(o.name) this.name = o.name
        if(o.enabled) this.enabled = o.enabled
        if(o.wet) this.wet = o.wet
        if(o.frequency) this.frequency = o.frequency
        if(o.depth) this.depth = o.depth
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