
import * as Tone from 'tone'

import * as RxJs from 'rxjs'

import { G } from './globals'
import { Delay } from './effects/delay'
import { Tremolo } from './effects/tremolo'
import { Reverb } from './effects/reverb'
import { Chorus } from './effects/chorus'
import { Distortion } from './effects/distortion'

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


        this.onTrigger = new RxJs.Subject()
        this.onRelease = new RxJs.Subject()

        this.dom.addEventListener('mousedown', this.trigger.bind(this), false)
        this.dom.addEventListener('mouseleave', this.release.bind(this), false)
        this.dom.addEventListener('mouseup', this.release.bind(this), false)

        this.updateText()
        this.transformDOM()
    }

    updateText() {

        this.dom.innerHTML = this.key.toUpperCase() + '</br>' + this.note + ' ' + this.octave
    }

    transformDOM() {

        let r = (Math.random() - .5) * 10 * this.octave
        this.dom.style.transform = 'rotate(' + r + 'deg) translateY(' + r / 2 + 'px)'
    }

    setOctave(o) {

        this.onRelease.next(this)

        this.octave = o

        this.transformDOM()
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
        // else if(name === 'chorus') return new Chorus()
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

        this.synth.triggerAttack(note + octave);
        this.activeNotes.push(note + octave)
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
        this.synth.connect(this.volume)

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

        this.isRecording = !this.isRecording

        if(this.isRecording) this.startRecording()
        else this.stopRecording()
    }

    /** Will start recording  */
    startRecording() {

        console.log('START RECORDING')

        if(!this.recorder) this.recorder = new Tone.Recorder()

        Tone.Destination.connect(this.recorder)

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

            Tone.Destination.disconnect(this.recorder)

        }, 0)
    }









    /** Keydown event */
    onKeyDown(e) {

console.log('onKeyDown: key', e.key)

        if(!e) return
        if(e.repeat) return

        if(e.key == 'ArrowRight') return this.setOctave(this.octave + 1)
        if(e.key == 'ArrowLeft') return this.setOctave(this.octave - 1)

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