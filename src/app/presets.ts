import type { IPreset } from "./core/preset-manager"


export const DEFAULT_SESSION = {

    presets: [],
    currentSession: {

        bpm: 120,
        volume: 1,
        octave: 2,
        channel: 0,
        tracks: [
            {
                muted: false,
                channel: 0,
                instrument: {
                    name: "DuoSynth",
                    enabled: true,
                    volume: 0.5,
                    detune: 0,
                    harmonicity: 1,
                    portamento: 0,
                    vibratoAmount: 0.5,
                    vibratoRate: 5,
                    attack0: 2.96,
                    decay0: 0,
                    release0: 0.5,
                    sustain0: 1,
                    attack1: 0,
                    decay1: 0,
                    release1: 0.1600000000000001,
                    sustain1: 0.6300000000000001
                },
                nodes: [
                    {
                        name: "Delay",
                        enabled: true,
                        wet: 1,
                        delayTime: 0,
                        feedback: 0.8200000000000001
                    },
                    {
                        name: "Tremolo",
                        enabled: true,
                        wet: 0,
                        frequency: 87.34000000000009,
                        depth: 0.04
                    }
                ],
                volume: -3
            },
            {
                channel: 0,
                muted: false,
                instrument: {
                    name: "FMSynth",
                    enabled: true,
                    volume: 3,
                    detune: 0.5,
                    portamento: 0,
                    harmonicity: 3,
                    phase: 0,
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 1,
                    release: 0.5
                },
                nodes: [],
                volume: -3
            },
            {
                channel: 0,
                muted: false,
                instrument: {
                    name: "Oscillator",
                    enabled: true,
                    detune: 0,
                    phase: 0,
                    wave: "sine",
                    wavePartial: "",
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.5,
                    release: 1
                },
                nodes: [],
                volume: -3
            }
        ]
    }
}


export const DEFAULT_PRESETS: IPreset[] = [

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
        "volume": .3,
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
    }
]