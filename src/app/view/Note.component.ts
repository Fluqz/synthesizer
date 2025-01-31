
import * as Tone from "tone";
import { Synthesizer } from "../synthesizer/synthesizer";
import { Sequencer, type SequenceObject } from "../synthesizer/sequencer";
import { Storage } from "../core/storage";
import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { CommonModule } from "@angular/common";



@Component({
    selector: 'sy-note',
    imports: [CommonModule],
    template: `
        
<div *ngIf="sequencer != undefined" class="note-wrapper">

    @if(getNoteWidth() < 30) {

        <div class="edit-note"
                [style.top.px]="yPos"
                [style.left.px]="((getSeconds(note.time) / sequencer.bars) * timelineRect.width)">

            <div class="btn" 
                    title="Note - Click to increase; Shift - Click to decrease" 
                    (pointerup)="onNoteClick($event, note)">{{ getNote(note) }}</div>
            <div class="btn" 
                    title="Octave - Click to increase; Shift - Click to decrease" 
                    (pointerup)="onOctaveClick($event, note)">{{ getOctave(note) }}</div>
        
        </div>
        
    }

    <div class="note" 
            [class.selected]="isSelected == true"
            (dblclick)="onNoteDblClick($event, note)"
            [style.top.px]="yPos"
            [style.height.px]="height"
            [style.left.px]="((getSeconds(note.time) / sequencer.bars) * timelineRect.width)"
            [style.width.px]="getNoteWidth()">

        
        <ng-content></ng-content>
        
        
        <div class="btn"
                title="Note - Click to increase; Shift - Click to decrease" 
                (pointerup)="onNoteClick($event, note)">{{ getNote(note) }}</div>
        <div class="btn"
                title="Octave - Click to increase; Shift - Click to decrease" 
                (pointerup)="onOctaveClick($event, note)">{{ getOctave(note) }}</div>
        
        <div class="velocity" [class.changed]="velocity < 1" [style.height]="velocity * 100 + '%'">
                            
        <!-- <div class="drag-handle drag-velocity" 
                (on:pointerdown)={(e) => onResizeHandlesDown(e, note, 'end')}
                (on:pointermove)={(e) => onResizeHandlesMove(e)}
                (on:pointerup)={(e) => onResizeHandlesUp(e)}></div> -->

        </div>
        
    </div>

</div>

`,
    styles: `

    :host {

        display: inline-block;
        width: auto;
        height: auto;
    }

    .note {
        z-index: 2;

        /* width: 25px; */
        position: absolute;

        width: 50px;
        min-width: 2px;
        height: 100%;

        background-color: var(--c-y);
        color: var(--c-o);

        /* opacity: .5; */

        text-align: center;

        display: inline-flex;
        justify-content: center;
        align-items: end;

        cursor: grab !important;

        mix-blend-mode: unset;
        /* border: .5px solid var(--c-w); */

        overflow: hidden;
    }

    .note.selected {
        background-color: var(--c-o);
        cursor: grabbing !important;
        z-index: 4;
    }

    .note.note.selected input {

        cursor: grabbing !important;
    }

    .note input {

        z-index: 2;

        min-width: unset;
        width: 50px;
        height: 25px;

        border: none;

        font-size: 1rem;

        text-align: center;

        background-color: transparent;

        padding: 0px;
        margin: 0px;
    }

    .note .btn {

        width: 15px;
        min-width: 15px;
        z-index: 2;
        background-color: transparent;
    }
    .note .btn:hover,
    .note .btn:active {

        background: unset;
        background-color: transparent;
        color: var(--c-b);
    }

    .note :global(.drag-handle)  {

        z-index: 3;

        position: absolute;
        top: 0px;

        width: 10px;
        height: 100%;

        cursor: ew-resize;

        background-color: #fff;

        opacity: .3;
    }

    .note :global(.drag-start)  {

        left: 0px;

    }

    .note :global(.drag-end) {

        right: 0px;
    }

    .note :global(.drag-velocity)  {

        left: 0px;

        width: 100%;
        height: 10px;

        cursor: row-resize;
    }

    .note :global(.velocity) {

        position:absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .note :global(.velocity.changed) {

        background-color: #fff;
        opacity: .7;
    }

    .edit-note {

        width: 50px;
        height: 25px;
    }

    `
})
export class NoteComponent implements OnDestroy {

    private _note: SequenceObject
    @Input('note') 
    set note(note: SequenceObject) {

        this._note = note
    }
    get note(): SequenceObject { return this._note }

    @Input('isSelected') isSelected: boolean = false
    @Input('timelineRect') timelineRect: DOMRect
    @Input('yPos') yPos: number = 0
    @Input('height') height: number = 0
    @Input('sequencer') sequencer: Sequencer

    @Output('onDelete') onDelete: EventEmitter<SequenceObject> = new EventEmitter()
    @Output('onDeleteSequencer') onDeleteSequencer: EventEmitter<Sequencer> = new EventEmitter()

    currentNote: string
    currentOctave: string
    width = 0
    velocity = .7
    rows: number = 1
    wrapperHeight: number = 100


    constructor() {}


    getSeconds(t: Tone.Unit.Time) {

        return Tone.Time(t).toSeconds()
    }

    /** DblClick Note Event 
     * TODO _------ -PUT IN TIMELINE!!!!!!
     */
    onNoteDblClick(e, note: SequenceObject) {

        e.stopPropagation()

        this.onDelete.next(this.note)
    }

    getNote(note: SequenceObject) {

        let n = Tone.Frequency(note.note).toNote().toString()

        const o = n[n.length - 1]

        n = n.replace(o, '')

        return n
    }

    getNoteWidth() {

        this.width = ((Tone.Time(this.note.length).toSeconds() / this.sequencer.bars) * this.timelineRect.width)
    }

    getOctave(note: SequenceObject) {

        let n = Tone.Frequency(note.note).toNote().toString()

        const o = n[n.length - 1]

        return o
    }

    onNoteClick(e, note: SequenceObject) {

        e.stopPropagation()

        this.currentNote = Tone.Frequency(note.note).toNote().toString()

        this.currentOctave = this.currentNote[this.currentNote.length - 1]

        this.currentNote = this.currentNote.replace(this.currentOctave, '')

        let i = Synthesizer.notes.indexOf(this.currentNote)

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i > Synthesizer.notes.length - 1) i = 0
        else if(i < 0) i = Synthesizer.notes.length - 1

        note.note = Synthesizer.notes[i] + this.currentOctave

        this.saveUndo()
    }

    onOctaveClick(e, note: SequenceObject) {

        console.log('onOctaveClick 1')

        e.stopPropagation()

        console.log('onOctaveClick 2')

        this.currentNote = Tone.Frequency(note.note).toNote().toString()

        this.currentOctave = this.currentNote[this.currentNote.length - 1]

        this.currentNote = this.currentNote.replace(this.currentOctave, '')

        let i = Synthesizer.octaves.indexOf(+this.currentOctave)

        if(!e.shiftKey) i++
        if(e.shiftKey) i--

        if(i > Synthesizer.octaves.length - 1) i = 0
        else if(i < 0) i = Synthesizer.octaves.length - 1

        note.note = this.currentNote + Synthesizer.octaves[i]

        this.saveUndo()
    }

    onDeleteHandler() {

        this.onDeleteSequencer.next(this.sequencer)
    }

    saveUndo() {

        Storage.saveUndo(JSON.stringify(this.sequencer.synthesizer.serializeOut()))
    }


    ngOnDestroy(): void {
        
    }
}