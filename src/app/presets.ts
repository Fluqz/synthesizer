

export const DEFAULT_SESSION = {

    presets: [],
    currentSession: {

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


export const presets = [

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
]