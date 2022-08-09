
import './style.css'

import * as Tone from 'tone'
import * as P5 from 'p5'

import { Keyboard } from './app/keyboard'
import { Storage } from './app/storage'
import { Knob } from './app/knob'
import { G } from './app/globals'


// Create Keyboard
const dom = document.querySelector('#keyboard')
const keyboard = new Keyboard(dom)

// Volume Button
const volume = document.querySelector('#volume')
const volumeKnob = new Knob(keyboard.volume.gain.value, 0, 1)
volumeKnob.onChange.subscribe((v) => { keyboard.setVolume(v) })
volume.append(volumeKnob.dom)

// Save preset input
const savePreset = document.querySelector('#save-preset')
savePreset.value = ''
savePreset.addEventListener('keydown', (e) => {

    e.stopPropagation()

    if(e.key == 'Enter' && e.target.value != null) {
        keyboard.savePreset(e.target.value)
    }
})

// Load preset select
const loadPreset = document.querySelector('#load-preset')
loadPreset.addEventListener('change', (e) => {

    keyboard.loadPreset(e.target.value)
    e.target.blur()
})

// Dynamically add select options
const addSelectOptions = () => {
    // for(let c of loadPreset.childNodes) c.remove()
    for(let p of keyboard.presets) {

        const o = document.createElement('option')
        o.value = o.innerHTML = p.name
        loadPreset.append(o)
    }
}

keyboard.onSavePreset.subscribe(addSelectOptions)
keyboard.onRemovePreset.subscribe(addSelectOptions)


// Set octave buttons events
const octaveDown = document.querySelector('#octave-down')
const octaveUp = document.querySelector('#octave-up')

octaveDown.addEventListener('click', () => {

    keyboard.setOctave(keyboard.octave - 1)
})

octaveUp.addEventListener('click', () => {

    keyboard.setOctave(keyboard.octave + 1)
})

// // Set arp button event
// const arp = document.querySelector('#arp input')

// arp.addEventListener('click', (e) => {

//     console.log('ARP', e.target.checked)

//     Keyboard.arp = e.target.checked
// })

// Synth select element
const synthSelect = document.querySelector('#synth-select')

synthSelect.addEventListener('change', (e) => {

    keyboard.setSynth(e.target.value)
})


// Container of effects
const effects = document.querySelector('#effects')
// Effect select element
const effectSelect = document.querySelector('#effect-select')

effectSelect.addEventListener('change', (e) => {

    let ef = Keyboard.getEffect(e.target.value)
    keyboard.addEffect(ef)
})

keyboard.onAddEffect.subscribe((e) => { effects.appendChild(e.dom) })
keyboard.onRemoveEffect.subscribe((e) => { if(e.dom.parentNode) e.dom.parentNode.removeChild(e.dom) })



// Toggle recording button
const record = document.querySelector('#record')

record.addEventListener('mousedown', (e) => {

    keyboard.toggleRecording()
})

keyboard.onRecordingStart.subscribe(() => {

    record.classList[keyboard.isRecording ? 'add' : 'remove']('recording')
})
keyboard.onRecordingEnd.subscribe(() => {

    record.classList[keyboard.isRecording ? 'add' : 'remove']('recording')
})

// Reset keyboard button
const reset = document.querySelector('#reset')

reset.addEventListener('mousedown', (e) => {

    keyboard.reset()
})




// Serialize
const serializeIn = file => {

    if(!file) return

    let o = JSON.parse(file)

    keyboard.serializeIn(o)

    // TODO - THIS IS NOT RIGHT
    for(let ef of keyboard.effectChain) effects.appendChild(ef.dom)

}

const serializeOut = () => {

    let o = keyboard.serializeOut()

    return JSON.stringify(o)
}

// ON LOAD
document.addEventListener('DOMContentLoaded', (e) => {

    serializeIn(Storage.load())
    addSelectOptions()

    G.w = window.innerWidth
    G.h = window.innerHeight

    const bg = (p5) => {

        p5.setup = () => {

            p5.createCanvas(G.w, G.h)
            p5.background('#161616')

            p5.canvas.style.position = 'absolute'
            p5.canvas.style.top = '0px'
            p5.canvas.style.left = '0px'
            p5.canvas.style.zIndex = '-1'
        }

        p5.draw = () => {

            p5.clear()

            // p5.fill('#fea5caff')
            p5.fill('#181818')
            p5.noStroke()
            p5[Math.random() > .5 ? 'circle' : 'rect'](
                Math.random() * G.w,
                Math.random() * G.h,
                Math.random() * Math.max(G.w, G.h)
            )

            
            if(keyboard.activeNotes.length > 0) {
                       
                let i = 1
                for(let n of keyboard.activeNotes) {

                    p5.noFill()
                    p5.stroke('#fefefedd')
                    p5.strokeWeight(5)
                    p5.circle(G.w / 2, G.h / 2, (G.w / 8) * i, (G.h / 8) * i)

                    i++
                }
            }
            // p5.fill('#161616')
            // p5.noStroke()
            // p5.circle(G.w / 2, G.h / 2, (G.w / 10) * keyboard.activeNotes.length - 3, (G.h / 10) * keyboard.activeNotes.length - 3)

            for(let n of keyboard.activeNotes) {

                for(let i = 0; i < 50; i++) {

                    // p5.fill('#fea5caff')
                    p5.fill('#ffffffff')
                    p5.noStroke()
                    p5[Math.random() > .5 ? 'circle' : 'rect'](
                        Math.random() * G.w,
                        Math.random() * G.h,
                        Math.random() * 5
                    )
                }
            }
        }

        p5.keyPressed = () => {

        }
    }

    let p5Background = new P5(bg)


    let envelope = (p5) => {

        p5.setup = () => {

            p5.createCanvas(G.w, G.h)
            p5.background('#FFFFFF00')

            p5.canvas.style.position = 'absolute'
            p5.canvas.style.top = '0px'
            p5.canvas.style.left = '0px'
            p5.canvas.style.zIndex = '-1'
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
            p5.circle(x + (xStep * 1), y - (keyboard.synth.options.voice0.envelope.attack * yStep), 20)
            p5.circle(x + (xStep * 2), y - (keyboard.synth.options.voice0.envelope.decay * yStep), 20)
            p5.circle(x + (xStep * 3), y - (keyboard.synth.options.voice0.envelope.sustain * yStep), 20)
            p5.circle(x + (xStep * 4), y - (keyboard.synth.options.voice0.envelope.release * yStep), 20)


            p5.line(x, y, x + (xStep * 1), y - (keyboard.synth.options.voice0.envelope.attack * yStep))
            p5.line(x + (xStep * 1), y - (keyboard.synth.options.voice0.envelope.attack * yStep), x + (xStep * 2), y - (keyboard.synth.options.voice0.envelope.decay * yStep))
            p5.line(x + (xStep * 2), y - (keyboard.synth.options.voice0.envelope.decay * yStep), x + (xStep * 3), y - (keyboard.synth.options.voice0.envelope.sustain * yStep))
            p5.line(x + (xStep * 3), y - (keyboard.synth.options.voice0.envelope.sustain * yStep), x + (xStep * 4), y - (keyboard.synth.options.voice0.envelope.release * yStep))
            p5.line(x + (xStep * 4), y - (keyboard.synth.options.voice0.envelope.release * yStep), G.w, G.h)

            // console.log('ENV', keyboard.envelope.attack, keyboard.envelope.decay, keyboard.envelope.sustain, keyboard.envelope.release)
                            
            // const waveform = new Tone.Waveform()
            // keyboard.synth.connect(waveform)

            // console.log(waveform, waveform.getValue())

        }
    }

    let p5Envelope = new P5(envelope)

    // const attackKnob = new Knob(keyboard.synth.options.voice0.envelope.attack, 0, 2)
    // attackKnob.onChange.subscribe((v) => { keyboard.synth.options.voice0.envelope.attack = v })
    // document.body.append(attackKnob.dom)
    // const decayKnob = new Knob(keyboard.synth.options.voice0.envelope.decay, 0, 2)
    // decayKnob.onChange.subscribe((v) => { keyboard.synth.options.voice0.envelope.decay = v })
    // document.body.append(decayKnob.dom)
    // const sustainKnob = new Knob(keyboard.synth.options.voice0.envelope.sustain, 0, 1)
    // sustainKnob.onChange.subscribe((v) => { keyboard.synth.options.voice0.envelope.sustain = v })
    // document.body.append(sustainKnob.dom)
    // const releaseKnob = new Knob(keyboard.synth.options.voice0.envelope.release, 0, 5)
    // releaseKnob.onChange.subscribe((v) => { keyboard.synth.options.voice0.envelope.release = v })
    // document.body.append(releaseKnob.dom)


})

// ON CHANGE TAB
document.addEventListener('visibilitychange', (e) => {

    if (document.visibilityState == "visible") {}
    else keyboard.stopAll()  // TODO - NOT WORKING?????
})

window.addEventListener('resize', () => {

    // Change p5 canvas size
})

// ON UNLOAD
window.onbeforeunload = () => {

    Storage.save(serializeOut())

    keyboard.dispose()
}