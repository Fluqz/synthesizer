
<script lang="ts">
    
    import * as Tone from 'tone'
    import { WebMidi, type NoteMessageEvent } from "webmidi";

    import { onDestroy, onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    import { Synthesizer as Synth, type ISynthesizerSerialization } from './app/synthesizer'
    import { Storage } from './app/util/storage'
    import { G } from './app/core/globals'
    
    import { Visual } from './app/p5/visual'
    import { Track } from './app/track';
    import { Vec2 } from './app/util/math';

    import { DEFAULT_SESSION } from './app/presets';
    import { Midi } from './app/core/midi';
    import { isSafari } from './app/util/browser';

    import Menu from './app/view/Menu.svelte';
    import { COLORS } from './app/core/colors';


    // Init globals
    G.init()
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()

    let storedMuteState = !synthesizer.isMuted

    G.w = window.innerWidth
    G.h = window.innerHeight



    // On document ready
    onMount(() => {

        // Create Visuals
        // let IID = setInterval(() => {

        //     const rnd = Math.round(Math.random() * 3)

        //     Visual.activeVisual.remove()

        //     console.log('rnd', rnd)
        //     switch(rnd) {

        //         case 0:
        //             Visual.flowField()
        //         break
        //         case 1:
        //             Visual.noise()
        //         break
        //         case 2:
        //             Visual.moire()
        //         break
        //         case 3:
        //             Visual.flowField()
        //         break
        //     }

        // }, 1000)

        Visual.flowField()

        // Set initial volume
        synthesizer.setVolume(-3)

        // Safari css support
        if(isSafari()) { document.body.classList.add('safari') }


        // Add midi support
        Midi.init((e: NoteMessageEvent) => {

            synthesizer.triggerAttack(e.note.identifier, Tone.now(), synthesizer.channel, e.note.velocity)
            
        },
        (e) => {
    
            synthesizer.triggerRelease(e.note.identifier, Tone.now(), synthesizer.channel)
        })


        // Scroll to bottom
        setTimeout(() => {

            window.scrollTo({
                top: 100000000,
                left: 0,
                behavior: 'smooth',
            })

        }, 1500)



        
        // Change Background Colors
        let colors = JSON.parse(JSON.stringify(COLORS))
        colors.sort(() =>  Math.ceil((Math.random() * 2) - 1) )
        
        let i = 0

        setInterval(() => {

            if(i >= colors.length) { 
                
                i = 0
                colors.sort(() =>  Math.ceil((Math.random() * 2) - 1))
            }

            // console.log('col', colors[i])
            document.body.style.backgroundColor = colors[i]

            i++

            synthesizer = synthesizer

        }, 30000 * (Tone.Transport.bpm.value * .01))

    })

    onDestroy(() => {

        // if(IID) clearInterval(IID)
    })


    // ON CHANGE TAB
    const toggleActive = (active:boolean) => {

        if (active) {

            synthesizer.mute(false)
            
            Visual.visualsEnabled = true
            
        }
        else {

            synthesizer.mute(true)

            Visual.visualsEnabled = false
        }

        synthesizer = synthesizer
    }

    document.addEventListener('visibilitychange', (e) => {
        
        if (document.visibilityState == "visible") {
            
            toggleActive(storedMuteState)
        }
        else {
            
            storedMuteState = !synthesizer.isMuted
            toggleActive(false)
        }
    })
    // Enter/Leave browser
    window.addEventListener('focus', () => toggleActive(storedMuteState))
    window.addEventListener('blur', () => {

        storedMuteState = !synthesizer.isMuted
        toggleActive(false)
    })

    // Browser resize event
    window.addEventListener('resize', () => {
    
        G.w = window.innerWidth
        G.h = window.innerHeight
    })
    
    // ON UNLOAD
    window.onbeforeunload = () => {

        Storage.save(serializeOut())

        synthesizer.mute(true)

        synthesizer = synthesizer
    }

    /** Menu open/close flag */
    let isMenuOpen = false
    /** Toggle menu open/close */
    const toggleMenu = (e) => {

        isMenuOpen = !isMenuOpen
    }

    /** Enable/Disable Visuals*/
    const toggleVisuals = (e) => {

        Visual.visualsEnabled = !Visual.visualsEnabled
    }
    
    /** Save image of visuals */
    const saveVisuals = (e) => {

        Visual.visualsEnabled = false

        G.saveVisuals()

        Visual.visualsEnabled = true
    }

    /** Collapse visuals container */
    const collapseVisuals = (e) => {

        Visual.collapsed = !Visual.collapsed

        if(Visual.activeVisual) {

            if(Visual.collapsed) Visual.activeVisual.remove()
            else Visual.activeVisual.restart()
        }
        else Visual.moire()

        console.log('COLL', Visual.collapsed)
    }


    document.addEventListener('click', () => {

        // Tone.start()
        // Tone.Transport.start()


        // console.log('click', synthesizer.presetManager.getPresets())

        // synthesizer.tracks.forEach(track => {

        //     console.log('Instrument', track.instrument.name, track.instrument.connectedInputs, track.instrument.connectedOutputs)
        //     track.nodes.forEach(node => {

        //         console.log('Node', node.name, node.connectedInputs, node.connectedOutputs)
        //     })
        // })
    })


    // Serialize
    const serializeIn = (file: any, isString: boolean = false) => {
        
        // file = ''
        if(file == undefined) return
    
        let o: ISynthesizerSerialization

        if(isString) o = JSON.parse(file)
        else o = file

        console.log('Serialize In', o)
    
        synthesizer.serializeIn(o)

        synthesizer = synthesizer
    }
    // TODO - MAKE VERSIONING HERE TOO FRO COMPATIBILITY
    const serializeOut = () => {
    
        let o = synthesizer.serializeOut()
    
        return JSON.stringify(o)
    }


    /** LOAD FROM LOCAL STORAGE */
    const storageData = Storage.load()

    if(storageData) serializeIn(storageData, true)

    else serializeIn(DEFAULT_SESSION, false)

    synthesizer = synthesizer
    
    


</script>


<div class="app-wrapper">

    <Menu bind:active={isMenuOpen} on:close={toggleMenu} ></Menu>

    <div class="content-wrapper">

        <div class="main-ui">

            <div class="btn" title="Remove Visuals" on:click={collapseVisuals}>&#x2715;</div>
            <div class="btn" title="Download Visual" on:click={saveVisuals}>I</div>
            <div class="btn" title="Visuals On/Off" on:click={toggleVisuals}>V</div>

            <div class="btn" title="Menu On/Off" on:click={toggleMenu} style="float:right;"></div>

        </div>

        <div id="p5-canvas-cont"></div>

        <div class="synthesizer-wrapper" class:screen-offset={!Visual.collapsed}>

            <Synthesizer synthesizer={synthesizer}></Synthesizer>

        </div>

    </div>

</div>

<style>

    .app-wrapper {

        position: relative;
    }

    .app-wrapper .content-wrapper {
        
        position: relative;
    }

    .main-ui {

        position: relative;
        z-index: 5;
    }

    .synthesizer-wrapper {

        position: absolute;

        top: 25px;
        left: 0px;

        width: 100%;
    }

    .synthesizer-wrapper.screen-offset {

        top: 100vh;
    }

    .svg-line {

        position: absolute;
        left: 0px;
        top: 0px;

        display: block;

        width: 100%;
        height: 100%;
    }

</style>

