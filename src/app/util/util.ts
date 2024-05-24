


export class Util {

    static removeOctaveFromNote(note: string) : { n:string, o:number } {

        const i = note.search(/(?<=^|[-+])\-\d+|\d+|[-+]/g)

        const o = note.charAt(i)
        const n = note.replace(/(?<=^|[-+])\-\d+|\d+|[-+]/g, '')

        return { n, o: +o }
    }
}