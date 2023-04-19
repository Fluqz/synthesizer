import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Node } from '../node';


/**  */
export class DuoSynth extends Instrument {

    public polySynth : Tone.PolySynth<Tone.DuoSynth>

    /** How loud */
    private _volume = .5
    /** Gain node */ 
    public gain
    /** Octave of oscillator */
    public octave = 2

    /** Necessary release time to prevent clicking */
    private releaseTime = 1

    /** freq, detune, volume, waveform,  */
    constructor(options = {}) {

        super('duosynth')

        // this._volume = options.volume ? options.volume : .5

        this.polySynth = new Tone.PolySynth(Tone.DuoSynth)

        this.gain = new Tone.Gain(this.volume)

        this.polySynth.connect(this.gain)

        this.output = this.gain

        console.log(this.polySynth.get())

        this.props.set('volume', { name: 'Volume', get: () => { return this.volume }, set: (v: number) => { this.volume = v }, min: 0, max: 1 })
        this.props.set('detune', { name: 'Detune', get: () => { return this.polySynth.get().detune }, set: (v: number) => { this.polySynth.set({ detune: v }) }, min: 0, max: 1  })

        this.props.set('harmonicity', { name: 'Harmonicity', get: () => { return this.polySynth.get().harmonicity }, set: (v: number) => { this.polySynth.set({ harmonicity: v }) }, min: 0, max: 1  })
        this.props.set('portamento', { name: 'Portamento', get: () => { return this.polySynth.get().portamento }, set: (v: number) => { this.polySynth.set({ portamento: v }) }, min: 0, max: 1  })
        this.props.set('vibratoAmount', { name: 'VibratoAmount', get: () => { return this.polySynth.get().vibratoAmount }, set: (v: number) => { this.polySynth.set({ vibratoAmount: v }) }, min: 0, max: 1  })
        this.props.set('vibratoRate', { name: 'VibratoRate', get: () => { return this.polySynth.get().vibratoRate }, set: (v: number) => { this.polySynth.set({ vibratoRate: v }) }, min: 0, max: 1  })

        this.props.set('attack1', { name: 'Attack 1', get: () => { return this.polySynth.get().voice0.envelope.attack }, set: (v: number) => { this.polySynth.set({ voice0: { envelope: { attack: v } } }) }, min: 0, max: 1  })
        this.props.set('decay1', { name: 'Decay 1', get: () => { return this.polySynth.get().voice0.envelope.decay }, set: (v: number) => { this.polySynth.set({ voice0: { envelope: { decay: v } } }) }, min: 0, max: 1  })
        this.props.set('release1', { name: 'Release 1', get: () => { return this.polySynth.get().voice0.envelope.release }, set: (v: number) => { this.polySynth.set({ voice0: { envelope: { release: v } } }) }, min: 0, max: 1  })
        this.props.set('sustain1', { name: 'Sustain 1', get: () => { return this.polySynth.get().voice0.envelope.sustain }, set: (v: number) => { this.polySynth.set({ voice0: { envelope: { sustain: v } } }) }, min: 0, max: 1  })

        this.props.set('attack2', { name: 'Attack 2', get: () => { return this.polySynth.get().voice1.envelope.attack }, set: (v: number) => { this.polySynth.set({ voice1: { envelope: { attack: v } } }) }, min: 0, max: 1  })
        this.props.set('decay2', { name: 'Decay 2', get: () => { return this.polySynth.get().voice1.envelope.decay }, set: (v: number) => { this.polySynth.set({ voice1: { envelope: { decay: v } } }) }, min: 0, max: 1  })
        this.props.set('release2', { name: 'Release 2', get: () => { return this.polySynth.get().voice1.envelope.release }, set: (v: number) => { this.polySynth.set({ voice1: { envelope: { release: v } } }) }, min: 0, max: 1  })
        this.props.set('sustain2', { name: 'Sustain 2', get: () => { return this.polySynth.get().voice1.envelope.sustain }, set: (v: number) => { this.polySynth.set({ voice1: { envelope: { sustain: v } } }) }, min: 0, max: 1  })

        console.log('POLY',)
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.now())
    }

    triggerNote(note) {

        super.triggerNote(note)

        this.polySynth.triggerAttack(note, Tone.now())
    }

    releaseNote(note) {

        super.releaseNote(note)

        if(note == undefined) this.polySynth.releaseAll(Tone.now()) 
        else this.polySynth.triggerRelease(note, Tone.now())
    }

    connect(n: Node | Tone.ToneAudioNode): void {

        this.polySynth.connect(this.gain)

        this.output = this.gain

        this.output.connect(n instanceof Node ? n.input : n)
    }

    disconnect(n?: Node | Tone.ToneAudioNode): void {
        
        if(n == undefined) {

            if(n instanceof Node) this.output.disconnect(n.input)
            else this.output.disconnect(n)
        }
        else this.output.disconnect()
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['volume']) this.volume = o['volume']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
        }
    }
}