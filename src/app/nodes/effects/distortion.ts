import * as Tone from 'tone'

import { Effect } from './effect';
import { ParamType } from '../node';


export class Distortion extends Effect {
   
    /** Amound of distortion */
    private _gain: number

    public distortion: Tone.Distortion

    constructor(wet, gain) {

        super('Distortion', wet)

        this.distortion = new Tone.Distortion(this.gain)

        this.gain = gain

        this.wet = this.wet

        this.props.set('wet', { type: ParamType.KNOB, name: 'Wet', get: () =>  this.wet })
        this.props.set('gain', { type: ParamType.KNOB, name: 'Gain', get: () =>  this.gain })
    }

    get wet() { return 0 }
    set wet(w: any) {
    }
    
    get gain() { return this._gain }
    set gain(g) {

        this._gain = g

        this.distortion.distortion = this._gain
    }

    serializeIn(o) {

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.wet != undefined) this.wet = o.wet
        if(o.gain != undefined) this.gain = o.gain
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
            gain: this.gain
        }
    }
}