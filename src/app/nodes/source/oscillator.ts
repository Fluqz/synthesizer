import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { ParamType, Node } from '../node';
import type { ToneWithContextOptions } from 'tone/build/esm/core/context/ToneWithContext';



/** 
 * 
 */
export class Oscillator extends Instrument {

    public envelope: Tone.AmplitudeEnvelope

    public osc: Tone.Oscillator

    /** Gain node */
    public gain: Tone.Gain

    /** How loud */
    private _volume: number
    /** Frequency */
    private _frequency: number
    /** Slight detuning of the note */
    private _detune: number
    /** The phase is the starting position within the oscillator's cycle. 
     * For example a phase of 180 would start halfway through the oscillator's cycle. */
    private _phase: number = 0

    /** Wave types. Sine, Triangle, Square, Saw */
    private _wave: Tone.ToneOscillatorType = 'sine'

    /** Wave types. Sine, Triangle, Square, Saw */
    private _wavePartial: string = ''


    private _attack: number
    private _decay: number
    private _sustain: number
    private _release: number

    /** Is the osc already playing */
    private isPlaying: boolean


    /** freq, detune, volume, waveform,  */
    constructor(volume?: number, frequency?: number, detune?: number) {

        super('Oscillator')

        this.osc = new Tone.Oscillator(this.frequency)
        this.osc.start(Tone.now())

        this.envelope = new Tone.AmplitudeEnvelope()
        this.gain = new Tone.Gain(1)

        this.output = this.gain

        this.isPlaying = false

        this.volume = volume ? volume : .4
        this.detune = this.osc.get().detune
        this.phase = this.osc.get().phase
        this.attack = this.envelope.get().attack as number
        this.decay = this.envelope.get().decay as number
        this.sustain = this.envelope.get().sustain
        this.release = this.envelope.get().release as number
        this._wave = 'sine'
        this._wavePartial = ''


        this.props.set('volume', { type: ParamType.KNOB, name: 'Volume', get: () => this.volume, set: (v:number) => this.volume = v, min: 0, max:1, groupID: 0 })

        this.props.set('wave', { type: ParamType.DROPDOWN, name: 'Wave', get: () => this.wave, set: (v:string) => this.wave = v, options: [ 'sine', 'square', 'sawtooth', 'triangle', 'pulse', ], groupID: 1 })
        this.props.set('wavePartial', { type: ParamType.DROPDOWN, name: 'Wave Partial', get: () => this.wavePartial, set: (v:string) => this.wavePartial = v, options: ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], group: 1 })

        this.props.set('detune', { type: ParamType.KNOB, name: 'Detune', get: () => { return this.detune }, set: (v) => this.detune = v, min: -1000, max: 1000, groupID: 2 })
        this.props.set('phase', { type: ParamType.KNOB, name: 'Phase', get: () => this.phase, set: (v:number) => this.phase = v, min: 0, max: 100, groupID: 2 })
        
        this.props.set('attack', { type: ParamType.KNOB, name: 'Attack', get: () => this.attack, set: (v:number) => this.attack = v, min: .1, max: 5, groupID: 4 })
        this.props.set('decay', { type: ParamType.KNOB, name: 'Decay', get: () => this.decay, set: (v:number) => this.decay = v, min: 0, max: 5, groupID: 4 })
        this.props.set('sustain', { type: ParamType.KNOB, name: 'Sustain', get: () => this.sustain, set: (v:number) => this.sustain = v, min: 0, max: 1, groupID: 4 })
        this.props.set('release', { type: ParamType.KNOB, name: 'Release', get: () => this.release, set: (v:number) => this.release = v, min: 0, max: 5, groupID: 4 })
    }

    get frequency() { return this._frequency }
    set frequency(f) {

        this._frequency = f

        this.osc.frequency.value = this._frequency
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.now())
    }

    get wave() { return this._wave }
    set wave(w) {

        this._wave = w
        this.osc.set({ type: this._wave })
    }

    get wavePartial() { return this._wavePartial }
    set wavePartial(w) {

        this._wavePartial = w
        this.osc.set({ type: this._wave })
    }

    get detune() { return this._detune }
    set detune(d) {


        this._detune = d

        this.osc.detune.setValueAtTime(this._detune, Tone.now())
    }

    get phase() { return this._phase }
    set phase(d) {

        this._phase = d
        this.osc.set({ phase: this._phase })
    }

    get attack() { return this._attack }
    set attack(d) {

        this._attack = d
        this.envelope.set({ attack: this._attack })
    }

    get decay() { return this._decay }
    set decay(d) {

        this._decay = d
        this.envelope.set({ decay: this._decay })
    }

    get sustain() { return this._sustain }
    set sustain(d) {

        this._sustain = d
        this.envelope.set({ sustain: this._sustain })
    }

    get release() { return this._release }
    set release(d) {

        this._release = d
        this.envelope.set({ release: this._release })
    }


    triggerAttack(note: Tone.Unit.Frequency, time: Tone.Unit.Time, velocity: number = 1) {

        this.frequency = Tone.Frequency(note).toFrequency()

        this.isPlaying = true

        this.envelope.triggerAttack(time, velocity)
    }

    triggerAttackRelease(note: Tone.Unit.Frequency, duration: Tone.Unit.Time, time: Tone.Unit.Time, velocity:number = 1): void {
        
        this.frequency = Tone.Frequency(note).toFrequency()

        // this.isPlaying ?

        this.envelope.triggerAttackRelease(duration, time, velocity)
    }

    triggerRelease(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        this.isPlaying = false

        // const otherPlayedNote = Array.from(Synthesizer.activeNotes).pop()
        // if(this.isPlaying || Synthesizer.activeNotes.size > 0 && otherPlayedNote != note) {

        //     console.log('play other note', Synthesizer.activeNotes)
        //     this.triggerAttack(otherPlayedNote, time)
        //     return
        // }

        this.envelope.triggerRelease(time)
    }

    releaseAll() {
        
        this.envelope.triggerRelease(Tone.now())
    }

    connect(n: Node | Tone.ToneAudioNode<ToneWithContextOptions>): void {

        this.osc.connect(this.envelope)

        this.envelope.connect(this.gain)

        this.output = this.gain

        this.output.connect(n instanceof Node ? n.input : n)
    }

    chain(nodes: Node[] | Tone.ToneAudioNode[]) {

        if(!nodes.length || nodes.length == 0) return // this.connect(nodes)

        this.osc.connect(this.envelope)

        this.envelope.connect(this.gain)

        this.output = this.gain

        this.output.connect(nodes[0] instanceof Node ? nodes[0].input : nodes[0])

        let lastNode: Tone.ToneAudioNode = nodes[0] instanceof Node ? nodes[0].output : nodes[0]

        nodes.shift()

        // console.log('chain', this.output.name, 'to', lastNode.name)

        for(let n of nodes) {
            
            if(n instanceof Node) {

                // console.log('chain Node', lastNode.name, 'to', n.name)

                lastNode.connect(n.input)
                lastNode = n.output
            }
            else {
                
                // console.log('chain ToneNode', lastNode.name, 'to', n.name)

                lastNode.connect(n)
                lastNode = n
            }
        }
    }

    disconnect(n?: Node | Tone.ToneAudioNode<ToneWithContextOptions>): void {
        
        if(n == undefined) {

            if(n instanceof Node) this.output.disconnect(n.input)
            else this.output.disconnect(n)
        }
        else this.output.disconnect()
    }

    destroy() {

        this.envelope.triggerRelease(Tone.now())
        this.envelope.disconnect()
        this.envelope.dispose()

        this.osc.stop(Tone.now() + this.envelope.toSeconds(this.envelope.release))

        this.osc.disconnect()
        this.osc.dispose()

        super.destroy()
    }
 
    serializeIn(o) {

        super.serializeIn(o)
        
        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.volume != undefined) this.volume = o.volume

        if(o.detune != undefined) this.detune = o.detune
        if(o.phase != undefined) this.phase = o.phase
        if(o.wave != undefined) this.wave = o.wave
        if(o.wavePartial != undefined) this.wavePartial = o.wavePartial

        if(o.attack != undefined) this.attack = o.attack
        if(o.decay != undefined) this.decay = o.decay
        if(o.sustain != undefined) this.sustain = o.sustain
        if(o.release != undefined) this.release = o.release
    }

    serializeOut() {

        let no = super.serializeOut()

        return {

            ...no,

            name: this.name,
            enabled: this.enabled,
            
            detune: this.detune,
            phase: this.phase,
            wave: this.wave,
            wavePartial: this.wavePartial,

            attack: this.attack,
            decay: this.decay,
            sustain: this.sustain,
            release: this.release,
        }
    }
}