


export class M {

    /** Calculates a angle from two points where the third point is { x=radius, y=0 }. Center { cx, cy } and edge { ex, ey } */
    static getAngle(cx, cy, ex, ey) {

        const dy = ey - cy;
        const dx = ex - cx;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }

}