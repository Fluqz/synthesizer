import { Subject, takeUntil } from "rxjs"
import * as Tone from "tone"
import type { IVisual } from "../p5/visual"
import type { Synthesizer } from "../synthesizer"


export class G {

    static debug = true

    static w: number
    static h: number

    static synthesizer: Synthesizer

    static visualsEnabled: boolean

    static visuals: Map<string, IVisual> = new Map()

    static beat: Subject<number> = new Subject()

    static init() {

        G.w = innerWidth
        G.h = innerHeight

        this.visualsEnabled = true

        Tone.Transport.scheduleRepeat(time => {

            this.beat.next(time)

        }, '32n')

        Tone.Transport.bpm.value = 120

        Tone.Transport.start()
    }


    static saveVisuals = () => {
    
        let main: HTMLElement = document.body.getElementsByTagName('main')[0]
    
        let canvases = main.querySelectorAll('canvas')


        let imgs = []

        for(let c of canvases) {

            let src = c.toDataURL('image/png')

            let image = new Image()
            image.src = src

            imgs.push(image)

            console.log('img', image)
        }

        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext("2d");


        ctx.globalAlpha = 0.5

        for(let img of imgs) {

            ctx.drawImage(img, 0, 0)

            console.log('draw', img)
        }

        function loadImage(src, onload) {


            var img = new Image();
            
            img.onload = onload;
            img.src = src;

            return img;
        }

        let generatedImg = loadImage(canvas.toDataURL('image/png'), (img) => {

            console.log('img ready', img)
        })


        const ele = document.createElement('div')


        ele.append(generatedImg)

        document.body.append(ele)
    }
}