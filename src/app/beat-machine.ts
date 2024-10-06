import * as Tone from "tone"
import { G } from "./globals"
import { Observable, Subject } from "rxjs"

export class BeatMachine {

    private static _isPlaying: boolean = false

    private static loop: Tone.Loop
    private static timeLine: Tone.Loop

    private static beatObserver: Subject<number> = new Subject()
    private static timeLineObserver: Subject<number> = new Subject()


    static get isPlaying() { return this._isPlaying }

    /** Start the beatmachine. Singleton */
    static start() {

        if(G.isPlaying == false) {

            G.start()
        }

        if(BeatMachine._isPlaying) return

        BeatMachine._isPlaying = true

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

    /** Stops the beatmachine */
    static stop() {

        if(!BeatMachine._isPlaying) return

        this.loop.stop(0)
        this.timeLine.stop(0)

        this.loop.dispose()
        this.timeLine.dispose()

        BeatMachine._isPlaying = false
    }

    /** Schedules a function for the next beat to happen. */
    static scheduleNextBeat(fn: (time: number) => void) {

        const unsubscribe = this.beatObserver.subscribe((time) => {

            // console.log('BeatMachine.scheduleNextBeat', time)

            fn(time)

            unsubscribe.unsubscribe()
            
        }, err => {

            console.error('BeatMachine.scheduleNextBeat - Observable Error')
        })
    }

    /** Subscribes to updates of the timeline */
    static subscribeTimeLine(fn: (time: number) => void) {

        return this.timeLineObserver.subscribe((t) => {

            fn(t)
        })
    }

    // static subscribe(fn: () => void) {

    // }
}