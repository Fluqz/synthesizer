




export class Grid {

    width
    height
    rows
    cols

    constructor(width, height, rows, cols) {

        this.setSize(width, height, rows, cols)
    }

    setSize(width, height, rows, cols) {

        this.width = width
        this.height = height
        this.rows = rows
        this.cols = cols
    }

    getCellSizeX() { return this.width / this.rows }
    getCellSizeY() { return this.height / this.cols }

    getCellPosByNr(n) {

        let x = 0
        let y = 0

        x = n % this.rows
        y = Math.floor(n / this.rows)

        return {
            x: (x * this.getCellSizeX()) + (this.getCellSizeX() / 2),
            y: (y * this.getCellSizeY()) + (this.getCellSizeY() / 2)
        }
    }
}