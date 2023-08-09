import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { ParamType } from '../node';

import Sweep from '../../../assets/samples/synth/SweepFm7.wav'
import BackHome from '../../../assets/samples/synth/Back_Home_F_01.wav'

import kick1 from '../../../assets/samples/drums/kick/Boxed_Ear_Vertice_11.wav'
import kick2 from '../../../assets/samples/drums/kick/grit_3.wav'
import kick3 from '../../../assets/samples/drums/kick/hip-hop-kick.wav'

import snare1 from '../../../assets/samples/drums/snare/Wu_1p.wav'
import snare2 from '../../../assets/samples/drums/snare/dilla_snare.wav'
import snare3 from '../../../assets/samples/drums/snare/g.wav'
import snare4 from '../../../assets/samples/drums/snare/snare2.wav'
import snare5 from '../../../assets/samples/drums/snare/snare5.wav'
import snare6 from '../../../assets/samples/drums/snare/snare6.wav'

import hihat1 from '../../../assets/samples/drums/hihat/WU_HH_179.wav'
import hihat2 from '../../../assets/samples/drums/hihat/Wu_1p1.wav'
import hihat3 from '../../../assets/samples/drums/hihat/Wu_1p2.wav'
import hihat4 from '../../../assets/samples/drums/hihat/Wu_1p3.wav'
import hihat5 from '../../../assets/samples/drums/hihat/hat_1.wav'
import hihat6 from '../../../assets/samples/drums/hihat/hat_3.wav'
import hihat7 from '../../../assets/samples/drums/hihat/hat_4.wav'

import perc1 from '../../../assets/samples/drums/perc/Boxed_Ear_Vertice_72.wav'
import perc2 from '../../../assets/samples/drums/perc/Percussion_08.wav'
import perc3 from '../../../assets/samples/drums/perc/WU_HH_191.wav'
import perc4 from '../../../assets/samples/drums/perc/perc5.wav'

import cymbal1 from '../../../assets/samples/drums/cymbal/Ride.wav'
import cymbal2 from '../../../assets/samples/drums/cymbal/WU_HH_177.wav'
import cymbal3 from '../../../assets/samples/drums/cymbal/WU_HH_198.wav'
import cymbal4 from '../../../assets/samples/drums/cymbal/WU_HH_199.wav'

// import sliced1 from '../../../assets/samples/drums/sliced/Wu-RZA-Hat-10.WAV'
// import sliced2 from '../../../assets/samples/drums/sliced/Wu-RZA-Hat-11.WAV'
// import sliced3 from '../../../assets/samples/drums/sliced/Wu-RZA-Hat-12.WAV'



const samples = [

    { path: Sweep, name: 'Sweep Fm7' },
    { path: BackHome, name: 'Back Home F'},
    { path: kick1, name: 'Kick1'},
    { path: kick2, name: 'Kick2'},
    { path: kick3, name: 'Kick3'},
    { path: snare1, name: 'Snare1'},
    { path: snare2, name: 'Snare2'},
    { path: snare3, name: 'Snare3'},
    { path: snare4, name: 'Snare4'},
    { path: snare5, name: 'Snare5'},
    { path: snare6, name: 'Snare6'},

    { path: hihat1, name: 'Hihat1'},
    { path: hihat2, name: 'Hihat2'},
    { path: hihat3, name: 'Hihat3'},
    { path: hihat4, name: 'Hihat4'},
    { path: hihat5, name: 'Hihat5'},
    { path: hihat6, name: 'Hihat6'},
    { path: hihat7, name: 'Hihat7'},

    { path: perc1, name: 'perc1'},
    { path: perc2, name: 'perc2'},
    { path: perc3, name: 'perc3'},
    { path: perc4, name: 'perc4'},

    { path: cymbal1, name: 'Cymbal1'},
    { path: cymbal2, name: 'Cymbal2'},
    { path: cymbal3, name: 'Cymbal3'},
    { path: cymbal4, name: 'Cymbal4'},
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

        const opts = samples.map((a) => { return a.name })
        
        console.log('options',opts)
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

            // if(this.sampler == undefined) this.sampler = new Tone.Sampler()
            return
        }

        console.log(v, path)

        this._sample = v

        if(!this.sampler) {

            this.sampler = new Tone.Sampler({
                urls: {
                    F2: path,
                },
            })
        }

        // this.sampler.set({
        //     urls: {
        //         C2: path,
        //     },
        // })
        
        
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


    triggerAttack(note: Tone.Unit.Frequency, time: Tone.Unit.Time, velocity: number = 1) {

        if(!this.sampler.loaded) return

        this.sampler.triggerAttack(note, time, velocity)
    }

    triggerAttackRelease(note: Tone.Unit.Frequency, duration: Tone.Unit.Time, time: Tone.Unit.Time, velocity:number = 1): void {
        
        if(!this.sampler.loaded) return
        
        this.sampler.triggerAttackRelease(note, duration, time, velocity)
    }

    triggerRelease(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

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
        if(o.sample != undefined) this.sample = o.sample
    }

    serializeOut() {

        let no = super.serializeOut()

        return {

            ...no,
            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
            sample: this.sample,
        }
    }
}