import { Effect } from "./effect";



/** Delay effect */
export class Delay extends Effect {

    /** How fast the delay is played in seconds */
    time 
    /** How long the delay is played. [0-1] */
    feedback


    constructor(time, feedback) {

        this.time = time
        this.feedback = feedback

    }
}