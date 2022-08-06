
import * as Tone from 'tone'

import * as RxJs from 'rxjs'

import { Key } from './key'

import { G } from './globals'

import { Delay } from './effects/delay'
import { Tremolo } from './effects/tremolo'
import { Reverb } from './effects/reverb'
import { Chorus } from './effects/chorus'
import { Distortion } from './effects/distortion'

/** Keyboard */
export class Keyboard {

    /** Array of keys on the keyboard */
    static keyMap = [
        // Upper
        'q',
        '2',
        'w',
        '3',
        'e',
        'r',
        '5',
        't',
        '6',
        'z',
        '7',
        'u',
        'i',
        '9',
        'o',
        '0',
        'p',

        //lower
        '<',
        'a',
        'y',
        's',
        'x',
        'd',
        'c',
        'v',
        'g',
        'b',
        'h',
        'n',
        'm',
        'k',
        ',',
        'l',
        '.',
        'ö',
        '-',
    ]

    /** Array of all notes */
    static notes = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
    ]

    /** 
     * This array is used to keep track which notes are currently triggered. 
     * There are some issues with polyphonic synths and releasing the note. 
     * In some occasions you can lose track and wont be able to release the note anymore.
     * The note will play for eternity.
     */
    static activeNotes

    static synths = {
        synth: Tone.Synth,
        FMSynth: Tone.FMSynth,
        DuoSynth: Tone.DuoSynth,
        MembraneSynth: Tone.MembraneSynth,
    }

    static getEffect(name) {

        if(name === 'delay') return new Delay(1, .12, .8)
        else if(name === 'tremolo') return new Tremolo(1, 5, 1)
        // else if(name === 'reverb') return new Reverb()
        else if(name === 'distortion') return new Distortion(1, .5)
        else if(name === 'chorus') return new Chorus(1, 4, 20, 1, 1)
    }

    /** Array of created Key objects */
    static keys = []

    /** Octave number */
    octave

    /** Master volume node */
    volume

    /** Synth that is used */
    synth
    /** Arppegiator mode */
    arp

    effectChain


    /** ToneJs Recorder instance */
    recorder
    /** Recording flag */
    isRecording

    /** DOM element container */
    dom


    // Events
    onKeyDownEvent
    onKeyUpEvent
    onRecordingStart
    onRecordingEnd


    constructor(dom, octave) {

        this.dom = dom

        this.octave = octave ? octave : 2

        this.volume = new Tone.Gain(1)
        this.volume.toDestination()

        this.effectChain = []
        this.activeNotes = []

        this.arp = false

        this.isRecording = false

        this.synth = new Tone.PolySynth(Keyboard.synths.DuoSynth)
        this.synth.connect(this.volume)


        // Create Keys
        let key
        let i = 0
        for(let keyMap of Keyboard.keyMap) {

            key = new Key(
                Keyboard.notes[i % Keyboard.notes.length], 
                this.octave + Math.floor(i / Keyboard.notes.length),
                keyMap
            )

            Keyboard.keys.push(key)

            this.dom.append(key.dom)

            key.onTrigger.subscribe(k => {

                this.playNote(k.note, k.octave)
            })

            key.onRelease.subscribe(k => {

                this.releaseNote(k.note, k.octave)
            })

            i++
        }

        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)

        this.onRecordingStart = new RxJs.Subject()
        this.onRecordingEnd = new RxJs.Subject()
    }

    /** Set one of the few synths of ToneJs. */
    setSynth(synth) {

        this.stopAll()

        this.synth = new Tone.PolySynth(Keyboard.synths[synth])
        this.synth.connect(this.volume)

        this.connectEffectChain()
    }

    toggleArpMode(m) {

    }

    /** Set Master Volume */
    setVolume(v) {

        this.volume.gain.value = v
    }

    /** Set the octave number */
    setOctave(o) {

        this.octave = o

        let i = 0
        for(let k of Keyboard.keys) {

            k.setOctave(this.octave + Math.floor(i / Keyboard.notes.length))
            k.updateText()

            i++
        }
    }

    /** Trigger note */
    playNote(note, octave) {

        this.activeNotes.push(note + octave)

        this.synth.triggerAttack(note + octave);
    }

    /** Release note */
    releaseNote(note, octave) {

        this.synth.triggerRelease(note + octave);
        this.activeNotes.splice(this.activeNotes.indexOf(note + octave), 1)
    }

    /** Will release all triggered notes that are stored in [activeNotes] */
    stopAll() {

        for(let an of this.activeNotes) this.releaseNote(an)
    }


    /** Adds a effect to the effect chain */
    addEffect(e) {

        this.effectChain.push(e)

        e.onDelete.subscribe(this.removeEffect.bind(this))

        this.connectEffectChain()
    }

    /** Connects all effects in a chain */
    connectEffectChain() {

        if(this.effectChain.length == 0) return

        this.synth.disconnect()
        // this.synth.connect(this.volume)

        // this.synth.connect(this.effectChain[0].instance)

        // for(let i = 0; i < this.effectChain.length; i++) {

        //     this.effectChain[i].disconnect()
        //     this.effectChain[i].connect(i == this.effectChain.length-1 ? this.volume : this.effectChain[i+1])
        // }

        let nodes = []

        for(let ef of this.effectChain) {

            nodes.push(ef.instance)
        }

        nodes.push(this.volume)

        this.synth.chain(...nodes)
    }

    /** Remove a effect from the effect chain */
    removeEffect(e) {

        let i = this.effectChain.indexOf(e)

        if(i == -1) return

        e.disconnect()

        this.effectChain.splice(i, 1)

        this.connectEffectChain()
    }









    /** Toggles the recording mode */
    toggleRecording() {

        if(!this.isRecording) this.startRecording()
        else this.stopRecording()
    }

    /** Will start recording  */
    startRecording() {

        this.isRecording = true

        console.log('START RECORDING')

        if(!this.recorder) this.recorder = new Tone.Recorder()

        Tone.Destination.connect(this.recorder)

        this.recorder.start()

        this.onRecordingStart.next()
    }

    stopRecording() {

        this.isRecording = false

        console.log('STOP RECORDING')

        window.setTimeout(async () => {

            const recording = await this.recorder.stop()

            this.onRecordingEnd.next()

            console.log('RECORDING', recording)

            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            anchor.download = "web-synth-recording.webm";
            anchor.href = url;
            anchor.click();

            Tone.Destination.disconnect(this.recorder)

        }, 0)
    }









    /** Keydown event */
    onKeyDown(e) {

console.log('onKeyDown: key', e.key)

        if(!e) return
        if(e.repeat) return

        if(e.key == 'ArrowRight') this.setOctave(this.octave + 1)
        if(e.key == 'ArrowLeft') this.setOctave(this.octave - 1)
        if(e.key == ' ') this.toggleRecording()

        for(let k of Keyboard.keys) {

            if(k.key === e.key || k.key === e.key.toLowerCase()) {

                k.trigger()
            }
        }
    }

    /** Keyup event */
    onKeyUp(e) {

        if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return

        for(let k of Keyboard.keys) {

            if(k.key === e.key || k.key === e.key.toLowerCase()) {

                k.release()
            }
        }
    }

    /** Resets the keyboard to standard settings */
    reset() {

        this.volume.gain.value = 1

        for(let ef of this.effectChain) {

            ef.disconnect()
            ef.dom.parentNode.removeChild(ef.dom)
        }

        this.effectChain = []

        // TODO - UPDATE DOM????
    }

    /** Disconnects everything and removes all event listeners */
    dispose() {

        document.removeEventListener('keydown', this.onKeyDown.bind(this), false)
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false)

        for(let key of Keyboard.keys) {

            // key.onTrigger.unsubscribe()
            // key.onRelease.unsubscribe()

            key.dispose()
        }
    }



    /** Load settings */
    serializeIn = o => {

        if(o['effectChain'] && o['effectChain'].length > 0) {

            for(let ef of o['effectChain']) {

                let e = Keyboard.getEffect(ef['name'])
                e.serializeIn(ef)
                this.addEffect(e)
            }
        }

        if(o['octave']) this.setOctave(o['octave'])
    }

    /** Save settings */
    serializeOut = () => {

        let effectChain = []
        for(let ef of this.effectChain) effectChain.push(ef.serializeOut())

        return {
            effectChain: effectChain,
            octave: this.octave
        }
    }
}