import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/templates/knob';
import { Synthesizer } from '../../synthesizer';
import type { Node } from '../../nodes/node';



/**  */
export class DuoSynth extends Instrument {

    declare public instance: Tone.PolySynth<Tone.DuoSynth>

    /** How loud */
    private _volume
    /** Gain node */
    public gain
    /** Frequency */
    private _frequency
    /** Slight detuning of the note */
    private _detune
    /** Offset of the wave */
    private _phase
    /** Octave of oscillator */
    public octave = 2

    /** Necessary release time to prevent clicking */
    private releaseTime = 1

    /** freq, detune, volume, waveform,  */
    constructor(options = {}) {

        super('duosynth')

        this._frequency = options.frequency ? options.frequency : 300
        this._volume = options.volume ? options.volume : .5
        this._detune = options.detune ? options.detune : 0
        this._phase = options.phase ? options.phase : 0

        this.instance = new Tone.PolySynth<Tone.DuoSynth>(Tone.DuoSynth, options)

        this.gain = new Tone.Gain(this.volume)

        this.instance.connect(this.gain)

        this.props.push('volume', 'detune')
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.context.currentTime)
    }

    get detune() { return this._detune }
    set detune(d) {

        this._detune = d

        // this.instance.detune.setValueAtTime(this.detune, Tone.context.currentTime)
    }

    get phase() { return this._phase }
    set phase(p) {

        this._phase = p

        // this.instance.phase.setValueAtTime(this.phase, Tone.context.currentTime)
    }

    triggerNote(note) {

        super.triggerNote(note)

        this.volume = this.volume

        this.instance.triggerAttackRelease(note, 2000)
    }

    releaseNote(note) {

        super.releaseNote(note)

        if(note == undefined) this.instance.releaseAll(Tone.context.currentTime) 
        else this.instance.triggerRelease(note, Tone.context.currentTime)
    }

    connect(n: Node) {

        this.gain.connect(n)
    }

    disconnect(n: Node) {

        if(n) this.gain.disconnect(n)
        else this.gain.disconnect()
    }


    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['volume']) this.volume = o['volume']
        if(o['detune']) this.detune = o['detune']
        if(o['phase']) this.phase = o['phase']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
            detune: this.detune,
            phase: this.phase
        }
    }
}