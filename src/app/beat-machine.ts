import * as Tone from "tone"
import { G } from "./globals"
import { Subject } from "rxjs"

export class BeatMachine {

    private static _isPlaying: boolean = false

    private static queue: [] = []

    private static loop: Tone.Loop
    private static timeLine: Tone.Loop

    private static beatObserver: Subject<number> = new Subject()
    private static timeLineObserver: Subject<number> = new Subject()

    private static SCHEDULE_ID: number

    constructor() {}

    static get isPlaying() { return this._isPlaying }

    static start() {

        if(G.isPlaying == false) {

            Tone.start()
            Tone.Transport.start()
            G.isPlaying = true
        }

        if(BeatMachine._isPlaying) return

        this.loop = new Tone.Loop((time: number) => {

            // console.log('beat time', time)

            this.beatObserver.next(time)

        }, '1b')

        this.timeLine = new Tone.Loop((time: number) => {

            // console.log('time line ', time)

            this.timeLineObserver.next(time)

        }, Tone.Time('1b').toSeconds() / 32 )

        this.loop.start(0)
        this.timeLine.start(0)
    }

    static stop() {

        this.loop.stop(0)
        this.timeLine.stop(0)

        this.loop.dispose()
        this.timeLine.dispose()

        BeatMachine._isPlaying = false
    }

    static scheduleNextBeat(fn: (time: number) => void) {

        const unsubscribe = this.beatObserver.subscribe((time) => {

            // console.log('BeatMachine.scheduleNextBeat', time)

            fn(time)

            unsubscribe.unsubscribe()
            
        }, err => {

            console.error('BeatMachine.scheduleNextBeat - Observable Error')
        })
    }

    static subscribeTimeLine(fn: (time: number) => void) {

        return this.timeLineObserver.subscribe((t) => {

            fn(t)
        })
    }

    // static subscribe(fn: () => void) {

    // }
}