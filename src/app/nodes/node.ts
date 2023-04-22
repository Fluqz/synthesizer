import { Subject, count } from 'rxjs'
import type * as Tone from 'tone'
import type { ISerialize } from '../synthesizer'

export enum ParamType {

    KNOB,
    DROPDOWN,
    SWITCH,
}

export type GroupID = number
export type NodeParameterGroup = Map<GroupID, NodeParameter[]>

export interface NodeParameter {

    /** Input type */
    type: ParamType
    /** Title */
    name: string
    /** Getter value */
    get?: () => any
    /** Setter value */
    set?: (v: any) => void
    /** Group ID */
    groupID?: GroupID
}

export interface KnobNodeParameter extends NodeParameter {

    /** Min value */
    min?: number
    /** Max value */
    max?: number
}

export interface DropDownNodeParameter extends NodeParameter {

    options: string | number
}

export interface SwitchNodeParameter extends NodeParameter {

    enabled: boolean
}

export interface INodeSerialization {

    name: string
    enabled: boolean
}

/** Represents a Node that can be connected to eachother */
export class Node implements ISerialize {

    static count = 0

    id: number 

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
    props: Map<string, KnobNodeParameter | SwitchNodeParameter | DropDownNodeParameter> 

    constructor(name) {

        this.id = Node.count++

        console.log('Create Node', name, this.id)

        this.name = name

        this._enabled = true

        this.props = new Map()

        this.onDelete = new Subject()
    }

    set enabled(e) { this._enabled = e }
    get enabled() { return this._enabled }

    /** Connects this Nodes Output to [e]'s Input */
    connect(n: Node | Tone.ToneAudioNode) {
        console.log('node CONNECT', this.name)

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

        this.output.connect(nodes[0] instanceof Node ? nodes[0].input : nodes[0])

        let lastNode: Tone.ToneAudioNode = nodes[0] instanceof Node ? nodes[0].output : nodes[0]

        nodes.shift()

        // console.log('chain', this.output.name, 'to', lastNode.name)

        for(let n of nodes) {
            
            if(n instanceof Node) {

                // console.log('chain Node', lastNode.name, 'to', n.name)

                lastNode.connect(n.input)
                lastNode = n.output
            }
            else {
                
                // console.log('chain ToneNode', lastNode.name, 'to', n.name)

                lastNode.connect(n)
                lastNode = n
            }
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