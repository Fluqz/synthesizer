






export class TrackMenu {

    /** DOM Element */
    static _dom

    static get dom() {

        if(TrackMenu._dom == undefined)
            TrackMenu._dom = document.querySelector('#track-menu')

        return TrackMenu._dom
    }

    /** Currently altering track */
    static track

    /** Open Menu */
    static open(track, x, y) {

        TrackMenu.track = track

        this.dom.classList.add('open')

        this.dom.style.left = x + 'px'
        this.dom.style.top = y + 'px'

        let rect = this.dom.getBoundingClientRect()

        console.log(rect.x, rect.y)
        console.log(rect.width, rect.height)
        console.log(x, y)
        console.log(window.innerWidth, window.innerHeight)

        console.log(rect.y + rect.height, window.innerHeight, rect)


        if(rect.y + rect.height > window.innerHeight) {

            this.dom.style.top = (rect.y - rect.height) + 'px'
        }
    }
    /** Close Menu */
    static close() {

        this.dom.classList.remove('open')

    }
}
