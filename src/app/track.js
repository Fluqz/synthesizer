import * as Tone from 'tone'
import { Instrument } from './nodes/source/instrument'
import { Keyboard } from "./keyboard"
import { Oscillator } from "./nodes/source/oscillator"
import { Knob } from './view/knob'
import { Node } from './nodes/node'

export class TrackMenu {

    /** DOM Element */
    dom

    constructor() {

        this.dom = document.querySelector('#track-menu')


    }

    open() {}
    close() {}
    select() {}
}


export class Track {

    /** DOM Element */
    dom

    /** ToneJs Gain Node used for the track */
    gain
     
    /** Volume property */
    _volume 

    /** Instrument used */
    instrument 

    /** Node Chain */
    nodeChain

    /** Mute this track */
    isMuted

    /** HTML Button for muting */
    muteBtn


    constructor(instrument) {

        this.dom = document.createElement('div')
        this.dom.classList.add('track')

        let options = document.createElement('div')
        options.classList.add('track-options')
        this.dom.append(options)

        this._volume = .7

        this.gain = new Tone.Gain(this._volume)

        let volumeKnob = new Knob(this.volume, 0, 1)
        options.appendChild(volumeKnob.dom)
        volumeKnob.onChange.subscribe(v => this.volume = v)

        this.muteBtn = document.createElement('div')
        this.muteBtn.classList.add('btn')
        this.muteBtn.innerHTML = 'Mute'
        this.muteBtn.addEventListener('click', () => {
            this.mute(!this.isMuted)
        })
        options.append(this.muteBtn)

        this.instrument = instrument
        this.dom.append(this.instrument.dom)

        this.nodeChain = []

        this.connectNodeChain()

        // this.addNode(Keyboard.nodes['delay']())
    }

    get volume() { return this._volume }
    set volume(v) { 

        this._volume = v 

        if(this._volume == 0) this.mute(true)
        else this.mute(false)
    }

    mute(m) {
        
        this.isMuted = m === true ? true : false

        if(this.isMuted) this.gain.gain.value = 0
        else this.gain.gain.value = this.volume

        console.log('mute', this.volume, this.gain.gain.value)

        this.muteBtn.classList[this.isMuted ? 'add' : 'remove']('active')
    }

    /** Adds a node to the node chain */
    addNode(n) {

        this.nodeChain.push(n)

        n.onDelete.subscribe(this.removeNode.bind(this))

        this.dom.append(n.dom)

        this.connectNodeChain()
    }


    /** Connects all nodes in a chain */
    connectNodeChain() {

        let nodes = []

        this.instrument.disconnect()

        for(let n of this.nodeChain) {

            n.disconnect()
            nodes.push(n.instance)
        }

        nodes.push(this.gain)

        this.instrument.instance.chain(...nodes)
    }

    /** Remove a node from the node chain */
    removeNode(n) {

        let i = this.nodeChain.indexOf(n)

        if(i == -1) return

        n.disconnect()

        n.dom.parentNode.removeChild(n.dom)

        this.nodeChain.splice(i, 1)

        this.connectNodeChain()

        // this.onRemoveNode.next(n)
    }

    connect(i) {
        
        if(this.nodeChain.length > 0) 
            return this.nodeChain[this.nodeChain.length-1].connect(i instanceof Node ? i.instance : i)

        this.gain.connect(i instanceof Node ? i.instance : i)
    }

    disconnect(note) {
        
        if(this.nodeChain.length > 0) 
            return this.nodeChain[this.nodeChain.length-1].disconnect(i instanceof Node ? i.instance : i)

        this.gain.disconnect(i instanceof Node ? i.instance : i)
    }


    serializeIn(o) {

        if(o['mute']) this.mute(o['mute'])
        if(o['volume']) this.volume = o['volume']
        
        if(o['nodes'] && o['nodes'].length > 0) {
            
            for(let n of o['nodes']) {

                let node = Keyboard.nodes[n.name]()
                node.serializeIn(n)
                this.addNode(node)
            }

            this.enabled = o['enabled']
        }
    }

    serializeOut() {

        let nodes = []
        for(let n of this.nodeChain) nodes.push(n.serializeOut())

        return {
            muted: this.isMuted,
            oscillator: this.oscillator.serializeOut(),
            nodes: nodes,
            volume: this.volume
        }
    }
}