import { fromEvent, Subject, throttleTime } from "rxjs"
import { M } from "../core/math"

/**
 * HTML Knob
 * Creates a HTML knob element that is turnable by mouse or touch.
 * The HTML element is stored in Knob.dom. 
 */
export class Knob {


    name
    /** Initial value */
    value

    /** Minimum possible value */
    min
    /** Maximum possible value */
    max
    /** Division of (max - min) / division 
     * Maybe this shouldnt be settable
     */
    division

    /** Turn knob endlessly 
     * NOT IMPLEMENTED
     */
    turnEndlessly

    /** HTML element of knob */
    dom
    /** HTML elements rect values. (x, y, width, height, offsets, ...) */
    clientRect

    /** Center position of HTML element { x, y } */
    centerPosition
    /** Current mouse position { x, y } */
    mousePosition

    /** Current angle when turning knob */
    angle
    /** New incoming angle when turning knob */
    newAngle
    /** Fix offset to start angle at 12 o clock */
    offsetAngle

    /** Is mouse button pressed down */
    isMouseDown
    /** Is key pressed down */
    isKeyDown

    /** Subscribeable observable, fired when value is changing */
    onChange

    pointerdownEvent
    pointermoveEvent
    pointerupEvent
    touchstartEvent
    touchmoveEvent
    touchendEvent
    keydownEvent
    keyupEvent
    wheelObservable



    /**
     * 
     * @param {string} name Title
     * @param {number} value Initiale value
     * @param {number} min Max value
     * @param {number} max Min value
     * @param {number} division Steps to increase/decrease
     * @param {boolean} turnEndlessly Turn the knob endlessly or stop at 0
     */
    constructor(name, value, min, max, division, turnEndlessly) {

        this.name = name ? name : ''
        this.value = value ? value : 0
        this.min = min ? min : 0
        this.max = max ? max : 1
        this.division = division ? division : 100
        this.turnEndlessly = turnEndlessly ? turnEndlessly : false

        this.angle = 0
        this.offsetAngle = Math.PI / 2

        this.isMouseDown = false
        this.isKeyDown = false

        this.dom = document.createElement('div')
        this.dom.classList.add('knob')
        this.dom.title = this.name
        const pointer = document.createElement('div')
        pointer.classList.add('knob-pointer')
        this.dom.append(pointer)

        this.dom.addEventListener('pointerdown', this.mousedownEvent = this.onMouseDown.bind(this))
        document.addEventListener('pointermove', this.mousemoveEvent = this.onMouseMove.bind(this))
        document.addEventListener('pointerup', this.mouseupEvent = this.onMouseUp.bind(this))
        this.dom.addEventListener('touchstart', this.touchstartEvent = this.onTouchStart.bind(this))
        document.addEventListener('touchmove', this.touchmoveEvent = this.onTouchMove.bind(this))
        document.addEventListener('touchend', this.touchendEvent = this.onTouchEnd.bind(this))

        document.addEventListener('keydown',this.keydownEvent = this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.keyupEvent = this.onKeyUp.bind(this))

        this.wheelObservable = fromEvent(this.dom, 'wheel', { bubbles: false })
        this.wheelObservable.subscribe(this.onScroll.bind(this))

        this.onChange = new Subject()

        this.setValue(this.value)
    }

    // ADD FIRST LETTER OF NAME TO MIDDLE OF KNOB

    /** Set value between 0 - 1 */
    setValue(v) {
        
        this.value = v

        if(this.value >= .5) this.turnEndlessly

        this.value = M.map(0, 1, this.min, this.max, this.value)

        this.value = M.clamb(this.min, this.max, this.value)

        this.dom.innerHTML = this.value.toFixed(2)

        this.angle = this.value / ((this.max - this.min) / (Math.PI * 2))

        this.rotateDOM()

        this.onChange.next(this.value)
    }

    /** Calculate value from current angle */
    setValueFromAngle() {

        this.value = this.angle / Math.PI / 2

        this.setValue(this.value)
    }

    /** Update rotation of HTML element from angle. */
    rotateDOM() {

        this.dom.style.transform = 'rotate('+Math.round(this.angle*(180/Math.PI))+'deg)';

        // window.setTimeout(() => { this.dom.innerHTML = '' }, 200)
    }

    /** On 'mousedown' event callback */
    onMouseDown(e) {

        // console.log('mousedown', e)

        e.preventDefault()
        e.stopPropagation()

        this.isMouseDown = true

        this.mousePosition = { x: e.clientX, y: e.clientY }

        this.clientRect = this.dom.getBoundingClientRect()

        this.centerPosition = { x: this.clientRect.x + (this.clientRect.width / 2), y: this.clientRect.y + (this.clientRect.height / 2) }

    }
    /** On 'mousemove' event callback */
    onMouseMove(e) {

        e.preventDefault()
        e.stopPropagation()
        
        if(!this.isMouseDown) return

        // console.log('mousemove', e)

        this.mousePosition = { x: e.clientX, y: e.clientY }

        this.newAngle = M.getAngle(this.centerPosition.x, this.centerPosition.y, this.mousePosition.x, this.mousePosition.y)

        this.angle = this.newAngle + this.offsetAngle
        if(this.angle > 2 * Math.PI) this.angle -= 2 * Math.PI

        this.setValueFromAngle()
    }
    /** On 'mouseup' event callback */
    onMouseUp(e) { this.isMouseDown = false }


    /** On 'touchstart' event callback */
    onTouchStart(e) { this.onMouseDown(e) }
    /** On 'touchmove' event callback */
    onTouchMove(e) { this.onMouseMove(e) }
    /** On 'touchend' event callback */
    onTouchEnd(e) { this.onTouchEnd(e) }

    /** On 'keydown' event callback */
    onKeyDown(e) {

        if(e.key === 'Shift') this.division *= 40
        if(e.key === 'Meta') this.division /= 4

        this.isKeyDown = true
    }
    /** On 'keyup' event callback */
    onKeyUp(e) {

        // console.log('keyup', e)
    
        if(e.key === 'Shift') this.division /= 40
        if(e.key === 'Meta') this.division *= 4

        this.isKeyDown = false
    }

    wheelDelta = 0
    t = 1
    time = Date.now()
    onScroll(e) {

        e.preventDefault()
        e.stopPropagation()

        if(e.wheelDelta > 0) this.setValue(M.map(this.min, this.max, 0, 1, this.value - ((1 / this.division) * Math.round(Math.abs(e.wheelDelta / 5)))))
        else if(e.wheelDelta < 0) this.setValue(M.map(this.min, this.max, 0, 1, this.value + ((1 / this.division) * Math.round(Math.abs(e.wheelDelta / 5)))))
    }

    /** Destroy knob */
    destroy() {

        this.dom.removeEventListener('pointerdown', this.mousedownEvent)
        document.removeEventListener('pointermove', this.mousemoveEvent)
        document.removeEventListener('pointerup', this.mouseupEvent)
        this.dom.removeEventListener('touchstart', this.touchstartEvent)
        document.removeEventListener('touchmove', this.touchmoveEvent)
        document.removeEventListener('touchend', this.touchendEvent)

        document.removeEventListener('keydown',this.keydownEvent)
        document.removeEventListener('keyup', this.keyupEvent)

        // if(this.wheelObservable) this.wheelObservable.unsubscribe()

        this.onChange = new Subject()

        if(this.dom.parentNode) this.dom.parentNode.removeChild(this.dom)
        this.dom.remove()
    }
}