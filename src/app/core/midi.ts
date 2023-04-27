import { WebMidi } from "webmidi";



export class Midi {






    static init() {

        // console.log('INIT MIDI')
        // WebMidi
        //     .enable()
        //     .then(onEnabled)
        //     .catch(err => alert(err))



        // Function triggered when WebMidi.js is ready
        function onEnabled() {

            // console.log('ENABLE MIDI')

            // // Display available MIDI input devices
            // if (WebMidi.inputs.length < 1) {

            //     console.log('NO MIDI DEVICE')

            //     document.body.innerHTML+= "No device detected."
            // } 
            // else {

            //     console.log('MIDI DEVICE CONNECTED')

            //     WebMidi.inputs.forEach((device, index) => {

            //         console.log(`${index}: ${device.name} <br>`);
            //     })
            // }
        }
    }


    // private static midi: MIDIAccess

    // static init() {
        
    //     navigator.permissions.query({ name: "midi", sysex: true }).then((result) => {

    //             if (result.state === "granted") {

    //                 console.log('GRANTED')
    //             // Access granted.
    //             } else if (result.state === "prompt") {
    //             // Using API will prompt for permission

    //             console.log('PROMPT')

    //             }
    //       })

    //     if(navigator.requestMIDIAccess) {

    //         navigator.requestMIDIAccess().then((midiAccess: MIDIAccess) => {

    //             console.log('MIDI ACCESS', midiAccess)

    //             this.midi = midiAccess

    //             this.listInputsAndOutputs()

    //             midiAccess.onstatechange = (e) => {

    //                 console.log('STATE CHANGE', e)

    //                 this.updateDevice(e)
    //             }

    //         }, () => {

    //             console.log('NO MIDI ACCESS')

    //         })
    //     }
    // }

    // private static listInputsAndOutputs() {

    //     if(!this.midi) return

    //     for (const entry of this.midi.inputs) {

    //         const input = entry[1]
    //         console.log(
    //             `Input port [type:'${input.type}']` +
    //             ` id:'${input.id}'` +
    //             ` manufacturer:'${input.manufacturer}'` +
    //             ` name:'${input.name}'` +
    //             ` version:'${input.version}'`
    //         )
    //     }
      
    //     for (const entry of this.midi.outputs) {

    //         const output = entry[1]
    //         console.log(
    //             `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
    //         )
    //     }
    // }
      

    // private static updateDevice(e) {

    //     if(!this.midi) return

    //     this.midi.inputs.forEach((entry) => {
    //         entry.onmidimessage = this.onMIDIMessage
    //     })
    // }

    // private static onMIDIMessage(event) {

    //     let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `

    //     for (const character of event.data) {
    //       str += `0x${character.toString(16)} `
    //     }
    //     console.log(str)
    // }
}