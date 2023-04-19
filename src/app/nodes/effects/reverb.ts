import * as Tone from 'tone'


import { Node } from "../node";



export class Reverb extends Node {

    declare instance: Tone.Reverb


    constructor() {

        super('Reverb')
        
    }
}