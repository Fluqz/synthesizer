import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/templates/knob';
import { Synthesizer } from '../../synthesizer';
import type { Node } from '../node';



/**  */
export class Oscillator extends Instrument {

    declare instance: Tone.Oscillator

    public envelope: Tone.AmplitudeEnvelope

    /** Gain node */
    public gain

    /** How loud */
    private _volume
    /** Frequency */
    private _frequency
    /** Slight detuning of the note */
    private _detune

    /** Octave of oscillator */
    public octave = 2

    /** Is the osc already playing */
    private isPlaying


    /** freq, detune, volume, waveform,  */
    constructor(volume?: number, frequency?: number, detune?: number, phase?: number, ) {

        super('oscillator')

        this.instance = new Tone.Oscillator(this.frequency)
        this.envelope = new Tone.AmplitudeEnvelope()
        this.gain = new Tone.Gain(this.volume)

        this.first = this.instance
        this.last = this.gain

        this.isPlaying = false

        this.volume = volume ? volume : .7
        this.frequency = frequency ? frequency : 1
        this.detune = detune ? detune : .5

        this.instance.start()

        this.props.push('volume', 'detune', 'phase')
    }

    get frequency() { return this._frequency }
    set frequency(f) {

        this._frequency = f

        this.instance.frequency.setValueAtTime(this._frequency, Tone.context.currentTime)
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.context.currentTime)
    }

    get detune() { return this._detune }
    set detune(d) {

        this._detune = d

        this.instance.detune.setValueAtTime(this._detune, Tone.context.currentTime)
    }

    triggerNote(note) {

        this.frequency = note

        this.isPlaying = true

        this.envelope.triggerAttack(Tone.context.currentTime)
    }

    TO
    releaseNote(note) {

        this.isPlaying = false

        if(this.isPlaying || Synthesizer.activeNotes.length > 0) {

            // console.log('play other note', Synthesizer.activeNotes)
            this.triggerNote(Synthesizer.activeNotes[Synthesizer.activeNotes.length-1])
            return
        }

        this.envelope.triggerRelease(Tone.context.currentTime)
    }

    connect(n) {

        this.instance.connect(this.envelope)

        this.envelope.connect(this.gain)

        this.last.connect(n)

        this.output = n
        n.input = this
    }



    destroy() {

        this.envelope.triggerRelease(Tone.context.currentTime)

        this.instance.stop(Tone.context.currentTime + this.envelope.toSeconds(this.envelope.release))

        super.destroy()
    }
 
    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['frequency']) this.frequency = o['frequency']
        if(o['volume']) this.volume = o['volume']
        if(o['detune']) this.detune = o['detune']
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