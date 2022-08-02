
import * as Tone from 'tone'

import * as RxJs from 'rxjs'

import { G } from './globals'

/** Represents a single Key on a Keyboard */
export class Key {

    /** Note string of this Key */
    note
    /** Octave of this Key */
    octave
    /** Keyboard mapping  */
    key
    /** Key DOM element */
    dom

    onTrigger
    onRelease

    constructor(note, octave, key) {

        this.note = note
        this.octave = octave
        this.key = key
        this.dom = document.createElement('div')
        this.dom.classList.add('key')
        if(this.note[1] == '#' | this.note[1] === 'b') this.dom.classList.add('black')

        this.updateText()

        this.onTrigger = new RxJs.Subject()
        this.onRelease = new RxJs.Subject()

        this.dom.addEventListener('mousedown', this.trigger.bind(this), false)
        this.dom.addEventListener('mouseleave', this.release.bind(this), false)
        this.dom.addEventListener('mouseup', this.release.bind(this), false)
    }

    updateText() {

        this.dom.innerHTML = this.key.toUpperCase() + '</br>' + this.note + ' ' + this.octave
    }

    /** On Key down */
    trigger() {

        if(G.debug) console.log(`Trigger | key: ${this.key} note: ${this.note} octave: ${this.octave}`)

        this.dom.classList.add('pressed')

        this.onTrigger.next(this)
    }

    /** On Key up */
    release() {

        if(G.debug) console.log(`Release | key: ${this.key} note: ${this.note} octave: ${this.octave}`)

        this.dom.classList.remove('pressed')

        this.onRelease.next(this)
    }

    dispose() {

        this.dom.removeEventListener('mousedown', this.trigger.bind(this), false)
        this.dom.removeEventListener('mouseleave', this.release.bind(this), false)
        this.dom.removeEventListener('mouseup', this.release.bind(this), false)

        this.onTrigger.complete()
        this.onTrigger.complete()
    }
}

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

    static synths = {
        synth: Tone.Synth,
        FMSynth: Tone.FMSynth,
        DuoSynth: Tone.DuoSynth,
        MembraneSynth: Tone.MembraneSynth,
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

    constructor(dom, octave) {

        this.dom = dom

        this.octave = octave ? octave : 2

        this.arp = false

        this.isRecording = false

        this.synth = new Tone.PolySynth(Keyboard.synths.DuoSynth)
        this.synth.toDestination()

        // Delay
        // this.delayTime = .3
        // this.delayFeedback= .8
        // this.delay = new Tone.FeedbackDelay(this.delayTime, this.delayFeedback).toDestination()
        // this.synth.connect(this.delay).toDestination()
        // this.setDelay(this.delayEnabled)

        // let d = new Tone.FeedbackDelay(2, 1).toDestination()
        // this.synth.connect(d).toDestination()

        // Chorus
        // this.chorusEnabled = false
        // this.chorusFrequency = 4
        // this.chorusDelayTime = 2.5
        // this.chorusDepth = .5
        // this.chorus = new Tone.Chorus(this.chorusFrequency, this.chorusDelayTime, this.chorusDepth).toDestination().start()
        // this.synth.connect(this.chorus).toDestination()
        // this.setChorus(this.chorusEnabled)

        // Tremolo
        // this.tremoloEnabled = false
        // this.tremoloFrequency = 5
        // this.tremoloDepth = 1
        // this.tremolo = new Tone.Tremolo(this.tremoloFrequency, this.tremoloDepth).toDestination().start()
        // this.synth.connect(this.tremolo).toDestination()
        // this.setTremolo(this.tremoloEnabled)


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
    }

    setSynth(synth) {

    }

    toggleArpMode(m) {

    }

    // setDelay(enabled, time, feedback) {

    //     if(enabled == false) this.delay.disconnect()
    //     else {

    //         this.delay.delayTime.set(time ? time : this.delayTime)
    //         this.delay.feedback.set(feedback ? feedback : this.delayFeedback)

    //         this.delay.toDestination()
    //     }
    // }

    // setChorus(enabled, frequency, delayTime, depth) {

    //     if(enabled == false) this.chorus.disconnect()
    //     else {

    //         this.chorus.frequency.set(frequency ? frequency : this.chorusFrequency)
    //         // this.chorus.delayTime.setValueAtTime(delayTime ? delayTime : this.chorusdelayTime)
    //         this.chorus.depth.set(depth ? depth : this.chorusDepth)

    //         this.chorus.toDestination().start()
    //     }
    // }

    // setTremolo(enabled, frequency, depth) {

    //     if(enabled == false) this.tremolo.disconnect()
    //     else {

    //         this.tremolo.frequency.set(frequency ? frequency : this.tremoloFrequency)
    //         this.tremolo.depth.set(depth ? depth : this.tremoloDepth)

    //         this.tremolo.toDestination().start()
    //     }
    // }

    /** Set the octave number */
    setOctave(o) {

        this.octave = o

        let i = 0
        for(let k of Keyboard.keys) {

            k.octave = this.octave + Math.floor(i / Keyboard.notes.length)
            k.updateText()

            i++
        }
    }

    /** Trigger note */
    playNote(note, octave) {

        this.synth.triggerAttack(note + octave);

    }

    /** Release note */
    releaseNote(note, octave) {

        this.synth.triggerRelease(note + octave);
    }



    toggleRecording() {

        this.isRecording = !this.isRecording

        if(this.isRecording) this.startRecording()
        else this.stopRecording()
    }

    startRecording() {

        console.log('START RECORDING')

        if(!this.recorder) this.recorder = new Tone.Recorder()

        this.synth.connect(this.recorder)

        this.recorder.start()
    }

    stopRecording() {

        console.log('STOP RECORDING')

        window.setTimeout(async () => {

            const recording = await this.recorder.stop()

            console.log('RECORDING', recording)

            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            anchor.download = "recording.webm";
            anchor.href = url;
            anchor.click();

            this.synth.disconnect(this.recorder)

        }, 0)
    }









    /** Keydown event */
    onKeyDown(e) {

        if(G.debug) console.log('onKeyDown: key', e.key)

        if(!e) return
        if(e.repeat) return

        if(e.key == 'ArrowRight') this.setOctave(this.octave + 1)
        if(e.key == 'ArrowLeft') this.setOctave(this.octave - 1)

        for(let k of Keyboard.keys) {

            if(k.key === e.key) {

                k.trigger()
            }
        }
    }

    /** Keyup event */
    onKeyUp(e) {

        if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return

        for(let k of Keyboard.keys) {

            if(k.key === e.key) {

                k.release()
            }
        }
    }

    dispose() {

        document.removeEventListener('keydown', this.onKeyDown.bind(this), false)
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false)

        for(let key of Keyboard.keys) {

            // key.onTrigger.unsubscribe()
            // key.onRelease.unsubscribe()

            key.dispose()
        }
    }
}