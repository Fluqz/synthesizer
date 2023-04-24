

import P5 from 'p5'

import { G } from '../core/globals'
import { moireShader } from './moire-shader'
import { keyVisualizer } from './background'
import { sinewave } from './sine-wave'
import { envelope } from './envelope'
import { worms } from './worms'

export interface IVisual {

    id: number,
    p5: P5[]
}

export let visualCount: number = 0

export const Visuals = {

    moire: () => {

        let m1 = new P5(moireShader)
        let m2 = new P5(moireShader)

        G.visuals.set('moire', {

            id: visualCount++,
            p5: [ m1, m2 ]
        })


        // Draw loop
        const onDraw = (time) => {

            m1.draw()
            m2.draw()
        }

        // G.beat.subscribe(onDraw)
    }
}