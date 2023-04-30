import * as Tone from 'tone'
import { Subject } from 'rxjs'
import { G } from '../../core/globals'
import { Node } from '../node'
import type { InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import type { Instrument as ToneInstrument } from 'tone/build/esm/instrument/Instrument'

/** Represents a instrument  */
export abstract class Instrument extends Node {

    constructor(name) {

        super(name)
    }
    
    /** On Key down */
    triggerNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        // if(G.debug) console.log(`Instrument - Trigger | note: ${note} time: ${time}`)
    }

    triggerReleaseNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        // if(G.debug) console.log(`Instrument - Trigger and Release | note: ${note} time: ${time}`)

    }

    /** On Key up */
    releaseNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time) {

        // if(G.debug) console.log(`Instrument - Release | note: ${note} time: ${time}`)
    }
}
