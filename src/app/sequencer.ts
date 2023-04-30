
import type * as Tone from 'tone'
import type { Channel, ISerialization, ISerialize, Synthesizer } from './synthesizer'

export interface ISequencerSerialization {


}

export class Sequencer implements ISerialize {

    synthesizer: Synthesizer

    notes: Tone.Unit.Frequency

    channel: Channel[]

    loop: boolean

    constructor(synthesizer: Synthesizer, notes: Tone.Unit.Frequency, channel: Channel[]) {

        this.synthesizer = synthesizer
        this.notes = notes

        this.channel = channel

        this.loop = true
    }

    start() {

    }

    stop() {

    }

    static parse(s: string) {


    }


    serializeOut: () => ISerialization
    serializeIn: (o: ISerialization) => void
}