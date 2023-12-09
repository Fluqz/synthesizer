import { Subject, takeUntil } from "rxjs"
import * as Tone from "tone"
import type { IVisual } from "../p5/visual"
import type { Synthesizer } from "../synthesizer"
import { Midi } from "./midi"
import { Visual } from "../p5/visual"
import { Vec2 } from "../util/math"


export class G {

    static debug = true

    static w: number = 0
    static h: number = 0

    static synthesizer: Synthesizer

    // static beat: Subject<number> = new Subject()

    static osc: Vec2 = new Vec2()



    static init() {

        G.w = innerWidth
        G.h = innerHeight

        Visual.init()
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