import * as Tone from 'tone'

import { Effect } from "./effect"
import { InputType } from '../node'



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

        console.log(this.tremolo)


        this.props.set('wet', { type: InputType.KNOB, name: 'Wet', get: () =>  this.wet, set: (v) => this.wet = v })
        this.props.set('frequency', { type: InputType.KNOB, name: 'Frequency', get: () =>  this.frequency, set: (v) => this._frequency = v })
        this.props.set('depth', { type: InputType.KNOB, name: 'Depth', get: () =>  this.depth, set: (v) => this.depth = v })
    }

    get wet() { return this._wet }
    set wet(w: any) {

        this._wet = w
        this.tremolo.set({ wet: this._wet })
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

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.wet != undefined) this.wet = o.wet
        if(o.frequency != undefined) this.frequency = o.frequency
        if(o.depth != undefined) this.depth = o.depth
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