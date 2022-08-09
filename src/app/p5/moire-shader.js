import { Keyboard } from "../keyboard"
import { G } from "../globals"
import { Grid } from "../grid"

export const moireShader = (p5) => {

    let theShader

    let grid
    let cellPos

    p5.preload = () => {
        theShader = p5.loadShader('./shader/moire-vert.glsl', './shader/moire-frag.glsl');
    }

    p5.setup = () => {

        p5.createCanvas(G.w, G.h, p5.WEBGL)

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-5'

        grid = new Grid(G.w, G.h, 9, 4) // 9 * 4 = 36 (keys)
    }

    p5.draw = () => {

        p5.clear()

        p5.shader(theShader)

        theShader.setUniform("u_resolution", [G.w, G.h])
        theShader.setUniform("u_time", p5.millis() / 1000.0)


        for(let k of Keyboard.keys) {

            if(k.note + k.octave == G.keyboard.activeNotes[G.keyboard.activeNotes.length-1]) {

                cellPos = grid.getCellPosByNr(Keyboard.keyMap.indexOf(k.mapping))
                break
            }
        }

        if(!cellPos) cellPos = { x: G.w / 2, y: G.h / 2 }

        theShader.setUniform("u_mouse", [cellPos.x, cellPos.y])
        // theShader.setUniform("u_mouse", [p5.mouseX, p5.map(p5.mouseY, 0, G.h, G.h, 0)])

        p5.rect(0, 0, G.w, G.h)
    }

    p5.windowResized = () => { // TODO - aNOT WORKING

        p5.resizeCanvas(G.w, G.h)
        grid.setSize(G.w, G.h, 9, 4)
    }
}