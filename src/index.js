
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

    effects.appendChild(ef.dom)
})



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

    G.w = window.innerWidth
    G.h = window.innerHeight

    const bg = (p5) => {

        p5.setup = () => {
            console.log('P5 SETUP')
            p5.createCanvas(G.w, G.h)
            p5.background('#161616')

            p5.canvas.style.position = 'absolute'
            p5.canvas.style.top = '0px'
            p5.canvas.style.left = '0px'
            p5.canvas.style.zIndex = '-1'
        }

        p5.draw = () => {

            p5.clear()
            
            p5.fill('#fefefeddad')
            p5.noStroke()
            p5.circle(G.w / 2, G.h / 2, (G.w / 10) * keyboard.activeNotes.length, (G.h / 10) * keyboard.activeNotes.length)

            for(let n of keyboard.activeNotes) {

                p5.fill('#fea5ca')
                p5.noStroke()
                p5[Math.random() > .5 ? 'circle' : 'rect'](
                    Math.random() * G.w, 
                    Math.random() * G.h, 
                    Math.random() * 100
                )
            }
        }

        p5.keyPressed = () => {

        }
    }

    let p5js = new P5(bg)

    console.log('canvas', p5js)
})

// ON CHANGE TAB
document.addEventListener('visibilitychange', (e) => {

    if (document.visibilityState == "visible") {}
    else keyboard.stopAll()  // TODO - NOT WORKING?????
})

// ON UNLOAD
window.onbeforeunload = () => {

    Storage.save(serializeOut())

    keyboard.dispose()
}