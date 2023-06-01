
import * as Tone from 'tone'
import type { Channel, ISerialize, Synthesizer } from './synthesizer'


export type Notation = '1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/32' | '1/64'

export type Sequence = (Tone.Unit.Frequency | Tone.Unit.Frequency[])[]

export const getNotationLength = (n: Notation) => {

    switch(n) {

        case '1': return '1n'
        case '1/2': return '2n'
        case '1/4': return '4n'
        case '1/8': return '8n'
        case '1/16': return '16n'
        case '1/32': return '32n'
        case '1/64': return '64n'
    }
}

export interface ISequencerSerialization {

    channel: Channel[]
    sequence: Sequence
    humanize: number
}

export class Sequencer implements ISerialize {

    synthesizer: Synthesizer

    sequence: Sequence

    toneSequence: Tone.Sequence

    channel: Channel[]

    noteLength: Notation

    isPlaying: boolean

    loop: boolean

    humanize: number

    constructor(synthesizer: Synthesizer, sequence?: Sequence, channel?: Channel[]) {

        this.synthesizer = synthesizer
        this.sequence = sequence == undefined ? [] : sequence

        this.channel = channel == undefined ? [0] : channel

        this.isPlaying = false
        this.loop = true

        this.noteLength = '1/4'
    }


    addChannel(channel: Channel) {

        if(this.channel.indexOf(channel) != -1) return false

        this.channel.push(channel)

        return true
    }
    removeChannel(channel: Channel) {

        if(this.channel.indexOf(channel) == -1) return false

        this.channel.splice(this.channel.indexOf(channel), 1)

        for(let tr of this.synthesizer.tracks) {

            if(tr.channel == channel) tr.releaseNotes()
        }

        return true
    }


    addNote(note: Tone.Unit.Frequency, length: Notation, index:number, ) {

    }

    removeNote(note: Tone.Unit.Frequency, index:number) {

    }

    // [F#2, G#3, F#2, F#3]
    start() {

        if(this.toneSequence) {

            this.toneSequence.cancel(Tone.now())
            this.toneSequence.stop(Tone.now())
            this.toneSequence.clear()
            this.toneSequence.dispose()

        }

        this.toneSequence = this.startSequence(this.sequence)

        this.isPlaying = true
    }

    private lastNote: Tone.Unit.Frequency
    private startSequence(sequence: Sequence) {

        if(this.toneSequence) {
            
            this.toneSequence.cancel(Tone.now())
            this.toneSequence.clear()
            this.toneSequence.stop(Tone.now())
        }

        console.log('start', sequence)


        // let seq = new Tone.Sequence((time: number, note: Tone.Unit.Frequency) => {

        //     for(let channel of this.channel) {

        //         this.synthesizer.triggerReleaseNote(Tone.Frequency(note).toNote(), ((60) / Tone.Transport.bpm.value) - .01, time, channel)

        //         console.log('SEQUENCER at Channel', channel, note, time)
        //     }

        // }, sequence, getNotationLength(this.noteLength))

                
        this.lastNote = undefined

        let seq = new Tone.Sequence((time: number, note: Tone.Unit.Frequency) => {

            for(let channel of this.channel) {

                if(this.lastNote != undefined) {

                    this.synthesizer.releaseNote(this.lastNote, time, channel)
                }

                this.synthesizer.triggerNote(note, time, channel)

                console.log('SEQUENCER at Channel', channel, note, time)
            }

            this.lastNote = note

        }, sequence, '4n')


        seq.humanize = false
        // seq.probability = 

        seq.start(Tone.now())

        return seq
    }

    stop() {

        if(this.toneSequence) {
            
            this.toneSequence.cancel(Tone.now())
            this.toneSequence.clear()
            this.toneSequence.stop(Tone.now())
        }


        for(let channel of this.channel) this.synthesizer.releaseNote(this.lastNote, Tone.now(), channel)
        
        for(let ch of this.channel) {
            
            for(let tr of this.synthesizer.tracks) {

                if(ch == tr.channel) tr.releaseNotes()
            }
        }

        this.isPlaying = false
    }

    destroy() {

        this.stop()

        if(this.toneSequence) this.toneSequence.dispose()

        delete this.channel
        delete this.sequence
    }

    static parse(st: string) {

        let split = st.split(' ')
        let notes: Tone.Unit.Frequency[] = []

        for(let s of split) {

            if(!Tone.isNote(s)) continue

            notes.push(s)
        }

        console.log('split', split)
        console.log('notes', notes)
    }


    serializeOut(): ISequencerSerialization {

        return {

            channel: this.channel,
            sequence: this.sequence,
            humanize: this.humanize
        }
    }
    serializeIn(o: ISequencerSerialization) {

        if(o.channel && o.channel.length) this.channel = o.channel
        if(o.sequence && o.sequence.length) this.sequence = o.sequence
        if(o.humanize) this.humanize = o.humanize
    }
}