
<script lang="ts">
    
    import * as Tone from 'tone'
    import { WebMidi, type NoteMessageEvent } from "webmidi";

    import { onDestroy, onMount } from 'svelte';
    import Synthesizer from './app/view/Synthesizer.svelte'
    
    import { Synthesizer as Synth, type ISynthesizerSerialization } from './app/synthesizer'
    import { Storage } from './app/core/storage'
    import { G } from './app/globals'
    
    import { Visual } from './app/p5/visual'
    import { Track } from './app/track';
    import { Vec2 } from './app/util/math';

    import { DEFAULT_SESSION } from './app/presets';
    import { Midi } from './app/core/midi';
    import { isSafari } from './app/util/browser';

    import Menu from './app/view/Menu.svelte';

    import { COLORS } from './app/core/colors';
    import { DB } from './app/core/db';


    // Init globals
    G.init()

    DB.get('sample').then((d) => {

        console.log('DB', d)
    })
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()

    let storedMuteState = !synthesizer.isMuted

    G.w = window.innerWidth
    G.h = window.innerHeight



    // On document ready
    onMount(() => {

        document.addEventListener('pointermove', onMouseMove)


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

        // Visual.moire()
        // Visual.flowField()
        // Visual.noise()

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


        // // Scroll to bottom
        // setTimeout(() => {

        //     window.scrollTo({
        //         top: 100000000,
        //         left: 0,
        //         behavior: 'smooth',
        //     })

        // }, 1500)



        
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

        }, 20000 * (Tone.Transport.bpm.value * .01))

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

    /** Open visuals in new window */
    const openVisualsInNewWindow = (e) => {

        Visual.openInNewWindow()
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
    }

    const onUndo = (e) => {

        synthesizer.serializeIn(JSON.parse(Storage.undo()))

        synthesizer = synthesizer
    }

    const onRedo = (e) => {

        synthesizer.serializeIn(JSON.parse(Storage.redo()))

        synthesizer = synthesizer
    }


    document.addEventListener('click', () => {
            
        if(G.isPlaying) {

            G.start()
        }


        console.log('LocalStorage')

        for(let i = 0; i < 1160; i++) {

            const name = 'synthesizer-undo-' + i
            const item:ISynthesizerSerialization = JSON.parse(window.localStorage.getItem(name))

            if(item == undefined) continue
            if(item.currentSession == undefined) continue
            if(item.currentSession.sequencers.length == 0) continue
            if(item.currentSession.sequencers.length == 2)

            console.log(name, item)
        }

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

    // Save Undo
    Storage.saveUndo(storageData)

    synthesizer = synthesizer
    
    
    let isUserActive: boolean = false
    let lastActiveTime = Date.now()
    let timeTillInactive = 1000 * 3
    const onMouseMove = (e) => {

        isUserActive = true

        lastActiveTime = Date.now()
    }

    let AFID
    const activityUpdate = () => {

        if(lastActiveTime + timeTillInactive < Date.now()) {

            isUserActive = false

        }

        window.cancelAnimationFrame(AFID)
        AFID = window.requestAnimationFrame(activityUpdate)
    }

    activityUpdate()



</script>


<div class="app-wrapper">

    <Menu bind:active={isMenuOpen} on:close={toggleMenu}></Menu>

    <div class="content-wrapper">

        {#if isUserActive }
            
            <div class="main-ui">

                <div class="btn" title="Remove Visuals" on:click={collapseVisuals}>&#x2715;</div>
                <div class="btn" title="Download Visual" on:click={saveVisuals}>I</div>
                <div class="btn" title="Visuals On/Off" on:click={toggleVisuals}>V</div>
                <div class="btn" title="Open visuals in new window" on:click={openVisualsInNewWindow}>W</div>

                <div class="btn" title="Menu On/Off" on:click={toggleMenu} style="float:right;"></div>

            </div>

        {/if}

        <div class="footer-ui">
                
            <div class="btn" title="Undo" on:click={onUndo}>Un</div>
            <div class="btn" title="Redo" on:click={onRedo}>Re</div>

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
        width: 100%;
        height: 100vh;
    }

    .main-ui {

        position: relative;
        z-index: 5;
    }

    .footer-ui {

        z-index: 5;

        width: 10%;

        display: flex;
        justify-content: space-evenly;

        position: absolute;
        left: 50%;
        top: 0px;
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

