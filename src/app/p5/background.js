
import { G } from '../globals'

export const keyVisualizer = (p5) => {

    p5.setup = () => {

        p5.createCanvas(G.w, G.h)
        p5.background('#161616')

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-4'
    }

    p5.draw = () => {

        p5.clear()

        // p5.fill('#fea5caff')
        // p5.fill('#181818')
        // p5.noStroke()
        // p5[Math.random() > .5 ? 'circle' : 'rect'](
        //     Math.random() * G.w,
        //     Math.random() * G.h,
        //     Math.random() * Math.max(G.w, G.h)
        // )

        
        if(G.keyboard.activeNotes.length > 0) {
                   
            let i = 1
            for(let n of G.keyboard.activeNotes) {

                p5.noFill()
                p5.stroke('#fefefedd')
                p5.strokeWeight(5)
                p5.circle(G.w / 2, G.h / 2, (G.w / 8) * i, (G.h / 8) * i)

                i++
            }
        }
        // p5.fill('#161616')
        // p5.noStroke()
        // p5.circle(G.w / 2, G.h / 2, (G.w / 10) * G.keyboard.activeNotes.length - 3, (G.h / 10) * G.keyboard.activeNotes.length - 3)

        for(let n of G.keyboard.activeNotes) {

            for(let i = 0; i < 50; i++) {

                // p5.fill('#fea5caff')
                p5.fill('#161616')
                p5.noStroke()
                p5[Math.random() > .5 ? 'circle' : 'rect'](
                    Math.random() * G.w,
                    Math.random() * G.h,
                    Math.random() * 5
                )
            }
        }
    }

    p5.windowResized = () => {

        p5.resizeCanvas(G.w, G.h)
    }
}