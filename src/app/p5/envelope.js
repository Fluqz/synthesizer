import { G } from '../core/globals'

export const envelope = (p5) => {

    p5.setup = () => {

        p5.createCanvas(G.w, G.h)
        p5.background('#FFFFFF')

        p5.canvas.style.position = 'absolute'
        p5.canvas.style.top = '0px'
        p5.canvas.style.left = '0px'
        p5.canvas.style.zIndex = '-3'
    }

    p5.draw = () => {

        p5.clear()

        return

        const x = 0
        const xStep = G.w / 4
        const y = G.h
        const yStep = G.h / 10

        p5.stroke('#ffffff')
        
        p5.circle(x, y, 20)
        p5.circle(x + (xStep * 1), y - (G.keyboard.synth.options.voice0.envelope.attack * yStep), 20)
        p5.circle(x + (xStep * 2), y - (G.keyboard.synth.options.voice0.envelope.decay * yStep), 20)
        p5.circle(x + (xStep * 3), y - (G.keyboard.synth.options.voice0.envelope.sustain * yStep), 20)
        p5.circle(x + (xStep * 4), y - (G.keyboard.synth.options.voice0.envelope.release * yStep), 20)


        p5.line(x, y, x + (xStep * 1), y - (G.keyboard.synth.options.voice0.envelope.attack * yStep))
        p5.line(x + (xStep * 1), y - (G.keyboard.synth.options.voice0.envelope.attack * yStep), x + (xStep * 2), y - (G.keyboard.synth.options.voice0.envelope.decay * yStep))
        p5.line(x + (xStep * 2), y - (G.keyboard.synth.options.voice0.envelope.decay * yStep), x + (xStep * 3), y - (G.keyboard.synth.options.voice0.envelope.sustain * yStep))
        p5.line(x + (xStep * 3), y - (G.keyboard.synth.options.voice0.envelope.sustain * yStep), x + (xStep * 4), y - (G.keyboard.synth.options.voice0.envelope.release * yStep))
        p5.line(x + (xStep * 4), y - (G.keyboard.synth.options.voice0.envelope.release * yStep), G.w, G.h)

        // console.log('ENV', G.keyboard.envelope.attack, G.keyboard.envelope.decay, G.keyboard.envelope.sustain, G.keyboard.envelope.release)
                        
        // const waveform = new Tone.Waveform()
        // G.keyboard.synth.connect(waveform)

        // console.log(waveform, waveform.getValue())

    }

    p5.windowResized = () => {

        p5.resizeCanvas(G.w, G.h)
    }
}