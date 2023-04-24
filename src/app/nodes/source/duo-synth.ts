import * as Tone from 'tone'
import { Instrument } from './instrument';
import { ParamType, Node } from '../node';


/**  */
export class DuoSynth extends Instrument {

    public polySynth : Tone.PolySynth<Tone.DuoSynth>

    /** Gain node */ 
    public gain: Tone.Gain

    public _volume: number = .5


    /** freq, detune, volume, waveform,  */
    constructor(options: any = {}) {

        super('DuoSynth')

        // this._volume = options.volume ? options.volume : .5

        this.polySynth = new Tone.PolySynth(Tone.DuoSynth)

        this.gain = new Tone.Gain(this.volume)

        this.polySynth.connect(this.gain)

        this.output = this.gain

        this.input = null


        console.log('DUO', this.polySynth.get())

        this.detune = options.detune != undefined ? options.detune : this.polySynth.get().detune
        this.portamento = options.portamento != undefined ? options.portamento : this.polySynth.get().portamento
        this.harmonicity = options.harmonicity != undefined ? options.harmonicity : this.polySynth.get().harmonicity
        this.vibratoAmount = options.vibratoAmount != undefined ? options.vibratoAmount : this.polySynth.get().vibratoAmount
        this.vibratoRate = options.vibratoRate != undefined ? options.vibratoRate : this.polySynth.get().vibratoRate

        this.attack0 = options.attack != undefined ? options.attack : this.polySynth.get().voice0.envelope.attack
        this.decay0 = options.decay != undefined ? options.decay : this.polySynth.get().voice0.envelope.decay
        this.sustain0 = options.sustain != undefined ? options.sustain : this.polySynth.get().voice0.envelope.sustain
        this.release0 = options.release != undefined ? options.release : this.polySynth.get().voice0.envelope.release

        this.attack1 = options.attack != undefined ? options.attack : this.polySynth.get().voice1.envelope.attack
        this.decay1 = options.decay != undefined ? options.decay : this.polySynth.get().voice1.envelope.decay
        this.sustain1 = options.sustain != undefined ? options.sustain : this.polySynth.get().voice1.envelope.sustain
        this.release1 = options.release != undefined ? options.release : this.polySynth.get().voice1.envelope.release



        this.props.set('volume', { type: ParamType.KNOB, name: 'Volume', get: () => { return this.volume }, set: (v: number) => { this.volume = v }, min: 0, max: 1, group: 0 })
        
        this.props.set('detune', { type: ParamType.KNOB, name: 'Detune', get: () => { return this.detune }, set: (v: number) => { this.detune = v }, min: 0, max: 1, group: 1 })
        this.props.set('harmonicity', { type: ParamType.KNOB, name: 'Harmonicity', get: () => { return this.harmonicity }, set: (v: number) => { this.harmonicity = v }, min: 0, max: 1, group: 1 })
        this.props.set('portamento', { type: ParamType.KNOB, name: 'Portamento', get: () => { return this.portamento }, set: (v: number) => { this.portamento = v }, min: 0, max: 1, group: 1 })
        this.props.set('vibratoAmount', { type: ParamType.KNOB, name: 'Vibrato Amount', get: () => { return this.vibratoAmount }, set: (v: number) => { this.vibratoAmount = v }, min: 0, max: 1, group: 1 })
        this.props.set('vibratoRate', { type: ParamType.KNOB, name: 'VibratoRate', get: () => { return this.vibratoRate }, set: (v: number) => { this.vibratoRate = v }, min: 0, max: 1, group: 1 })

        this.props.set('attack0', { type: ParamType.KNOB, name: 'Attack 1', get: () => { return this.attack0 }, set: (v: number) => { this.attack0 = v }, min: 0, max: 3, group: 2 })
        this.props.set('decay0', { type: ParamType.KNOB, name: 'Decay 1', get: () => { return this.decay0 }, set: (v: number) => { this.decay0 = v }, min: 0, max: 1, group: 2 })
        this.props.set('release0', { type: ParamType.KNOB, name: 'Release 1', get: () => { return this.release0 }, set: (v: number) => { this.release0 = v }, min: 0, max: 5, group: 2 })
        this.props.set('sustain0', { type: ParamType.KNOB, name: 'Sustain 1', get: () => { return this.sustain0 }, set: (v: number) => { this.sustain0 = v }, min: 0, max: 1, group: 2 })

        this.props.set('attack1', { type: ParamType.KNOB, name: 'Attack 2', get: () => { return this.attack1 }, set: (v: number) => { this.attack1 = v }, min: 0, max: 3, group: 3 })
        this.props.set('decay1', { type: ParamType.KNOB, name: 'Decay 2', get: () => { return this.decay1 }, set: (v: number) => { this.decay1 = v }, min: 0, max: 1, group: 3 })
        this.props.set('release1', { type: ParamType.KNOB, name: 'Release 2', get: () => { return this.release1 }, set: (v: number) => { this.release1 = v }, min: 0, max: 5, group: 3 })
        this.props.set('sustain1', { type: ParamType.KNOB, name: 'Sustain 2', get: () => { return this.sustain1 }, set: (v: number) => { this.sustain1 = v }, min: 0, max: 1, group: 3 })
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v
        this.gain.gain.setValueAtTime(v, Tone.now())
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

    chain(nodes: Node[] | Tone.ToneAudioNode[]) {

        // this.polySynth.connect(this.gain)

        // this.output = this.gain

        super.chain(nodes)
    }

    disconnect(n?: Node | Tone.ToneAudioNode): void {
        
        if(n == undefined) {

            if(n instanceof Node) this.output.disconnect(n.input)
            else this.output.disconnect(n)
        }
        else this.output.disconnect()
    }

    serializeIn(o) {

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled

        if(o.volume != undefined) this.volume = o.volume
        if(o.detune != undefined) this.detune = o.detune
        if(o.harmonicity != undefined) this.harmonicity = o.harmonicity
        if(o.portamento != undefined) this.portamento = o.portamento
        if(o.vibratoAmount != undefined) this.vibratoAmount = o.vibratoAmount
        if(o.vibratoRate != undefined) this.vibratoRate = o.vibratoRate
        if(o.attack0 != undefined) this.attack0 = o.attack0
        if(o.decay0 != undefined) this.decay0 = o.decay0
        if(o.release0 != undefined) this.release0 = o.release0
        if(o.sustain0 != undefined) this.sustain0 = o.sustain0
        if(o.attack1 != undefined) this.attack1 = o.attack1
        if(o.decay1 != undefined) this.decay1 = o.decay1
        if(o.release1 != undefined) this.release1 = o.release1
        if(o.sustain1 != undefined) this.sustain1 = o.sustain1
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