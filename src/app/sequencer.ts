
import * as Tone from 'tone'
import type { Channel, ISerialize, Synthesizer } from './synthesizer'


export type Notation = '1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/32' | '1/64'

export type REST = ''

export type SequenceObject = { 
    note: Tone.Unit.Frequency | REST,
    time: Tone.Unit.Time,
    length: Tone.Unit.Time,
    velocity?: number
}

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
    sequence: SequenceObject[]
    humanize: number
}

export class Sequencer implements ISerialize {

    synthesizer: Synthesizer

    sequence: SequenceObject[]

    _bars: number

    toneSequence: Tone.Part

    channels: Channel[]

    noteLength: Notation

    isPlaying: boolean

    loop: boolean

    humanize: number

    constructor(synthesizer: Synthesizer, sequence?: SequenceObject[], channels?: Channel[]) {

        this.synthesizer = synthesizer
        this.sequence = sequence == undefined ? [] : sequence

        this.bars = this.sequence.length == 0 ? 4 : this.sequence.length

        this.channels = channels == undefined ? [0] : channels

        this.isPlaying = false
        this.loop = true

        this.noteLength = '1/4'
    }


    get bars() { return this._bars }
    set bars(v: number) { 

        this._bars = v

        if(this.toneSequence) {

            this.toneSequence.loopEnd = this._bars
        }
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

    addNote(note: Tone.Unit.Frequency, time: Tone.Unit.Time, length: Tone.Unit.Time, velocity: number) {

        console.log('add', note, time, length)

        if(!Tone.isNote(note)) return

        const n = { note, time, length, velocity }

        this.sequence.push(n)
        
        if(this.toneSequence) this.toneSequence.add(n)
    }

    updateNote(i:number, note: Tone.Unit.Frequency, time: Tone.Unit.Time, length: Tone.Unit.Time, velocity: number) {

        if(!Tone.isNote(note)) return

        for(let c of this.channels) this.synthesizer.releaseNote(Tone.Frequency(this.sequence[i].note).toNote(), Tone.now(), c)

        this.sequence[i].note = note
        this.sequence[i].time = time
        this.sequence[i].length = length
        this.sequence[i].velocity = velocity
    }

    removeNote(i:number, note) {

        for(let c of this.channels) this.synthesizer.releaseNote(Tone.Frequency(this.sequence[i].note).toNote(), Tone.now(), c)

        this.sequence.splice(i, 1)

        if(this.toneSequence) this.toneSequence.remove(note)
    }

    addBar() {

        this.bars++

        this.toneSequence.loopEnd = this.bars
    }

    removeBar() {

        this.bars--

        if(this.bars <= 0) this.bars = 1

        this.toneSequence.loopEnd = this.bars
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
    private startSequence(sequence: SequenceObject[]) {

        if(this.toneSequence) {
            
            this.toneSequence.cancel(Tone.now())
            this.toneSequence.clear()
            this.toneSequence.stop(Tone.now())
            this.toneSequence.dispose()
        }

        console.log('start', sequence)

        this.isPlaying = true

        this.toneSequence = new Tone.Part((time, value) => {

            for(let channel of this.channels) {

                this.synthesizer.triggerReleaseNote(Tone.Frequency(value.note).toNote(), '8n', time, channel, 1)

                console.log('SEQUENCER at Channel', channel, Tone.Frequency(value.note).toNote(), time, value, sequence)
            }

        }, sequence)

        // [
        //     { note: 'A2', time: '0:0:0', velocity: 1},
        //     { note: 'G3', time: '0:1:0', velocity: 1},
        //     { note: 'C3', time: '0:2:0', velocity: 1},
        // ]

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


        this.toneSequence.loop = this.loop

        this.toneSequence.loopEnd = this.bars

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
            this.toneSequence.dispose()
        }

        for(let channel of this.channels) this.synthesizer.releaseNote(this.lastNote, Tone.now(), channel)
        
        for(let ch of this.channels) {
            
            for(let tr of this.synthesizer.tracks) {

                if(ch == tr.channel) tr.releaseNotes()
            }
        }

        this.isPlaying = false
    }

    destroy() {

        this.stop()

        if(this.toneSequence) this.toneSequence.dispose()

        delete this.channels
        delete this.sequence
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