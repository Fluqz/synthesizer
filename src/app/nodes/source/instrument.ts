import * as Tone from 'tone'
import { Subject } from 'rxjs'
import { G } from '../../core/globals'
import { Node } from '../node'
import type { InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import type { Instrument as ToneInstrument } from 'tone/build/esm/instrument/Instrument'

export enum InstrumentType {

    MONO = 'MONO',
    POLY = 'POLY'
} 

/** Represents a instrument  */
export abstract class Instrument extends Node {

    /** Source is a ToneJS Instrument */
    source: ToneInstrument<InstrumentOptions>

    /** Poly or Mono type */
    type: InstrumentType

    /** Flag for is playing currently */
    isPlaying: boolean

    constructor(name, type) {

        super(name)

        this.type = type

        this.isPlaying = false
    }
    
    /** Trigger Note */
    abstract triggerAttack(note: Tone.Unit.Frequency, time: Tone.Unit.Time, velocity:number) 
    // { // if(G.debug) console.log(`Instrument - Trigger | note: ${note} time: ${time}`) }

    /** Trigger and Release Note */
    abstract triggerAttackRelease(note: Tone.Unit.Frequency, duration: Tone.Unit.Time, time: Tone.Unit.Time, velocity:number)
    // {// if(G.debug) console.log(`Instrument - Trigger and Release | note: ${note} time: ${time}`) }

    /** Release Note */
    abstract triggerRelease(note: Tone.Unit.Frequency, time: Tone.Unit.Time)
    // { // if(G.debug) console.log(`Instrument - Release | note: ${note} time: ${time}`) }

    /** Release all Notes */
    abstract releaseAll()
}
