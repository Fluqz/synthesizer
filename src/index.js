
import './style.css'

import * as P5 from 'p5'
import * as Tone from 'tone'

import { Keyboard } from './app/keyboard'
import { Storage } from './app/core/storage'
import { Knob } from './app/view/knob'
import { G } from './app/core/globals'
import { moireShader } from './app/p5/moire-shader'
import { keyVisualizer } from './app/p5/background'
import { envelope } from './app/p5/envelope'
import { Dropdown } from './app/view/dropdown'


let keyboard
let dom
// ON LOAD
document.addEventListener('DOMContentLoaded', (e) => {

    G.w = window.innerWidth
    G.h = window.innerHeight

    // Create Keyboard
    dom = document.querySelector('#keyboard')
    keyboard = G.keyboard = new Keyboard(dom)

    // serializeIn(Storage.load())

    // Volume Button
    const volume = document.querySelector('#volume')
    const volumeKnob = new Knob(keyboard.volume, 0, 1)
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

    let ps = []
    for(let p of keyboard.presets) ps.push(p.name)

    let presetDropdown = new Dropdown(ps, undefined, false, true)
    presetDropdown.onSelectOption.subscribe((o) => {

        keyboard.loadPreset(o)
    })
    presetDropdown.onDeleteOption.subscribe((o) => {

        keyboard.removePreset(o)
    })
    loadPreset.appendChild(presetDropdown.dom)

    keyboard.onSavePreset.subscribe((p) => {

        presetDropdown.add(p.name)
    })
    keyboard.onRemovePreset.subscribe((p) => {

        presetDropdown.remove(p.name)
    })


    // Set octave buttons events
    const octaveDown = document.querySelector('#octave-down')
    const octaveUp = document.querySelector('#octave-up')

    octaveDown.addEventListener('click', () => {

        keyboard.setOctave(keyboard.octave - 1)
    })

    octaveUp.addEventListener('click', () => {

        keyboard.setOctave(keyboard.octave + 1)
    })



    // Synth select element
    // const synthsDropdownElement = document.querySelector('#synth-dropdown')

    // let synths = []
    // for(let s in Keyboard.synths) synths.push(s)

    // let synthsDropdown = new Dropdown(synths, keyboard.synth.voice.name)
    // synthsDropdown.onSelectOption.subscribe((o) => {

    //     keyboard.setSynth(o)
    // })
    // synthsDropdownElement.appendChild(synthsDropdown.dom)





    // Container of Tracks
    const tracksCont = document.querySelector('#tracks')













    // Node select element
    // const nodeDropdown = document.querySelector('#node-dropdown')

    // let nodes = []
    // for(let e in Keyboard.nodes) nodes.push(e)

    // let nodesDropdown = new Dropdown(nodes, undefined, true)
    // nodesDropdown.onSelectOption.subscribe((o) => {

    //     keyboard.addNode(Keyboard.nodes[o]())
    // })
    // nodeDropdown.appendChild(nodesDropdown.dom)

    // keyboard.onAddNode.subscribe((e) => { console.log('onaddnode');tracksCont.appendChild(e.dom) })
    // keyboard.onRemoveNode.subscribe((e) => { if(e.dom.parentNode) e.dom.parentNode.removeChild(e.dom) })







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





    let p5Shader = new P5(moireShader)

    let p5Background = new P5(keyVisualizer)

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


    // serializeIn(Storage.load())
})


// Serialize
const serializeIn = file => {

    // file = ''
    if(!file) return

    let o = JSON.parse(file)

    keyboard.serializeIn(o)
}

const serializeOut = () => {

    let o = keyboard.serializeOut()

    return JSON.stringify(o)
}

// ON CHANGE TAB
document.addEventListener('visibilitychange', (e) => {

    if (document.visibilityState == "visible") {

    }
    else {
        keyboard.stopAll()
    }  // TODO - NOT WORKING?????

    
})

window.addEventListener('resize', () => {

    G.w = window.innerWidth
    G.h = window.innerHeight
})

// ON UNLOAD
window.onbeforeunload = () => {

    // Storage.save(serializeOut())

    keyboard.dispose()
}