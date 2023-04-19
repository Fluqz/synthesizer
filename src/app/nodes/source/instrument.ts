import * as Tone from 'tone'
import { Subject } from 'rxjs'
import { G } from '../../core/globals'
import { Node } from '../node'
import type { InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import type { Instrument as ToneInstrument } from 'tone/build/esm/instrument/Instrument'

/** Represents a instrument  */
export abstract class Instrument extends Node {

    onTrigger
    onRelease

    constructor(name) {

        super(name)

        this.onTrigger = new Subject()
        this.onRelease = new Subject()
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
