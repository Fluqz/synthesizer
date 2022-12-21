import * as Tone from 'tone'
import type { Node } from '../node';


/**  */
export class DuoSynth extends Tone.DuoSynth implements Node {

    enabled: boolean;

    /** freq, detune, volume, waveform,  */
    constructor(options?: Tone.DuoSynthOptions) {

        super(options)
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['frequency']) this.frequency.value = o['frequency']
        if(o['volume']) this.volume.value = o['volume']
        if(o['detune']) this.detune.value = o['detune']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            frequency: this.frequency,
            volume: this.volume,
            detune: this.detune,
        }
    }
}