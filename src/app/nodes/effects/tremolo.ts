import * as Tone from 'tone'

import { Effect } from "./effect"



/** Tremolo node */
export class Tremolo extends Effect {
    get wet(): any {
        throw new Error('Method not implemented.')
    }
    set wet(w: any) {
        throw new Error('Method not implemented.')
    }

    tremolo: Tone.Tremolo

    /** Tremolo amplitude */
    private _frequency 
    /** Trempolo depth */
    private _depth


    constructor(wet, frequency, depth) {

        super('tremolo', wet)

        this.tremolo = new Tone.Tremolo(this.frequency, this.depth)

        this.wet = wet
        this.frequency = frequency
        this.depth = depth

        this.props.set('frequency', { name: 'Frequency', value: this.frequency })
        this.props.set('depth', { name: 'Depth', value: this.depth })

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

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.wet = o['wet']
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