import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Synthesizer } from '../../synthesizer';
import { Node } from '../node';
import type { ToneWithContextOptions } from 'tone/build/esm/core/context/ToneWithContext';



/**  */
export class Oscillator extends Instrument {

    public envelope: Tone.AmplitudeEnvelope

    public osc: Tone.Oscillator

    /** Gain node */
    public gain

    /** How loud */
    private _volume
    /** Frequency */
    private _frequency
    /** Slight detuning of the note */
    private _detune

    /** Octave of oscillator */
    public octave = 2

    /** Is the osc already playing */
    private isPlaying


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

        this.props.set('volume', { name: 'Volume', get: () => this.volume })
        this.props.set('detune', { name: 'Detune', get: () => this.detune })
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

    get detune() { return this._detune }
    set detune(d) {

        this._detune = d

        this.osc.detune.setValueAtTime(this._detune, Tone.now())
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