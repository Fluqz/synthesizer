import { Synthesizer } from "../synthesizer"
import { G } from "../core/globals"
import { Grid } from "../util/grid"
import { M } from "../util/math/math"
import { Visual } from "./visual"


export let moireShaderOptions = { timeMultiplier: null }

export const moireShader = (p5) => {

    let timeMultiplier = moireShaderOptions.timeMultiplier

    let shader

    let grid
    let oldCellPos = { x: 0, y: 0 }
    let currentCellPos = { x: 200, y: 200 }
    let newCellPos = { x: 0, y: 0 }
    let increment = 40
    let isAnimating = false
    let IVID

    let tIncrement = Math.random() / 30 + .1
    let t = 0

    let passFrame = true

    p5.preload = () => {
        shader = p5.loadShader('./shader/moire-vert.glsl', './shader/moire-frag.glsl');
    }

    p5.setup = () => {

        // p5grain.setup()
        // granulateSimple(42)


        p5.createCanvas(G.w, G.h, p5.WEBGL)

        p5.frameRate(24)
        // p5.noLoop()

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-5'


        grid = new Grid(G.w, G.h, 9, 4) // 9 * 4 = 36 (keys)
        // grid = new Grid(100, 100, 9, 4) // 9 * 4 = 36 (keys)

        // oldCellPos = grid.getCellPosByNr(Synthesizer.keyMap.indexOf(Math.round(Synthesizer.keyMap.length / 2)))


    }

    p5.draw = () => {

        if(!Visual.visualsEnabled) {

            return
        }

        // if(!passFrame) { return }
        // else {

        //     passFrame = false
        // }

        // console.log('draw')

        // p5.clear()

        p5.shader(shader)

        shader.setUniform("u_resolution", [G.w, G.h])
        shader.setUniform("u_time", (p5.millis() / 200.0) * timeMultiplier)
        // shader.setUniform("u_color1", M.map(-1, 1, 0, 1, Math.cos((Tone.now() * .5))))
        // shader.setUniform("u_color2", M.map(-1, 1, 0, 1, Math.sin((Tone.now()) + 2)))
        // shader.setUniform("u_color3", M.map(-1, 1, 0, 1, Math.cos((Tone.now()) + 5)))
        shader.setUniform("u_color1", M.map(-1, 1, 0, 1, Math.cos((0 * .5))))
        shader.setUniform("u_color2", M.map(-1, 1, 0, 1, Math.sin((0) + 2)))
        shader.setUniform("u_color3", M.map(-1, 1, 0, 1, Math.cos((0) + 5)))
        shader.setUniform("u_activeNotes", M.map(0, 3, .5, 1.5, Synthesizer.activeNotes.size))
        shader.setUniform("u_osc", G.osc.y)

        // console.log(M.map(-1, 1, 0.99, 1, Math.sin(Tone.now())))

        if(true) {

            // Get last pressed key
            let key = Synthesizer.keys.find((k) => {

                if(k.note + k.octave == Array.from(Synthesizer.activeNotes).pop()) return k
            })

            // If key set position from key index in keymap array
            if(key) {

                oldCellPos.x = newCellPos.x
                oldCellPos.y = newCellPos.y

                newCellPos = grid.getCellPosByNr(Synthesizer.keyMap.indexOf(key.mapping))
            }

            if(!newCellPos) newCellPos = { x: G.w / 2, y: G.h / 2 }



            // Did cellpos change?
            if((oldCellPos.x !== newCellPos.x || oldCellPos.y !== newCellPos.y)) {

                // console.log('other pos', oldCellPos, newCellPos)

                currentCellPos.x = oldCellPos.x
                currentCellPos.y = oldCellPos.y


                let tmpCellPos = {}

                let normal

                let time = (Math.random() * 500) + 100
                let rMin = 33.33333 // ~30fps
                let rMax = 110
                let randomMizeIntervalLength = Math.random() * 100
                let interval = Math.round(Math.random() * (rMax - rMin)) + rMin

                // Get interpolation step as vec3
                increment = M.getDistanceVector(oldCellPos, newCellPos) / (time / interval)

                // console.log('increment', increment)
                // console.log('Clear')

                // console.log('old', oldCellPos)
                // console.log('new', newCellPos)

                isAnimating = true

                window.clearInterval(IVID)

                IVID = window.setInterval(() => {

                    // console.log('ANIMATE')

                    tmpCellPos.x = currentCellPos.x
                    tmpCellPos.y = currentCellPos.y
                    
                    normal = M.getDirectionVector(currentCellPos, newCellPos)
                    normal = M.getNormalizedVector(normal)
                    // console.log('normal', normal)
        
                    tmpCellPos.x += normal.x * increment
                    tmpCellPos.y += normal.y * increment

                    // console.log('d', M.getDirectionVector(currentCellPos, tmpCellPos))

                    // console.log('check', oldCellPos, tmpCellPos, newCellPos, )
                    // console.log('diff', M.getDistanceVector(currentCellPos, newCellPos), M.getDistanceVector(tmpCellPos, newCellPos))

                    if(M.getDistanceVector(currentCellPos, newCellPos) >= M.getDistanceVector(tmpCellPos, newCellPos)) {

                        // console.log('curr', currentCellPos)
                        currentCellPos.x = tmpCellPos.x
                        currentCellPos.y = tmpCellPos.y

                        // console.log('interpolating')

                    }
                    else {
                        // console.log('Clear2')
                        window.clearInterval(IVID)
                        isAnimating = false
                        oldCellPos.x = newCellPos.x
                        oldCellPos.y = newCellPos.y
                        currentCellPos.x = newCellPos.x
                        currentCellPos.y = newCellPos.y

                        // console.log('stop animation')

                    }


                    shader.setUniform("u_mouse", [
                        M.map(0, G.w, -200, 200, currentCellPos.x), 
                        M.map(0, G.h, -200, 200, currentCellPos.y)
                    ])

                    // console.log('interval')

                }, interval + randomMizeIntervalLength)
            }
            else {

                t += tIncrement
                // console.log((Math.sin(t)), t)
                shader.setUniform("u_mouse", [
                    M.map(0, G.w, -200, 200, currentCellPos.x + (Math.sin(t) * 10)), 
                    M.map(0, G.h, -200, 200, currentCellPos.y + (Math.cos(t) * 20))
                ])
            }
        }

        // shader.setUniform("u_mouse", [p5.mouseX, p5.map(p5.mouseY, 0, G.h, G.h, 0)])
        // shader.setUniform("u_mouse", [
        //     M.map(0, G.w, -G.w / 2, G.w, p5.mouseX), 
        //     M.map(0, G.h, -G.h / 2, G.h, p5.mouseY)
        // ])



        // // constant
        // const m = [
        //     M.map(0, G.w, -200, 200, p5.mouseX), 
        //     M.map(0, G.h, -120, 130, p5.mouseY)
        // ]

        // console.log('xy', m)

        // shader.setUniform("u_mouse", m)


        p5.rect(0, 0, G.w, G.h)
    }

    let resizeID
    p5.windowResized = () => { // TODO - aNOT WORKING

        clearTimeout(resizeID)
        resizeID = setTimeout(() => {

            p5.resizeCanvas(G.w, G.h)
            grid.setSize(G.w, G.h, 9, 4)

        })
    }


    let CID
    p5.keyPressed = () => { // TODO - aNOT WORKING

        if(Visual.visualsEnabled) return

        // Trigger frame on keydown
        p5.draw()

        // Clear idle animation
        clearInterval(CID)


        // Trigger animation for a short duration
        let IID = setInterval(() => {

            p5.draw()

        }, 50)


        // End key interval and trigger idle animation
        setTimeout(() => {

            clearInterval(IID)

        }, 1000) // Animate on keydown for a second
    }
}