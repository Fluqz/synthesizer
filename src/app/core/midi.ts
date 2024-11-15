import { WebMidi } from "webmidi";
import { G } from "../globals";
import * as Tone from "tone";



export class Midi {

    static init(trigger: (...args) => void, release: (...args) => void) {

        console.log('INIT MIDI')

        WebMidi.enable().then(() => {

            console.log('ENABLE MIDI')

            // Display available MIDI input devices
            if (WebMidi.inputs.length < 1) {

                console.log('NO MIDI DEVICE')
            }
            else {

                console.log('MIDI DEVICE CONNECTED')

                WebMidi.inputs.forEach((device, index) => {

                    console.log(`${index}: ${device.name} <br>`);
                })


                WebMidi.inputs[0].addListener("noteon", e => {

                    trigger(e)

                }, { channels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] });


                WebMidi.inputs[0].addListener("noteoff", e => {

                    release(e)

                }, { channels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] });
            }
        })
        .catch(err => console.error(err))
    }
}