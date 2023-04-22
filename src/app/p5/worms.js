


import * as Tone from 'tone'


import { G } from '../core/globals'
import { M } from '../core/math'
import { Synthesizer } from '../synthesizer'
import { ElectricFuzz } from './electric-fuzz'

export const worms = (p5) => {

    let efs = []
    let amount = 100
    let init = true

    p5.setup = () => {

        p5.createCanvas(G.w, G.h)
        p5.background('#FFFFFF00')

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-3'
        p5.canvas.style.mixBlendMode = 'difference'
        // p5.canvas.style.opacity = '.4'
    }

    let ef 
    p5.draw = () => {


        // // DOTS
        // for(let n of Synthesizer.activeNotes) {

        //     for(let i = 0; i < 200; i++) {

        //         // p5.fill('#fea5caff')
        //         p5.fill('#fea5ca')
        //         p5.noStroke()

        //         // p5[Math.random() > .5 ? 'circle' : 'rect'](
        //         p5['circle'](
        //             Math.random() * G.w,
        //             Math.random() * G.h,
        //             Math.random() * 5
        //         )
        //     }
        // }

        // // Electric fuzz
        // if(Synthesizer.activeNotes.length > 0) {

        //     ef = new ElectricFuzz(
        //         G.w / 2, 
        //         G.h / 2, 
        //         (Math.random() * 20 + 20) * Synthesizer.activeNotes.length, 
        //         2, 
        //         10,
        //         undefined,
        //         undefined,
        //         (px, py, nx, ny, c, w) => {

        //             p5.stroke(c)
        //             p5.strokeWeight(w)
        //             p5.line(px, py, nx, ny)
        //         }
        //     )
        // }







        if(Synthesizer.activeNotes.size > 0) {

            if(init) {

                init = false

                let x = Math.random() * G.w, 
                    y = Math.random() * G.h

                for(let n of Synthesizer.activeNotes) {

                    for(let i = 0; i < 20; i++) {

                        efs.push(new ElectricFuzz(
                            // Math.random() * G.w,
                            // Math.random() * G.h,
                            // G.w / 2,
                            // G.h / 2,
                            x,
                            y,
                            1, 
                            1,
                            10,
                            // '#'+Math.floor(Math.random()*16777215).toString(16),
                            '#fed33a44',
                            (px, py, nx, ny, vs, c) => {

                                // p5.stroke(c)
                                // p5.strokeWeight(Math.random() * 3)
                                // p5.line(px, py, nx, ny)


                                p5.fill('#44004444')
                                p5.noStroke()
                                p5.rect(nx+1, ny+1, 2, 2)

                                p5.fill(c)
                                p5.noStroke()
                                p5.rect(nx, ny, 2, 2)
                                // for(let i = 1; i < vs.length; i++) {

                                //     p5.stroke(c)
                                //     p5.strokeWeight(Math.random() * 3)
                                //     p5.line(vs[i-1].x, vs[i-1].y, vs[i].x, vs[i].y)

                                // }
                            }
                        ))
                    }
                }
            }
            else {
                for(let ef of efs) {

                    ef.grow()
                }
            }
        }
        else {
            if(efs.length > 0) efs = []
            init = true
            p5.clear()
        }
       
    }

    p5.windowResized = () => {

        p5.resizeCanvas(G.w, G.h)
    }
}

