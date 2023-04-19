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

        super('DuoSynth')

        // this._volume = options.volume ? options.volume : .5

        this.polySynth = new Tone.PolySynth(Tone.DuoSynth)

        this.gain = new Tone.Gain(this.volume)

        this.polySynth.connect(this.gain)

        this.output = this.gain


        this.props.set('volume', { name: 'Volume', get: () => { return this.volume }, set: (v: number) => { this.volume = v }, min: 0, max: 1 })
        
        this.props.set('detune', { name: 'Detune', get: () => { return this.detune }, set: (v: number) => { this.detune = v }, min: 0, max: 1  })
        this.props.set('harmonicity', { name: 'Harmonicity', get: () => { return this.harmonicity }, set: (v: number) => { this.harmonicity = v }, min: 0, max: 1  })
        this.props.set('portamento', { name: 'Portamento', get: () => { return this.portamento }, set: (v: number) => { this.portamento = v }, min: 0, max: 10  })
        this.props.set('vibratoAmount', { name: 'VibratoAmount', get: () => { return this.vibratoAmount }, set: (v: number) => { this.vibratoAmount = v }, min: 0, max: 1  })
        this.props.set('vibratoRate', { name: 'VibratoRate', get: () => { return this.vibratoRate }, set: (v: number) => { this.vibratoRate = v }, min: 0, max: 1  })

        this.props.set('attack1', { name: 'Attack 1', get: () => { return this.attack0 }, set: (v: number) => { this.attack0 = v }, min: 0, max: 3  })
        this.props.set('decay1', { name: 'Decay 1', get: () => { return this.decay0 }, set: (v: number) => { this.decay0 = v }, min: 0, max: 1  })
        this.props.set('release1', { name: 'Release 1', get: () => { return this.release0 }, set: (v: number) => { this.release0 = v }, min: 0, max: 1  })
        this.props.set('sustain1', { name: 'Sustain 1', get: () => { return this.sustain0 }, set: (v: number) => { this.sustain0 = v }, min: 0, max: 1  })

        this.props.set('attack2', { name: 'Attack 2', get: () => { return this.attack1 }, set: (v: number) => { this.attack1 = v }, min: 0, max: 3  })
        this.props.set('decay2', { name: 'Decay 2', get: () => { return this.decay1 }, set: (v: number) => { this.decay1 = v }, min: 0, max: 1  })
        this.props.set('release2', { name: 'Release 2', get: () => { return this.release1 }, set: (v: number) => { this.release1 = v }, min: 0, max: 1  })
        this.props.set('sustain2', { name: 'Sustain 2', get: () => { return this.sustain1 }, set: (v: number) => { this.sustain1 = v }, min: 0, max: 1  })
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.now())
    }

    set detune(v: number) { this.polySynth.set({ detune: v }) }
    get detune() { return this.polySynth.get().detune }

    set harmonicity(v: number) { this.polySynth.set({ harmonicity: v }) }
    get harmonicity() { return this.polySynth.get().harmonicity }
    set portamento(v: number) { this.polySynth.set({ portamento: v }) }
    get portamento() { return this.polySynth.get().portamento }
    set vibratoAmount(v: number) { this.polySynth.set({ vibratoAmount: v }) }
    get vibratoAmount() { return this.polySynth.get().vibratoAmount }
    set vibratoRate(v: number) { this.polySynth.set({ vibratoRate: v }) }
    get vibratoRate() { return this.polySynth.get().vibratoRate }

    set attack0(v: number) { this.polySynth.set({ voice0: { envelope: { attack: v } } }) }
    get attack0() { return this.polySynth.get().voice0.envelope.attack }
    set decay0(v: number) { this.polySynth.set({ voice0: { envelope: { decay: v } } }) }
    get decay0() { return this.polySynth.get().voice0.envelope.decay }
    set release0(v: number) { this.polySynth.set({ voice0: { envelope: { release: v } } }) }
    get release0() { return this.polySynth.get().voice0.envelope.release }
    set sustain0(v: number) { this.polySynth.set({ voice0: { envelope: { sustain: v } } }) }
    get sustain0() { return this.polySynth.get().voice0.envelope.sustain }

    set attack1(v: number) { this.polySynth.set({ voice1: { envelope: { attack: v } } }) }
    get attack1() { return this.polySynth.get().voice1.envelope.attack }
    set decay1(v: number) { this.polySynth.set({ voice1: { envelope: { decay: v } } }) }
    get decay1() { return this.polySynth.get().voice1.envelope.decay }
    set release1(v: number) { this.polySynth.set({ voice1: { envelope: { release: v } } }) }
    get release1() { return this.polySynth.get().voice1.envelope.release }
    set sustain1(v: number) { this.polySynth.set({ voice1: { envelope: { sustain: v } } }) }
    get sustain1() { return this.polySynth.get().voice1.envelope.sustain }


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

        if(o.name) this.name = o.name
        if(o.enabled) this.enabled = o.enabled

        if(o.volume) this.volume = o.volume
        if(o.detune) this.detune = o.detune
        if(o.harmonicity) this.harmonicity = o.harmonicity
        if(o.portamento) this.portamento = o.portamento
        if(o.vibratoAmount) this.vibratoAmount = o.vibratoAmount
        if(o.vibratoRate) this.vibratoRate = o.vibratoRate
        if(o.attack0) this.attack0 = o.attack0
        if(o.decay0) this.decay0 = o.decay0
        if(o.release0) this.release0 = o.release0
        if(o.sustain0) this.sustain0 = o.sustain0
        if(o.attack1) this.attack1 = o.attack1
        if(o.decay1) this.decay1 = o.decay1
        if(o.release1) this.release1 = o.release1
        if(o.sustain1) this.sustain1 = o.sustain1
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,

            volume: this.volume,
            detune: this.detune,
            harmonicity: this.harmonicity,
            portamento: this.portamento,
            vibratoAmount: this.vibratoAmount,
            vibratoRate: this.vibratoRate,
            attack0: this.attack0,
            decay0: this.decay0,
            release0: this.release0,
            sustain0: this.sustain0,
            attack1: this.attack1,
            decay1: this.decay1,
            release1: this.release1,
            sustain1: this.sustain1,
        }
    }
}