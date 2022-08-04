import { fromEvent, Subject, throttleTime } from "rxjs"
import { M } from "./math"




export class Knob {

    value
    prevValue

    min
    max
    division

    dom

    centerPosition
    mousePosition
    clickPosition
    clientRect
    angle
    prevAngle
    newAngle

    isMouseDown
    isKeyDown

    onChange

    constructor(value, min, max, division) {

        this.prevValue = this.value = value ? value : 0
        this.min = min ? min : 0
        this.max = max ? max : 1
        this.division = division ? division : 100

        this.angle = 0
        this.prevAngle = -Math.PI / 2

        this.isMouseDown = false
        this.isKeyDown = false

        this.dom = document.createElement('div')
        this.dom.classList.add('knob')
        const pointer = document.createElement('div')
        pointer.classList.add('knob-pointer')
        this.dom.append(pointer)

        this.dom.addEventListener('mousedown', this.onMouseDown.bind(this))
        document.addEventListener('mousemove', this.onMouseMove.bind(this))
        document.addEventListener('mouseup', this.onMouseUp.bind(this))
        this.dom.addEventListener('touchstart', this.onTouchStart.bind(this))
        document.addEventListener('touchmove', this.onTouchMove.bind(this))
        document.addEventListener('touchend', this.onTouchEnd.bind(this))

        document.addEventListener('keydown', this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.onKeyUp.bind(this))

        fromEvent(this.dom, 'wheel', { bubbles: false }).pipe(throttleTime(50)).subscribe(this.onScroll.bind(this))

        this.onChange = new Subject()
    }

    setValue(v) {
        
        this.value = v

        this.value = Math.round(this.value * this.division) / this.division

        if(this.value > this.max) this.value = this.max
        else if(this.value < this.min) this.value = this.min


        this.dom.innerHTML = this.value

        this.rotateDOM()

        this.onChange.next(this.value)
    }

    setValueFromAngle() {

        this.angle += Math.PI

        this.value = this.angle / Math.PI / 2

        this.setValue(this.value)
    }

    rotateDOM() {

        this.dom.style.transform = 'rotate('+Math.round(this.angle*(180/Math.PI))+'deg)';
    }

    onMouseDown(e) {

        // console.log('mousedown', e)

        e.preventDefault()
        e.stopPropagation()

        this.isMouseDown = true

        this.clickPosition = { x: e.clientX, y: e.clientY }
        this.mousePosition = { x: e.clientX, y: e.clientY }

        this.clientRect = this.dom.getBoundingClientRect()

        this.centerPosition = { x: this.clientRect.x + (this.clientRect.width / 2), y: this.clientRect.y + (this.clientRect.height / 2) }

        // this.prevAngle = M.getAngle(this.centerPosition.x, this.centerPosition.y, this.clickPosition.x, this.clickPosition.y)

        // this.setValueFromAngle()
    }
    onMouseMove(e) {

        e.preventDefault()
        e.stopPropagation()
        
        if(!this.isMouseDown) return

        // console.log('mousemove', e)

        this.mousePosition = { x: e.clientX, y: e.clientY }

        this.newAngle = M.getAngle(this.centerPosition.x, this.centerPosition.y, this.mousePosition.x, this.mousePosition.y)

        this.angle = this.newAngle - this.prevAngle

        // this.prevAngle = this.newAngle

        if (this.angle < 0) {
            this.angle += Math.PI * 2;
        }
        if (this.angle > Math.PI) {
            this.angle -= Math.PI * 2;
        }


        this.setValueFromAngle()

    }
    onMouseUp(e) {

        this.prevAngle = this.angle

        // console.log('mouseup', e)

        this.isMouseDown = false
    }


    onTouchStart(e) {}
    onTouchMove(e) {}
    onTouchEnd(e) {}

    onKeyDown(e) {

        // console.log('keydown', e)

        this.isKeyDown = true
    }
    onKeyUp(e) {

        // console.log('keyup', e)

        this.isKeyDown = false

    }

    onScroll(e) {

        e.preventDefault()
        e.stopPropagation()
        console.log('SCROLL', e.wheelDelta, e)

        if(e.wheelDelta > 0) this.setValue(this.value - (1 / this.division))
        else if(e.wheelDelta < 0) this.setValue(this.value + (1 / this.division))
    }
}