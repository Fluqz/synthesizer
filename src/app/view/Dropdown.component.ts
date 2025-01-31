



import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";


@Component({
    selector: 'sy-dropdown',
    imports: [CommonModule],
    template: `
    


    <div class="dropdown-wrapper">

        <!-- <label for="dropdown">{ name }</label> -->

        <div class="dropdown-options">

            <select *ngIf="options" class="dropdown-select" name="dropdown" [value]="value" (change)="onChange($event)">

                    <option *ngFor="let o of options" class="dropdown-option" [value]="o">

                        <div class="dropdown-option-text">{{ o }}</div>

                        <!-- <div class="btn delete" on:click={onDeleteOptionHandler}>&#x2715;</div> -->

                    </option>
            
                    <option *ngIf="fileUpload == true" class="dropdown-option" value="fileUpload" (click)="selectFileUpload($event)">

                        <div class="dropdown-option-text">{{ 'Upload file' }}</div>

                        <input type="file" class="dropdown-file-upload" name="filename" #inputElement (change)="onChangeUploadFileInput($event)">

                    </option>

            </select>

        </div>

    </div>



    
    `,
    styles: `
    
    :host {

        width: auto;
        height: auto;
    }
        
    .dropdown-wrapper {

        display: inline-block;
        text-align: center;

        font-size: 0.7rem;
        margin: 0px 10px 0px 10px;

        min-width: 50px;
        height: 25px;

        cursor: pointer;
    }

    .dropdown-options {

        width: 100%;
        height: 100%;
    }

    .dropdown-select {

        width: auto;
        height: inherit;

        /* padding: 0px 5px; */

        -webkit-appearance:none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;

        border: none;

        border-radius: 0px;

        /* background-color: transparent; */
        color: --c-w;

        text-align: center;

        font-size: inherit;
    }

    .dropdown-option {
        
        width: 100%;
        height: 100%;

        padding: 0px 10px;
    }

    .dropdown-option .dropdown-file-upload {


    }

    
    `
})
export class DropdownComponent {

    /** Name of Knob */
    @Input('name') name: string = ''
    
    private init: boolean = true
    private initValue: string | number
    private _value: string | number = ''
    /** value */
    @Input('value') 
    set value(v: string | number) {

        this._value = v

        if(this.init) {

            this.init = false
            this.initValue = this._value
        }
    }
    get value() { return this._value }
    /** Options */
    @Input('options') options: string[] | number[] = []

    @Input('deletableOptions') deletableOptions: boolean = true

    @Input('fileUpload') fileUpload: boolean = false


    @Output('onSelect') onSelect: EventEmitter<Event> = new EventEmitter()
    @Output('onDeleteOption') onDeleteOption: EventEmitter<Event> = new EventEmitter()
    @Output('onFile') onFile: EventEmitter<File> = new EventEmitter()

    @ViewChild('inputElement') 
    private _inputElement: ElementRef<HTMLInputElement>
    get inputElement() : HTMLInputElement { 

        if(this._inputElement == undefined) return null
        return this._inputElement.nativeElement
    }

    constructor() {

        // public initValue = value


        // if(value == undefined && options && options.length > 0) value = options[0]

    }


    public reset = () => {

        this.value = this.initValue
    }

    public onChange = (e: InputEvent) => {

        // console.log('change', e.target.value == 'fileUpload' || e.target.classList.contains('dropdown-file-upload'), e)

        const target = e.target as HTMLInputElement

        if(target.value == 'fileUpload' || target.classList.contains('dropdown-file-upload')) return

        this.onSelect.next(e)

        target.blur()
    }

    public onDeleteOptionHandler(e: Event) {

        this.onDeleteOption.next(e)
    }


    /** On selecting file upload option */
    public selectFileUpload = (e: MouseEvent) => {
        
        if(this.inputElement) {

            // console.log('ye')

            this.inputElement.click()
        }
    }

    public onChangeUploadFileInput = (e: InputEvent) => {

        const ele = e.target as HTMLInputElement

        const file = ele.files[0]

        // console.log('File incoming', e)

        this.onFile.next(file)

        ele.blur()
    }

}