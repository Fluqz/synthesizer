

export const DEFAULT_SESSION = {

    presets: [],
    currentSession: {

        volume: 1,
        octave: 2,
        tracks: [
            {
                muted: false,
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