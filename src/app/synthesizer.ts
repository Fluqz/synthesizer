
import * as Tone from 'tone'

import * as RxJs from 'rxjs'

import { Key } from './key'

import { Synth, DuoSynth, Instrument, FMSynth, AMSynth, Delay, Tremolo, Reverb, Chorus, Distortion, Oscillator, Effect} from './nodes'

import { Track, type ITrackSerialization } from './track'
import { PresetManager, type IPreset } from './core/preset-manager'

export interface ISerialize {

    serializeOut: () => ISerialization
    serializeIn: (o: ISerialization) => void
}

export interface ISerialization {}

export interface ISession {

    volume: number,
    octave: number,
    tracks: ITrackSerialization[]
}

export interface ISynthesizerSerialization extends ISerialization {

    presets: IPreset[]
    currentSession: ISession
}




/** Synthesizer */
export class Synthesizer implements ISerialize {

    /** Array of keys on the synthesizer */
    static keyMap: string[] = [
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
    static notes: string[] = [
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
    static activeNotes: string[] = []

    static nodes = {
        effects: {

            Delay: () => { return new Delay(1, .12, .8) },
            Tremolo: () => { return new Tremolo(1, 5, 1) },
            Distortion: () => { return new Distortion(1, .5) },
            Chorus: () => { return new Chorus(1, 4, 20, 1, 1) },
        },
        sources: {
	
            FMSynth: () => { return new FMSynth() },
            AMSynth: () => { return new AMSynth() },
            MonoSynth: () => {},
            MetalSynth:	() => {},
            Oscillator: () => { return new Oscillator() },
            Synth: () => { return new Synth() },
            DuoSynth: () => { return new DuoSynth() },
        }
    }

    static createNode(name: string) {

        if(Synthesizer.nodes.sources[name]) return Synthesizer.nodes.sources[name]() as Instrument
        if(Synthesizer.nodes.effects[name]) return Synthesizer.nodes.effects[name]() as Effect
        return null
    }

    /** Array of created Key objects */
    static keys: Key[] = []
    
    /** Octave number */
    octave: number
    /** Master volume node */
    volume: number
    /** ToneJs Gain Node as Master Gain */
    gain: Tone.Gain
    /** Arpeggiator Tone.Pattern */
    arp: Tone.Pattern<string>
    /** Arpeggiator array */
    arpPattern: string[] = []
    /** Arpeggiator mode */
    arpMode: boolean = false
    /** Beats per minute */
    bpm: number = 400
    
    tracks: Track[]


    /** ToneJs Recorder instance */
    recorder: Tone.Recorder
    /** Recording flag */
    isRecording: boolean

    presetManager: PresetManager

    // Events
    onKeyDownEvent
    onKeyUpEvent
    onRecordingStart
    onRecordingEnd
    onAddNode
    onRemoveNode


    constructor() {

        // Synthesizer Volume
        this.volume = .5
        this.octave = 2
        
        this.gain = new Tone.Gain(this.volume)
        this.gain.toDestination()

        this.isRecording = false

        let key
        let i = 0
        for(let keyMap of Synthesizer.keyMap) {

            key = new Key(
                Synthesizer.notes[i % Synthesizer.notes.length], 
                this.octave + Math.floor(i / Synthesizer.notes.length),
                keyMap
            )

            Synthesizer.keys.push(key)

            key.onTrigger.subscribe(k => {

                this.triggerNote(k.note, k.octave)
            })

            key.onRelease.subscribe(k => {

                this.releaseNote(k.note, k.octave)
            })

            i++
        }


        this.tracks = []
        this.addTrack(new Track(this, Synthesizer.nodes.sources.Oscillator()))
        // this.addTrack(new Track(this, Synthesizer.nodes.sources.Synth()))
        this.addTrack(new Track(this, Synthesizer.nodes.sources.DuoSynth()))
        // this.addTrack(new Track(this, Synthesizer.nodes.sources.FMSynth()))
        // this.addTrack(new Track(this, Synthesizer.nodes.sources.AMSynth()))

        // this.addTrack(new Track(this, Synthesizer.nodes.sources.FMSynth()))

        this.presetManager = new PresetManager(this)


        // Events
        this.onRecordingStart = new RxJs.Subject()
        this.onRecordingEnd = new RxJs.Subject()

        this.onAddNode = new RxJs.Subject()
        this.onRemoveNode = new RxJs.Subject()
    }

    /** Set Master Volume */
    setVolume(v) {

        this.volume = v
        this.gain.gain.setValueAtTime(this.volume, Tone.now())
    }

    /** Set the octave number */
    setOctave(o) {

        this.octave = o


        let i = 0
        for(let k of Synthesizer.keys) {

            k.setOctave(this.octave + Math.floor(i / Synthesizer.notes.length))

            i++
        }
    }

    /** Add a instrument to the synthesizer. */
    addTrack(track: Track) {

        this.stopAll()
        
        if(this.tracks.indexOf(track) == -1) this.tracks.push(track)
        
        track.connect(this.gain)

        console.log('ADD TRACK', this.tracks.length)
    }

    removeTrack(track: Track) {

        this.stopAll()

        this.tracks.splice(this.tracks.indexOf(track), 1)

        track.disconnect(this.gain)

        track.destroy()
    }

    isRunning = false


    /** Trigger note */
    triggerNote(note, octave) {

        if(this.isRunning == false) {
            Tone.start()
            this.isRunning = true
        }

        Synthesizer.activeNotes.push(note + octave)

        // console.log('Synthesizer.trigger', Synthesizer.activeNotes)

        if(this.arpMode) {

            this.setArpChord(Synthesizer.activeNotes, (time, note) => {

                for(let tr of this.tracks) tr.triggerNote(note)

            }, () => {

                for(let tr of this.tracks) tr.releaseNote(note)

            })
        }
        else 
            for(let tr of this.tracks) tr.triggerNote(note + octave)
    }

    /** Release note */
    releaseNote(note:string, octave?:number) {

        Synthesizer.activeNotes.splice(Synthesizer.activeNotes.indexOf(note + octave), 1)

        if(this.arpMode) {
            
            this.setArpChord(Synthesizer.activeNotes, (time, note, length) => {

                for(let tr of this.tracks) tr.triggerNote(note)

            }, () => {

                for(let tr of this.tracks) tr.releaseNote(note)

            })
        }
        else for(let tr of this.tracks) tr.releaseNote(note + octave)
    }

    /** Will release all triggered notes that are stored in [activeNotes] */
    stopAll() {

        for(let i = Synthesizer.activeNotes.length-1; i >= 0; i--) this.releaseNote(Synthesizer.activeNotes[i])
    }



    toggleArpMode(m) {

        this.arpMode = m == undefined ? !this.arpMode : m

        this.setArpChord([])

        Tone.Transport.stop()

        console.log('ARP', this.arpMode)
    }

    setArpChord(chord: string[], onTrigger?: (...args) => void, onRelease?: (...args) => void) {

        console.log('Set ARP', chord)

        const length = 60 / this.bpm

        this.stopArpeggiator(onRelease)

        if(!chord || chord.length == 0) return
        
        this.arp = new Tone.Pattern((time, note) => {

            if(onTrigger) onTrigger(time, note, length)

        }, chord)

        this.arp.interval = length
        this.arp.start()
        Tone.Transport.bpm.setValueAtTime(this.bpm, Tone.now())
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









    /** Resets the synthesizer to standard settings */
    reset() {

        this.setVolume(.5)
        this.setOctave(2)

        this.stopAll()

        for(let t of this.tracks) t.destroy()

        this.tracks = []
    }

    /** Disconnects everything and removes all event listeners */
    dispose() {

        for(let key of Synthesizer.keys) {

            key.dispose()
        }
    }

    /** Get the current session as js object */
    getSessionObject() : ISession {

        let tracks: ITrackSerialization[] = []
        for(let t of this.tracks) tracks.push(t.serializeOut())

        return {
            volume: this.volume,
            octave: this.octave,
            tracks: tracks
        }
    }

    loadSessionObject(o: ISession) {

        if(o.volume) this.setVolume(o.volume)
        if(o.octave) this.setOctave(o.octave)

        console.log('tracks', this.tracks, this.tracks.length)
        for(let i = this.tracks.length-1; i >= 0; i--) this.removeTrack(this.tracks[i])

        this.tracks.length = 0
        if(o.tracks && o.tracks.length > 0) {

            for(let t of o.tracks) {

                let track = new Track(this)
                track.serializeIn(t)
                this.addTrack(track)
            }
        }
    }

    /** Load settings */
    serializeIn = (o: ISynthesizerSerialization) => {

        console.log('SerializeIn', o)

        const c = o.currentSession

        if(c) this.loadSessionObject(c)

        if(o.presets && o.presets.length > 0) {

            this.presetManager.presets = o.presets
        }

        console.log('SerializeIn', this)
    }

    /** Save settings */
    serializeOut = () : ISynthesizerSerialization => {
        
        return {

            presets: this.presetManager.presets,
            currentSession: this.getSessionObject()
        }
    }
}