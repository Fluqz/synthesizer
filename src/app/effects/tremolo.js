import { Effect } from "./effect"



/** Tremolo effect */
export class Tremolo extends Effect {

    /** Tremolo amplitude */
    frequency 
    /** Trempolo depth */
    depth


    constructor(frequency, depth) {

        this.frequency = frequency
        this.depth = depth
        
    }
}