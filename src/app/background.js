
import { G } from './globals'

export const bg = (p5) => {

    p5.setup = () => {
        console.log('P5 SETUP')
        p5.createCanvas(G.w, G.h)
        p5.background('#161616')

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-1'
    }

    p5.draw = () => {

        p5.clear()
        
        p5.fill('#fefefedd')
        p5.noStroke()
        p5.circle(G.w / 2, G.h / 2, (G.w / 10) * keyboard.activeNotes.length, (G.h / 10) * keyboard.activeNotes.length)

        for(let n of keyboard.activeNotes) {

            p5.fill('#fea5ca')
            p5.noStroke()
            p5[Math.random() > .5 ? 'circle' : 'rect'](
                Math.random() * G.w,
                Math.random() * G.h,
                Math.random() * 100
            )
        }
    }

    p5.keyPressed = () => {

    }
}