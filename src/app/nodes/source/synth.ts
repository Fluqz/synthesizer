import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/templates/knob';
import { Synthesizer } from '../../synthesizer';


/**  */
export class Synth extends Instrument {

    synth: Tone.Synth
    /** How loud */
    _volume
    /** Gain node */
    gain
    /** Slight detuning of the note */
    _detune
    /** Offset of the wave */
    _portamento
    /** Octave of oscillator */
    octave = 2

    /** freq, detune, volume, waveform,  */
    constructor(options?) {

        super('synth')

        this.volume = options.volume ? options.volume : 3
        this.detune = options.detune ? options.detune : .5
        this.portamento = options.portamento ? options.portamento : 0

        this.synth = new Tone.Synth()

        this.gain = new Tone.Gain(this.volume)

        this.output = this.gain

        this.props.set('volume', { name: 'Volume', value: this.volume })
        this.props.set('detune', { name: 'Detune', value: this.detune })
        this.props.set('portamento', { name: 'Portamento', value: this.portamento })
    }

    set volume(v: number) {

        this._volume = v 
        this.gain.gain.value.setValueAtTime(this.volume, Tone.context.currentTime)
    }
    get volume() { return this.volume }


    set detune(d: number) { 
        this._detune = d 
        this.synth.set({ detune: this.detune })
    }
    get detune() { return this.detune }


    get portamento() { return this._portamento }
    set portamento(p) {

        this._portamento = p
        this.synth.set({ portamento: this._portamento })
    }

    triggerNote(note: string) {

        // this.gain.gain.setValueAtTime(this.volume, 0)
        // this.gain.gain.value = this.volume

        console.log('trigger', note, Synthesizer.activeNotes)

        this.synth.triggerAttack(note)
    }

    releaseNote(note: string) {

        console.log('release')

        this.synth.triggerRelease(note)
    }


    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['volume']) this.volume = o['volume']
        if(o['detune']) this.detune = o['detune']
        if(o['portamento']) this.portamento = o['portamento']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            volume: this.volume,
            detune: this.detune,
            portamento: this.portamento
        }
    }
}