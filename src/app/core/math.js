

/** Math Utilities */
export class M {

    /** Calculates a angle from two points where the third point is { x=radius, y=0 }. Center { cx, cy } and edge { ex, ey } */
    static getAngle(cx, cy, ex, ey) {

        let theta = Math.atan2(ey - cy, ex - cx) // range (-PI, PI]
        // theta *= 180 / Math.PI // rads to degs, range (-180, 180]
        if (theta < 0) theta = (Math.PI*2) + theta // range [0, 360)
        
        return theta
    }

    /** Map a value from one range (min, max) to another. 
     * @param iMin - Input min value
     * @param iMin - Input max value
     * @param iMin - Output min value
     * @param iMin - Output max value
     * @param v - Value to map
    */
    static map(iMin, iMax, oMin, oMax, v) {

	    return oMin + (oMax - oMin) * ((v-iMin) / (iMax-iMin))
    }

    /** Clambs a value to a min and max. Meaning it wont exeed the min and max values */
    static clamb(min, max, v) {

        if(v > max) v = max
        else if(v < min) v = min
        return v
    }
}