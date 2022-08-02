import { Subject } from "rxjs"
import { M } from "./math"




export class Knob {

    value

    min
    max
    division

    dom

    centerPosition
    mousePosition
    clickPosition
    clientRect
    angle
    lastMoveAngle
    moveAngle

    isMouseDown
    isKeyDown

    onChange

    constructor(value, min, max, division) {

        this.value = value ? value : 0
        this.min = min ? min : 0
        this.max = max ? max : 1
        this.division = division ? division : .01

        this.angle = 0

        this.isMouseDown = false
        this.isKeyDown = false

        this.dom = document.createElement('div')
        this.dom.classList.add('knob')
        const pointer = document.createElement('div')
        pointer.classList.add('knob-pointer')
        this.dom.append(pointer)

        this.dom.addEventListener('mousedown', this.onMouseDown.bind(this), false)
        this.dom.addEventListener('mousemove', this.onMouseMove.bind(this), false)
        this.dom.addEventListener('mouseup', this.onMouseUp.bind(this), false)
        this.dom.addEventListener('touchstart', this.onTouchStart.bind(this), false)
        this.dom.addEventListener('touchmove', this.onTouchMove.bind(this), false)
        this.dom.addEventListener('touchend', this.onTouchEnd.bind(this), false)

        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)

        this.onChange = new Subject()
    }

    setValue() {

        this.value = this.angle / 360

        this.dom.innerHTML = Math.abs(Math.round(this.value * 100) / 100)

        this.rotateDOM()
    }

    rotateDOM() {

        this.dom.style.transform = 'rotate('+Math.round(this.angle)+'deg)';
    }

    onMouseDown(e) {

        console.log('mousedown', e)

        this.isMouseDown = true

        this.clickPosition = { x: e.clientX, y: e.clientY }
        this.mousePosition = { x: e.clientX, y: e.clientY }

        this.clientRect = this.dom.getBoundingClientRect()

        this.centerPosition = { x: this.clientRect.x + (this.clientRect.width / 2), y: this.clientRect.y + (this.clientRect.height / 2) }

        this.lastMoveAngle = M.getAngle(this.centerPosition.x, this.centerPosition.y, this.clickPosition.x, this.clickPosition.y)

        this.setValue()
    }
    onMouseMove(e) {

        if(!this.isMouseDown) return

        console.log('mousemove', e)

        this.mousePosition = { x: e.clientX, y: e.clientY }

        this.moveAngle = M.getAngle(this.centerPosition.x, this.centerPosition.y, this.mousePosition.x, this.mousePosition.y)

        this.angle += (this.moveAngle - this.lastMoveAngle)

        this.angle = Math.abs(this.angle)

        this.lastMoveAngle = this.moveAngle

        console.log('ANGLE', this.angle, this.lastMoveAngle, this.moveAngle)

        this.setValue()
    }
    onMouseUp(e) {

        console.log('mouseup', e)

        this.isMouseDown = false
    }


    onTouchStart(e) {}
    onTouchMove(e) {}
    onTouchEnd(e) {}

    onKeyDown(e) {

        console.log('keydown', e)

        this.isKeyDown = true
    }
    onKeyUp(e) {

        console.log('keyup', e)

        this.isKeyDown = false

    }

    onScroll() {
        
    }
}