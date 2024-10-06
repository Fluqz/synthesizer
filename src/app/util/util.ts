

export class Util {

    static removeOctaveFromNote(note: string) : { n:string, o:number } {

        // Regex: Get all positive and negative numbers
        // Get index of octave number
        const i = note.search(/(?<=^|[-+])\-\d+|\d+|[-+]/g)

        // Get number (octave)
        const o = note.charAt(i)

        // Get Note string
        const n = note.replace(/(?<=^|[-+])\-\d+|\d+|[-+]/g, '')

        
        return { n, o: +o }
    }

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    static getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}