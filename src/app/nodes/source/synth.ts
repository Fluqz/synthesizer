import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { ParamType } from '../node';


/**  */
export class Synth extends Instrument {

    synth: Tone.PolySynth
    /** How loud */
    _volume: number
    /** Gain node */
    gain: Tone.Gain
    /** Slight detuning of the note */
    _detune: number
    /** Offset of the wave */
    _portamento: number

    /** freq, detune, volume, waveform,  */
    constructor(options? = {}) {

        super('Synth')

        this.synth = new Tone.PolySynth(Tone.Synth)

        this.gain = new Tone.Gain(this.volume)

        this.synth.connect(this.gain)

        this.output = this.gain

        this.volume = options.volume ? options.volume : 3
        this.detune = options.detune ? options.detune : .5
        this.portamento = options.portamento ? options.portamento : 0


        this.props.set('volume', { type: ParamType.KNOB, name: 'Volume', get: () =>  this.volume })
        this.props.set('detune', { type: ParamType.KNOB, name: 'Detune', get: () =>  this.detune })
        this.props.set('portamento', { type: ParamType.KNOB, name: 'Portamento', get: () =>  this.portamento })
    }

    set volume(v: number) {

        this._volume = v 
        this.gain.gain.setValueAtTime(this.volume, Tone.now())
    }
    get volume() { return this._volume }


    set detune(d: number) { 
        this._detune = d 
        this.synth.set({ detune: this._detune })
    }
    get detune() { return this._detune }


    get portamento() { return this._portamento }
    set portamento(p) {

        this._portamento = p
        this.synth.set({ portamento: this._portamento })
    }

    triggerNote(note: string) {

        this.synth.triggerAttack(note, Tone.now())
    }

    releaseNote(note: string) {

        this.synth.triggerRelease(note, Tone.now())
    }


    serializeIn(o) {

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.volume != undefined) this.volume = o.volume
        if(o.detune != undefined) this.detune = o.detune
        if(o.portamento != undefined) this.portamento = o.portamento
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
            detune: this.detune,
            portamento: this.portamento
        }
    }
}