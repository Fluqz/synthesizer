import { Subject } from "rxjs"
import type { ISession, Synthesizer } from "../synthesizer"



export interface IPreset extends ISession {

    id: number
    name: string
}

export class PresetManager {

    presets: IPreset[]

    synthesizer: Synthesizer

    private presetID = 0

    onSavePreset: Subject<IPreset>
    onRemovePreset: Subject<IPreset>

    constructor(synthesizer: Synthesizer) {

        this.synthesizer = synthesizer

        this.presets = []

        this.onSavePreset = new Subject()
        this.onRemovePreset = new Subject()
    }

    savePreset(name: string) {

        for(let p of this.presets) { if(p.name === name) return false }

        const p: IPreset = this.synthesizer.getSessionObject() as IPreset
        p.id = this.presetID++
        p.name = name

        this.presets.push(p)

        this.onSavePreset.next(this.presets[this.presets.length-1])

        return true
    }

    loadPreset(name: string) : boolean {

        let preset
        for(let p of this.presets) {

            if(p.name == name) { 
                preset = p
                break
            }
        }

        if(!preset) return false

        this.synthesizer.serializeIn({
            currentSession: preset,
            presets: this.presets
        })

        return true
    }

    removePreset(name: string) : boolean {

        if(!name) return false

        for(let i = 0; i < this.presets.length; i++) {

            if(this.presets[i].name == name) {

                this.presets.splice(i, 1)
                this.onRemovePreset.next(this.presets[i])
            }
        }

        return true
    }

    setPresets(presets: IPreset[]) {

        this.presets = presets
    }
}
