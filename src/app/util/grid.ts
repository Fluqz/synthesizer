
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

    getCellSizeW() { return this.width / this.rows }
    getCellSizeH() { return this.height / this.cols }

    getCellPosByNr(n) {

        return {
            x: ((n % this.rows) * this.getCellSizeW()) + (this.getCellSizeW() / 2),
            y: (Math.floor(n / this.rows) * this.getCellSizeH()) + (this.getCellSizeH() / 2)
        }
    }
}