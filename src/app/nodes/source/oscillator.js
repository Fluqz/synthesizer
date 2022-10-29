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
    releaseTime = .2

    /** Is the osc already playing */
    isPlaying


    /** freq, detune, volume, waveform,  */
    constructor(frequency, detune, phase, ) {

        super('oscillator')

        this.frequency = frequency ? frequency : 1
        this.detune = detune ? detune : .5
        this.phase = phase ? phase : 0

        this.instance = new Tone.Oscillator(this.frequency)
        this.instance.disconnect()

        this.gain = new Tone.Gain(this.volume)

        // this.instance.connect(this.gain)
        
        // this.setFrequency(this.frequency)
        // let frequencyKnob = new Knob('', this.frequency, 0, 1)
        // this.dom.appendChild(frequencyKnob.dom)
        // frequencyKnob.onChange.subscribe(v => this.setFrequency(v))

        this.isPlaying = false

        this.setVolume(0)
        let volumeKnob = new Knob('Volume', this.volume, 0, 1)
        this.dom.appendChild(volumeKnob.dom)
        volumeKnob.onChange.subscribe(v => this.setVolume(v))
        this.knobs.push(volumeKnob)

        this.setDetune(this.detune)
        let detuneKnob = new Knob('Detune', this.detune, 0, 1)
        this.dom.appendChild(detuneKnob.dom)
        detuneKnob.onChange.subscribe(v => this.setDetune(v))
        this.knobs.push(detuneKnob)

        this.setPhase(this.phase)
        let phaseKnob = new Knob('Phase', this.phase, 0, 1)
        this.dom.appendChild(phaseKnob.dom)
        phaseKnob.onChange.subscribe(v => this.setPhase(v))
        this.knobs.push(phaseKnob)

        this.instance.start()
    }

    setFrequency(f) {

        this.frequency = f

        this.instance.frequency.setValueAtTime(this.frequency, Tone.context.currentTime)
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

        // this.instance.phase.value = this.phase
    }

    triggerNote(note, time, length) {

        time = time == undefined ? Tone.context.currentTime : time

        console.log('PLAY', note)

        window.clearTimeout(this.TO)

        this.gain.gain.cancelScheduledValues(time)

        this.setFrequency(note)

        this.setVolume(1)

        this.isPlaying = true
    }

    TO
    releaseNote(note) {

        this.isPlaying = false

        if(this.isPlaying || Keyboard.activeNotes.length > 0) {

            // console.log('play other note', Keyboard.activeNotes)
            this.triggerNote(Keyboard.activeNotes[Keyboard.activeNotes.length-1])
            return
        }

        console.log('STOP', note)

        this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)

        this.gain.gain.linearRampToValueAtTime(0, Tone.context.currentTime + this.releaseTime)
    }

    connect(n) {

        this.instance.connect(this.gain)

        this.gain.connect(n instanceof Node ? n.gain : n)
    }

    disconnect(n) {

        if(n) this.gain.disconnect(n instanceof Node ? n.gain : n)
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