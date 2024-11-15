import type { ISerialization } from "../synthesizer/synthesizer";



export type MenuNavigation = 'MANUAL' | 'SETTINGS'



export interface IAppSerialization extends ISerialization {

    settings: {
        visualsEnabled: boolean
        animationsEnabled: boolean
        colorsEnabled: boolean
        muteOnLeaveBrowserEnabled: boolean
        showKeyboard: boolean
    }

}