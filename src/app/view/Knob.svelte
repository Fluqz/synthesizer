


<script lang="ts">

    import * as Tone from "tone"

    import { fromEvent, Observable } from "rxjs"
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { M } from "../core/math"
    import { Vec2 } from "../core/math";

    import GIF from '../../assets/imgs/tenor.gif'


    /** Name of Knob */
    export let name: string
    /** value */
    export let value: number = 0
    /** Minimum possible value */
    export let min: number = 0
    /** Maximum possible value */
    export let max: number = 1
    /** Division of (max - min) / division */
    export let division: number = 100

    /** Initial value */
    const initValue: number = value

    /** Wrapper dom element */
    let dom: HTMLElement

    let knobDOM: HTMLElement

    let clientRect: DOMRect

    
    /** Center position of HTML element { x, y } */
    let centerPosition: Vec2 = new Vec2()
    /** Current mouse position { x, y } */
    let mousePosition: Vec2 = new Vec2()
    /** Current mouse position { x, y } */
    let mouseDownPosition: Vec2 = new Vec2()

    /** Current angle when turning knob */
    let angle: number = 0
    /** New incoming angle when turning knob */
    let newAngle: number = 0
    /** Fix offset to start angle at 12 o clock */
    let offsetAngle: number = -Math.PI / 2


    /** Is mouse drag active */
    let drag: boolean = false
    /** Is mouse button pressed down */
    let isMouseDown: boolean = false
    /** Is key pressed down */
    let isKeyDown: Boolean = false

    /** Amount of pixels the cursor is allowed to travel between the mousedown and mouseup event. 
     * If value is exeeding clickRange, no click has occured.
    */
    let clickRange: number = 2
    
    /** Output emitter */
    let dispatch = createEventDispatcher()

    let showResetBtn: boolean = false


    // ADD FIRST LETTER OF NAME TO MIDDLE OF KNOB


    const reset = () => {

        setValue(initValue)
    }

    /** Set value between 0 - 1 */
    const setValue = (v: number) => {
        
        value = v

        value = M.map(0, 1, min, max, value)

        value = M.clamb(min, max, value)

        angle = (value / ((max - min) / (Math.PI * 2)))
        
        // console.log('Change', name, 'to :', value)

        dispatch('onChange', value)
    }

    /** Calculate value from current angle */
    const setValueFromAngle = () => {

        value = (angle) / Math.PI / 2

        setValue(value)
    }


    setValue(value)





    // EVENTS

    /** On 'mousedown' event callback */
    const onMouseDown = (e) => {

        // console.log('mousedown', e)

        e.preventDefault()
        e.stopPropagation()

        if(e.which === 3) return

        isMouseDown = true
        drag = false

        mouseDownPosition.set(e.clientX, e.clientY)
        mousePosition.set(e.clientX, e.clientY)

        clientRect = knobDOM.getBoundingClientRect()

        centerPosition.set( clientRect.x + (clientRect.width / 2), clientRect.y + (clientRect.height / 2))
    }

    /** On 'mousemove' event callback */
    const onMouseMove = (e) => {

        e.preventDefault()
        e.stopPropagation()
        
        if(!isMouseDown) return

        // console.log('mousemove', e)

        // Keep track of mouse position
        mousePosition.set(e.clientX, e.clientY)

        // Check if mouse has moved more than clickRange
        if(mouseDownPosition.distanceTo(mousePosition) > clickRange) drag = true

        if(!drag) return

        // Angle
        newAngle = centerPosition.angleTo(mousePosition)

        if(angle < newAngle) {

            if(newAngle < Math.PI * 2) angle = newAngle
            else angle = Math.PI * 2
        }

        else if(angle > newAngle) {

            if(newAngle > 0) angle = newAngle
            else angle = 0
        }

        // Update value from angle
        setValueFromAngle()
    }

    /** On 'mouseup' event callback */
    const onMouseUp = (e) => { 

        isMouseDown = false 

        if(drag) return

        // Click
        // showResetBtn = true
    }
    /** On 'touchstart' event callback */
    const onTouchStart = onMouseDown
    /** On 'touchmove' event callback */
    const onTouchMove = onMouseMove
    /** On 'touchend' event callback */
    const onTouchEnd = onMouseUp
    /** On 'keydown' event callback */
    const onKeyDown = (e) => {

        if(e.key === 'Shift') division *= 40
        // if(e.key === 'Meta') division /= 4

        isKeyDown = true
    }
    /** On 'keyup' event callback */
    const onKeyUp = (e) => {


        if(e.key === 'Shift') division /= 40
        // if(e.key === 'Meta') division *= 4

        isKeyDown = false
    }
    const onScroll = (e) => {

        e.preventDefault()
        e.stopPropagation()

        if(e.wheelDelta > 0) setValue(M.map(min, max, 0, 1, value - ((1 / division) * Math.round(Math.abs(e.wheelDelta / 5)))))
        else if(e.wheelDelta < 0) setValue(M.map(min, max, 0, 1, value + ((1 / division) * Math.round(Math.abs(e.wheelDelta / 5)))))
    }

    document.addEventListener('pointermove', onMouseMove)
    document.addEventListener('pointerup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onTouchEnd)

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    let wheelObservable: Observable

    let unsubscribeWheelObserver

    onMount(() => {

        wheelObservable = fromEvent(knobDOM, 'wheel', { bubbles: false })
        wheelObservable.subscribe(onScroll)
    })

    onDestroy(() => {

        document.removeEventListener('pointermove', onMouseMove)
        document.removeEventListener('pointerup', onMouseUp)
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('touchend', onTouchEnd)

        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup', onKeyUp)

        if(unsubscribeWheelObserver) unsubscribeWheelObserver.unsubscribe()
    })

</script>





<div class="knob-wrapper" bind:this={dom}>

    <div class="knob"
         bind:this={knobDOM}
         on:pointerdown={onMouseDown} 
         on:touchstart={onTouchStart}
         on:dblclick={() => showResetBtn = !showResetBtn}
         style={'transform: rotate(' + Math.round(angle * (180 / Math.PI)) + 'deg);'}>

        <div class="knob-underlay">

            <div class="knob-pointer"></div>

            <div class="knob-value">{ value.toFixed(2) }</div>

        </div>

    </div>

    <div class="knob-title">{ name }</div>

</div>

{#if showResetBtn}
        
    <div class="knob-settings" 
            on:click={reset}
            style={'left:' + mousePosition.x + 'px;'}>
        Reset
    </div>
    
{/if}




<style>



.knob-wrapper {

    display: inline-block;
    text-align: center;

    font-size: 0.7rem;
    margin: 5px 5px 0px 5px;
    color: inherit;
}

.knob {

  position: relative;

  cursor: grab;

  width: 30px;
  height: 30px;
  line-height: 30px;

  border-radius: 100%;

  /* border: 1px solid var(--c-y); */
  
  background-color: blue;
  color: inherit;

  font-size: 0.7rem;

  overflow: hidden;
/* 
  display: flex;
  justify-content: center;
  align-items: flex-start; */

  margin: 0 auto;

  /* box-shadow: 0px 0px 1px 2px rgba(0,0,0,0.2); */

  -webkit-user-select: none;  
  -moz-user-select: none;    
  -ms-user-select: none;      
  user-select: none;


  background-image: url('/src/assets/imgs/circle-sepia.gif');
  background-size: 1000%;
  background-position: center;
  background-repeat: no-repeat;
}

.knob > .knob-pointer {

  position: absolute;
  top: 0px;
  left: calc(50% - (10% / 2));

  width: 10%;
  height: 30%;

  background-color: var(--c-o);
}

.knob > .knob-value {

  width: 100%;
  height: 100%;
  line-height: inherit;

  text-align: center;
}

.knob-underlay {
  background-color: #000;
  /* mix-blend-mode: unset; */

}

.knob-settings {
    position: absolute;

    top: 0px;
    left: 0px;

    width: 100px;
    height: 100px;

    cursor: pointer;
}

</style>