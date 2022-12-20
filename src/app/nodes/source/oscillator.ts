import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/templates/knob';
import { Synthesizer } from '../../synthesizer';



/**  */
export class Oscillator extends Instrument {

    declare instance: Tone.Oscillator
    /** Gain node */
    public gain

    /** How loud */
    private _volume
    /** Frequency */
    private _frequency
    /** Slight detuning of the note */
    private _detune
    /** Offset of the wave */
    private _phase

    /** Octave of oscillator */
    public octave = 2

    /** Necessary release time to prevent clicking */
    private releaseTime = .2

    /** Is the osc already playing */
    private isPlaying


    /** freq, detune, volume, waveform,  */
    constructor(volume?: number, frequency?: number, detune?: number, phase?: number, ) {

        super('oscillator')

        this.instance = new Tone.Oscillator(this.frequency)
        this.gain = new Tone.Gain(this.volume)
        this.isPlaying = false

        this.volume = volume ? volume : .7
        this.frequency = frequency ? frequency : 1
        this.detune = detune ? detune : .5
        this.phase = phase ? phase : 0

        this.instance.start()

        this.props.push('volume', 'detune', 'phase')
    }

    get frequency() { return this._frequency }
    set frequency(f) {

        this._frequency = f

        this.instance.frequency.setValueAtTime(this._frequency, Tone.context.currentTime)
    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.context.currentTime)
    }

    get detune() { return this._detune }
    set detune(d) {

        this._detune = d

        this.instance.detune.setValueAtTime(this._detune, Tone.context.currentTime)
    }

    get phase() { return this._phase }
    set phase(p) {

        this._phase = p

        // this.instance.phase.value = this.phase
    }

    triggerNote(note) {

        window.clearTimeout(this.TO)

        this.gain.gain.cancelScheduledValues(Tone.context.currentTime)

        this.frequency = note

        this.volume = 1

        this.isPlaying = true
    }

    TO
    releaseNote(note) {

        this.isPlaying = false

        if(this.isPlaying || Synthesizer.activeNotes.length > 0) {

            // console.log('play other note', Synthesizer.activeNotes)
            this.triggerNote(Synthesizer.activeNotes[Synthesizer.activeNotes.length-1])
            return
        }

        this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)

        this.gain.gain.linearRampToValueAtTime(0, Tone.context.currentTime + this.releaseTime)
    }

    connect(n) {

        this.instance.connect(this.gain)

        this.gain.connect(n)
    }

    disconnect(n) {

        if(n) this.gain.disconnect(n)
        else this.gain.disconnect()
    }

    destroy() {

        this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)
        this.volume = 0

        this.gain.gain.linearRampToValueAtTime(this.volume, Tone.context.currentTime + this.releaseTime)

        this.instance.stop(Tone.context.currentTime + this.releaseTime + .02)
        
        super.destroy()
    }
 
    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['frequency']) this.frequency = o['frequency']
        if(o['volume']) this.volume = o['volume']
        if(o['detune']) this.detune = o['detune']
        if(o['phase']) this.phase = o['phase']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            frequency: this.frequency,
            volume: this.volume,
            detune: this.detune,
            phase: this.phase
        }
    }
}