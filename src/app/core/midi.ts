



export class Midi {


    static init() {
        
        navigator.permissions.query({ name: "midi", sysex: true }).then((result) => {


            if (result.state === "granted") {

                console.log('GRANTED')
              // Access granted.
            } else if (result.state === "prompt") {
              // Using API will prompt for permission

              console.log('PROMPT')

            }
          });

        if(navigator.requestMIDIAccess) {

            navigator.requestMIDIAccess().then(midiAccess => {

                console.log('MIDI ACCESS')

                midiAccess.onstatechange = (e) => {

                    console.log('STATE CHANGE', e)

                    this.updateDevice(e)
                }

            }, () => {

                console.log('NO MIDI ACCESS')

            })
        }
    }

    private static updateDevice(e) {

        
    }
}