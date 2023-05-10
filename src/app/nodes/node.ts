import { Subject, count } from 'rxjs'
import * as Tone from 'tone'
import type { ISerialization, ISerialize } from '../synthesizer'
import { writable, type Writable } from 'svelte/store'

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
    get: () => any
    /** Setter value */
    set: (v: any) => void
    /** Group ID */
    groupID?: GroupID
}

export interface KnobNodeParameter extends NodeParameter {

    /** Min value */
    min: number
    /** Max value */
    max: number
}

export interface DropDownNodeParameter extends NodeParameter {

    options: any
}

export interface SwitchNodeParameter extends NodeParameter {

    enabled: boolean
}


export interface INodeSerialization extends ISerialization {

    name: string
    enabled: boolean
    collapsed: boolean
}

/** Represents a Node that can be connected to eachother */
export abstract class Node extends Tone.ToneAudioNode implements ISerialize {

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

    /** instance Store */
    store: Writable<Node>

    /** Visiblity flag for small/edit view */
    collapsed: boolean = false

    constructor(name) {
        super()

        this.id = Node.count++

        this.store = writable(this)

        this.name = name

        this._enabled = true

        this.props = new Map()

        this.onDelete = new Subject()
    }

    set enabled(e) { this._enabled = e }
    get enabled() { return this._enabled }

    connect(destination: Tone.InputNode, outputNum?: number, inputNum?: number): this {

        this.output.connect(destination, outputNum, inputNum)

        return this
    }

    disconnect(destination?: Tone.InputNode, outputNum?: number, inputNum?: number): this {
        
        this.output.disconnect(destination, outputNum, inputNum)

        return this
    }

    chain(...nodes: Tone.InputNode[]): this {
        
        if(!nodes.length || nodes.length == 0) return // this.connect(nodes)

        this.output.connect(nodes[0])

        let lastNode = nodes[0]

        nodes.shift()

        // console.log('chain', this.output.name, 'to', lastNode.name)

        for(let n of nodes) {
            
            // if(n instanceof Node) {

            //     // console.log('chain Node', lastNode.name, 'to', n.name)

            //     lastNode.connect(n.input)
            //     lastNode = n.output
            // }
            // else {
                
                // console.log('chain ToneNode', lastNode.name, 'to', n.name)

                console.log('HI')

                console.log(lastNode.connect)
                lastNode.connect(n)
                lastNode = n
            // }
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
        if(o.collapsed) this.collapsed = o.collapsed
    }

    serializeOut() : INodeSerialization {

        return {

            name: this.name,
            enabled: this.enabled,
            collapsed: this.collapsed
        }
    }
}