import { Effect } from "./effect"



/** Chorus effect */
export class Chorus extends Effect {

    /** Chorus amplitude */
    frequency
    /** Chorus delay */
    delayTime 
    /** Chorus depth */
    depth

    constructor(frequency, delayTime, depth) {

        this.frequency = frequency
        this.delayTime = delayTime
        this.depth = depth
    }
}