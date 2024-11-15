
import * as Tone from "tone";
import { Sequencer, type NoteLength, type SequenceObject } from "../synthesizer/sequencer";
import { Storage } from "../core/storage";
import { BeatMachine } from "../synthesizer/beat-machine";
import { timer, type Subscription } from "rxjs";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from "@angular/core";
import { NoteComponent } from "./Note.component";
import { CommonModule } from "@angular/common";
import { Synthesizer } from "../synthesizer/synthesizer";


export const convertNoteLength = (n: NoteLength) => {

    switch(n) {

        case '1': return '1n'
        case '1/2': return '2n'
        case '1/4': return '4n'
        case '1/8': return '8n'
        case '1/16': return '16n'
        case '1/32': return '32n'
        case '1/64': return '64n'
    }
}

@Component({

    selector: 'sy-timeline',
    standalone: true,
    imports: [ CommonModule, NoteComponent ],
    template: `


    <div *ngIf="sequencer != undefined" class="timeline-wrapper" >

        <div class="timeline"
                #timeline
                [style.height.px]="wrapperHeight"
                (pointerdown)="onTimelineClick($event)"
                (dblclick)="onTimelineDblClick($event)"
                (resize)="onResizeTimeline($event)">
            
            <div *ngIf="timelineRect != undefined">

                <div class="timeline-ui">

                    <div *ngIf="sequencer.isPlaying == true" class="current-line" [style.left.px]="currentLinePos"></div>

                    @for(_ of barArray; track _; let bar = $index) {

                        <div class="bar" 
                                [style.width.px]="barWidth"
                                [style.left.px]="barPositionArray[bar]">

                            @for(__ of barDivisionsArray; track __; let noteLine = $index) {

                                <div class="note-line" [style.left.px]="((((timelineRect.width / bars) / barDivisions) * noteLine) - .5)"></div>
                            }

                        </div>

                        <div class="bar-line" [style.left.px]="(((timelineRect.width / bars) * bar) - 1)"></div>
                    }

                    <div class="bar-line" [style.right.px]="-1" [style.left]="'unset'"></div>

                </div>

                <div class="timeline-notes">

                    @for(note of sequence; track note; let i = $index;) {

                        <sy-note [note]="getSequenceObject(note)"
                                (pointerdown)="notePointerDown($event, note)"
                                [sequencer]="sequencer"
                                [timelineRect]="timelineRect"
                                [yPos]="noteYArray[i]"
                                [height]="noteHeight"
                                (onDelete)="removeNote($event.target)">
                            
                                            
                            <div class="drag-handle drag-start"
                                    (pointerdown)="resizeNoteStartHandler($event, note, 'start')"></div>
                                    
                            <div class="drag-handle drag-end"
                                    (pointerdown)="resizeNoteStartHandler($event, note, 'end')"></div>

                        </sy-note>

                    }

                </div>

            </div>

        </div>

    </div>

`,
    styles: `

    :host {

        display:block;
        width: 100%;
        height: auto;
    }

    .timeline {

        mix-blend-mode: color-dodge;
        mix-blend-mode: unset;

        position: relative;

        width: 100%;
        height: 100px;
    }

    .timeline .timeline-notes,
    .timeline .timeline-ui {

        position: absolute;

        width: 100%;
        height: 100%;
    }


    .timeline .bar {

        position: absolute;
        left: 0px;
        top: 0px;

        max-width: 2000px;
        min-width: 40px;
        height: 100%;

        text-align: center;
    /* 
        background-color: var(--c-w);
        opacity: .01; */
    }
    .timeline .bar-line {

        z-index: 1;
        position: absolute;
        left: -.5px;
        top: 0px;
        height: 100%;
        width: 1px;

        background-color: var(--c-y);
    }
    .timeline .note-line {

        z-index: 1;
        position: absolute;
        left: -.5px;
        top: 0px;
        height: 100%;
        width: 1px;
        opacity: .3;

        background-color: var(--c-y);
    }

    .timeline .current-line {

        z-index: 1;
        position: absolute;
        left: 1px;
        top: 0px;
        height: 100%;
        width: 2px;
        opacity: 1;

        background-color: #fff;
    }
    .timeline .add-remove-cont {

        height: 100%;
        width: 50px;
    }
    
    .timeline .remove-bar,
    .timeline .add-bar {

        display: inline-flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        width: 50px;
        height: 50%;
        background-color: var(--c-w);
        color: var(--c-b);
    }

    .timeline .remove-bar:hover,
    .timeline .add-bar:hover {

        background-color: var(--c-b);
        color: var(--c-y);
    }

`,
    host: {

        // '(pointermove)': 'notePointerMove($event)',
    }
})
export class TimelineComponent implements OnChanges {

    /** Instance of the Sequencer */
    @Input('sequencer') sequencer: Sequencer

    @Input('sequence')
    get sequence(): SequenceObject[] { return this._sequence }
    set sequence(s: SequenceObject[]) {

        this._sequence = s

        this.update()
    }
    private _sequence: SequenceObject[]

    noteYArray: number[] = []

    @Input('bars')
    get bars(): number { return this._bars }
    set bars(b: number) { 

        this._bars = b

        this.update()
    }
    private _bars: number = 1

    barWidth: number = 0
    barPositionArray: number[] = []
    barArray: number[] = []
    barDivisions: number = 16
    barDivisionsArray: number[] = []

    /** Height of a single note */
    noteHeight: number = 100

    /** Height of the html wrapper of the timeline. */
    wrapperHeight: number = 100

    /** Counts how many rows of notes are in the timeline  */
    rows: number = 1

    /** HTML Timline line x position */
    currentLinePos = 0

    /** Observable of the Beat for timeline */
    timelineObserver: Subscription

    /** Timeline HTML element ref */
    @ViewChild('timeline')
    private _timeline: ElementRef<HTMLElement>
    /** Timeline HTML element ref */
    get timeline() : HTMLElement { 
        
        if(this._timeline == null) return null

        this.timelineRect = this._timeline.nativeElement.getBoundingClientRect()

        return this._timeline.nativeElement 
    }

    /** Timeline's client rect object */
    timelineRect: DOMRect

    /** Selected note object */
    private selectedNote: SequenceObject
    /** Temporary object for altering the selected note */
    private alteredSequenceObject: SequenceObject

    private isPointerDown = false
    private isNoteDrag = false
    private noteEle: HTMLElement
    private clickOffsetX: number = 0
    private clickOffsetY: number = 0
    private noteRect: DOMRect
    
    constructor(public cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {

        this.onResizeTimeline()

        if(this.sequencer == undefined) return 

        // Update position of timeline line
        this.timelineObserver = BeatMachine.subscribeTimeLine((t) => {

            const startTime = this.sequencer.startTime

            if(!Number.isNaN(startTime)) {

                Tone.Draw.schedule(() => {

                    if(this.sequencer.isPlaying) {

                        this.currentLinePos = ((((Tone.immediate() - startTime) % this.bars)) * (this.timelineRect.width / this.bars))

                        this.cdr.detectChanges()
                    }
                        
                    else this.currentLinePos = 0

                }, t)
            }
        })

        this.update()
    }

    getBarArray() {

        this.barArray.length = 0

        for(let i = 0; i < this.bars; i++) this.barArray.push(i)

        return this.barArray
    }

    getBarDivisionsArray() {

        this.barDivisionsArray.length = 0

        for(let i = 0; i < this.barDivisions; i++) this.barDivisionsArray.push(i)

        return this.barDivisionsArray
    }

    getBarPositionArray() {

        this.barPositionArray.length = 0

        for(let i = 0; i < this.bars; i++) this.barPositionArray.push(this.getBarLeftPosition(i))

        return this.barPositionArray
    }

    ngOnChanges() {

        this.update()
        if(this.selectedNote) this.getSequenceObject(this.selectedNote)
    }


    ngOnDestroy() {

        this.timelineObserver.unsubscribe()

        Tone.getTransport().cancel()
    }

    update() {

        this.onResizeTimeline()
        this.updateRows()
        this.updateWrapperHeight()
        this.updateNoteHeight()
        this.updateNoteYArray()

        if(this.timeline && this.timelineRect) {

            this.barWidth = this.getBarWidth()
            this.barArray = this.getBarArray()
            this.barDivisionsArray = this.getBarDivisionsArray()
            this.barPositionArray = this.getBarPositionArray()
        }
    }

    /** DblClick Timeline event */
    onTimelineDblClick(e: MouseEvent) {

        // console.log('onTimelineDblClick')

        this.timelineRect = this.timeline.getBoundingClientRect()

        const width = this.timelineRect.width
        const posX = e.clientX - this.timelineRect.left 

        let xInPercent = posX / width

        let time = Math.round(this.bars * xInPercent * 1000) / 1000

        this.addNote(time)
        
        this.update()

        this.saveUndo()
    }

    /** Pointerdown Timeline event */
    onTimelineClick(e: MouseEvent) {

        // console.log('onTimelineClick')

        this.selectedNote = null

        this.update()

    }
    /** Resize Timeline event - need to get clientRect from timeline */
    onResizeTimeline(e?) {

        // console.log('onResizeTimeline')

        // if(e instanceof Event) timelineRect = (e.target as HTMLElement).getBoundingClientRect()
        // else timelineRect = e.getBoundingClientRect()

        if(this.timeline != undefined) this.timelineRect = this.timeline.getBoundingClientRect()
    }
    
    /** Add new note to sequencer */
    addNote(time: Tone.Unit.Time, note?: Tone.Unit.Frequency) {
        
        if(note == undefined) {
            
            if(Synthesizer.lastNotePlayed != undefined) note = Synthesizer.lastNotePlayed
            else note = 'F3'
        }
        
        this.sequencer.addNote(note, time, convertNoteLength(this.sequencer.noteLength), 1)
        
        this.update()

        this.saveUndo()
    }
    
    /** DblClick Note Event  */
    removeNote(note: SequenceObject) {

        if(this.isDragNoteResize) return

        this.sequencer.removeNote(note.id)

        this.update()

        this.saveUndo()
    }

    updateNoteYArray() {

        this.noteYArray.length = 0

        for(let n of this.sequence) {

            this.noteYArray.push(this.getNoteY(n))
        }
    }

    getBarWidth() {
        return (this.timelineRect.width / this.bars)
    }

    getBarLeftPosition(bar: number) {
        return (((this.timelineRect.width / this.bars) * bar) - 1)
    }

    notePointerDown(e, note: SequenceObject) {

        // console.log('notePointerDown')

        e.stopPropagation()

        if(e.target instanceof HTMLInputElement) return
        
        this.noteEle = e.target.closest('.note')

        if (!this.noteEle) return

        this.noteRect = this.noteEle.getBoundingClientRect()

        this.isPointerDown = true

        this.selectedNote = note
        this.clickOffsetX = e.pageX - this.noteRect.left
        this.clickOffsetY = e.clientY - this.noteRect.top

        this.alteredSequenceObject = {

            id: this.selectedNote.id,
            note: this.selectedNote.note,
            time: this.selectedNote.time,
            length: this.selectedNote.length,
            velocity: this.selectedNote.velocity
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(e) {

        this.notePointerMove(e)
        this.resizeNoteMoveHandler(e)
    }

    notePointerMove(e) {
        
        if(!this.isPointerDown) return
        if(!this.noteEle) return
        if(this.isDragNoteResize) return
        if(!this.selectedNote) return

        this.isNoteDrag = true

        const width = this.timelineRect.width
        const stop = this.timelineRect.right
        const start = 0

        // const noteHeight = this.getNoteHeight()
        // const noteY = this.getNoteY(this.selectedNote)

        // // Vertical drag
        // let posY = e.clientY - this.timelineRect.top - this.clickOffsetY

        // if(posY > noteY) {

        //     const i = sequencer.sequence.indexOf(selectedNote)

        //     // If not exist Or first element
        //     if(i != -1 && i != 0) {

        //         newIndex = i - 1
                
        //         console.log('ABOVE', posY, noteY, posY > noteY, selectedNote.id, i, newIndex)

        //         // Remove
        //         sequencer.sequence.splice(i, 1)
        //         // Insert
        //         sequencer.sequence.splice(newIndex, 0, selectedNote)
        //         // Update
        //         sequence.set(sequencer.sequence)
        //     }
        // }
        // else if(posY < noteY + noteHeight) {

        //     const i = sequencer.sequence.indexOf(selectedNote)

        //     // If not exist Or first element
        //     if(i != -1 && i != sequencer.sequence.length) {

        //         newIndex = i + 1
                
        //         console.log('BELOW', posY, noteY + noteHeight, posY < noteY + noteHeight, selectedNote.id, i, newIndex)
                
        //         // Remove
        //         sequencer.sequence.splice(i, 1)
        //         // Insert
        //         sequencer.sequence.splice(newIndex, 0, selectedNote)
        //         // Update
        //         sequence.set(sequencer.sequence)
        //     }
        // }
        // else {

        //     console.log('NOTHING')
        // }

        // Horizontal drag
        let posX = e.clientX - this.timelineRect.left - this.clickOffsetX

        // Right boundary
        if(this.timelineRect.left + posX + this.noteRect.width > stop) posX = stop - this.noteRect.width - this.timelineRect.left
        
        let xInPercent = posX / width

        let time = Math.round(this.bars * xInPercent * 1000) / 1000
        
        // Left boundary
        if(time < start) time = start

        this.alteredSequenceObject.time = time

        this.updateWrapperHeight()
    }

    @HostListener('mouseup')
    onMouseUp(e) {

        this.notePointerUp(e)
        this.resizeNoteEndHandler(e)
    } 

    notePointerUp = (e) => {

        console.log('notePointerUp')

        this.isPointerDown = false
        
        if(this.selectedNote && this.selectedNote.id == this.alteredSequenceObject.id) {

            if(this.selectedNote.time != this.alteredSequenceObject.time) {

                this.sequencer.updateNote(
                    this.alteredSequenceObject.id, 
                    this.alteredSequenceObject.note, 
                    this.alteredSequenceObject.time, 
                    this.alteredSequenceObject.length, 
                    this.alteredSequenceObject.velocity
                )
                
                this.updateWrapperHeight()
                
                this.saveUndo()
            }
        }

        if(this.isNoteDrag) {

            this.selectedNote = null
            this.alteredSequenceObject = null
            
            this.clickOffsetX = 0
            this.clickOffsetY = 0
            
            this.noteRect = null

            this.isNoteDrag = false
        }
    }


    private isDragNoteResize = false
    private startTime: number = 0
    private endTime: number = 0
    private dragOffset: number = 0
    private handle = 0
    /** Resizing note - Mouse down event */
    resizeNoteStartHandler = (e, note: SequenceObject, which: 'start' | 'end') => {
        console.log('resizeNoteStartHandler', note)

        e.stopPropagation()

        this.isDragNoteResize = true

        this.selectedNote = note

        this.alteredSequenceObject = {

            id: this.selectedNote.id,
            note: this.selectedNote.note,
            time: this.selectedNote.time,
            length: this.selectedNote.length,
            velocity: this.selectedNote.velocity
        }

        this.startTime = Tone.Time(this.selectedNote.time).toSeconds()
        this.endTime = this.startTime + Tone.Time(this.selectedNote.length).toSeconds()

        this.dragOffset = e.pageX - e.target.getBoundingClientRect().left

        this.handle = which == 'start' ? 0 : 1
    }

    /** Resizing note - Mouse move event */
    resizeNoteMoveHandler = (e) => {

        // e.stopPropagation()

        if(!this.isDragNoteResize) return
        
        if(!this.selectedNote) return
        
        // console.log('move')

        const width = this.timelineRect.width
        const posX = e.clientX - this.timelineRect.left + (this.handle == 0 ? -this.dragOffset : this.dragOffset)

        let xInPercent = posX / width

        let time = Math.round(this.bars * xInPercent * 1000) / 1000

        let l: Tone.Unit.Time
        if(this.handle == 0) {

            if(time < 0) time = 0
            
            l = this.endTime - time
            
            if(l < 0) time = this.endTime
            
        }
        else {

            if(time < 0) time = 0

            this.endTime = time

            l = this.endTime - this.startTime

            time = Tone.Time(this.selectedNote.time).toSeconds()
        }

        this.alteredSequenceObject.time = time
        this.alteredSequenceObject.length = l
    }

    /** Resizing note - Mouse up event */
    resizeNoteEndHandler = (e) => {
        console.log('resizeNoteEndHandler', this.selectedNote, this.alteredSequenceObject)
        
        // e.stopPropagation()

        if(this.selectedNote && this.selectedNote.id == this.alteredSequenceObject.id) {

            console.log('resizeNoteEndHandler update !!PONASFO')
            this.sequencer.updateNote(
                this.alteredSequenceObject.id, 
                this.alteredSequenceObject.note, 
                this.alteredSequenceObject.time, 
                this.alteredSequenceObject.length, 
                this.alteredSequenceObject.velocity
            )
            
            this.updateWrapperHeight()
            
            this.saveUndo()
        }


        if(this.isDragNoteResize) {

            this.isDragNoteResize = false
            
            this.selectedNote = null
            this.alteredSequenceObject = null
            
            this.dragOffset = 0
            
            this.startTime = 0
            this.endTime = 0
        }
    }


    /** The Note component is filled with a SequenceObject. On some events like dragndrop 
     * the selected sequenceObject is replaced with an temporal sequenceObject to visualize the process
     * without manipulating the real sequence of the sequencer. */
    getSequenceObject(note: SequenceObject) : SequenceObject {

        if(this.alteredSequenceObject && this.alteredSequenceObject.id == note.id) return this.alteredSequenceObject
        return note
    }


    updateRows() {

        // rows = getMaxDifferentNotes(sequencer.sequence).length

        this.rows = this.sequence.length

        return this.rows
    }

    /** Returns the maximal amount of overlaps of the array */
    getMaxDifferentNotes(notes: SequenceObject[]) {

        let _notes = []
        for(let n of notes) {

            if(_notes.indexOf(n.note) == -1) _notes.push(n.note)
        }

        return _notes
    }    

    /** Returns an array with all notes (including the passed in note) that overlap with the passed in note. */
    getYOverlappingNotesByNote = (() => {

        let t1: number,
            t2: number,
            l1: number,
            l2: number
    
        return (note: SequenceObject) => {
        
            const notes: SequenceObject[] = [ note ]

            t1 = Tone.Time(note.time).toSeconds()
            l1 = Tone.Time(note.length).toSeconds()

            for(let n2 of this.sequencer.sequence) {

                t2 = Tone.Time(n2.time).toSeconds()
                l2 = Tone.Time(n2.length).toSeconds()

                if(t1 > t2 && t1 < t2 + l2 || t1 + l1 > t2 && t1 + l1 < t2 + l2) {

                    notes.push(n2)
                }
            }

            return notes
        }
    })()

    /** Returns the Y position for the passed in note. Y position is for HTML */
    getNoteY = (note: SequenceObject) => {

        // const diffNotes = getMaxDifferentNotes(sequencer.sequence)

        // diffNotes.sort((a, b) => {

        //     return Tone.Frequency(a.note).toFrequency() - Tone.Frequency(b.note).toFrequency() 
        // })

        // let i = diffNotes.indexOf(note.note)

        // console.log('y', note.note, i, wrapperHeight, rows,(wrapperHeight / rows) * i)
        // return (wrapperHeight / rows) * i

        // sequencer.sequence.sort((a, b) => {

        //     return Tone.Frequency(a.note).toFrequency() - Tone.Frequency(b.note).toFrequency() 
        // })

        let i = this.sequencer.sequence.indexOf(note)

        // console.log('y', note.note, i, wrapperHeight, rows,(wrapperHeight / rows) * i)
        return (this.wrapperHeight / this.rows) * i
    }

    /** Returns the HTML height for the passed in note */
    updateNoteHeight = () => {

        return this.noteHeight = this.wrapperHeight / this.rows
    }

    updateWrapperHeight() {

        if(this.rows < 3) return this.wrapperHeight = 100
        return this.wrapperHeight = this.rows * 33
    }

    saveUndo = () => {

        Storage.saveUndo(JSON.stringify(this.sequencer.synthesizer.serializeOut()))
    }
}