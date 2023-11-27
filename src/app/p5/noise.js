import { Synthesizer } from "../synthesizer"
import { G } from "../core/globals"
import { Grid } from "../util/grid"
import { M } from "../util/math/math"
import { Visual } from "./visual"


export const noiseOptions = {

    timeMultiplier: 1
}

export const noise = (p5) => {

    let shader

    p5.preload = () => {
        shader = p5.loadShader('./shader/noise/noise-vert.glsl', './shader/noise/noise-frag.glsl');
    }

    p5.setup = () => {

        let p5Canvas = p5.createCanvas(G.w, G.h)
        p5Canvas.parent("p5-canvas-cont")

        p5.frameRate(24)
        // p5.noLoop()

        p5.noStroke()

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        // p5.canvas.style.zIndex = '-5'
    }

    p5.draw = () => {

        if(!Visual.visualsEnabled) {

            return
        }

        p5.shader(shader)

        shader.setUniform("u_resolution", [G.w, G.h])
        shader.setUniform("u_time", (p5.millis() / 1000) * noiseOptions.timeMultiplier)

        // shader.setUniform("u_mouse", [])

        p5.rect(0, 0, G.w, G.h)
    }

    p5.windowResized = () => { // TODO - aNOT WORKING

        p5.resizeCanvas(G.w, G.h)
    }


    let CID
    p5.keyPressed = () => { // TODO - aNOT WORKING

        if(Visual.visualsEnabled) return
    }
}