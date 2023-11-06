


<script lang="ts">

    import { fromEvent, Observable } from "rxjs"
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { M } from "../util/math"
    import { Vec2 } from "../util/math";


    /** Name of Knob */
    export let name: string
    /** Current value */
    export let value: number = 0
    /** Minimum possible value */
    export let min: number = 0
    /** Maximum possible value */
    export let max: number = 1
    /** The steps to go. Default is abs(max - min) / 360 */
    export let steps: number = Math.abs(max - min) / 360

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
    /** Mouse offset from center of knob */
    let offsetMousePosition: Vec2 = new Vec2()

    /** Drag init value */
    let dragInitValue: number
    /** Drag starting position */
    let dragStartPosition: Vec2 = new Vec2()


    /** Current angle when turning knob */
    let angle: number = 0

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

        // value = M.map(0, 1, min, max, value)


        // console.log('Change', name, 'to :', value, initValue)

        value = M.clamb(min, max, value)
        
        getAngle()

        dispatch('onChange', value)
    }

    const getAngle = () => {

        const oneDegree = ((max - min) / (Math.PI * 2))
        
        return angle = (value / oneDegree) - (min / oneDegree)
    }


    // EVENTS

    /** On 'mousedown' event callback */
    const onMouseDown = (e) => {

        e.preventDefault()
        e.stopPropagation()

        if(e.which === 3) return

        isMouseDown = true
        drag = false

        mouseDownPosition.set(e.clientX, e.clientY)
        mousePosition.set(e.clientX, e.clientY)

        clientRect = knobDOM.getBoundingClientRect()

        centerPosition.set( clientRect.x + (clientRect.width / 2), clientRect.y + (clientRect.height / 2))

        offsetMousePosition.set(mousePosition.x - centerPosition.x, mousePosition.y - centerPosition.y)
    }

    /** On 'mousemove' event callback */
    const onMouseMove = (e) => {

        e.preventDefault()
        e.stopPropagation()
        
        // If mouse is not clicked while moving
        if(!isMouseDown) return

        // console.log('mousemove', e)

        // Keep track of mouse position
        mousePosition.set(e.clientX, e.clientY)

        // Keep track of mouse position offset
        offsetMousePosition.set(mousePosition.x - centerPosition.x, mousePosition.y - centerPosition.y)


        // Check if mouse has moved more than clickRange
        if(mouseDownPosition.distanceTo(mousePosition) > clickRange) {
         
            if(drag == false) {

                dragStartPosition.copy(mousePosition)
                dragInitValue = value
            }

            drag = true
        }

        // Dragging 
        if(!drag) return

        const distance = dragStartPosition.y - mousePosition.y

        const val = M.clamb(min, max, dragInitValue + (distance * steps))

        setValue(val)
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

        if(e.key === 'Meta') steps *= 40
        // if(e.key === 'Meta') steps /= 4

        isKeyDown = true
    }
    /** On 'keyup' event callback */
    const onKeyUp = (e) => {


        if(e.key === 'Meta') steps /= 40
        // if(e.key === 'Meta') steps *= 4

        isKeyDown = false
    }
    const onScroll = (e) => {

        if(!e.shiftKey) return

        e.preventDefault()
        e.stopPropagation()

        // if(e.wheelDelta > 0) setValue(M.clamb(min, max, M.map(min, max, 0, 1, value - ((1 / steps) * Math.round(Math.abs(e.wheelDelta / 5))))))
        // else if(e.wheelDelta < 0) setValue(M.clamb(min, max, M.map(min, max, 0, 1, value + ((1 / steps) * Math.round(Math.abs(e.wheelDelta / 5))))))

        if(e.wheelDelta > 0) setValue(M.clamb(min, max, value - (steps * Math.round(Math.abs(e.wheelDelta / 5)))))
        else if(e.wheelDelta < 0) setValue(M.clamb(min, max, value + (steps * Math.round(Math.abs(e.wheelDelta / 5)))))
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

        getAngle()

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

    <!-- <div class="knob-value">{ value.toFixed(2) }</div> -->
    <div class="knob-value"><input type="text" bind:value={value} step={.01} on:click={(e) => { e.target.select() }} on:keydown={ (e) => e.key == 'Enter' ? setValue(value) : null }/></div>

    <div class="knob shifting-GIF"
        bind:this={knobDOM}
        on:pointerdown={onMouseDown} 
        on:touchstart={onTouchStart}
        on:dblclick={() => showResetBtn = !showResetBtn}
        style={'transform: rotate(' + Math.round(angle * (180 / Math.PI)) + 'deg);'}>

        <!-- <div class="knob-underlay"> -->

            

            <div class="knob-pointer"></div>
            
        <!-- </div> -->

    </div>

    {#if name }
    
        <div class="knob-title">{ name }</div>
        
    {/if}


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
    margin: 0px 5px 0px 5px;
    color: inherit;

    /* min-width: 50px; */
}

.knob {

  position: relative;

  cursor: grab;

  width: 30px;
  height: 30px;
  line-height: 30px;

  border-radius: 100%;
  /* border: 1px solid var(--c-bl); */

  background-color: blue;
  color: inherit;

  font-size: 0.7rem;

  overflow: hidden;

  margin: 0 auto;

  -webkit-user-select: none;  
  -moz-user-select: none;    
  -ms-user-select: none;      
  user-select: none;

  transition: .4s background-color, .4s color;
  mix-blend-mode: difference;

  z-index: 100;
}
.knob:hover {
    
    background-image: url('/src/assets/imgs/circle-monochrome-yellow.gif');

    /* background-image: none; */
}

.knob .knob-pointer {

  position: absolute;
  top: 0px;
  left: calc(50% - (10% / 2));

  width: 100%;
  height: 100%;

  border-radius: 100%;

  /* transform: inherit; */
  
  mix-blend-mode: difference;
  background-color: var(--c-bl);
}

.knob .knob-value {
/* .knob > .knob-value { */
/* 
    position: absolute;

  width: 100%;
  height: 100%;
  line-height: inherit;

  text-align: center;

  z-index: 10; */
}

.knob-wrapper .knob-value input {

    width: 25px;
    height: auto;
    line-height: inherit;
    padding: 0px;

    border: none;
    outline: none;

    border-radius: 0px;

    text-decoration: none;

    text-align: center;

    background-color: transparent;
    color: inherit;
}

.knob-underlay {
  /* background-color: #FFF; */


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