import * as Tone from 'tone'
import { Synthesizer, type ISerialization, type ISerialize } from "./synthesizer"
import { Node, type INodeSerialization } from './nodes/node'
import type { Instrument } from './nodes'

export interface ITrackSerialization extends ISerialization {

    muted: boolean
    volume: number
    instrument: INodeSerialization
    nodes: INodeSerialization[]
}

export class Track implements ISerialize {

    static count: number = 0

    public id: number

    public synthesizer: Synthesizer

    /** ToneJs Volume Node used for the track */
    public volumeNode: Tone.Volume

    /** Volume property */
    private _volume: number

    /** Overwriting Synthesizer's octave */
    private octave: number

    /** Instrument used */
    public instrument: Instrument

    /** Array of added nodes. Nodes are chained in array order  */
    public nodes: Node[]

    /** Mute this track */
    public isMuted: boolean

    /** Mute this track */
    public isSolo: boolean

    /** When enabled, the current instrument with current note/chord is played endlessly. */
    private _holdEnabled: boolean

    /** Allow arpegiator to play this tracks instrument. */
    public arpEnabled: boolean

    constructor(synthesizer: Synthesizer, instrument?: Instrument) {

        this.id = Track.count++

        this.synthesizer = synthesizer

        this._volume = -3
        this.nodes = []
        this.instrument = instrument
        this.volumeNode = new Tone.Volume(this._volume)
        this.isMuted = false
        this.isSolo = false
        this._holdEnabled = false

        if(instrument) {

            this.setInstrument(instrument)
            this.connectNodes()
        }

        this.addNode(Synthesizer.nodes.effects.AutoFilter())
        this.addNode(Synthesizer.nodes.effects.Reverb())
        this.addNode(Synthesizer.nodes.effects.Delay())
        this.addNode(Synthesizer.nodes.effects.Phaser())
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

        console.log('mute track', m)

        this.isMuted = m === true ? true : false

        if(this.isMuted) this.volumeNode.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .15, Tone.now())
        else this.volumeNode.volume.exponentialRampTo(this._volume, .15, Tone.now())
    }

    /** Activates solo mode. Only tracks in solo mode can be heard. */
    solo(s: boolean) {

        this.isSolo = s === true ? true : false

        if(this.isSolo) {

            // Set volume
            this.volumeNode.volume.exponentialRampTo(this._volume, .15, Tone.now())

            for(let t of this.synthesizer.tracks) {

                // Ignore self
                if(t === this) continue
                // Ignore others in solo mode
                else if(t.isSolo) continue
                // Silence every other track
                else t.volumeNode.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .2, Tone.now())
            }
        }
        else {

            // Any track left in solo mode? then only change self volume back to normal
            let staySoloMode:boolean = false
            for(let t of this.synthesizer.tracks) {

                if(t.isSolo) staySoloMode = true
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

    get holdEnabled() { return this._holdEnabled }
    set holdEnabled(hold: boolean) { 

        // this._holdEnabled = hold

        if(!hold) this.instrument.releaseNote()
    }


    /** Triggers the instruments note */
    triggerNote(note: string) {

        if(this.holdEnabled) return

        // Cant keep track of notes. Also will stay in this octave only! Need to check (synth.octave - note.octave) + this.octave
        if(this.octave != undefined) note = note.replace(/[0-9]/g, '') + this.octave

        this.instrument.triggerNote(note)
    }

    /** Stops the instruments note */
    releaseNote(note:string) {

        if(this.holdEnabled) return

        if(this.octave != undefined) note = note.replace(/[0-9]/g, '') + this.octave

        this.instrument.releaseNote(note)
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

            console.log('Connect Nodes', this.id, this.nodes)

            const nodes = []

            for(let n of this.nodes) {

                nodes.push(n)
            }

            nodes.push(this.volumeNode)

            console.log('NODES', nodes)

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


    /** Connect the output gain node to passed in output */
    connect(i: Node | Tone.ToneAudioNode) {
        
        this.volumeNode.connect(i instanceof Node ? i.input : i)
    }

    /** Disconnects the output gain node from passed in output */
    disconnect(i: Node | Tone.ToneAudioNode) {
        
        this.volumeNode.disconnect(i instanceof Node ? i.input : i)
    }

    /** Destroy this track. */
    destroy() {

        for(let i = this.nodes.length; i >= 0; i--) this.removeNode(this.nodes[i])

        if(this.instrument) this.instrument.destroy()
    }

    serializeIn(o: ITrackSerialization) {

        if(o.muted) this.mute(o.muted)
        if(o.volume) this.volume = o.volume

        if(o.instrument) {

            let instrument: Instrument = Synthesizer.createNode(o.instrument.name) as Instrument
            instrument.serializeIn(o.instrument)
            this.setInstrument(instrument)
        }
        
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
    }

    serializeOut() : ITrackSerialization {

        let nodes: INodeSerialization[] = []
        for(let n of this.nodes) nodes.push(n.serializeOut())

        return {
            muted: this.isMuted,
            instrument: this.instrument == null ? undefined : this.instrument.serializeOut(),
            nodes: nodes,
            volume: this.volume
        }
    }
}