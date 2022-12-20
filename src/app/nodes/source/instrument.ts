import * as Tone from 'tone'
import { Subject } from 'rxjs'
import { G } from '../../core/globals'
import { Node } from '../node'
import type { ToneWithContextOptions } from 'tone/build/esm/core/context/ToneWithContext'

/** Represents a instrument  */
export class Instrument extends Node {

    public envelope: Tone.AmplitudeEnvelope

    onTrigger
    onRelease

    constructor(name) {

        super(name)

        this.envelope = new Tone.AmplitudeEnvelope()

        this.onTrigger = new Subject()
        this.onRelease = new Subject()
    }

    /** Connects this Nodes Output to [e]'s Input */
    connect(e: Node | Tone.ToneAudioNode) {

        if(!e) return

        this.envelope.connect(e instanceof Node ? e.instance : e)

        this.output = e
    }

    /** Disconnects this Output from [e]'s/all Input(s) */
    disconnect(e?: Node | Tone.ToneAudioNode) {

        if(e) this.envelope.disconnect(e instanceof Node ? e.instance : e)
        else this.envelope.disconnect()

        this.output = null
        if(e) e.input = null
    }

    chain(nodes: Node[]) {

        if(!nodes.length) return // this.connect(nodes)

        this.connect(nodes[0])

        for(let i = 0; i < nodes.length; i++) {

            if(nodes[i + 1] != null)
                nodes[i].connect(nodes[i + 1])
        }
    }
    
    /** On Key down */
    triggerNote(note: string) {

        if(G.debug) console.log(`Instrument - Trigger | note: ${note}`)

        this.onTrigger.next(this)
    }

    /** On Key up */
    releaseNote(note?: string) {

        if(G.debug) console.log(`Instrument - Release | note: ${note}`)

        this.onRelease.next(this)
    }

    destroy() {

        super.destroy()

        this.onTrigger.complete()
        this.onTrigger.complete()
    }
}
