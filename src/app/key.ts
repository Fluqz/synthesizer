import * as RxJs from 'rxjs'

import { G } from './globals'

// @reactive()
/** Represents a single Key on a Synthesizer */
export class Key {

    /** Note string of this Key */
    note: string
    /** Octave of this Key */
    octave: number
    /** Synthesizer mapping  */
    mapping: string
    /** Key down flag */
    isPressed: boolean

    onTrigger: RxJs.Subject<Key>
    onRelease: RxJs.Subject<Key>

    
    constructor(note: string, octave: number, mapping: string) {

        this.note = note
        this.octave = octave
        this.mapping = mapping

        this.onTrigger = new RxJs.Subject()
        this.onRelease = new RxJs.Subject()
    }

    setOctave(o: number) {

        this.onRelease.next(this)

        this.octave = o
    }

    /** On Key down */
    trigger() {

        if(G.debug) console.log(`Trigger | mapping: ${this.mapping} note: ${this.note} octave: ${this.octave}`)

        this.isPressed = true

        this.onTrigger.next(this)
    }

    /** On Key up */
    release() {

        if(G.debug) console.log(`Release | mapping: ${this.mapping} note: ${this.note} octave: ${this.octave}`)

        // if(!this.isPressed) return

        this.isPressed = false

        this.onRelease.next(this)
    }

    dispose() {

        this.onTrigger.complete()
        this.onRelease.complete()
    }
}
