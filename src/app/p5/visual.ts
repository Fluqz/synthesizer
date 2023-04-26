

import P5 from 'p5'

import { G } from '../core/globals'
import { moireShader } from './moire-shader'
import { keyVisualizer } from './background'
import { sinewave } from './sine-wave'
import { envelope } from './envelope'
import { worms } from './worms'

export interface IVisual {

    id: number,
    sketch: P5[]
    remove: () => void
    restart: () => void
    pause: () => void
}

export let visualCount: number = 0

export class Visual {

    static _visualsEnabled: boolean = true
    static collapsed: boolean = false

    static visuals: Map<string, IVisual> = new Map()

    static activeVisual: IVisual


    static get visualsEnabled() { return this._visualsEnabled }
    static set visualsEnabled(v: boolean) {

        this._visualsEnabled = v

        if(!this.activeVisual) return

        if(Visual.visualsEnabled) Visual.activeVisual.restart()
        else Visual.activeVisual.pause()
    }


    static init() {

        this.visualsEnabled = true
        this.collapsed = false

        this.visuals = new Map()
    }

    static moire() {

        const name = 'moire'

        if(this.visuals.has(name)) {

            this.activeVisual = this.visuals.get(name)

            this.activeVisual.restart()

            return this.activeVisual
        }

        const m1 = new P5(moireShader)
        const m2 = new P5(moireShader)

        this.activeVisual = {

            id: visualCount++,
            sketch: [m1, m2],

            remove: () => {

                m1.remove()
                m2.remove()

                this.visuals.delete(name)

                this.activeVisual = null
            },
            pause: () => {

                m1.noLoop()
                m2.noLoop()
            },
            restart: () => {

                m1.loop()
                m2.loop()
            }
        }

        this.visuals.set(name, this.activeVisual)


        // Draw loop
        const onDraw = (time) => {

            m1.draw()
            m2.draw()
        }

        // G.beat.subscribe(onDraw)

        return this.activeVisual
    }
}