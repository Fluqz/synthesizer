
import { Node, type INodeSerialization } from "../node"


export interface IEffectSerialization extends INodeSerialization{

    wet: number
}


/** Effect node */
export abstract class Effect extends Node {

    /** Bypass ratio. 1 = wet, 0 = dry. */
    protected _wet: number
    abstract get wet()
    abstract set wet(w) 

    constructor(name, wet) {

        super(name)

        this._wet = wet
    }

    override set enabled(e) { 

        this._enabled = e 
        
        this.wet = e ? this.wet : 0
    }
    override get enabled() { return this._enabled }


    override serializeIn(o: IEffectSerialization) {

        super.serializeIn(o)

        if(o.name != undefined) this.name = o.name
        if(o.enabled != undefined) this.enabled = o.enabled
        if(o.wet != undefined) this.wet = o.wet
    }

    override serializeOut() : IEffectSerialization {

        let no = super.serializeOut()

        return {

            ...no,
            name: this.name,
            enabled: this.enabled,
            wet: this.wet,
        }
    }
 }