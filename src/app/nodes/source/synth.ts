import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/templates/knob';
import { Synthesizer } from '../../synthesizer';


/**  */
export class Synth extends Instrument {

    declare instance: Tone.PolySynth<Tone.Synth>

    /** How loud */
    volume
    /** Gain node */
    gain
    /** Slight detuning of the note */
    detune
    /** Offset of the wave */
    portamento
    /** Octave of oscillator */
    octave = 2

    /** freq, detune, volume, waveform,  */
    constructor(options) {

        super('synth')

        this.volume = options.volume ? options.volume : 3
        this.detune = options.detune ? options.detune : .5
        this.portamento = options.portamento ? options.portamento : 0

        this.instance = new Tone.PolySynth(Tone.Synth)

        this.gain = new Tone.Gain(this.volume)

        this.instance.connect(this.gain)

        this.first = this.instance
        this.last = this.gain
    }

    setVolume(v) {

        this.volume = v

        this.gain.gain.value.setValueAtTime(this.volume, Tone.context.currentTime)
    }

    setDetune(d) {

        this.detune = d

        this.instance.set({ detune: this.detune })
    }


    setPortamento(p) {

        this.portamento = p

        this.instance.set({ portamento: this.portamento })

    }

    triggerNote(note: string) {

        // this.gain.gain.setValueAtTime(this.volume, 0)
        // this.gain.gain.value = this.volume

        console.log('trigger', note, Synthesizer.activeNotes)

        this.instance.triggerAttack(note)
    }

    releaseNote(note: string) {

        console.log('release')

        this.instance.triggerRelease(note)
    }


    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['volume']) this.setVolume(o['volume'])
        if(o['detune']) this.setDetune(o['detune'])
        if(o['portamento']) this.setPortamento(o['portamento'])
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