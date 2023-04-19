import { Subject } from 'rxjs'
import type * as Tone from 'tone'


export interface NodeProperty  {

    name: string,
    value: number | boolean
}

export interface INodeSerialization {

    name: string
    enabled: boolean
}

/** Represents a Node that can be connected to eachother */
export class Node {

    /** Tag/Name of node */
    name: string

    /** Enabled flag */
    _enabled: boolean

    /** Input Node reference */
    input: Tone.ToneAudioNode

    /** Output Node reference */
    output: Tone.ToneAudioNode

    /** OnDelete Observable */
    onDelete

    /** Array of settable properties */
    props: Map<string, NodeProperty>

    constructor(name) {

        // super()

        console.log('Create Node', name)

        this.name = name

        this.enabled = true

        this.props = new Map()

        this.onDelete = new Subject()
    }

    set enabled(e) { this._enabled = e }
    get enabled() { return this._enabled }

    /** Connects this Nodes Output to [e]'s Input */
    connect(e: Node | Tone.ToneAudioNode) {

        if(!e) return

        this.output.connect(e instanceof Node ? e.input : e)
    }

    /** Disconnects this Output from [e]'s/all Input(s) */
    disconnect(e?: Node | Tone.ToneAudioNode) {

        if(e) this.output.disconnect(e instanceof Node ? e.input : e)
        else this.output.disconnect()
    }

    chain(nodes: Node[]) {

        if(!nodes.length || nodes.length == 0) return // this.connect(nodes)

        this.connect(nodes[0])

        for(let i = 0; i < nodes.length; i++) {

            if(nodes[i + 1] != null)
                nodes[i].connect(nodes[i + 1])
        }
    }

    delete() {

        this.onDelete.next(this)

        this.destroy()
    }

    destroy() {

        this.disconnect()

        this.onDelete.unsubscribe()
    }

    serializeIn(o : INodeSerialization) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
    }

    serializeOut() : INodeSerialization {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}