import * as Tone from 'tone'
import type { Node } from '../node';


/** Delay node */
export class Delay extends Tone.Delay implements Node {
    
    enabled: boolean;

    constructor(wet, delayTime, feedback) {

        super(delayTime)

        this.delayTime.value = delayTime ? delayTime : 3
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
        if(o['delayTime']) this.delayTime.value = o['delayTime']
    }

    serializeOut() {

        return {

            enabled: this.enabled,
            delayTime: this.delayTime,
        }
    }
}