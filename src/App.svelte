
<script lang="ts">
    
    import * as Tone from 'tone'
    import { WebMidi, type NoteMessageEvent } from "webmidi";

    import { onMount } from 'svelte';
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


    // Init globals
    G.init()
    
    // Create Synthesizer
    let synthesizer = G.synthesizer = new Synth()

    // Create Visuals
    let activeVisual = Visual.moire()

    let storedMuteState = !synthesizer.isMuted

    G.w = window.innerWidth
    G.h = window.innerHeight

    // On document ready
    onMount(() => {

        synthesizer.setVolume(-3)

        if(isSafari()) { document.body.classList.add('safari') }

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


        // Tone.Transport.scheduleRepeat(() => {

        //     // console.log(Tone.Transport.position)
        //     // console.log(Tone.Transport.seconds)
        //     // console.log(Tone.Transport.PPQ)
        //     console.log('s',Tone.Transport.nextSubdivision('4n'))
        //     console.log('now',Tone.Transport.now())
        //     // console.log(Tone.Transport.sampleTime)

        // }, .1)

        /**
         * 
         *  RGB
         * 
'rgb(128, 122, 255)',
'rgb(255, 121, 159)',
'rgb(128, 255, 255)',
'rgb(255, 255, 159)',
'rgb(21, 111, 74)',
'rgb(105, 22, 22)',
'rgb(22, 22, 74)',
'rgb(22, 22, 22)',
'rgb(105, 111, 22)',
'rgb(105, 22, 74)',
'rgb(21, 111, 23)',
         */

        let i = 0
        let colors = [
            
            // '#FFFFFF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF0000', '#00FF00',
    
            //   Cyan        Black      Red      blue
            '#166f4a', '#161616', '#691616', '#16164a',
            // 'rgb(128, 122, 255)',
            'rgb(255, 121, 159)',
            'rgb(128, 255, 255)',
            'rgb(255, 255, 159)',
            'rgb(21, 111, 74)',
            'rgb(105, 22, 22)',
            'rgb(22, 22, 74)',
            'rgb(22, 22, 22)',
            // 'rgb(105, 111, 22)',
            'rgb(105, 22, 74)',
            'rgb(21, 111, 23)',
        ]


        // Colors
        colors.sort(() =>  Math.ceil((Math.random() * 2) - 1) )

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


        // Add wildcard css at the beginning
        // this will be removed/readded when opening/closing the menu
        document.styleSheets[0].insertRule('* { mix-blend-mode: difference; }', 0)
    })
    


    // ON CHANGE TAB
    
    const toggleActive = (active:boolean) => {

        let nsd = Tone.Transport.nextSubdivision('8n')

        
        if (active) {
            // console.log('activate')
            
            synthesizer.mute(false)
            
            // Tone.Transport.start(nsd)
            
            Visual.visualsEnabled = true
            
        }
        else {
            // console.log('deactivate')
            
            // synthesizer.releaseKeys()
            synthesizer.mute(true)
            
            // Tone.Transport.pause(nsd)
            // Tone.Transport.stop(nsd)
            // Tone.Transport.cancel(nsd)

            // TODO - NOT RELEASING KEYS


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
    window.addEventListener('focus', () => toggleActive(storedMuteState))
    window.addEventListener('blur', () => {

        storedMuteState = !synthesizer.isMuted
        toggleActive(false)
    })

    
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

    let isMenuOpen = false
    const toggleMenu = (e) => {

        console.log('TOGGLE MENU',)

        isMenuOpen = !isMenuOpen

        // Add css dynamicly via document to use the wildcard  * { ... }
        if(isMenuOpen) {

            document.styleSheets[0].deleteRule(0)
            document.styleSheets[0].insertRule('html, body {margin: 0; height: 100%; overflow: hidden }', 1) // Could use a class here too
        }
        else {

            document.styleSheets[0].deleteRule(1) // Could use a class here too
            document.styleSheets[0].insertRule('* { mix-blend-mode: difference; }', 0)
        }

        console.log('stylesheet', isMenuOpen, document.styleSheets[0].cssRules[0])
    }

    const toggleVisuals = (e) => {

        Visual.visualsEnabled = !Visual.visualsEnabled
    }
    
    const saveVisuals = (e) => {

        Visual.visualsEnabled = false

        G.saveVisuals()

        Visual.visualsEnabled = true
    }

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
    // MAKE VERSIONING HERE TOO FRO COMPATIBILITY
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


{#if !G.fullScreenmode }

    <div class="main-ui">

        <div class="btn" title="Remove Visuals" on:click={collapseVisuals}>&#x2715;</div>
        <div class="btn" title="Download Visual" on:click={saveVisuals}>I</div>
        <div class="btn" title="Visuals On/Off" on:click={toggleVisuals}>V</div>

        <div class="btn" title="Menu On/Off" on:click={toggleMenu} style="float:right;"></div>


    </div>


    <Menu bind:active={isMenuOpen} on:close={toggleMenu}></Menu>


{/if}

<div class="synthesizer-wrapper" class:screen-offset={!Visual.collapsed}>

    <Synthesizer synthesizer={synthesizer}>
        
        
    </Synthesizer>

</div>


<style>

    .main-ui {


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

