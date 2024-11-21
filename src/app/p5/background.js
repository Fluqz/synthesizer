
import { G } from '../globals'

import { Synthesizer } from '../synthesizer'

class Tween {

    start
    end

    current

    steps

    direction

    constructor(start, end, steps, direction = 'increase' | 'decrease') {

        this.start = start
        this.end = end
        this.steps = steps
        this.direction = direction

        this.current = this.start
    }

    update() {

        this.current += this.steps

        this.steps *= 1.1

        if(this.direction == 'increase') {

            if(this.current > this.end) this.current = this.end
        }
        else {

            if(this.current < this.end) this.current = this.end
        }
    }

}

export const keyVisualizer = (p5) => {

    let noteAnimationMap = new Map()
    let activeNoteslength

    let img;

    p5.preload = () => {

        img = p5.loadImage("/assets/imgs/idioma.jpg");

    }

    p5.setup = () => {

        let p5Canvas = p5.createCanvas(G.w, G.h)
        p5Canvas.parent("p5-canvas-cont");

        p5.background('#161616')

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-4'

        p5.loadPixels();
    }

    const resizeImage = (w1, h1, img) => {

        let r = w1 / h1
        let w, h

        return { w: w, h: h}
    }

    p5.draw = () => {

        p5.clear()
        // p5.loadPixels()





        // let r = img.width / img.height
        // p5.image(img, 0, -(Math.abs(G.w / r - G.h)) / 2, G.w, G.w / r)





        

        // // Loop through every pixel column
        // for (let x = 0; x < G.w; x++) {

        //     // Loop through every pixel row
        //     for (let y = 0; y < G.h; y++) {

        //         // Use the formula to find the 1D location
        //         let index = x + y * G.w;
        //         if (x % 2 == 0) { // If we are an even column
        //             p5.pixels[index] = p5.color(255);
        //         } else { // If we are an odd column
        //             p5.pixels[index] = p5.color(0);
        //         }
        //     }
        // }

        // p5.updatePixels()












        // p5.fill('#fea5caff')
        // p5.fill('#181818')
        // p5.noStroke()
        // p5[Math.random() > .5 ? 'circle' : 'rect'](
        //     Math.random() * G.w,
        //     Math.random() * G.h,
        //     Math.random() * Math.max(G.w, G.h)
        // )

        // CIRCLES

        let startSize = (G.w / 10)
        let endSize = (G.w / 7)
        
        if(Synthesizer.activeNotes.length > 0) {

            let i = Synthesizer.activeNotes.size
            for(let n of Synthesizer.activeNotes) {

                let t
                if(!noteAnimationMap.has(n)) {
                    t = new Tween(startSize * i, endSize * i, 10, 'increase')
                    noteAnimationMap.set(n, t)
                }
                else t = noteAnimationMap.get(n)

                // p5.noFill()
                // p5.stroke('#fefefe')
                // p5.strokeWeight(5)

                p5.noStroke()
                // p5.fill('#'+
                //     (10 * (i+1)).toString() +
                //     (10 * (i+1)).toString() +
                //     (7 * (i+1)).toString() + '88')
                p5.fill('#ffffff66')

                p5.circle(G.w / 2, G.h / 2, t.current)

                t.update()

                i--
            }
        }

        if(Synthesizer.activeNotes.size !== activeNoteslength) noteAnimationMap.clear()
        activeNoteslength = Synthesizer.activeNotes.size

        // Remove keys from map
        let keys = []
        for(let k of noteAnimationMap.keys()) keys.push(k)
        for(let k of keys) {

            if(Synthesizer.activeNotes.has(k) == -1) {
                noteAnimationMap.delete(k)
                continue
            }
        }
    }

    p5.windowResized = () => {

        p5.resizeCanvas(G.w, G.h)
    }
}