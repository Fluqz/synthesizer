import { Subject } from 'rxjs'
import type * as Tone from 'tone'
import type { ISerialize } from '../synthesizer'

export enum InputType {

    KNOB,
    DROPDOWN,
    SWITCH,
}

export interface NodeInputGroup {

    group: string
    children: NodeInput[]
}

export interface NodeInput {

    /** Input type */
    type: InputType
    /** Title */
    name: string
    /** Getter value */
    get?: () => any
    /** Setter value */
    set?: (v: any) => void
    /** Group ID */
    group?: number
}

export interface KnobNodeInput extends NodeInput {

    /** Min value */
    min?: number
    /** Max value */
    max?: number
}

export interface DropDownNodeInput extends NodeInput {

    options: string | number
}

export interface SwitchNodeInput extends NodeInput {

    enabled: boolean
}


export interface INodeSerialization {

    name: string
    enabled: boolean
}

/** Represents a Node that can be connected to eachother */
export class Node implements ISerialize {

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
    props: Map<string, KnobNodeInput | SwitchNodeInput | DropDownNodeInput>

    constructor(name) {

        // super()

        console.log('Create Node', name)

        this.name = name

        this._enabled = true

        this.props = new Map()

        this.onDelete = new Subject()
    }

    set enabled(e) { this._enabled = e }
    get enabled() { return this._enabled }

    /** Connects this Nodes Output to [e]'s Input */
    connect(n: Node | Tone.ToneAudioNode) {

        if(!n) return

        this.output.connect(n instanceof Node ? n.input : n)
    }

    /** Disconnects this Output from [e]'s/all Input(s) */
    disconnect(n?: Node | Tone.ToneAudioNode) {

        if(n) this.output.disconnect(n instanceof Node ? n.input : n)
        else this.output.disconnect()
    }

    chain(nodes: Node[] | Tone.ToneAudioNode[]) {

        if(!nodes.length || nodes.length == 0) return // this.connect(nodes)

        // this.connect(nodes[0])

        let n1: Tone.ToneAudioNode
        let n2: Tone.ToneAudioNode

        for(let i = 0; i < nodes.length - 1; i++) {

            n1 = (nodes[i] instanceof Node ? nodes[i].output : nodes[i]) as Tone.ToneAudioNode
            n2 = (nodes[i + 1] instanceof Node ? nodes[i + 1].output : nodes[i + 1]) as Tone.ToneAudioNode

            n1.connect(n2)
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

        if(o.name) this.name = o.name
        if(o.enabled) this.enabled = o.enabled
    }

    serializeOut() : INodeSerialization {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}