import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { InputType, Node } from '../node';
import type { ToneWithContextOptions } from 'tone/build/esm/core/context/ToneWithContext';



/**  */
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
    private _phase: number

    /** Wave types. Sine, Triangle, Square, Saw */
    private _wave: string = 'sine'

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

        this.volume = volume ? volume : .7
        this.frequency = frequency ? frequency : 1
        this.detune = detune ? detune : .5
    
        this.props.set('volume', { type: InputType.KNOB, name: 'Volume', get: () => this.volume, set: (v:number) => this.volume = v, group: 0 })

        this.props.set('wave', { type: InputType.DROPDOWN, name: 'Wave', get: () => this.wave, set: (v:string) => this.wave = v, options: ['triangle', 'sine', 'square', 'sawtooth'], group: 1 })
        this.props.set('wavePartial', { type: InputType.DROPDOWN, name: 'Wave Partial', get: () => this.wavePartial, set: (v:string) => this.wavePartial = v, options: ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], group: 1 })

        this.props.set('detune', { type: InputType.KNOB, name: 'Detune', get: () => this.detune, set: (v:number) => this.detune = v, group: 2 })
        this.props.set('phase', { type: InputType.KNOB, name: 'Phase', get: () => this.phase, set: (v:number) => this.phase = v, group: 2 })
        
        this.props.set('attack', { type: InputType.KNOB, name: 'Attack', get: () => this.attack, set: (v:number) => this.attack = v, group: 4 })
        this.props.set('decay', { type: InputType.KNOB, name: 'Decay', get: () => this.decay, set: (v:number) => this.decay = v, group: 4 })
        this.props.set('sustain', { type: InputType.KNOB, name: 'Sustain', get: () => this.sustain, set: (v:number) => this.sustain = v, group: 4 })
        this.props.set('release', { type: InputType.KNOB, name: 'Release', get: () => this.release, set: (v:number) => this.release = v, group: 4 })
    }

    get frequency() { return this._frequency }
    set frequency(f) {

        this._frequency = f

        this.osc.frequency.setValueAtTime(this._frequency, Tone.now())
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.now())
    }

    get wave() { return this._wave }
    set wave(w) {

        this._wave = w
        this.osc.set({ type: (this._wave + this.wavePartial) as Tone.ToneOscillatorType})
    }

    get wavePartial() { return this._wavePartial }
    set wavePartial(w) {

        this._wavePartial = w
        this.osc.set({ type: (this._wave + this.wavePartial) as Tone.ToneOscillatorType})
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

    triggerNote(note) {

        super.triggerNote(note)

        this.frequency = note

        this.isPlaying = true

        this.envelope.triggerAttack(Tone.now())
    }

    releaseNote(note) {
        
        super.releaseNote(note)

        this.isPlaying = false

        if(this.isPlaying || Synthesizer.activeNotes.length > 0) {

            // console.log('play other note', Synthesizer.activeNotes)
            this.triggerNote(Synthesizer.activeNotes[Synthesizer.activeNotes.length-1])
            return
        }

        this.envelope.triggerRelease(Tone.now())
    }

    connect(n: Node | Tone.ToneAudioNode<ToneWithContextOptions>): void {

        this.osc.connect(this.envelope)

        this.envelope.connect(this.gain)

        this.output = this.gain

        this.output.connect(n instanceof Node ? n.input : n)
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

        this.osc.stop(Tone.now() + this.envelope.toSeconds(this.envelope.release))

        this.osc.disconnect()
        this.osc.dispose()

        super.destroy()
    }
 
    serializeIn(o) {

        if(o.enabled) this.enabled = o.enabled
        if(o.frequency) this.frequency = o.frequency
        if(o.volume) this.volume = o.volume
        if(o.detune) this.detune = o.detune
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