import * as Tone from 'tone'
import { Instrument } from './instrument';


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

        this.polySynth = new Tone.PolySynth<Tone.DuoSynth>(options)

        this.gain = new Tone.Gain(this.volume)

        this.polySynth.connect(this.gain)

        this.output = this.gain

        this.props.set('volume', { name: 'Volume', value: this.volume })

    }

    get volume() { return this._volume }
    set volume(v) {

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.context.currentTime)
    }

    triggerNote(note) {

        super.triggerNote(note)

        this.volume = this.volume

        this.polySynth.triggerAttack(note)
    }

    releaseNote(note) {

        super.releaseNote(note)

        if(note == undefined) this.polySynth.releaseAll(Tone.context.currentTime) 
        else this.polySynth.triggerRelease(note, Tone.context.currentTime)
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