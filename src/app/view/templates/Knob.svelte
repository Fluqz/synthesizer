


<script lang="ts">

    import { fromEvent, Observable, Subject } from "rxjs"
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { M } from "../../core/math"


    /** Name of Knob */
    export let name: string
    /** Initial value */
    export let value: number = 0
    /** Minimum possible value */
    export let min: number = 0
    /** Maximum possible value */
    export let max: number = 1
    /** Division of (max - min) / division */
    export let division: number = 100

    /** Wrapper dom element */
    let dom: HTMLElement

    let knobDOM: HTMLElement

    let clientRect: DOMRect

    
    /** Center position of HTML element { x, y } */
    let centerPosition: { x: number, y: number }
    /** Current mouse position { x, y } */
    let mousePosition: { x: number, y: number }

    /** Current angle when turning knob */
    let angle: number = 0
    /** New incoming angle when turning knob */
    let newAngle: number = 0
    /** Fix offset to start angle at 12 o clock */
    let offsetAngle: number = 0

    /** Is mouse button pressed down */
    let isMouseDown: boolean = false
    /** Is key pressed down */
    let isKeyDown: Boolean = false
    
    /** Output emitter */
    let dispatch = createEventDispatcher()



    // ADD FIRST LETTER OF NAME TO MIDDLE OF KNOB




    /** Set value between 0 - 1 */
    const setValue = (v: number) => {
        
        value = v

        value = M.map(0, 1, min, max, value)

        value = M.clamb(min, max, value)

        angle = value / ((max - min) / (Math.PI * 2))

        dispatch('onChange', value)
    }

    /** Calculate value from current angle */
    const setValueFromAngle = () => {

        value = angle / Math.PI / 2

        setValue(value)
    }


    setValue(value)





    // EVENTS

    /** On 'mousedown' event callback */
    const onMouseDown = (e) => {

        // console.log('mousedown', e)

        e.preventDefault()
        e.stopPropagation()

        isMouseDown = true

        mousePosition = { x: e.clientX, y: e.clientY }

        clientRect = knobDOM.getBoundingClientRect()

        centerPosition = { x: clientRect.x + (clientRect.width / 2), y: clientRect.y + (clientRect.height / 2) }

    }
    /** On 'mousemove' event callback */
    const onMouseMove = (e) => {

        e.preventDefault()
        e.stopPropagation()
        
        if(!isMouseDown) return

        // console.log('mousemove', e)

        mousePosition = { x: e.clientX, y: e.clientY }

        newAngle = M.getAngle(centerPosition.x, centerPosition.y, mousePosition.x, mousePosition.y)

        angle = newAngle + offsetAngle
        if(angle > 2 * Math.PI) angle -= 2 * Math.PI

        setValueFromAngle()
    }
    /** On 'mouseup' event callback */
    const onMouseUp = (e) => { isMouseDown = false }
    /** On 'touchstart' event callback */
    const onTouchStart = onMouseDown
    /** On 'touchmove' event callback */
    const onTouchMove = onMouseMove
    /** On 'touchend' event callback */
    const onTouchEnd = onMouseUp
    /** On 'keydown' event callback */
    const onKeyDown = (e) => {

        if(e.key === 'Shift') division *= 40
        if(e.key === 'Meta') division /= 4

        isKeyDown = true
    }
    /** On 'keyup' event callback */
    const onKeyUp = (e) => {

        if(e.key === 'Shift') division /= 40
        if(e.key === 'Meta') division *= 4

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
    onMount(() => {

        wheelObservable = fromEvent(dom, 'wheel', { bubbles: false })
        wheelObservable.subscribe(onScroll)
    })

    onDestroy(() => {

        document.removeEventListener('pointermove', onMouseMove)
        document.removeEventListener('pointerup', onMouseUp)
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('touchend', onTouchEnd)

        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup', onKeyUp)

        if(wheelObservable) wheelObservable.unsubscribe()
    })

</script>





<div class="knob-wrapper" bind:this={dom}>

    <div class="knob"
         bind:this={knobDOM}
         on:pointerdown={onMouseDown} 
         on:touchstart={onTouchStart}
         style={'transform: rotate(' + Math.round(angle*(180/Math.PI)) + 'deg)'}>

        <div class="knob-pointer"></div>

        <div class="knob-value">{ value.toFixed(2) }</div>

    </div>

    <div class="knob-title">{ name }</div>

</div>


<style>



.knob-wrapper {
  text-align: center;

  font-size: 0.7rem;
  margin: 5px 5px 0px 5px;
}

.knob {

  position: relative;

  cursor: grab;

  width: 30px;
  height: 30px;
  line-height: 30px;

  border-radius: 100%;

  border: 1px dotted var(--c-w);
  background-color: blue;
  color: var(--c-w);

  font-size: 0.8rem;

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
}

.knob > .knob-pointer {

  position: absolute;
  top: 0px;
  left: calc(50% - (7% / 2));

  width: 7%;
  height: 30%;

  background-color: var(--c-o);
}

.knob > .knob-value {

  width: 100%;
  height: 100%;
  line-height: inherit;

  text-align: center;
}
</style>