import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { ParamType } from '../node';

import Sweep from '../../../assets/samples/synth/SweepFm7.wav'
import BackHome from '../../../assets/samples/synth/Back_Home_F_01.wav'

const samples = [


    { path: Sweep, name: 'Sweep Fm7' },
    { path: BackHome, name: 'Back Home F'},
]

export class Sampler extends Instrument {

    sampler: Tone.Sampler
    /** How loud */
    _volume: number
    /** Gain node */
    // gain: Tone.Gain
    /** Slight detuning of the note */
    _detune: number
    /** Offset of the wave */
    _portamento: number
    _attack
    _release

    _sample: string

    /** freq, detune, volume, waveform,  */
    constructor(options? = {}) {

        super('Sampler')


        // this.gain = new Tone.Gain(this.volume)

        // this.output = this.gain

        this.volume = options.volume ? options.volume : .5

        const opts = [
            'Sweep Fm7',
            'Back Home F',
        ]
        
        this.sample = opts[0]

        this.attack = this.sampler.get().attack
        this.release = this.sampler.get().release

        this.props.set('volume', { type: ParamType.KNOB, name: 'Volume', get: () =>  this.volume, set: (v) => this.volume = v, min: -70, max: 6, groupID: 0 })
        this.props.set('attack', { type: ParamType.KNOB, name: 'Attack', get: () =>  this.attack, set: (v) => this.attack = v, min: 0, max: 1, groupID: 0 })
        this.props.set('release', { type: ParamType.KNOB, name: 'Release', get: () =>  this.release, set: (v) => this.release = v, min: 0, max: 5, groupID: 0 })
        this.props.set('sample', { type: ParamType.DROPDOWN, name: 'Sample', get: () =>  this.sample, set: (v) => this.sample = v, options: opts,min: 0, max: 1, groupID: 0 })
    }

    set volume(v: number) {

        this._volume = v 
        if(this.sampler) this.sampler.volume.setValueAtTime(this.volume, Tone.now())
        // this.gain.gain.setValueAtTime(this.volume, Tone.now())
    }
    get volume() { return this._volume }

    set sample(v: string) {

        let { path } = samples.find(s => {

            if(s.name == v) return s.path
        })


        if(path == undefined) {

            if(this.sampler == undefined) this.sampler = new Tone.Sampler()
            return
        }

        this._sample = v

        this.sampler = new Tone.Sampler({
            urls: {
                F2: path,
            },
        })

        this.output = this.sampler
        // this.sampler.connect(this.gain)
    }
    get sample() { return this._sample }


    get attack() { return this._attack }
    set attack(d) {

        this._attack = d
        this.sampler.set({ attack: this._attack })
    }

    get release() { return this._release }
    set release(d) {

        this._release = d
        this.sampler.set({ release: this._release })
    }


    triggerNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time, velocity: number = 1) {

        if(!this.sampler.loaded) return

        this.sampler.triggerAttack(note, time, velocity)
    }

    triggerReleaseNote(note: Tone.Unit.Frequency, duration: Tone.Unit.Time, time: Tone.Unit.Time, velocity:number = 1): void {
        
        if(!this.sampler.loaded) return
        
        this.sampler.triggerAttackRelease(note, duration, time, velocity)
    }

    releaseNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        if(!this.sampler.loaded) return

        this.sampler.triggerRelease(note, time)
    }
    
    releaseAll() {
        
        this.sampler.releaseAll()
    }

    destroy() {
        
        this.sampler.releaseAll()
        this.sampler.disconnect()
        this.sampler.dispose()
        // this.gain.disconnect()
        // this.gain.dispose()
        
        super.destroy()
    }

    serializeIn(o) {

        super.serializeIn(o)

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.volume != undefined) this.volume = o.volume
    }

    serializeOut() {

        let no = super.serializeOut()

        return {

            ...no,
            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
        }
    }
}