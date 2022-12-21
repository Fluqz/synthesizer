import * as Tone from "tone"
import type { Node } from "../node"



export class Reverb extends Tone.Reverb implements Node {



    constructor(wet, decay) {

        super(decay)
        
    }
    enabled: boolean
    serializeIn(o: any): void {
        throw new Error("Method not implemented.")
    }
    serializeOut(): {} {
        throw new Error("Method not implemented.")
    }
}