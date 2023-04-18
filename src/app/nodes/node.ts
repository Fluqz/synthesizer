import { Subject } from 'rxjs'
import type * as Tone from 'tone'
import type { NodeInputs } from './node-inputs'

/** Represents a Node that can be connected to eachother */
export class Node implements NodeInputs {

    /** Tag/Name of node */
    name: string

    /** Enabled flag */
    _enabled: boolean

    /** Input Node reference */
    input

    /** Output Node reference */
    output

    /** First ToneAudioNode Node reference of this node */
    first

    /** First ToneAudioNode Node reference of this node */
    last

    /** ToneJs instance */
    instance: Tone.ToneAudioNode

    /** OnDelete Observable */
    onDelete

    /** Array of settable properties */
    props: string[]

    constructor(name) {

        // super()

        console.log('Create Node', name)

        this.name = name

        this.enabled = true

        this.props = []

        this.onDelete = new Subject()
    }

    set enabled(e) { this._enabled = e }
    get enabled() { return this._enabled }

    /** Connects this Nodes Output to [e]'s Input */
    connect(e: Node | Tone.ToneAudioNode) {

        if(!e) return

        console.log('connect', this.last.inputs, e.input)
        this.last.connect(e instanceof Node ? e.first : e)

        this.output = e
        e.input = this
    }

    /** Disconnects this Output from [e]'s/all Input(s) */
    disconnect(e?: Node | Tone.ToneAudioNode) {

        console.log('disconnect',this.last, e)
        if(e) this.last.disconnect(e instanceof Node ? e.first : e)
        else this.last.disconnect()

        this.output = null
        if(e) e.input = null
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

        this.instance.dispose()
    }

    serializeIn(o) {

        if(o['name']) this.name = o['name']
        if(o['enabled']) this.enabled = o['enabled']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}