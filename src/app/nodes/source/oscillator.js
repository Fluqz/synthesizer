import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/knob';
import { Keyboard } from '../../keyboard';



/**  */
export class Oscillator extends Instrument {

    /** How loud */
    volume
    /** Gain node */
    gain
    /** Frequency */
    frequency
    /** Slight detuning of the note */
    detune
    /** Offset of the wave */
    phase
    /** Octave of oscillator */
    octave = 2

    /** Necessary release time to prevent clicking */
    releaseTime = 1

    /** Is the osc already playing */
    isPlaying

    /** freq, detune, volume, waveform,  */
    constructor(frequency, volume, detune, phase, ) {

        super('oscillator')

        this.frequency = frequency ? frequency : 1
        this.volume = volume ? volume : 3
        this.detune = detune ? detune : .5
        this.phase = phase ? phase : 0

        this.instance = new Tone.Oscillator(this.frequency)

        this.gain = new Tone.Gain(this.volume)

        this.instance.connect(this.gain)
        
        // this.setFrequency(this.frequency)
        // let frequencyKnob = new Knob(this.frequency, 0, 1)
        // this.dom.appendChild(frequencyKnob.dom)
        // frequencyKnob.onChange.subscribe(v => this.setFrequency(v))

        this.isPlaying = false

        this.setVolume(this.volume)
        let volumeKnob = new Knob(this.volume, 0, 1)
        this.dom.appendChild(volumeKnob.dom)
        volumeKnob.onChange.subscribe(v => this.setVolume(v))
        this.knobs.push(volumeKnob)

        this.setDetune(this.detune)
        let detuneKnob = new Knob(this.detune, 0, 1)
        this.dom.appendChild(detuneKnob.dom)
        detuneKnob.onChange.subscribe(v => this.setDetune(v))
        this.knobs.push(detuneKnob)

        this.setPhase(this.phase)
        let phaseKnob = new Knob(this.phase, 0, 1)
        this.dom.appendChild(phaseKnob.dom)
        phaseKnob.onChange.subscribe(v => this.setPhase(v))
        this.knobs.push(phaseKnob)
    }

    setFrequency(f) {

        this.frequency = f

        this.instance.frequency.value = this.frequency
    }

    setVolume(v) {

        this.volume = v

        this.gain.gain.value = this.volume
    }

    setDetune(d) {

        this.detune = d

        this.instance.detune.value = this.detune
    }

    setPhase(p) {

        this.phase = p

        // this.instance.phase.value = this.phase
    }

    triggerNote(note, time) {

        // this.gain.gain.setValueAtTime(this.volume, 0)
        // this.gain.gain.value = this.volume

        this.setFrequency(note)

        if(!this.isPlaying) {

            this.instance.stop()

            this.instance.start()
        }

        this.isPlaying = true
    }

    releaseNote(note) {

        this.instance.stop()
        // this.gain.gain.linearRampToValueAtTime(0, this.releaseTime)

        this.isPlaying = false
    }

    connect(n) {

        this.gain.connect(n instanceof Node ? n.gain : n)
    }

    disconnect(n) {

        if(n) this.gain.disconnect(n instanceof Node ? n.gain : n)
        else this.gain.disconnect()
    }


    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['frequency']) this.setFrequency(o['frequency'])
        if(o['volume']) this.setVolume(o['volume'])
        if(o['detune']) this.setDetune(o['detune'])
        if(o['phase']) this.setPhase(o['phase'])
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
            frequency: this.frequenzy,
            volume: this.volume,
            detune: this.detune,
            phase: this.phase
        }
    }
}