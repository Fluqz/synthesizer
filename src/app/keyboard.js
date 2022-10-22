
import * as Tone from 'tone'

import * as RxJs from 'rxjs'

import { Key } from './key'

import { G } from './core/globals'

import { Delay } from './nodes/effects/delay'
import { Tremolo } from './nodes/effects/tremolo'
import { Reverb } from './nodes/effects/reverb'
import { Chorus } from './nodes/effects/chorus'
import { Distortion } from './nodes/effects/distortion'
import { Oscillator } from './nodes/source/oscillator'
import { Synth } from './nodes/source/synth'
import { Track } from './track'
import { DuoSynth } from './nodes/source/duo-synth'

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
        Synth: Tone.Synth,
        FMSynth: Tone.FMSynth,
        DuoSynth: Tone.DuoSynth,
        MembraneSynth: Tone.MembraneSynth,
    }

    static nodes = {
        effects: {

            delay: () => { return new Delay(1, .12, .8) },
            tremolo: () => { return new Tremolo(1, 5, 1) },
            distortion: () => { return new Distortion(1, .5) },
            chorus: () => { return new Chorus(1, 4, 20, 1, 1) },
        },
        source: {

            oscillator: () => { return new Oscillator() },
            synth: () => { return new Synth() },
            duosynth: () => { return new DuoSynth() },
        }
    }

    /** Array of created Key objects */
    static keys = []
    /** Octave number */
    octave
    /** Master volume node */
    volume
    /** ToneJs Gain Node as Master Gain */
    gain
    /** Arpeggiator Tone.Pattern */
    arp
    /** Arpeggiator array */
    arpPattern = []
    /** Arpeggiator mode */
    arpMode = false
    /** Presets */
    presets
    /** Beats per minute */
    bpm = 400

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
    onSavePreset
    onRemovePreset
    onAddNode
    onRemoveNode


    constructor(dom, octave) {

        this.dom = dom

        this.octave = octave ? octave : 2

        this.volume = .7

        this.gain = new Tone.Gain(this.volume)
        this.gain.toDestination()

        this.presets = []
        Keyboard.activeNotes = []

        this.isRecording = false

        this.tracks = []
        // this.addTrack()
        // this.addTrack()
        // this.addTrack(new Track(Keyboard.nodes.source.oscillator()))
        this.addTrack(new Track(Keyboard.nodes.source.duosynth()))
        // this.addTrack(new Track(Keyboard.nodes.oscillator()))


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

                this.triggerNote(k.note, k.octave)
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

        this.onSavePreset = new RxJs.Subject()
        this.onRemovePreset = new RxJs.Subject()

        this.onAddNode = new RxJs.Subject()
        this.onRemoveNode = new RxJs.Subject()
    }



    /** Set Master Volume */
    setVolume(v) {

        this.volume = v
        this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)
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

    /** Add a instrument to the keyboard. */
    addTrack(track, instrument) {

        this.stopAll()

        if(track == undefined) track = new Track(instrument)
        
        if(this.tracks.indexOf(track) == -1) this.tracks.push(track)

        track.connect(this.gain)

        let cont = document.querySelector('#tracks')

        for(let track of this.tracks)
            cont.append(track.dom)
    }

    removeTrack(track) {

        this.tracks.splice(this.tracks.indexOf(track), 1)

        track.disconnect(this.gain)

        track.dom.parentNode.removeChild(track.dom)

        track.destroy()
    }

    /** Trigger note */
    triggerNote(note, octave) {

        Keyboard.activeNotes.push(note + octave)

        console.log('Keyboard.trigger', Keyboard.activeNotes)

        if(this.arpMode) {

            this.setArpSequence(Keyboard.activeNotes, (time, note, length) => {

                for(let tr of this.tracks) tr.instrument.triggerNote(note, time)

            }, () => {

                for(let tr of this.tracks) tr.instrument.releaseNote(note)

            })
        }
        else 
            for(let tr of this.tracks) tr.instrument.triggerNote(note + octave)
    }

    /** Release note */
    releaseNote(note, octave) {

        Keyboard.activeNotes.splice(Keyboard.activeNotes.indexOf(note + octave), 1)

        if(this.arpMode) {
            
            this.setArpSequence(Keyboard.activeNotes, (time, note, length) => {

                for(let tr of this.tracks) tr.instrument.triggerNote(note, time)

            }, () => {

                for(let tr of this.tracks) tr.instrument.releaseNote(note)

            })
        }
        else for(let tr of this.tracks) tr.instrument.releaseNote(note + octave)
    }

    /** Will release all triggered notes that are stored in [activeNotes] */
    stopAll() {

        for(let an of Keyboard.activeNotes) this.releaseNote(an)
    }



    toggleArpMode(m) {

        this.arpMode = m == undefined ? !this.arpMode : m

        this.setArpSequence([])

        Tone.Transport.stop()

        console.log('ARP', this.arpMode)
    }

    setArpSequence(sequence, onTrigger, onRelease) {

        console.log('Set ARP', sequence)

        const length = 60 / this.bpm

        this.stopArpeggiator(onRelease)

        if(!sequence || sequence.length == 0) return

        this.arp = new Tone.Pattern((time, note) => {

            if(onTrigger) onTrigger(time, note, time * length)

        }, sequence)

        this.arp.interval = length
        this.arp.start()
        Tone.Transport.bpm.setValueAtTime(this.bpm, Tone.context.currentTime)
        Tone.Transport.start()
    }

    stopArpeggiator(onRelease) {

        if(this.arp) {
            this.arp.stop()
            this.arp.cancel()
            this.arp.dispose()
        }

        if(onRelease) onRelease()
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

    /** Will stop recording and download the webm file  */
    stopRecording() {

        this.isRecording = false

        console.log('STOP RECORDING')

        window.setTimeout(async () => {

            const recording = await this.recorder.stop()

            this.onRecordingEnd.next()

            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            anchor.download = "web-synth-recording.webm";
            anchor.href = url;
            anchor.click();

            Tone.Destination.disconnect(this.recorder)

        }, 0)
    }








    isRunning = false
    /** Keydown event */
    onKeyDown(e) {

        if(!e) return
        if(e.repeat) return

        if(this.isRunning == false) {
            Tone.start()
            this.isRunning = true
        }

        // console.log('onKeyDown: key', e.key)

        if(e.key == 'ArrowRight') this.setOctave(this.octave + 1)
        if(e.key == 'ArrowLeft') this.setOctave(this.octave - 1)
        if(e.key == ' ') this.toggleRecording()

        for(let k of Keyboard.keys) {

            if(k.mapping === e.key || k.mapping === e.key.toLowerCase()) {

                k.trigger()
            }
        }
    }

    /** Keyup event */
    onKeyUp(e) {

        if(G.debug) console.log('keyUp: key', e.key)

        if(!e) return

        for(let k of Keyboard.keys) {

            if(k.mapping === e.key || k.mapping === e.key.toLowerCase()) {

                k.release()
            }
        }
    }

    /** Resets the keyboard to standard settings */
    reset() {

        this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)

        for(let n of Keyboard.activeNotes) this.releaseNote(n)
        Keyboard.activeNotes = []

        for(let t of this.tracks) 
            this.removeTrack(t)

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

    presetID = 0
    savePreset(name) {

        for(let p of this.presets) { if(p.name === name) return }

        const p = this.getSessionObject()
        p.id = this.presetID + 1,
        p.name = name
        this.presets.push(p)

        this.onSavePreset.next(this.presets[this.presets.length-1])
    }

    loadPreset(name) {

        let preset
        for(let p of this.presets) {

            if(p.name == name) { 
                preset = p
                break
            }
        }

        if(!preset) return

        this.serializeIn({
            currentSession: preset,
            presets: this.presets
        })
    }

    removePreset(name) {

        if(!name) return

        for(let i = 0; i < this.presets.length; i++) {

            if(name && this.presets[i].name == name) {
                this.onRemovePreset.next(this.presets[i])
                this.presets.splice(i, 1)
            }
        }
    }

    getSessionObject() {

        let tracks = []
        for(let t of this.tracks) tracks.push(t.serializeOut())

        return {
            volume: this.volume,
            octave: this.octave,
            tracks: tracks
        }
    }

    /** Load settings */
    serializeIn = o => {

        console.log('SerializeIn', o)

        this.reset()

        const c = o['currentSession']

        if(c['volume']) this.setVolume(c['volume'])
        if(c['octave']) this.setOctave(c['octave'])

        if(c['synth']) this.setSynth(c['synth'])

        if(c['tracks'] && c['tracks'].length > 0) {

            for(let t of c['tracks']) {

                let track = new Track()
                track.serializeIn(t)
                this.addTrack(track)
            }
        }

        if(o['presets'] && o['presets'].length > 0) {

            this.presets = o['presets']
        }
    }

    /** Save settings */
    serializeOut = () => {
        
        return {
            presets: this.presets,
            currentSession: this.getSessionObject()
        }
    }
}