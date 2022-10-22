import * as Tone from 'tone'
import { Instrument } from './instrument';
import { Knob } from '../../view/knob';
import { Keyboard } from '../../keyboard';



/**  */
export class DuoSynth extends Instrument {

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

    /** freq, detune, volume, waveform,  */
    constructor(options = {}) {

        super('duosynth')
        

        this.frequency = options.frequency ? options.frequency : 300
        this.volume = options.volume ? options.volume : 1
        this.detune = options.detune ? options.detune : 0
        this.phase = options.phase ? options.phase : 0

        this.instance = new Tone.PolySynth(Tone.DuoSynth, options)
        console.log(this.name, this.instance)

        this.gain = new Tone.Gain(this.volume)

        this.instance.connect(this.gain)
        
        // this.setFrequency(this.frequency)
        // let frequencyKnob = new Knob('', this.frequency, 0, 1)
        // this.dom.appendChild(frequencyKnob.dom)
        // frequencyKnob.onChange.subscribe(v => this.setFrequency(v))

        let volumeKnob = new Knob('Volume', this.volume, 0, 1)
        this.dom.appendChild(volumeKnob.dom)
        volumeKnob.onChange.subscribe(v => this.setVolume(v))

        let detuneKnob = new Knob('Detune', this.detune, 0, 1)
        this.dom.appendChild(detuneKnob.dom)
        detuneKnob.onChange.subscribe(v => this.setDetune(v))

        let phaseKnob = new Knob('phase', this.phase, 0, 1)
        this.dom.appendChild(phaseKnob.dom)
        phaseKnob.onChange.subscribe(v => this.setPhase(v))

        // this.setFrequency(this.frequency)
        // this.setVolume(this.volume)
        // this.setDetune(this.detune)
        // this.setPhase(this.phase)
    }

    setFrequency(f) {

        this.frequency = f
    }

    setVolume(v) {

        this.volume = v

        this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)
    }

    setDetune(d) {

        this.detune = d

        this.instance.detune.setValueAtTime(this.detune, Tone.context.currentTime)
    }


    setPhase(p) {

        this.phase = p

        this.instance.phase.setValueAtTime(this.phase, Tone.context.currentTime)
    }

    triggerNote(note, time) {

        // this.gain.gain.setValueAtTime(this.volume, 0)
        // this.gain.gain.value = this.volume

        // console.log('trigger', note, Keyboard.activeNotes)

        // this.instance.detune = 50
        // this.instance.harmonicity = 50

        // setInterval(() => {
            
        //     this.instance.detune += 1
        //     console.log('detune', this.instance.detune)

        // }, 400)

        this.setFrequency(note)

        this.setVolume(this.volume)

        this.instance.triggerAttackRelease(note, time)
    }

    releaseNote(note) {

        // console.log('release')

        this.instance.triggerRelease(note)

        this.gain.gain.linearRampToValueAtTime(0, this.releaseTime)
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