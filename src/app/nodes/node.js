import { Subject } from 'rxjs'
import * as Tone from 'tone'

/** Represents a Node that can be connected to eachother */
export class Node {

    /** Tag/Name of node */
    name

    /** Enabled flag */
    _enabled

    /** Input Node reference. Should actually be a Array! */
    input

    /** Output Node reference. Should actually be a Array! */
    output

    /** ToneJs instance */
    instance

    /** HTML element */
    dom

    /** OnDelete Observable */
    onDelete

    /** Array of knobs */
    knobs

    constructor(name) {

        console.log('Create Node', name)

        this.name = name

        this.enabled = true

        this.dom = document.createElement('div')
        this.dom.classList.add('node', this.name)

        const text = document.createElement('div')
        text.classList.add('node-title')
        text.innerHTML = this.name[0].toUpperCase() + this.name.substr(1)
        this.dom.append(text)

        const x = document.createElement('div')
        x.classList.add('delete')
        x.innerHTML = 'x'
        this.dom.append(x)
        this.onDelete = new Subject()
        x.addEventListener('click', this.delete.bind(this))

        this.knobs = []
    }

    set enabled(e) { this._enabled = e }
    get enabled() { return this._enabled }

    /** Connects this Nodes Output to [e]'s Input */
    connect(e) {

        if(!e) return

        this.instance.connect(e instanceof Node ? e.instance : e)

        this.output = e
    }

    /** Disconnects this Output from [e]'s/all Input(s) */
    disconnect(e) {

        if(!e) return

        if(e) this.instance.disconnect(e instanceof Node ? e.instance : e)
        else this.instance.disconnect()

        this.output = null
        if(e) e.input = null
    }

    chain(nodes) {

        if(!nodes.length) return this.connect(nodes)

        this.connect(nodes[0])

        for(let i = 0; i < nodes.length; i++) {

            if(nodes[i + 1] != null)
                nodes[i].connect(nodes[i + 1])
        }
    }

    delete() {

        // this.dom.parentNode.removeChild(this.dom)
        this.onDelete.next(this)

        this.destroy()
    }

    destroy() {

        this.disconnect()

        this.onDelete.unsubscribe()

        this.instance.dispose()

        for(let k of this.knobs) k.destroy()
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}