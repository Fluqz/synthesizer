import * as Tone from 'tone'
import { Knob } from '../../view/templates/knob';

import { Effect } from './effect';


export class Distortion extends Effect {

    /** Amound of distortion */
    private _gain: number

    declare public instance: Tone.Distortion

    constructor(wet, gain) {

        super('distortion', wet)

        this.instance = new Tone.Distortion(this.gain)

        this.gain = gain

        this.last = this.first = this.instance

        this.wet = this.wet
    }

    
    get gain() { return this._gain}
    set gain(g) {

        this._gain = g

        this.instance.distortion = this._gain
    }

    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
        if(o['wet']) this.wet = o['wet']
        if(o['gain']) this.gain = o['gain']
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