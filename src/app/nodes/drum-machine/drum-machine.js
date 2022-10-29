
import { Subject } from 'rxjs'
import * as Tone from 'tone'


export class DrumMachine {

    gain
    volume

    tracks

    bpm



    constructor(options) {

        this.bpm = 120
        this.volume = .7

        this.gain = Tone.Gain(this.volume)

        this.tracks = []
    }

    addTrack(track) {

        if(this.tracks.indexOf(track) != -1) return

        this.tracks.push(track)

        this.setTracks(this.tracks)
    }

    setTracks(tracks) {

        this.tracks = tracks

        let urls = []
        this.tracks.filter(t => urls.push(t.sample))

        this.sampler = new Tone.Sampler(urls, )
        this.sampler.sync()
    }

    remove(track) {

        this.tracks.splice(this.tracks.indexOf(track), 1)

        this.setTracks(this.tracks)
    }

    start() {

        
    }


    stop() {

    }




}