import * as RxJs from 'rxjs'

import { G } from './globals'

/** Represents a single Key on a Keyboard */
export class Key {

    /** Note string of this Key */
    note
    /** Octave of this Key */
    octave
    /** Keyboard mapping  */
    mapping
    /** Key DOM element */
    dom

    onTrigger
    onRelease

    constructor(note, octave, mapping) {

        this.note = note
        this.octave = octave
        this.mapping = mapping
        this.dom = document.createElement('div')
        this.dom.classList.add('key')
        this.dom.title = 'key'
        if(this.note[1] == '#' | this.note[1] === 'b') this.dom.classList.add('black')


        this.onTrigger = new RxJs.Subject()
        this.onRelease = new RxJs.Subject()

        this.dom.addEventListener('mousedown', this.trigger.bind(this), false)
        this.dom.addEventListener('mouseleave', this.release.bind(this), false)
        this.dom.addEventListener('mouseup', this.release.bind(this), false)

        this.updateText()
    }

    updateText() {

        this.dom.innerHTML = this.mapping.toUpperCase() + '</br>' + this.note + ' ' + this.octave
    }

    transformDOM() {

        // const r = (Math.random() - .5) * 50 * this.octave
        // this.dom.style.transform = 'rotate(' + r + 'deg)' // translateY(' + r / 2 + 'px)'
        const r = ((Math.random() * 2) + 1) 
        this.dom.style.transform = 'scale(' + r + ')' // translateY(' + r / 2 + 'px)'
        this.dom.style.transformOrigin = 'center'
    }

    resetTransformDOM() {

        this.dom.style.transform = ''
    }

    setOctave(o) {

        this.onRelease.next(this)

        this.octave = o
    }

    /** On Key down */
    trigger() {

        if(G.debug) console.log(`Trigger | mapping: ${this.mapping} note: ${this.note} octave: ${this.octave}`)

        this.dom.classList.add('pressed')

        this.onTrigger.next(this)

        this.transformDOM()
    }

    /** On Key up */
    release() {

        if(G.debug) console.log(`Release | mapping: ${this.mapping} note: ${this.note} octave: ${this.octave}`)

        this.dom.classList.remove('pressed')

        this.onRelease.next(this)

        this.resetTransformDOM()
    }

    dispose() {

        this.dom.removeEventListener('mousedown', this.trigger.bind(this), false)
        this.dom.removeEventListener('mouseleave', this.release.bind(this), false)
        this.dom.removeEventListener('mouseup', this.release.bind(this), false)

        this.onTrigger.complete()
        this.onTrigger.complete()
    }
}
