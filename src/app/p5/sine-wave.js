


import * as Tone from 'tone'


import { G } from '../core/globals'
import { M } from '../core/math'

export const sinewave = (p5) => {

    p5.setup = () => {

        p5.createCanvas(G.w, G.h)
        p5.background('#FFFFFF00')

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-3'
        p5.canvas.style.mixBlendMode = 'difference'
    }

    const points = []
    const amplitude = 50
    const frequency = .3
    const maxPoints = 400

    p5.draw = () => {

        p5.clear()

        points.push({
            x: Tone.context.currentTime,
            y: M.map(-1, 1, 0, 1, Math.cos(Tone.context.currentTime)),
        })

        // console.log(points[points.length-1])

        let i = 0
        for(let p of points) {

            p5.fill('#ffff')
            p5.noStroke()
            p5.circle((G.w / 2) - ((points.length * frequency) / 2) + i, (G.h / 2) + (p.y * amplitude), 2)

            i += frequency
        }

        if(points.length > maxPoints) points.shift()

    }

    p5.windowResized = () => {

        p5.resizeCanvas(G.w, G.h)
    }
}