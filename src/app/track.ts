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

    /** ToneJs Gain Node used for the track */
    public gain: Tone.Gain

    /** Volume property */
    private _volume: number

    /** Instrument used */
    public instrument: Instrument

    /** Array of added nodes. Nodes are chained in array order  */
    public nodes: Node[]

    /** Mute this track */
    public isMuted: boolean

    /** When enabled, the current instrument with current note/chord is played endlessly. */
    private _holdEnabled: boolean

    /** Allow arpegiator to play this tracks instrument. */
    public arpEnabled: boolean

    constructor(instrument?: Instrument) {

        this._volume = .7
        this.nodes = []
        this.instrument = instrument
        this.gain = new Tone.Gain(this._volume)
        this.isMuted = false
        this._holdEnabled = false

        if(instrument) {

            this.setInstrument(instrument)
            this.connectNodes()
        }

        // this.addNode(Synthesizer.nodes.effects.Tremolo())
        this.addNode(Synthesizer.nodes.effects.Delay())
    }

    setInstrument(instrument: Instrument) {

        if(this.instrument && this.instrument != instrument) {

            this.instrument.disconnect()
            this.instrument.destroy()
        }

        this.instrument = instrument
        this.connectNodes()
    }

    get volume() { return this._volume }
    set volume(v: number) { 

        this._volume = v

        this.gain.gain.setValueAtTime(this._volume, Tone.now())
    }

    mute(m: boolean) {

        console.log('mute track', m)

        this.isMuted = m === true ? true : false

        if(this.isMuted) this.gain.gain.setValueAtTime(0, Tone.now())
        else this.gain.gain.setValueAtTime(this.volume, Tone.now())
    }

    get holdEnabled() { return this._holdEnabled }
    set holdEnabled(hold: boolean) { 

        // for(let n of Synthesizer.activeNotes) hold ? this.instrument.triggerNote(n) : this.instrument.releaseNote(n)

        // this._holdEnabled = hold

        if(!hold) this.instrument.releaseNote()
    }


    /** Triggers the instruments note */
    triggerNote(note: string) {

        if(this.holdEnabled) return

        this.instrument.triggerNote(note)
    }

    /** Stops the instruments note */
    releaseNote(note:string) {

        if(this.holdEnabled) return

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

            const nodes: Tone.ToneAudioNode[] = []

            nodes.push(this.instrument.output)

            for(let n of this.nodes) {

                nodes.push(n.input)
                n.disconnect()

                if(n.input != n.output) nodes.push(n.output)
            }

            nodes.push(this.gain)

            this.instrument.chain(nodes)

            // for(let i = 0; i < nodes.length - 1; i++) {

            //     console.log('nodes', i, i+1, nodes.length)

            //     nodes[i].connect(nodes[i+1])
            // }

            // this.instrument.output.connect(this.gain)
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
        
        this.gain.connect(i instanceof Node ? i.input : i)
    }

    /** Disconnects the output gain node from passed in output */
    disconnect(i: Node | Tone.ToneAudioNode) {
        
        this.gain.disconnect(i instanceof Node ? i.input : i)
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

            let instrument: Instrument = Synthesizer.nodes.source[o.instrument.name]()
            instrument.serializeIn(o.instrument)
            this.setInstrument(instrument)
        }
        
        if(o.nodes && o.nodes.length > 0) {
            
            for(let n of o.nodes) {

                let node: Node = Synthesizer.nodes.effects[n.name]()

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