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

    

    constructor(name) {

        console.log('Create Effect', name)

        this.name = name

        this.enabled = true

        this.dom = document.createElement('div')
        this.dom.classList.add('effect', this.name)
        this.dom.innerHTML = this.name[0].toUpperCase() + this.name.substr(1);
    }

    connect(e) {

        this.instance.connect(e instanceof Effect ? e.instance : e)
    }

    disconnect(e) {

        if(e) this.instance.disconnect(e instanceof Effect ? e.instance : e)
        else this.instance.disconnect()
    }

    serializeIn(o) {


    }

    serializeOut() {

        return {

            name: this.name,
            enabled: this.enabled,
        }
    }
}