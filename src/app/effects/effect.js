import { Subject } from 'rxjs'
import * as Tone from 'tone'




export class Effect {

    /** Tag/Name of effect */
    name

    /** Enabled flag */
    enabled

    /** ToneJs instance */
    instance

    /** HTML element */
    dom

    onDelete
    

    constructor(name) {

        console.log('Create Effect', name)

        this.name = name

        this.enabled = true

        this.dom = document.createElement('div')
        this.dom.classList.add('effect', this.name)

        const text = document.createElement('div')
        text.classList.add('effect-title')
        text.innerHTML = this.name[0].toUpperCase() + this.name.substr(1);
        this.dom.append(text)

        const x = document.createElement('div')
        x.classList.add('delete')
        x.innerHTML = 'x'
        this.dom.append(x)
        this.onDelete = new Subject()
        x.addEventListener('click', (e) => {

            this.dom.parentNode.removeChild(this.dom)
            this.onDelete.next(this)
        })
    }

    connect(e) {

        this.instance.connect(e instanceof Effect ? e.instance : e)
    }

    disconnect(e) {

        if(e) this.instance.disconnect(e instanceof Effect ? e.instance : e)
        else this.instance.disconnect()
    }

    serializeIn(o) {

        if(o['enabled']) this.enabled = o['enabled']
    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}