import * as Tone from 'tone'
import { Synthesizer, type ISerialization, type ISerialize, type Channel } from "./synthesizer"
import { Node, type INodeSerialization } from './nodes/node'
import type { Instrument } from './nodes'
import { writable, type Writable } from 'svelte/store'

export interface ITrackSerialization extends ISerialization {

    enabled: boolean

    channel: number
    octave: number
    volume: number
    instrument: INodeSerialization
    nodes: INodeSerialization[]

    isMuted: boolean
    soloEnabled: boolean
    hold: {
        enabled: HoldMode
        activeKeys: string[]
    }

    isCollapsed: boolean
}

export type HoldMode = 'OFF' | 'PLAY' | 'HOLD'

export class Track implements ISerialize {

    /** Track count */
    static count: number = 0

    /** Track UID */
    public id: number

    /** Synthesizer instance */
    public synthesizer: Synthesizer

    /** ToneJs Volume Node used for the track */
    public volumeNode: Tone.Volume

    /** Volume property */
    private _volume: number

    /** Overwriting Synthesizer's octave */
    public octave: number

    /** Channel number to port to */
    public channel: Channel

    /** Instrument used */
    public instrument: Instrument

    /** Array of added nodes. Nodes are chained in array order  */
    public nodes: Node[]

    /** Mute this track */
    public isMuted: boolean

    /** Mute this track */
    public soloEnabled: boolean

    /** When enabled, the current instrument with current note/chord is played endlessly. */
    private _hold: HoldMode

    /** Allow arpegiator to play this tracks instrument. */
    public arpEnabled: boolean

    /** Map to keep track of all active/triggered notes. */
    public activeNotes: Set<Tone.Unit.Frequency> = new Set()


    constructor(synthesizer: Synthesizer, instrument?: Instrument) {

        this.id = Track.count++

        this.synthesizer = synthesizer

        this._volume = -3
        this.nodes = []
        this.instrument = instrument
        this.volumeNode = new Tone.Volume(this._volume)
        this.isMuted = false
        this.soloEnabled = false
        this.channel = synthesizer.channel
        this._hold = 'OFF'

        if(instrument) {

            this.setInstrument(instrument)
            this.connectNodes()
        }

        // this.addNode(Synthesizer.nodes.effects.Reverb())
        // this.addNode(Synthesizer.nodes.effects.Delay())
        // this.addNode(Synthesizer.nodes.effects.AutoFilter())
        // this.addNode(Synthesizer.nodes.effects.Phaser())
        // this.addNode(Synthesizer.nodes.effects.Chorus())
        // this.addNode(Synthesizer.nodes.effects.Distortion())
        // this.addNode(Synthesizer.nodes.effects.Tremolo())
        // this.addNode(Synthesizer.nodes.effects.Vibrato())
    }

    /** Get the track count/order number */
    get number() { return this.synthesizer ? this.synthesizer.tracks.indexOf(this) + 1 : -1 }

    /** Sets the tracks source instrument and connects them in chain. 
     * Instrument will always be the first element in the chain */
    setInstrument(instrument: Instrument) {

        if(this.instrument && this.instrument != instrument) {

            this.releaseNotes()

            this.instrument.disconnect()
            this.instrument.destroy()
        }

        this.instrument = instrument
        this.connectNodes()
    }

    /** VolumeNode value */
    get volume() { return this._volume }
    set volume(db: number) { 

        this._volume = db

        this.volumeNode.volume.exponentialRampTo(this._volume, .04, Tone.now())
    }

    /** Silences/Unsilences the track volume */
    mute(m: boolean) {

        this.isMuted = m === true ? true : false

        if(this.isMuted) this.volumeNode.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .15, Tone.now())
        else this.volumeNode.volume.exponentialRampTo(this._volume, .15, Tone.now())
    }

    /** Activates solo mode. Only tracks in solo mode can be heard. */
    solo(s: boolean) {

        this.soloEnabled = s === true ? true : false

        if(this.soloEnabled) {

            // Set volume
            this.volumeNode.volume.exponentialRampTo(this._volume, .15, Tone.now())

            for(let t of this.synthesizer.tracks) {

                // Ignore self
                if(t === this) continue
                // Ignore others in solo mode
                else if(t.soloEnabled) continue
                // Silence every other track
                else t.volumeNode.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .2, Tone.now())
            }
        }
        else {

            // Any track left in solo mode? then only change self volume back to normal
            let staySoloMode:boolean = false
            for(let t of this.synthesizer.tracks) {

                if(t.soloEnabled) staySoloMode = true
            }

            // Any track left in solo mode? then only change self volume back to normal
            if(staySoloMode) {

                // Set volume
                this.volumeNode.volume.exponentialRampTo(this._volume, .2, Tone.now())

            }
            else {

                // Unsilence every track
                for(let t of this.synthesizer.tracks) {

                    t.volumeNode.volume.exponentialRampTo(t._volume, .2, Tone.now())
                }
            }
        }
    }

    /** Set Hold state of this track.
     * Hold has three states. PLAY, HOLD, OFF
     * PLAY: While 'PLAY' is active, all notes that are played will be triggered but not released.
     * HOLD: While 'HOLD' is active, new notes wont be triggered, but active notes will play endlessly.
     * OFF: All active notes will be released and nothing will be triggered. Its off
     */
    get hold() { return this._hold }
    set hold(hold: HoldMode) { 

        this._hold = hold

        if(hold == 'PLAY') {


        }
        else if(hold == 'HOLD') {

        }
        else { // OFF

            this.releaseNotes()
        }
    }

    /** Set this track's channel number. Needs to release all triggered notes. */
    setChannel(c: Channel) {

        this.channel = c

        this.releaseNotes()
    }

    /** Releases all triggered notes */
    releaseNotes() {

        for(let n of this.activeNotes) this.triggerRelease(n, Tone.now())

        this.instrument.releaseAll()
    }

    /** Triggers the instruments note */
    triggerAttack(note: Tone.Unit.Frequency, time: Tone.Unit.Time, velocity: number = 1) {

        // Prevent triggering while in HOLD Mode. Held sounds are already set 
        if(this.hold == 'HOLD') return

        // Cant keep track of notes. Also will stay in this octave only! Need to check (synth.octave - note.octave) + this.octave
        // if(this.octave != undefined) note = note.replace(/[0-9]/g, '') + this.octave

        
        this.activeNotes.add(note)

        this.instrument.triggerAttack(note, time, velocity)
    }

    /** Triggers the instruments note */
    triggerAttackRelease(note: Tone.Unit.Frequency, duration: Tone.Unit.Time, time: Tone.Unit.Time, velocity:number = 1): void {

        // Prevent triggering while in HOLD Mode. Held sounds are already set 
        // if(this.hold == 'HOLD') return
        
        this.activeNotes.add(note)

        const n = note
        Tone.Transport.scheduleOnce((t) => {

            Synthesizer.activeNotes.delete(n)

        }, time)
        // }, Tone.Time(time).toSeconds() + Tone.Time(duration).toSeconds())

        this.instrument.triggerAttackRelease(note, duration, time, velocity)
    }


    /** Stops the instruments note */
    triggerRelease(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        // Prevent triggering while in HOLD Mode. Held sounds are already set 
        if(this.hold == 'HOLD' || this.hold == 'PLAY') return

        // if(this.octave != undefined) note = note.replace(/[0-9]/g, '') + this.octave

        this.activeNotes.delete(note)

        this.instrument.triggerRelease(note, time)
    }

    /** Adds a node to the node chain */
    addNode(n: Node) {

        this.nodes.push(n)

        n.onDelete.subscribe(this.removeNode.bind(this))

        this.connectNodes()
    }

    /** Connects all nodes in a chain */
    connectNodes() {

        if(this.instrument) {

            this.instrument.disconnect()

            // console.log('Connect Nodes', this.id)

            const nodes = []

            for(let n of this.nodes) {

                n.disconnect()

                nodes.push(n)
            }

            nodes.push(this.volumeNode)


            this.instrument.chain(nodes)
        }
    }

    /** Remove a node from the node chain */
    removeNode(n: Node) {

        let i = this.nodes.indexOf(n)

        if(i == -1) return

        n.disconnect()

        this.nodes.splice(i, 1)

        n.destroy()
        
        this.connectNodes()
    }

    /** Move a node forward by one in the array. */
    shiftNodeForward(node: Node) {

        let i = this.nodes.indexOf(node)

        if(i <= 0) return

        let dNode: Node = this.nodes.splice(i, 1)[0]
        this.nodes.splice(i - 1, 0, dNode)
    }

    /** Move a node backward by one in the array. */
    shiftNodeBackward(node: Node) {

        let i = this.nodes.indexOf(node)

        if(i > this.nodes.length) return

        this.nodes.splice(i, 1)
        this.nodes.splice(i + 1, null, node)
    }


    /** Connect the output gain node to passed in output */
    connect(i: Node | Tone.ToneAudioNode) {
        
        this.volumeNode.connect(i instanceof Node ? i.input : i)
    }

    /** Disconnects the output gain node from passed in output */
    disconnect(i: Node | Tone.ToneAudioNode) {
        
        this.volumeNode.disconnect(i instanceof Node ? i.input : i)
    }

    /** Destroy this track. */
    destroy() {

        this.releaseNotes()

        for(let i = this.nodes.length; i >= 0; i--) this.removeNode(this.nodes[i])

        if(this.instrument) this.instrument.destroy()
    }

    serializeIn(o: ITrackSerialization) {

        // if(o.name) this.name = o.name
        if(o.volume != undefined) this.volume = o.volume
        if(o.octave != undefined) this.octave = o.octave
        if(o.channel != undefined) this.channel = o.channel as Channel

        // if(o.enabled) this.enabled = o.enabled

        // if(o.arpeggiatorEnabled) this.arpeggiatorEnabled = o.arpeggiatorEnabled

        if(o.instrument) {

            let instrument: Instrument = Synthesizer.createNode(o.instrument.name) as Instrument
            instrument.serializeIn(o.instrument)
            this.setInstrument(instrument)
        }
        
        // if(o.isCollapsed) this.isCollapsed = o.isCollapsed

        if(o.nodes && o.nodes.length > 0) {

            for(let i = this.nodes.length; i >= 0; i--) this.removeNode(this.nodes[i])

            this.nodes.length = 0
            
            for(let n of o.nodes) {

                let node: Node = Synthesizer.createNode(n.name)

                if(!node) { console.error('Track Serialize Node Error: Node is undefined. Node.name no match.'); continue}

                node.serializeIn(n)
                this.addNode(node)
            }
        }

        if(o.isMuted) this.mute(o.isMuted)
        if(o.soloEnabled) this.solo(o.soloEnabled)
        if(o.hold) {

            this.hold = o.hold.enabled
            
            if(this.hold != 'OFF') {

                this.hold = 'PLAY'

                for(let k of o.hold.activeKeys) {

                    this.triggerAttack(k, Tone.now())
                }

                this.hold = 'HOLD'
            }
        }
    }

    serializeOut() : ITrackSerialization {

        let nodes: INodeSerialization[] = []
        for(let n of this.nodes) nodes.push(n.serializeOut())

        return {

            // name: this.name,
            enabled: true,

            octave: this.octave,
            channel: this.channel,

            volume: this.volume,
            instrument: this.instrument == null ? undefined : this.instrument.serializeOut(),
            nodes: nodes,

            soloEnabled: this.soloEnabled,
            hold: {
                enabled: this.hold,
                activeKeys: Array.from(this.activeNotes as Iterable<string>)
            },
            isMuted: this.isMuted,

            isCollapsed: false,
        }
    }
}