
import { Keyboard } from '../keyboard'

export class ElectricFuzz {

    originX
    originY

    currentX
    currentY

    previousX
    previousY

    normalX
    normalY

    vertices = []

    steps

    distance

    minLength
    maxLength

    color
    weight

    cb

    constructor(x, y, steps, minLength, maxLength, color, cb) {

        this.originX = x
        this.originY = y

        this.previousX = x
        this.previousY = y

        this.steps = Math.round(steps > 0 ? steps : 1)

        this.minLength = minLength == undefined ? 2 : minLength
        this.maxLength = maxLength == undefined ? 10 : maxLength

        this.color = color == undefined ? '#fea5ca' : color

        this.cb = cb


        for(let i = 0; i < this.steps; i++) {

            this.grow()
        }
    }

    grow() {

        // Create random length between min, max
        this.distance = (Math.random() * ((this.maxLength - this.minLength) + this.minLength)) * (Keyboard.activeNotes.length / 2)

        // Create random normalized vector for direction
        this.normalX = (Math.random() * 2) - 1
        this.normalY = (Math.random() * 2) - 1

        // Add distance along direction to current position
        this.currentX = this.previousX + (this.normalX * this.distance)
        this.currentY = this.previousY + (this.normalY * this.distance)

        if(this.cb != undefined) this.cb(this.previousX, this.previousY, this.currentX, this.currentY, this.vertices, this.color)

        this.vertices.push({
            x: this.currentX,
            y: this.currentY,
        })

        this.previousX = this.currentX
        this.previousY = this.currentY
    }

    reset() {

        this.previousX = this.originX
        this.previousY = this.originY

        this.vertices = []
    }
}