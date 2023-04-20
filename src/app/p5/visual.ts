

import * as P5 from 'p5'

import { G } from '../core/globals'
import { moireShader } from './moire-shader'
import { keyVisualizer } from './background'
import { sinewave } from './sine-wave'
import { envelope } from './envelope'
import { worms } from './worms'

export const Visuals = {

    moireShader: () => {

        // Processing
        let m1 = new P5(moireShader)
        let m2 = new P5(moireShader)

        // new P5(keyVisualizer)
        // new P5(envelope)
        // new P5(sinewave)
        // new P5(worms)

    }

    
}