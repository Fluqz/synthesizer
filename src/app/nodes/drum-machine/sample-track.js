
import { Subject } from 'rxjs'
import * as Tone from 'tone'


export class SampleTrack {

    gain
    volume

    sample
    pattern

    constructor(sample, pattern, options) {

        this.sample = sample
        this.pattern = pattern == undefined ? [] : pattern

        this.bpm = 120
        this.volume = 1

        this.gain = Tone.Gain()
    }
}