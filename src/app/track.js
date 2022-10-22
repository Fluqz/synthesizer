import * as Tone from 'tone'
import { Instrument } from './nodes/source/instrument'
import { Keyboard } from "./keyboard"
import { Oscillator } from "./nodes/source/oscillator"
import { Knob } from './view/knob'
import { Node } from './nodes/node'
import { TrackMenu } from './view/track-menu'


export class Track {

    /** DOM Element */
    dom

    /** ToneJs Gain Node used for the track */
    gain
     
    /** Volume property */
    _volume

    /** Instrument used */
    instrument 

    /** Array of added nodes. Nodes are chained in array order  */
    nodeChain

    /** Mute this track */
    isMuted

    /** HTML Button for muting */
    muteBtn


    mouseDownEvent

    constructor(instrument) {

        this.dom = document.createElement('div')
        this.dom.classList.add('track')
        this.dom.addEventListener('mousedown', this.mouseDownEvent = this.onMouseDown.bind(this))

        let options = document.createElement('div')
        options.classList.add('track-options', 'node')
        this.dom.append(options)

        this._volume = .7

        this.gain = new Tone.Gain(this._volume)

        let volumeKnob = new Knob('Volume', this.volume, 0, 1)
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
        if(instrument) this.dom.append(this.instrument.dom)

        this.nodeChain = []

        this.connectNodeChain()

        this.addNode(Keyboard.nodes.effects.delay())
    }

    get volume() { return this._volume }
    set volume(v) { 

        this._volume = v 

        if(this._volume == 0) this.mute(true)
        else this.mute(false)
    }

    mute(m) {
        
        this.isMuted = m === true ? true : false

        if(this.isMuted) this.gain.gain.setValueAtTime(0, Tone.context.currentTime)
        else this.gain.gain.setValueAtTime(this.volume, Tone.context.currentTime)

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

        if(this.instrument) {

            this.instrument.disconnect()

            for(let n of this.nodeChain) {

                n.disconnect()
                nodes.push(n.instance)
            }

            nodes.push(this.gain)

            this.instrument.chain(nodes)
        }
    }

    /** Remove a node from the node chain */
    removeNode(n) {

        let i = this.nodeChain.indexOf(n)

        if(i == -1) return

        n.disconnect()

        n.dom.parentNode.removeChild(n.dom)

        this.nodeChain.splice(i, 1)

        n.destroy()
        
        this.connectNodeChain()
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

    destroy() {

        this.dom.removeEventListener('mousedown', this.mouseDownEvent)

        for(let i = this.nodeChain.length; i >= 0; i--) this.removeNode(this.nodeChain[i])

        if(this.instrument) this.instrument.destroy()

        this.muteBtn.remove()
    }

    serializeIn(o) {

        if(o['mute']) this.mute(o['mute'])
        if(o['volume']) this.volume = o['volume']

        if(o['instrument']) {

            this.instrument = Keyboard.nodes[o['instrument']['name']]()
            this.dom.append(this.instrument.dom)
        }
        
        if(o['nodes'] && o['nodes'].length > 0) {
            
            for(let n of o['nodes']) {

                let node = Keyboard.nodes[n.name]()
                if(!node) { console.error('Track Serialize Node Error: Node is undefined. Node.name no match.'); continue}
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
            instrument: this.instrument == null ? undefined : this.instrument.serializeOut(),
            nodes: nodes,
            volume: this.volume
        }
    }






    onMouseDown(e) {


        if(e.target === this.dom) {

            TrackMenu.open(this, e.clientX, e.clientY)
        }
        else TrackMenu.close()
    }
}