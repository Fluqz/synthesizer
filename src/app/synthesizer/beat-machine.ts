import * as Tone from "tone"
import { G } from "../globals"
import { Observable, Subject } from "rxjs"

export class BeatMachine {

    private static _isPlaying: boolean = false

    /** Tone.Loop() - Fires every bar along the Tone.getTransport class */
    private static loop: Tone.Loop
    /** Tone.Loop() - Fixed update loop running every ~3ms along the Tone.getTransport class 
     * TODO - What about AnimationFrame?
    */
    private static timeLine: Tone.Loop

    private static beatObserver: Subject<number> = new Subject()
    private static timeLineObserver: Subject<number> = new Subject()

    private static currentDelta:number = 0

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

        let last = 0
        this.timeLine = new Tone.Loop((time: number) => {

            // console.log('time line ', time, time - last)

            this.currentDelta = time - last

            this.timeLineObserver.next(time)

            last = time

        }, Tone.Time('1b').toSeconds() / 15 )

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