import { Component } from "@angular/core"





@Component({


    selector: 'sy-custom-wave',
    standalone: true,
    imports: [ ],
    template: `
    

    `
})
export class CustomWaveComponent {


    partialCount: number = 32


    constructor() {

        this._partials = []
    }


    private _partials: number[]
    set partials(ps: number[]) {

        this._partials = ps
        
        if (!this._partials) {
            
        }
    }
}