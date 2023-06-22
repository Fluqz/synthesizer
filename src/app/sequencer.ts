
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

    channels: Channel[]

    noteLength: Notation

    isPlaying: boolean

    loop: boolean

    humanize: number

    constructor(synthesizer: Synthesizer, sequence?: Sequence, channels?: Channel[]) {

        this.synthesizer = synthesizer
        this.sequence = sequence == undefined ? [] : sequence

        this.channels = channels == undefined ? [0] : channels

        this.isPlaying = false
        this.loop = true

        this.noteLength = '1/4'
    }


    addChannel(channel: Channel) {

        if(this.channels.indexOf(channel) != -1) return

        this.channels.push(channel)
    }
    removeChannel(channel: Channel) {

        if(this.channels.indexOf(channel) == -1) return false

        this.channels.splice(this.channels.indexOf(channel), 1)

        for(let tr of this.synthesizer.tracks) {

            if(tr.channel == channel) tr.releaseNotes()
        }

        return true
    }


    addNote(note: Tone.Unit.Frequency, i:number, i2:number) {

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

        this.startSequence(this.sequence)

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

        this.isPlaying = true

        this.toneSequence = new Tone.Sequence((time: number, note: Tone.Unit.Frequency) => {

            console.log(this.channels)

            for(let channel of this.channels) {

                this.synthesizer.triggerReleaseNote(Tone.Frequency(note).toNote(), ((60) / Tone.Transport.bpm.value) - .01, time, channel)

                console.log('SEQUENCER at Channel', channel, note, time)
            }

        }, sequence, getNotationLength(this.noteLength))

        console.log('nota', getNotationLength(this.noteLength))
                
        // this.lastNote = undefined

        // this.toneSequence = new Tone.Sequence((time: number, note: Tone.Unit.Frequency) => {

        //     for(let channel of this.channel) {

        //         if(this.lastNote != undefined) {

        //             this.synthesizer.releaseNote(this.lastNote, time, channel)
        //         }

        //         this.synthesizer.triggerNote(note, time, channel)

        //         console.log('SEQUENCER at Channel', channel, note, time)
        //     }

        //     this.lastNote = note

        // }, sequence, '4n')


        this.toneSequence.humanize = false
        // this.toneSequence.probability = 

        this.toneSequence.start(Tone.now())

        return this.toneSequence
    }

    stop() {

        if(this.toneSequence) {
            
            this.toneSequence.cancel(Tone.now())
            this.toneSequence.clear()
            this.toneSequence.stop(Tone.now())
        }


        for(let channel of this.channels) this.synthesizer.releaseNote(this.lastNote, Tone.now(), channel)
        
        for(let ch of this.channels) {
            
            for(let tr of this.synthesizer.tracks) {

                if(ch == tr.channel) tr.releaseNotes()
            }
        }

        this.isPlaying = false
    }

    setSubdivision(subdivision: Tone.Unit.Time) {

        // if(this.toneSequence) this.toneSequence.set({ subdivision: getNotationLength(subdivision) })
    }

    destroy() {

        this.stop()

        if(this.toneSequence) this.toneSequence.dispose()

        delete this.channels
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

            channel: this.channels,
            sequence: this.sequence,
            humanize: this.humanize
        }
    }
    serializeIn(o: ISequencerSerialization) {

        if(o.channel && o.channel.length) this.channels = o.channel
        if(o.sequence && o.sequence.length) this.sequence = o.sequence
        if(o.humanize) this.humanize = o.humanize
    }
}