// @ts-nocheck

import type { IPreset } from "../core/preset-manager"


export const DEFAULT_SESSION = {
  "presets": [],
  "currentSession": {
    "bpm": 120,
    "volume": -10.874444444444421,
    "octave": 2,
    "channel": 0,
    "tracks": [
      {
        "enabled": true,
        "index": 0,
        "octaveOffset": 1,
        "channel": 0,
        "volume": 5.978888888888889,
        "instrument": {
          "name": "Oscillator",
          "enabled": true,
          "collapsed": false,
          "volume": 0.4,
          "detune": 0,
          "phase": 0,
          "wave": "sine",
          "wavePartial": "",
          "attack": 0.01,
          "decay": 0.1,
          "sustain": 0.5,
          "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#2",
            "A#2",
            "D#3",
            "F#3",
            "F3"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 1,
        "octaveOffset": 0,
        "channel": 0,
        "volume": 4.332222222222228,
        "instrument": {
          "name": "Oscillator",
          "enabled": true,
          "collapsed": false,
          "volume": 0.4,
          "detune": 0,
          "phase": 0,
          "wave": "triangle",
          "wavePartial": "",
          "attack": 0.01,
          "decay": 0.1,
          "sustain": 0.5,
          "release": 1
        },
        "nodes": [
          {
            "name": "Distortion",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "gain": 0.5
          }
        ],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#1",
            "A#1",
            "D#2",
            "F#2",
            "F2"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 2,
        "octaveOffset": -1,
        "channel": 0,
        "volume": -7.004444444444452,
        "instrument": {
          "name": "Sampler",
          "enabled": true,
          "collapsed": false,
          "volume": 0,
          "sample": "Kick1"
        },
        "nodes": [
          {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.12,
            "feedback": 0.8
          }
        ],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#0",
            "A#0",
            "D#1",
            "F#1",
            "F1"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 3,
        "octaveOffset": 0,
        "channel": 0,
        "volume": 3.0866666666666656,
        "instrument": {
          "name": "Synth",
          "enabled": true,
          "collapsed": false,
          "volume": 3,
          "detune": 0.5,
          "attack": 0.005,
          "attackCurve": "linear",
          "decay": 0.1,
          "decayCurve": "exponential",
          "release": 1,
          "releaseCurve": "exponential",
          "sustain": 0.3,
          "partialCount": 0,
          "partials": [],
          "phase": 0,
          "type": "triangle",
          "portamento": 0
        },
        "nodes": [
          {
            "name": "Vibrato",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "depth": 0.1,
            "maxDelay": 0.005,
            "wave": "sine",
            "wavePartial": "",
            "frequency": 5
          }
        ],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#1",
            "A#1",
            "D#2",
            "F#2",
            "F2"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 4,
        "octaveOffset": 0,
        "channel": 0,
        "volume": 2.9744444444444373,
        "instrument": {
          "name": "AMSynth",
          "enabled": true,
          "collapsed": false,
          "volume": 1,
          "detune": 0,
          "portamento": 0,
          "harmonicity": 3,
          "phase": 0,
          "attack": 0.01,
          "decay": 0.01,
          "sustain": 1,
          "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#1",
            "A#1",
            "D#2",
            "F#2",
            "F2"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 5,
        "octaveOffset": 0,
        "channel": 0,
        "volume": -6.715555555555748,
        "instrument": {
          "name": "DuoSynth",
          "enabled": true,
          "collapsed": false,
          "volume": 0.21999999999999975,
          "detune": 1,
          "harmonicity": 1,
          "portamento": 0,
          "vibratoAmount": 0.13611111111111182,
          "vibratoRate": 1,
          "attack0": 0.01,
          "decay0": 0,
          "release0": 0.5,
          "sustain0": 1,
          "attack1": 0.01,
          "decay1": 0,
          "release1": 0.5,
          "sustain1": 1
        },
        "nodes": [
          {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 0,
            "delayTime": 0.12944444444444583,
            "feedback": 0.7227777777777771
          }
        ],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#1",
            "A#1",
            "D#2",
            "F#2",
            "F2"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 6,
        "octaveOffset": 1,
        "channel": 0,
        "volume": 5.134444444444448,
        "instrument": {
          "name": "FMSynth",
          "enabled": true,
          "collapsed": false,
          "volume": 0.5,
          "detune": 0.5,
          "portamento": 0,
          "harmonicity": 3,
          "phase": 0,
          "attack": 0.01,
          "decay": 0.01,
          "sustain": 1,
          "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F#2",
            "A#2",
            "D#3",
            "F#3",
            "F3"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 7,
        "octaveOffset": 0,
        "channel": 15,
        "volume": 2.9322222222222236,
        "instrument": {
          "name": "Sampler",
          "enabled": true,
          "collapsed": false,
          "volume": 0.5,
          "sample": "Kick3"
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "A1",
            "F3"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 8,
        "octaveOffset": 0,
        "channel": 14,
        "volume": 1.4333333333333365,
        "instrument": {
          "name": "Sampler",
          "enabled": true,
          "collapsed": false,
          "volume": 0.5,
          "sample": "Snare6"
        },
        "nodes": [
          {
            "name": "Distortion",
            "enabled": true,
            "collapsed": false,
            "wet": 0.8405555555555548,
            "gain": 0.5030555555555545
          },
          {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 0.5830555555555552,
            "delayTime": 0.3844444444444451,
            "feedback": 0.3925000000000005
          }
        ],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "A#3",
            "C3",
            "B2",
            "G#3",
            "G#2",
            "F#2",
            "G2",
            "F2"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      },
      {
        "enabled": true,
        "index": 9,
        "octaveOffset": 0,
        "channel": 13,
        "volume": -2.9999999999999716,
        "instrument": {
          "name": "Sampler",
          "enabled": true,
          "collapsed": false,
          "volume": 0.5,
          "sample": "Hihat2"
        },
        "nodes": [
          {
            "name": "Distortion",
            "enabled": true,
            "collapsed": false,
            "wet": 0.9302777777777778,
            "gain": 1
          }
        ],
        "soloEnabled": false,
        "hold": {
          "enabled": "OFF",
          "activeKeys": [
            "F3",
            "A2",
            "G2"
          ]
        },
        "isMuted": false,
        "isCollapsed": false
      }
    ],
    "sequencers": [
      {
        "index": 7,
        "channel": [
          0
        ],
        "sequence": [
          {
            "id": 0,
            "note": "F#1",
            "time": 0,
            "length": 0.124,
            "velocity": 1
          },
          {
            "id": 1,
            "note": "A#1",
            "time": 0.124,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 2,
            "note": "D#2",
            "time": 0.25,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 3,
            "note": "F#2",
            "time": 0.375,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 4,
            "note": "D#2",
            "time": 0.5,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 5,
            "note": "A#1",
            "time": 0.625,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 6,
            "note": "F#1",
            "time": 0.751,
            "length": "16n",
            "velocity": 1
          }
        ],
        "humanize": false,
        "bars": 1,
        "noteLength": "1/16"
      },
      {
        "index": 9,
        "channel": [
          15
        ],
        "sequence": [
          {
            "id": 0,
            "note": "A1",
            "time": 0,
            "length": 0.126,
            "velocity": 1
          },
          {
            "id": 1,
            "note": "A1",
            "time": 0.061,
            "length": 0.125,
            "velocity": 1
          },
          {
            "id": 2,
            "note": "F3",
            "time": 0.249,
            "length": "4n",
            "velocity": 1
          }
        ],
        "humanize": false,
        "bars": 1,
        "noteLength": "1/16"
      },
      {
        "index": 11,
        "channel": [
          14
        ],
        "sequence": [
          {
            "id": 0,
            "note": "F2",
            "time": 1.5,
            "length": "8n",
            "velocity": 1
          },
          {
            "id": 1,
            "note": "A#3",
            "time": 0,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 2,
            "note": "C3",
            "time": 0.126,
            "length": 0.14300000000000002,
            "velocity": 1
          },
          {
            "id": 3,
            "note": "A#3",
            "time": 0.25,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 4,
            "note": "B2",
            "time": 0.495,
            "length": "16n",
            "velocity": 1
          },
          {
            "id": 5,
            "note": "G#2",
            "time": 0.811,
            "length": "32n",
            "velocity": 1
          },
          {
            "id": 6,
            "note": "F#2",
            "time": 0.873,
            "length": 0.11699999999999999,
            "velocity": 1
          },
          {
            "id": 7,
            "note": "G#3",
            "time": 0.749,
            "length": "32n",
            "velocity": 1
          },
          {
            "id": 8,
            "note": "G2",
            "time": 0.999,
            "length": 0.03950000000000009,
            "velocity": 1
          }
        ],
        "humanize": false,
        "bars": 2,
        "noteLength": "1/16"
      },
      {
        "index": 13,
        "channel": [
          13
        ],
        "sequence": [
          {
            "id": 0,
            "note": "A2",
            "time": 0.249,
            "length": 0.126,
            "velocity": 1
          },
          {
            "id": 1,
            "note": "F2",
            "time": 0.499,
            "length": 0.124,
            "velocity": 1
          },
          {
            "id": 2,
            "note": "F3",
            "time": 0,
            "length": 0.124,
            "velocity": 1
          },
          {
            "id": 4,
            "note": "G2",
            "time": 0.756,
            "length": 0.244,
            "velocity": 1
          }
        ],
        "humanize": false,
        "bars": 1,
        "noteLength": "1/16"
      }
    ]
  }
}

// {

//     presets: [],
//     currentSession: {
//         "bpm": 120,
//         "volume": 0.49999999999999994,
//         "octave": 1,
//         "channel": 0,
//         "tracks": [
//           {
//             "enabled": true,
//             "index": 0,
//             "channel": 0,
//             "volume": -3,
//             "instrument": {
//               "name": "Oscillator",
//               "enabled": true,
//               "collapsed": false,
//               "detune": 0,
//               "phase": 0,
//               "wave": "sine",
//               "wavePartial": "",
//               "attack": 0.01,
//               "decay": 0.1,
//               "sustain": 0.5,
//               "release": 1
//             },
//             "nodes": [],
//             "soloEnabled": false,
//             "hold": {
//               "enabled": "OFF",
//               "activeKeys": []
//             },
//             "isMuted": false,
//             "isCollapsed": false
//           },
//           {
//             "enabled": true,
//             "index": 1,
//             "channel": 0,
//             "volume": -3,
//             "instrument": {
//               "name": "Oscillator",
//               "enabled": true,
//               "collapsed": false,
//               "detune": 0,
//               "phase": 0,
//               "wave": "triangle",
//               "wavePartial": "",
//               "attack": 0.01,
//               "decay": 0.1,
//               "sustain": 0.5,
//               "release": 1
//             },
//             "nodes": [
//               {
//                 "name": "Distortion",
//                 "enabled": true,
//                 "collapsed": false,
//                 "wet": 1,
//                 "gain": 0.5
//               }
//             ],
//             "soloEnabled": false,
//             "hold": {
//               "enabled": "OFF",
//               "activeKeys": []
//             },
//             "isMuted": false,
//             "isCollapsed": false
//           },
//           {
//             "enabled": true,
//             "index": 2,
//             "channel": 0,
//             "volume": -3,
//             "instrument": {
//               "name": "Sampler",
//               "enabled": true,
//               "collapsed": false,
//               "volume": 0,
//               "sample": "Sweep Fm7"
//             },
//             "nodes": [
//               {
//                 "name": "Delay",
//                 "enabled": true,
//                 "collapsed": false,
//                 "wet": 1,
//                 "delayTime": 0.12,
//                 "feedback": 0.8
//               }
//             ],
//             "soloEnabled": false,
//             "hold": {
//               "enabled": "OFF",
//               "activeKeys": []
//             },
//             "isMuted": false,
//             "isCollapsed": false
//           },
//           {
//             "enabled": true,
//             "index": 3,
//             "channel": 0,
//             "volume": -3,
//             "instrument": {
//               "name": "Synth",
//               "enabled": true,
//               "collapsed": false,
//               "volume": 3,
//               "detune": 0.5,
//               "attack": 0.005,
//               "attackCurve": "linear",
//               "decay": 0.1,
//               "decayCurve": "exponential",
//               "release": 1,
//               "releaseCurve": "exponential",
//               "sustain": 0.3,
//               "partialCount": 0,
//               "partials": [],
//               "phase": 0,
//               "type": "triangle",
//               "portamento": 0
//             },
//             "nodes": [
//               {
//                 "name": "Vibrato",
//                 "enabled": true,
//                 "collapsed": false,
//                 "wet": 1,
//                 "depth": 0.1,
//                 "maxDelay": 0.005,
//                 "wave": "sine",
//                 "wavePartial": "",
//                 "frequency": 5
//               }
//             ],
//             "soloEnabled": false,
//             "hold": {
//               "enabled": "OFF",
//               "activeKeys": []
//             },
//             "isMuted": false,
//             "isCollapsed": false
//           },
//           {
//             "enabled": true,
//             "index": 4,
//             "channel": 0,
//             "volume": -3,
//             "instrument": {
//               "name": "AMSynth",
//               "enabled": true,
//               "collapsed": false,
//               "volume": 1,
//               "detune": 0,
//               "portamento": 0,
//               "harmonicity": 3,
//               "phase": 0,
//               "attack": 0.01,
//               "decay": 0.01,
//               "sustain": 1,
//               "release": 0.5
//             },
//             "nodes": [],
//             "soloEnabled": false,
//             "hold": {
//               "enabled": "OFF",
//               "activeKeys": []
//             },
//             "isMuted": false,
//             "isCollapsed": false
//           },
//           {
//             "enabled": true,
//             "index": 5,
//             "channel": 0,
//             "volume": -16.511111111111255,
//             "instrument": {
//               "name": "DuoSynth",
//               "enabled": true,
//               "collapsed": false,
//               "volume": 0.21999999999999975,
//               "detune": 1,
//               "harmonicity": 1,
//               "portamento": 0,
//               "vibratoAmount": 0.45,
//               "vibratoRate": 1,
//               "attack0": 0.01,
//               "decay0": 0,
//               "release0": 0.5,
//               "sustain0": 1,
//               "attack1": 0.01,
//               "decay1": 0,
//               "release1": 0.5,
//               "sustain1": 1
//             },
//             "nodes": [],
//             "soloEnabled": false,
//             "hold": {
//               "enabled": "OFF",
//               "activeKeys": []
//             },
//             "isMuted": false,
//             "isCollapsed": false
//           }
//         ],
//         "sequencers": []
//       }


    // currentSession: {

    //     bpm: 120,
    //     volume: 1,
    //     octave: 2,
    //     channel: 0,
    //     tracks: [
    //         {
    //             muted: false,
    //             channel: 0,
    //             instrument: {
    //                 name: "DuoSynth",
    //                 enabled: true,
    //                 volume: 0.5,
    //                 detune: 0,
    //                 harmonicity: 1,
    //                 portamento: 0,
    //                 vibratoAmount: 0.5,
    //                 vibratoRate: 5,
    //                 attack0: 2.96,
    //                 decay0: 0,
    //                 release0: 0.5,
    //                 sustain0: 1,
    //                 attack1: 0,
    //                 decay1: 0,
    //                 release1: 0.1600000000000001,
    //                 sustain1: 0.6300000000000001
    //             },
    //             nodes: [
    //                 {
    //                     name: "Delay",
    //                     enabled: true,
    //                     wet: 1,
    //                     delayTime: 0,
    //                     feedback: 0.8200000000000001
    //                 },
    //                 {
    //                     name: "Tremolo",
    //                     enabled: true,
    //                     wet: 0,
    //                     frequency: 87.34000000000009,
    //                     depth: 0.04
    //                 }
    //             ],
    //             volume: -3
    //         },
    //         {
    //             channel: 0,
    //             muted: false,
    //             instrument: {
    //                 name: "FMSynth",
    //                 enabled: true,
    //                 volume: 3,
    //                 detune: 0.5,
    //                 portamento: 0,
    //                 harmonicity: 3,
    //                 phase: 0,
    //                 attack: 0.01,
    //                 decay: 0.01,
    //                 sustain: 1,
    //                 release: 0.5
    //             },
    //             nodes: [],
    //             volume: -3
    //         },
    //         {
    //             channel: 0,
    //             muted: false,
    //             instrument: {
    //                 name: "Oscillator",
    //                 enabled: true,
    //                 detune: 0,
    //                 phase: 0,
    //                 wave: "sine",
    //                 wavePartial: "",
    //                 attack: 0.01,
    //                 decay: 0.1,
    //                 sustain: 0.5,
    //                 release: 1
    //             },
    //             nodes: [],
    //             volume: -3
    //         }
    //     ]
    // }


export const DEFAULT_PRESETS: IPreset[] = 

  [
    {
      "bpm": 120,
      "volume": -3,
      "octave": 2,
      "channel": 14,
      "tracks": [
        {
          "enabled": true,
          "index": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 1,
          "channel": 1,
          "volume": -14.695555555555593,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": -4.221388888888889,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C3",
              "E3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 2,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "PulseOscillator",
            "enabled": true,
            "collapsed": false,
            "volume": 0.6194444444444445,
            "detune": 0,
            "width": 0.2,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.12,
              "feedback": 0.8
            },
            {
              "name": "Chorus",
              "enabled": true,
              "collapsed": false,
              "wet": 0.5,
              "delayTime": 3.5,
              "depth": 0.7,
              "feedback": 0
            },
            {
              "name": "Distortion",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "gain": 1
            },
            {
              "name": "AutoFilter",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 1,
              "octaves": 2.6,
              "wave": "sine",
              "wavePartial": "",
              "baseFrequency": 200,
              "frequency": 1
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "B3",
              "E4"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 3,
          "channel": 15,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "sample": "Kick3"
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 4,
          "channel": 14,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "sample": "Snare4"
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A#1",
              "F2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 5,
          "channel": 13,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "sample": "Hihat7"
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "index": 1,
          "channel": [
            0
          ],
          "sequence": [
            {
              "id": 0,
              "note": "C3",
              "time": 0,
              "length": 0.242,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "C3",
              "time": 0.746,
              "length": "4n",
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 2
        },
        {
          "index": 2,
          "channel": [
            1
          ],
          "sequence": [
            {
              "id": 0,
              "note": "C3",
              "time": 0.123,
              "length": 0.127,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "E3",
              "time": 0.377,
              "length": 0.126,
              "velocity": 1
            },
            {
              "id": 2,
              "note": "C3",
              "time": 0.399,
              "length": 0.22399999999999998,
              "velocity": 1
            },
            {
              "id": 3,
              "note": "C3",
              "time": 0.873,
              "length": 0.12499999999999989,
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 1
        },
        {
          "index": 4,
          "channel": [
            0
          ],
          "sequence": [],
          "humanize": false,
          "bars": 1
        },
        {
          "index": 6,
          "channel": [
            2
          ],
          "sequence": [
            {
              "id": 0,
              "note": "B3",
              "time": 0,
              "length": 3.999,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "E4",
              "time": 4.001,
              "length": 4.0040000000000004,
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 8
        },
        {
          "index": 10,
          "channel": [
            15
          ],
          "sequence": [
            {
              "id": 0,
              "note": "C3",
              "time": 0,
              "length": 0.247,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "C3",
              "time": 0.249,
              "length": "4n",
              "velocity": 1
            },
            {
              "id": 2,
              "note": "C3",
              "time": 0.999,
              "length": 0.20200000000000018,
              "velocity": 1
            },
            {
              "id": 3,
              "note": "C3",
              "time": 1.248,
              "length": "4n",
              "velocity": 1
            },
            {
              "id": 4,
              "note": "C3",
              "time": 0.872,
              "length": 0.127,
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 2
        },
        {
          "index": 11,
          "channel": [
            14
          ],
          "sequence": [
            {
              "id": 0,
              "note": "A#1",
              "time": 0.499,
              "length": "4n",
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 1
        },
        {
          "index": 12,
          "channel": [
            13
          ],
          "sequence": [
            {
              "id": 0,
              "note": "C3",
              "time": 0.003,
              "length": "4n",
              "velocity": 1
            },
            {
              "id": 1,
              "note": "C3",
              "time": 0.498,
              "length": "4n",
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 1
        }
      ],
      "id": 100020,
      "name": "Space Beat"
    },
    {
      "volume": 0.5,
      "octave": 1,
      "channel": 0,
      "tracks": [
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "triangle",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [
            {
              "name": "Distortion",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "gain": 0.5
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.12,
              "feedback": 0.8
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Synth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0
          },
          "nodes": [
            {
              "name": "Vibrato",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 0.1,
              "maxDelay": 0.005,
              "wave": "sine",
              "wavePartial": "",
              "frequency": 5
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.21999999999999975,
            "detune": 1,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.6599999999999997,
            "vibratoRate": 1,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "id": 0,
      "name": "F#3-D2-F#3-C#3"
    },
    {
      "bpm": 80,
      "volume": 0.5,
      "octave": 4,
      "channel": 2,
      "tracks": [
        {
          "enabled": true,
          "channel": 0,
          "volume": -3.5900000000002024,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "E2",
              "E3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 1,
          "volume": 6,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "E3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 1,
          "volume": 6,
          "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "E3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A4"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -26.379999999999754,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A4"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "channel": [
            0
          ],
          "sequence": [
            "D2",
            "E2",
            "D2",
            "E2"
          ]
        },
        {
          "channel": [
            0,
            1
          ],
          "sequence": [
            "F#2",
            "E3",
            "F#2",
            "E3"
          ]
        },
        {
          "channel": [
            2
          ],
          "sequence": [
            [
              [
                "F#4",
                "A4"
              ],
              [
                "C#5",
                "A4"
              ],
              [
                "A4",
                "A4"
              ],
              [
                "A4",
                "A4"
              ]
            ]
          ]
        }
      ],
      "id": 0,
      "name": "Blelelel"
    },
    {
      "volume": 0.8500000000000004,
      "octave": 4,
      "channel": 7,
      "tracks": [
        {
          "enabled": true,
          "channel": 7,
          "volume": -3,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [
            {
              "name": "Reverb",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "decay": 3,
              "preDelay": 0.060000000000000005
            },
            {
              "name": "Phaser",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "octaves": 3,
              "baseFrequency": 350,
              "frequency": 0.5,
              "Q": 10
            },
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.08000000000000003,
              "feedback": 0.4900000000000002
            },
            {
              "name": "Vibrato",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 0.1,
              "maxDelay": 0.005,
              "wave": "triangle",
              "wavePartial": "",
              "frequency": 5
            },
            {
              "name": "Chorus",
              "enabled": true,
              "collapsed": false,
              "wet": 0.5,
              "delayTime": 3.5,
              "depth": 0.7,
              "feedback": 0
            },
            {
              "name": "Reverb",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "decay": 3,
              "preDelay": 0
            },
            {
              "name": "Reverb",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "decay": 3,
              "preDelay": 1
            },
            {
              "name": "Phaser",
              "enabled": true,
              "collapsed": false,
              "wet": 0,
              "octaves": 3,
              "baseFrequency": 350,
              "frequency": 131.98000000000022,
              "Q": 10
            },
            {
              "name": "Phaser",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "octaves": 12,
              "baseFrequency": 503.86999999999955,
              "frequency": 0.5,
              "Q": 1
            },
            {
              "name": "Phaser",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "octaves": 3,
              "baseFrequency": 350,
              "frequency": 0.5,
              "Q": 10
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "HOLD",
            "activeKeys": [
              "A3",
              "B4",
              "F#4",
              "F#3",
              "D2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "id": 0,
      "name": "singing birds"
    },
    {
      "volume": 0.3,
      "octave": 2,
      "channel": 2,
      "tracks": [
        {
          "enabled": true,
          "channel": 7,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "HOLD",
            "activeKeys": [
              "D2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 1,
          "volume": -3,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0,
            "decay": 2.23,
            "sustain": 1,
            "release": 1.0100000000000005
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.1499999999999997,
            "detune": 0,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.03,
              "feedback": 0.8
            },
            {
              "name": "Vibrato",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 0.1,
              "maxDelay": 0.005,
              "wave": "triangle",
              "wavePartial": "",
              "frequency": 5
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "A5"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "channel": [
            7,
            0
          ],
          "sequence": [
            "A2",
            "F2"
          ]
        },
        {
          "channel": [
            0,
            1,
            7
          ],
          "sequence": [
            "A2",
            "F2",
            "G2",
            "F2"
          ]
        },
        {
          "channel": [
            2
          ],
          "sequence": [
            [
              "F5",
              "F5",
              "F5",
              "F5",
              "F5",
              "F5",
              "A5",
              "A5"
            ]
          ]
        }
      ],
      "id": 0,
      "name": "SEQ"
    },
    {
      "bpm": 120,
      "volume": 0.5,
      "octave": 4,
      "channel": 0,
      "tracks": [
        {
          "enabled": true,
          "channel": 0,
          "volume": 1.2000000000003581,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.3500000000000002,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [],
      "id": 0,
      "name": "j"
    },
    {
      "bpm": 120,
      "volume": 1,
      "octave": 2,
      "channel": 1,
      "tracks": [
        {
          "enabled": true,
          "channel": 1,
          "volume": -3,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 2.96,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0,
            "decay1": 0,
            "release1": 0.1600000000000001,
            "sustain1": 0.6300000000000001
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0,
              "feedback": 0.8200000000000001
            },
            {
              "name": "Tremolo",
              "enabled": true,
              "collapsed": false,
              "wet": 0,
              "frequency": 87.34000000000009,
              "depth": 0.04
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C#3",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C#3",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": 6,
          "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 6,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.09,
              "feedback": 0.4600000000000002
            },
            {
              "name": "Chorus",
              "enabled": true,
              "collapsed": false,
              "wet": 0.5,
              "delayTime": 3.5,
              "depth": 0.7,
              "feedback": 0
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C#3",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 1,
          "volume": -3,
          "instrument": {
            "name": "Synth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.12,
              "feedback": 0.8
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C#3",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "channel": [
            0,
            2,
            1
          ],
          "sequence": [
            "A#2",
            "A3",
            [
              "DB3",
              "C#2"
            ],
            "E3"
          ]
        }
      ],
      "id": 0,
      "name": "test"
    },
    {
      "bpm": 120,
      "volume": 0,
      "octave": 2,
      "channel": 0,
      "tracks": [
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 2.96,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0,
            "decay1": 0,
            "release1": 0.1600000000000001,
            "sustain1": 0.6300000000000001
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0,
              "feedback": 0.8200000000000001
            },
            {
              "name": "Tremolo",
              "enabled": true,
              "collapsed": false,
              "wet": 0,
              "frequency": 87.34000000000009,
              "depth": 0.04
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 1,
          "volume": -3,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 3,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 7,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6
          },
          "nodes": [
            {
              "name": "Vibrato",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 1,
              "maxDelay": 1,
              "wave": "sine",
              "wavePartial": "",
              "frequency": 0.2909964774028786
            },
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.29388233955232396,
              "feedback": 0.30788145842107184
            },
            {
              "name": "Chorus",
              "enabled": true,
              "collapsed": false,
              "wet": 0.5,
              "delayTime": 7.649999999999995,
              "depth": 1,
              "feedback": 0.8199999999999998
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 7,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6
          },
          "nodes": [
            {
              "name": "Vibrato",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 1,
              "maxDelay": 1,
              "wave": "sine",
              "wavePartial": "",
              "frequency": 0.286144993268701
            },
            {
              "name": "Phaser",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "octaves": 0.03420278359088041,
              "baseFrequency": 106.78622128881788,
              "frequency": 218.375227138607,
              "Q": 0.14447751544810739
            },
            {
              "name": "Distortion",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "gain": 0.5
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C3"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "channel": [
            7
          ],
          "sequence": [
            {
              "id": 0,
              "note": "C3",
              "time": 1.01,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 1,
              "note": "C3",
              "time": 0.011,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 2,
              "note": "C3",
              "time": 2.009,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 3,
              "note": "C3",
              "time": 3.003,
              "length": "16n",
              "velocity": 1
            }
          ]
        }
      ],
      "id": 0,
      "name": "beepbeepbebeep"
    },
    {
      "bpm": 120,
      "volume": 0,
      "octave": 2,
      "channel": 15,
      "tracks": [
        {
          "enabled": true,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6,
            "sample": "Kick2"
          },
          "nodes": [
            {
              "name": "Tremolo",
              "enabled": true,
              "collapsed": false,
              "wet": 0,
              "frequency": 87.34000000000009,
              "depth": 0.04
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C2",
              "D2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 1,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6,
            "sample": "Snare3"
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.12,
              "feedback": 0.18999999999999995
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 2,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6,
            "sample": "Hihat1"
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F2",
              "A2",
              "A1"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 15,
          "volume": -3,
          "instrument": {
            "name": "Synth",
            "enabled": true,
            "collapsed": false,
            "volume": 0,
            "detune": 0.5,
            "attack": 0.005,
            "attackCurve": "linear",
            "decay": 0.1,
            "decayCurve": "exponential",
            "release": 1,
            "releaseCurve": "exponential",
            "sustain": 0.3,
            "partialCount": 0,
            "partials": [],
            "phase": 0,
            "type": "triangle",
            "portamento": 0
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C2",
              "D2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 15,
          "volume": -3,
          "instrument": {
            "name": "PulseOscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "width": 0.2,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C2",
              "D2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "channel": 15,
          "volume": 5.959999999999994,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "sample": "Back Home F"
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "C2",
              "D2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "channel": [
            0,
            15
          ],
          "sequence": [
            {
              "id": 0,
              "note": "C3",
              "time": -31419130815508.19,
              "length": -31419130815509.543,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "C3",
              "time": -9029385698377.71,
              "length": -9029385698377.71,
              "velocity": 1
            },
            {
              "id": 2,
              "note": "C3",
              "time": -8.327,
              "length": -9.009,
              "velocity": 1
            },
            {
              "id": 3,
              "note": "D2",
              "time": 1.998,
              "length": 0.992,
              "velocity": 1
            },
            {
              "id": 4,
              "note": "C2",
              "time": 3.985,
              "length": 1.0100000000000002,
              "velocity": 1
            },
            {
              "id": 5,
              "note": "C2",
              "time": 6.005,
              "length": 0.8769999999999998,
              "velocity": 1
            },
            {
              "id": 6,
              "note": "C2",
              "time": 0.013,
              "length": 0.984,
              "velocity": 1
            },
            {
              "id": 7,
              "note": "D2",
              "time": 2.508,
              "length": 0.9969999999999999,
              "velocity": 1
            },
            {
              "id": 8,
              "note": "C2",
              "time": 6.778,
              "length": 0.24600000000000044,
              "velocity": 1
            },
            {
              "id": 9,
              "note": "C2",
              "time": 7.004,
              "length": 0.9720000000000004,
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 8
        },
        {
          "channel": [
            1
          ],
          "sequence": [
            {
              "id": 0,
              "note": "F2",
              "time": 0.858,
              "length": 0.9750000000000001,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "F2",
              "time": 2.9,
              "length": 0.5049999999999999,
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 4
        },
        {
          "channel": [
            2
          ],
          "sequence": [
            {
              "id": 0,
              "note": "F2",
              "time": 0.249,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 1,
              "note": "A2",
              "time": 0.499,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 2,
              "note": "A1",
              "time": 0.749,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 3,
              "note": "F2",
              "time": 0,
              "length": "16n",
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 1
        }
      ],
      "id": 0,
      "name": "DEFAULT"
    },
    {
      "bpm": 120,
      "volume": -3,
      "octave": 4,
      "channel": 1,
      "tracks": [
        {
          "enabled": true,
          "index": 0,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "volume": 0.4,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 1,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "volume": 0.4,
            "detune": 0,
            "phase": 0,
            "wave": "triangle",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [
            {
              "name": "Distortion",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "gain": 0.5
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 2,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0,
            "sample": "Cymbal1"
          },
          "nodes": [
            {
              "name": "Delay",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "delayTime": 0.12,
              "feedback": 0.8
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": true,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 3,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "Synth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "attack": 0.005,
            "attackCurve": "linear",
            "decay": 0.1,
            "decayCurve": "exponential",
            "release": 1,
            "releaseCurve": "exponential",
            "sustain": 0.3,
            "partialCount": 0,
            "partials": [],
            "phase": 0,
            "type": "triangle",
            "portamento": 0
          },
          "nodes": [
            {
              "name": "Vibrato",
              "enabled": true,
              "collapsed": false,
              "wet": 1,
              "depth": 0.1,
              "maxDelay": 0.005,
              "wave": "sine",
              "wavePartial": "",
              "frequency": 5
            }
          ],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 4,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 5,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -16.511111111111255,
          "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.21999999999999975,
            "detune": 1,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.45,
            "vibratoRate": 1,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 6,
          "octaveOffset": 0,
          "channel": 0,
          "volume": -3,
          "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": [
              "F#1",
              "A#1",
              "D#2",
              "F#2"
            ]
          },
          "isMuted": false,
          "isCollapsed": false
        },
        {
          "enabled": true,
          "index": 7,
          "octaveOffset": 0,
          "channel": 1,
          "volume": -3,
          "instrument": {
            "name": "FatOscillator",
            "enabled": true,
            "collapsed": false,
            "volume": 0.4,
            "detune": 0,
            "spread": 20,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
          },
          "nodes": [],
          "soloEnabled": false,
          "hold": {
            "enabled": "OFF",
            "activeKeys": []
          },
          "isMuted": false,
          "isCollapsed": false
        }
      ],
      "sequencers": [
        {
          "index": 7,
          "channel": [
            0
          ],
          "sequence": [
            {
              "id": 0,
              "note": "F#1",
              "time": 0,
              "length": 0.124,
              "velocity": 1
            },
            {
              "id": 1,
              "note": "A#1",
              "time": 0.124,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 2,
              "note": "D#2",
              "time": 0.25,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 3,
              "note": "F#2",
              "time": 0.375,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 4,
              "note": "D#2",
              "time": 0.5,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 5,
              "note": "A#1",
              "time": 0.625,
              "length": "16n",
              "velocity": 1
            },
            {
              "id": 6,
              "note": "F#1",
              "time": 0.751,
              "length": "16n",
              "velocity": 1
            }
          ],
          "humanize": false,
          "bars": 1
        },
        {
          "index": 8,
          "channel": [
            0
          ],
          "sequence": [],
          "humanize": false,
          "bars": 1
        }
      ],
      "id": 0,
      "name": "SHARP SOUND"
    },










    




    // NEW -----------------------------------------------------------------------------------
















    {
    "volume": 0.5,
    "octave": 1,
    "channel": 0,
    "tracks": [
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "triangle",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [
            {
            "name": "Distortion",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "gain": 0.5
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5
        },
        "nodes": [
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.12,
            "feedback": 0.8
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "Synth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0
        },
        "nodes": [
            {
            "name": "Vibrato",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "depth": 0.1,
            "maxDelay": 0.005,
            "wave": "sine",
            "wavePartial": "",
            "frequency": 5
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.21999999999999975,
            "detune": 1,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.6599999999999997,
            "vibratoRate": 1,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "id": 0,
    "name": "F#3-D2-F#3-C#3"
    },
    {
    "bpm": 80,
    "volume": 0.5,
    "octave": 4,
    "channel": 2,
    "tracks": [
        {
        "enabled": true,
        "channel": 0,
        "volume": -3.5900000000002024,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "E2",
            "E3"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 1,
        "volume": 6,
        "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "E3"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 1,
        "volume": 6,
        "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "E3"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 2,
        "volume": -3,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "A4"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 2,
        "volume": -26.379999999999754,
        "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "A4"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "sequencers": [
        {
        "channel": [
            0
        ],
        "sequence": [
            "D2",
            "E2",
            "D2",
            "E2"
        ]
        },
        {
        "channel": [
            0,
            1
        ],
        "sequence": [
            "F#2",
            "E3",
            "F#2",
            "E3"
        ]
        },
        {
        "channel": [
            2
        ],
        "sequence": [
            [
            [
                "F#4",
                "A4"
            ],
            [
                "C#5",
                "A4"
            ],
            [
                "A4",
                "A4"
            ],
            [
                "A4",
                "A4"
            ]
            ]
        ]
        }
    ],
    "id": 0,
    "name": "Blelelel"
    },
    {
    "volume": 0.8500000000000004,
    "octave": 4,
    "channel": 7,
    "tracks": [
        {
        "enabled": true,
        "channel": 7,
        "volume": -3,
        "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [
            {
            "name": "Reverb",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "decay": 3,
            "preDelay": 0.060000000000000005
            },
            {
            "name": "Phaser",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "octaves": 3,
            "baseFrequency": 350,
            "frequency": 0.5,
            "Q": 10
            },
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.08000000000000003,
            "feedback": 0.4900000000000002
            },
            {
            "name": "Vibrato",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "depth": 0.1,
            "maxDelay": 0.005,
            "wave": "triangle",
            "wavePartial": "",
            "frequency": 5
            },
            {
            "name": "Chorus",
            "enabled": true,
            "collapsed": false,
            "wet": 0.5,
            "delayTime": 3.5,
            "depth": 0.7,
            "feedback": 0
            },
            {
            "name": "Reverb",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "decay": 3,
            "preDelay": 0
            },
            {
            "name": "Reverb",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "decay": 3,
            "preDelay": 1
            },
            {
            "name": "Phaser",
            "enabled": true,
            "collapsed": false,
            "wet": 0,
            "octaves": 3,
            "baseFrequency": 350,
            "frequency": 131.98000000000022,
            "Q": 10
            },
            {
            "name": "Phaser",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "octaves": 12,
            "baseFrequency": 503.86999999999955,
            "frequency": 0.5,
            "Q": 1
            },
            {
            "name": "Phaser",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "octaves": 3,
            "baseFrequency": 350,
            "frequency": 0.5,
            "Q": 10
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "HOLD",
            "activeKeys": [
            "A3",
            "B4",
            "F#4",
            "F#3",
            "D2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "id": 0,
    "name": "singing birds"
    },
    {
    "volume": 0.3,
    "octave": 2,
    "channel": 2,
    "tracks": [
        {
        "enabled": true,
        "channel": 7,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "A2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 2,
        "volume": -3,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1.5,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "HOLD",
            "activeKeys": [
            "D2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 1,
        "volume": -3,
        "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "A2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 1,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0,
            "decay": 2.23,
            "sustain": 1,
            "release": 1.0100000000000005
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "A2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 2,
        "volume": -3,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.1499999999999997,
            "detune": 0,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 0.01,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0.01,
            "decay1": 0,
            "release1": 0.5,
            "sustain1": 1
        },
        "nodes": [
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.03,
            "feedback": 0.8
            },
            {
            "name": "Vibrato",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "depth": 0.1,
            "maxDelay": 0.005,
            "wave": "triangle",
            "wavePartial": "",
            "frequency": 5
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "A5"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "sequencers": [
        {
        "channel": [
            7,
            0
        ],
        "sequence": [
            "A2",
            "F2"
        ]
        },
        {
        "channel": [
            0,
            1,
            7
        ],
        "sequence": [
            "A2",
            "F2",
            "G2",
            "F2"
        ]
        },
        {
        "channel": [
            2
        ],
        "sequence": [
            [
            "F5",
            "F5",
            "F5",
            "F5",
            "F5",
            "F5",
            "A5",
            "A5"
            ]
        ]
        }
    ],
    "id": 0,
    "name": "SEQ"
    },
    {
    "bpm": 120,
    "volume": 0.5,
    "octave": 4,
    "channel": 0,
    "tracks": [
        {
        "enabled": true,
        "channel": 0,
        "volume": 1.2000000000003581,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.3500000000000002,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "sequencers": [],
    "id": 0,
    "name": "j"
    },
    {
    "bpm": 120,
    "volume": 1,
    "octave": 2,
    "channel": 1,
    "tracks": [
        {
        "enabled": true,
        "channel": 1,
        "volume": -3,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 2.96,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0,
            "decay1": 0,
            "release1": 0.1600000000000001,
            "sustain1": 0.6300000000000001
        },
        "nodes": [
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0,
            "feedback": 0.8200000000000001
            },
            {
            "name": "Tremolo",
            "enabled": true,
            "collapsed": false,
            "wet": 0,
            "frequency": 87.34000000000009,
            "depth": 0.04
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "C#3",
            "F#2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 2,
        "volume": -3,
        "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "C#3",
            "F#2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": 6,
        "instrument": {
            "name": "AMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 6,
            "detune": 0,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.09,
            "feedback": 0.4600000000000002
            },
            {
            "name": "Chorus",
            "enabled": true,
            "collapsed": false,
            "wet": 0.5,
            "delayTime": 3.5,
            "depth": 0.7,
            "feedback": 0
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "C#3",
            "F#2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 1,
        "volume": -3,
        "instrument": {
            "name": "Synth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0
        },
        "nodes": [
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.12,
            "feedback": 0.8
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "C#3",
            "F#2"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "sequencers": [
        {
        "channel": [
            0,
            2,
            1
        ],
        "sequence": [
            "A#2",
            "A3",
            [
            "DB3",
            "C#2"
            ],
            "E3"
        ]
        }
    ],
    "id": 0,
    "name": "test"
    },
    {
    "bpm": 120,
    "volume": 0,
    "octave": 2,
    "channel": 0,
    "tracks": [
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "DuoSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 0.5,
            "detune": 0,
            "harmonicity": 1,
            "portamento": 0,
            "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "attack0": 2.96,
            "decay0": 0,
            "release0": 0.5,
            "sustain0": 1,
            "attack1": 0,
            "decay1": 0,
            "release1": 0.1600000000000001,
            "sustain1": 0.6300000000000001
        },
        "nodes": [
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0,
            "feedback": 0.8200000000000001
            },
            {
            "name": "Tremolo",
            "enabled": true,
            "collapsed": false,
            "wet": 0,
            "frequency": 87.34000000000009,
            "depth": 0.04
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 1,
        "volume": -3,
        "instrument": {
            "name": "FMSynth",
            "enabled": true,
            "collapsed": false,
            "volume": 3,
            "detune": 0.5,
            "portamento": 0,
            "harmonicity": 3,
            "phase": 0,
            "attack": 0.01,
            "decay": 0.01,
            "sustain": 1,
            "release": 0.5
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 2,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 3,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 0,
        "volume": -3,
        "instrument": {
            "name": "Oscillator",
            "enabled": true,
            "collapsed": false,
            "detune": 0,
            "phase": 0,
            "wave": "sine",
            "wavePartial": "",
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 1
        },
        "nodes": [],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": []
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 7,
        "volume": -3,
        "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6
        },
        "nodes": [
            {
            "name": "Vibrato",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "depth": 1,
            "maxDelay": 1,
            "wave": "sine",
            "wavePartial": "",
            "frequency": 0.2909964774028786
            },
            {
            "name": "Delay",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "delayTime": 0.29388233955232396,
            "feedback": 0.30788145842107184
            },
            {
            "name": "Chorus",
            "enabled": true,
            "collapsed": false,
            "wet": 0.5,
            "delayTime": 7.649999999999995,
            "depth": 1,
            "feedback": 0.8199999999999998
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "C3"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        },
        {
        "enabled": true,
        "channel": 7,
        "volume": -3,
        "instrument": {
            "name": "Sampler",
            "enabled": true,
            "collapsed": false,
            "volume": 6
        },
        "nodes": [
            {
            "name": "Vibrato",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "depth": 1,
            "maxDelay": 1,
            "wave": "sine",
            "wavePartial": "",
            "frequency": 0.286144993268701
            },
            {
            "name": "Phaser",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "octaves": 0.03420278359088041,
            "baseFrequency": 106.78622128881788,
            "frequency": 218.375227138607,
            "Q": 0.14447751544810739
            },
            {
            "name": "Distortion",
            "enabled": true,
            "collapsed": false,
            "wet": 1,
            "gain": 0.5
            }
        ],
        "soloEnabled": false,
        "hold": {
            "enabled": "OFF",
            "activeKeys": [
            "C3"
            ]
        },
        "isMuted": false,
        "isCollapsed": false
        }
    ],
    "sequencers": [
        {
        "channel": [
            7
        ],
        "sequence": [
            {
            "id": 0,
            "note": "C3",
            "time": 1.01,
            "length": "16n",
            "velocity": 1
            },
            {
            "id": 1,
            "note": "C3",
            "time": 0.011,
            "length": "16n",
            "velocity": 1
            },
            {
            "id": 2,
            "note": "C3",
            "time": 2.009,
            "length": "16n",
            "velocity": 1
            },
            {
            "id": 3,
            "note": "C3",
            "time": 3.003,
            "length": "16n",
            "velocity": 1
            }
        ]
        }
    ],
    "id": 0,
    "name": "beepbeepbebeep"
    },






    {
        "bpm": 120,
        "volume": 0,
        "octave": 2,
        "channel": 15,
        "tracks": [
            {
            "enabled": true,
            "channel": 0,
            "volume": -3,
            "instrument": {
                "name": "Sampler",
                "enabled": true,
                "collapsed": false,
                "volume": 6,
                "sample": "Kick2"
            },
            "nodes": [
                {
                "name": "Tremolo",
                "enabled": true,
                "collapsed": false,
                "wet": 0,
                "frequency": 87.34000000000009,
                "depth": 0.04
                }
            ],
            "soloEnabled": false,
            "hold": {
                "enabled": "OFF",
                "activeKeys": [
                "C2",
                "D2"
                ]
            },
            "isMuted": false,
            "isCollapsed": false
            },
            {
            "enabled": true,
            "channel": 1,
            "volume": -3,
            "instrument": {
                "name": "Sampler",
                "enabled": true,
                "collapsed": false,
                "volume": 6,
                "sample": "Snare3"
            },
            "nodes": [
                {
                "name": "Delay",
                "enabled": true,
                "collapsed": false,
                "wet": 1,
                "delayTime": 0.12,
                "feedback": 0.18999999999999995
                }
            ],
            "soloEnabled": false,
            "hold": {
                "enabled": "OFF",
                "activeKeys": [
                "F2"
                ]
            },
            "isMuted": false,
            "isCollapsed": false
            },
            {
            "enabled": true,
            "channel": 2,
            "volume": -3,
            "instrument": {
                "name": "Sampler",
                "enabled": true,
                "collapsed": false,
                "volume": 6,
                "sample": "Hihat1"
            },
            "nodes": [],
            "soloEnabled": false,
            "hold": {
                "enabled": "OFF",
                "activeKeys": [
                "F2",
                "A2",
                "A1"
                ]
            },
            "isMuted": false,
            "isCollapsed": false
            },
            {
            "enabled": true,
            "channel": 15,
            "volume": -3,
            "instrument": {
                "name": "Synth",
                "enabled": true,
                "collapsed": false,
                "volume": 0,
                "detune": 0.5,
                "attack": 0.005,
                "attackCurve": "linear",
                "decay": 0.1,
                "decayCurve": "exponential",
                "release": 1,
                "releaseCurve": "exponential",
                "sustain": 0.3,
                "partialCount": 0,
                "partials": [],
                "phase": 0,
                "type": "triangle",
                "portamento": 0
            },
            "nodes": [],
            "soloEnabled": false,
            "hold": {
                "enabled": "OFF",
                "activeKeys": [
                "C2",
                "D2"
                ]
            },
            "isMuted": false,
            "isCollapsed": false
            },
            {
            "enabled": true,
            "channel": 15,
            "volume": -3,
            "instrument": {
                "name": "PulseOscillator",
                "enabled": true,
                "collapsed": false,
                "detune": 0,
                "width": 0.2,
                "phase": 0,
                "attack": 0.01,
                "decay": 0.1,
                "sustain": 0.5,
                "release": 1
            },
            "nodes": [],
            "soloEnabled": false,
            "hold": {
                "enabled": "OFF",
                "activeKeys": [
                "C2",
                "D2"
                ]
            },
            "isMuted": false,
            "isCollapsed": false
            },
            {
            "enabled": true,
            "channel": 15,
            "volume": 5.959999999999994,
            "instrument": {
                "name": "Sampler",
                "enabled": true,
                "collapsed": false,
                "volume": 0.5,
                "sample": "Back Home F"
            },
            "nodes": [],
            "soloEnabled": false,
            "hold": {
                "enabled": "OFF",
                "activeKeys": [
                "C2",
                "D2"
                ]
            },
            "isMuted": false,
            "isCollapsed": false
            }
        ],
        "sequencers": [
            {
                "channel": [
                    0,
                    15
                ],
                "sequence": [
                    {
                    "id": 0,
                    "note": "C3",
                    "time": -31419130815508.19,
                    "length": -31419130815509.543,
                    "velocity": 1
                    },
                    {
                    "id": 1,
                    "note": "C3",
                    "time": -9029385698377.71,
                    "length": -9029385698377.71,
                    "velocity": 1
                    },
                    {
                    "id": 2,
                    "note": "C3",
                    "time": -8.327,
                    "length": -9.009,
                    "velocity": 1
                    },
                    {
                    "id": 3,
                    "note": "D2",
                    "time": 1.998,
                    "length": 0.992,
                    "velocity": 1
                    },
                    {
                    "id": 4,
                    "note": "C2",
                    "time": 3.985,
                    "length": 1.0100000000000002,
                    "velocity": 1
                    },
                    {
                    "id": 5,
                    "note": "C2",
                    "time": 6.005,
                    "length": 0.8769999999999998,
                    "velocity": 1
                    },
                    {
                    "id": 6,
                    "note": "C2",
                    "time": 0.013,
                    "length": 0.984,
                    "velocity": 1
                    },
                    {
                    "id": 7,
                    "note": "D2",
                    "time": 2.508,
                    "length": 0.9969999999999999,
                    "velocity": 1
                    },
                    {
                    "id": 8,
                    "note": "C2",
                    "time": 6.778,
                    "length": 0.24600000000000044,
                    "velocity": 1
                    },
                    {
                    "id": 9,
                    "note": "C2",
                    "time": 7.004,
                    "length": 0.9720000000000004,
                    "velocity": 1
                    }
                ],
                "humanize": false,
                "bars": 8
            },
            {
                "channel": [
                    1
                ],
                "sequence": [
                    {
                    "id": 0,
                    "note": "F2",
                    "time": 0.858,
                    "length": 0.9750000000000001,
                    "velocity": 1
                    },
                    {
                    "id": 1,
                    "note": "F2",
                    "time": 2.9,
                    "length": 0.5049999999999999,
                    "velocity": 1
                    }
                ],
                "humanize": false,
                "bars": 4
            },
            {
                "channel": [
                    2
                ],
                "sequence": [
                    {
                    "id": 0,
                    "note": "F2",
                    "time": 0.249,
                    "length": "16n",
                    "velocity": 1
                    },
                    {
                    "id": 1,
                    "note": "A2",
                    "time": 0.499,
                    "length": "16n",
                    "velocity": 1
                    },
                    {
                    "id": 2,
                    "note": "A1",
                    "time": 0.749,
                    "length": "16n",
                    "velocity": 1
                    },
                    {
                    "id": 3,
                    "note": "F2",
                    "time": 0,
                    "length": "16n",
                    "velocity": 1
                    }
                ],
                "humanize": false,
                "bars": 1
            },
        ],
        "id": 0,
        "name": "DEFAULT"
    }
]

