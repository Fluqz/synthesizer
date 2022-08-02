
import './style.css'

import * as Tone from 'tone'
import { Keyboard } from './app/keyboard'
import { Knob } from './app/knob'

// Create Keyboard
const dom = document.querySelector('#keyboard')

const keyboard = new Keyboard(dom)

// Set octave buttons events
const octaveDown = document.querySelector('#octave-down')
const octaveUp = document.querySelector('#octave-up')

octaveDown.addEventListener('click', () => {

    console.log('Octave down')
    keyboard.setOctave(keyboard.octave - 1)
})

octaveUp.addEventListener('click', () => {

    console.log('Octave up')
    keyboard.setOctave(keyboard.octave + 1)
})

// Set arp button event
const arp = document.querySelector('#arp input')

arp.addEventListener('click', (e) => {

    console.log('ARP', e.target.checked)

    Keyboard.arp = e.target.checked
})

// Set delay button event
const delay = document.querySelector('#delay input')

delay.addEventListener('click', (e) => {

    console.log('delay', e.target.checked)

    keyboard.setDelay(e.target.checked)
})

delay.checked = keyboard.delayEnabled

// Set tremolo button event
const tremolo = document.querySelector('#tremolo input')

tremolo.addEventListener('click', (e) => {

    console.log('tremolo', e.target.checked)

    keyboard.setTremolo(e.target.checked)
})

tremolo.checked = keyboard.tremoloEnabled


// Set tremolo button event
const chorus = document.querySelector('#chorus input')

chorus.addEventListener('click', (e) => {

    console.log('chorus', e.target.checked)

    keyboard.setChorus(e.target.checked)
})

chorus.checked = keyboard.chorusEnabled




let knob = new Knob()

document.body.append(knob.dom)



const record = document.querySelector('#record')

record.addEventListener('mousedown', (e) => {

    keyboard.toggleRecording()
})







// Unload

window.onbeforeunload = () => {

    keyboard.dispose()
}