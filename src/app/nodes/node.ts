import type * as Tone from 'tone'

/** Represents a Node that can be connected to eachother */
export interface Node {

    /** Tag/Name of node */
    name: string

    /** Enabled flag */
    enabled: boolean

    onDelete?

    destroy?(): void

    /** Change class properties by passing in a javascript object */
    serializeIn(o) : void

    /** Creates a javascript object containing all data to recreate the state of this class. */
    serializeOut() : {}
}