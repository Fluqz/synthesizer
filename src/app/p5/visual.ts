

import P5 from 'p5'

import * as Tone from 'tone'

import { moireShader, moireShaderOptions } from './moire-shader'
import { keyVisualizer } from './background'
import { sinewave } from './sine-wave'
import { envelope } from './envelope'
import { worms } from './worms'
import { noise } from './noise'
import { flowField, flowFieldOptions } from './flow-field'
import { COLORS, COLORS_RGB } from '../core/colors'

export interface IVisual {

    id: number,
    sketch: P5[]
    pause: () => void
    restart: () => void
    remove: () => void
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

        if (!Visual.activeVisual) return

        if (Visual.visualsEnabled) Visual.activeVisual.restart()
        else Visual.activeVisual.pause()
    }

    private static _container: HTMLElement
    static get container() {

        if(this._container == undefined) this._container = document.getElementById('p5-canvas-cont')

        return this._container || document.body
    }


    static init() {

        this.visualsEnabled = true
        this.collapsed = false

        this.visuals = new Map()
    }

    private static play(name: string, visual: IVisual) {

        if (this.visuals.has(name)) {

            this.activeVisual = this.visuals.get(name)

            this.activeVisual.restart()

            return this.activeVisual
        }
        else {

            this.activeVisual = visual

            this.visuals.set(name, this.activeVisual)
        }
    }

    static moire() {

        const name = 'moire'

        moireShaderOptions.timeMultiplier = .5
        const m1 = new P5(moireShader, this.container)

        moireShaderOptions.timeMultiplier = 0
        const m2 = new P5(moireShader, this.container)


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

        this.play(name, this.activeVisual)
    }


    static noise() {

        const name = 'noise'

        const m1 = new P5(noise, this.container)


        this.activeVisual = {

            id: visualCount++,
            sketch: [m1],

            remove: () => {

                m1.remove()

                this.visuals.delete(name)

                this.activeVisual = null
            },
            pause: () => {

                m1.noLoop()
            },
            restart: () => {

                m1.loop()
            }
        }

        this.play(name, this.activeVisual)
    }


    static flowField() {

        const name = 'flow-field'

        const m1 = new P5(flowField, this.container)


        var IID = Tone.Transport.scheduleRepeat(() => {

            // flowFieldOptions.modulator += 1

            if(Tone.Transport.state == 'started') flowFieldOptions.modulator = Math.round(Math.random() * 100)

            // console.log(flowFieldOptions.modulator)


            let colors = JSON.parse(JSON.stringify(COLORS_RGB))

            const rndCI = Math.round(Math.random() * (colors.length-1))

            flowFieldOptions.modulatorColor = colors[rndCI]

            // flowFieldOptions.modulator = 2
            // console.log('modulator', flowFieldOptions.modulator, colors[rndCI])

        }, '2m')

        
        this.activeVisual = {

            id: visualCount++,
            sketch: [m1],

            remove: () => {

                m1.remove()

                this.visuals.delete(name)

                this.activeVisual = null

                window.clearInterval(IID)
            },
            pause: () => {

                m1.noLoop()
            },
            restart: () => {

                m1.loop()
            }
        }

        this.play(name, this.activeVisual)
    }


    static openInNewWindow() {

        console.log('openInNewWindow')

        const win = window.open('./visual.html', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')

    }

}