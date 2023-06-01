import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { ParamType } from '../node';


/** {
 * 
 * 
  "volume": 0,
  "detune": 0.5,
  "portamento": 0,
  "envelope": {
    "attack": 0.005,
    "attackCurve": "linear",
    "decay": 0.1,
    "decayCurve": "exponential",
    "release": 1,
    "releaseCurve": "exponential",
    "sustain": 0.3
  },
  "oscillator": {
    "partialCount": 0,
    "partials": [],
    "phase": 0,
    "type": "triangle"
  }

  
}  */
export class Synth extends Instrument {

    synth: Tone.PolySynth
    /** How loud */
    _volume: number
    /** Gain node */
    // gain: Tone.Gain
    /** Slight detuning of the note */
    _detune: number
    /** Offset of the wave */
    _portamento: number

    /** freq, detune, volume, waveform,  */
    constructor(options? = {}) {

        super('Synth')

        this.synth = new Tone.PolySynth(Tone.Synth)
        this.output = this.synth

        // this.gain = new Tone.Gain(this.volume)

        // this.synth.connect(this.gain)

        // this.output = this.gain

        this.volume = options.volume ? options.volume : 3
        this.detune = options.detune ? options.detune : .5
        this.portamento = options.portamento ? options.portamento : 0

        console.log('synth', this.synth.get())

        this.props.set('volume', { type: ParamType.KNOB, name: 'Volume', get: () =>  this.volume, set: (v) => this.volume = v, min: -70, max: 6, groupID: 0 })
        this.props.set('detune', { type: ParamType.KNOB, name: 'Detune', get: () => { return this.detune }, set: (v) => this.detune = v, min: -100, max: 100, groupID: 0 })
        this.props.set('portamento', { type: ParamType.KNOB, name: 'Portamento', get: () =>  this.portamento, set: (v) => this.portamento = v, min: 0, max: 1, groupID: 0 })
    }

    set volume(v: number) {

        this._volume = v 
        // this.gain.gain.setValueAtTime(this.volume, Tone.now())
        this.synth.volume.setValueAtTime(this.volume, Tone.now())
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

    triggerNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time, velocity: number = 1) {

        this.synth.triggerAttack(note, time, velocity)
    }

    triggerReleaseNote(note: Tone.Unit.Frequency, duration: Tone.Unit.Time, time: Tone.Unit.Time, velocity:number = 1): void {
        
        this.synth.triggerAttackRelease(note, duration, time, velocity)
    }

    releaseNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        this.synth.triggerRelease(note, time)
    }

    releaseAll() {
        
        this.synth.releaseAll()
    }

    destroy() {
        
        this.synth.releaseAll()
        this.synth.disconnect()
        this.synth.dispose()
        // this.gain.disconnect()
        // this.gain.dispose()
        
        super.destroy()
    }

    serializeIn(o) {

        super.serializeIn(o)

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.volume != undefined) this.volume = o.volume
        if(o.detune != undefined) this.detune = o.detune
        if(o.portamento != undefined) this.portamento = o.portamento
    }

    serializeOut() {

        let no = super.serializeOut()

        return {

            ...no,

            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
            detune: this.detune,
            portamento: this.portamento
        }
    }
}