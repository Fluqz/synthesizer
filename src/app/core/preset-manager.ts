import { Subject } from "rxjs"
import type { ISession, Synthesizer } from "../synthesizer"
import { DEFAULT_SESSION } from "../presets"



export interface IPreset extends ISession {

    id: number
    name: string
}

export class PresetManager {

    private presets: IPreset[]

    private synthesizer: Synthesizer

    private presetID = 0

    public default: IPreset

    public onSavePreset: Subject<IPreset>
    public onRemovePreset: Subject<IPreset>

    constructor(synthesizer: Synthesizer) {

        this.synthesizer = synthesizer

        this.presets = []

        this.default = {
            name: 'default',
            id: -1,
            ...DEFAULT_SESSION.currentSession
        }

        this.onSavePreset = new Subject()
        this.onRemovePreset = new Subject()
    }

    getPresets() { return this.presets }

    savePreset(name: string) {

        for(let p of this.presets) { if(p.name === name) return false }

        const p: IPreset = this.synthesizer.getSessionObject() as IPreset
        p.id = this.presetID++
        p.name = name

        this.presets.push(p)

        this.onSavePreset.next(this.presets[this.presets.length-1])

        return true
    }

    addPreset(preset: IPreset) {

        if(this.presets.find(p => p.name == preset.name)) return

        this.presets.push(preset)
    }

    loadPresetFromName(name: string) : boolean {

        let preset = this.presets.find(p => p.name == name)

        if(!preset) return false

        this.synthesizer.serializeIn({
            currentSession: preset,
            presets: this.presets
        })

        return true
    }


    loadPreset(preset: IPreset) : boolean {

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

    reset() {

        this.presets.length = 0
        this.presetID = 0
    }
}
