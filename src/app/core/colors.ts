import { Util } from "../util/util"


export const getChannelColor = (channel: number = 0) => {

    const colors: string[] = JSON.parse(JSON.stringify(COLORS))

    return colors[channel].slice()
}

export const COLORS: string[] = [
    '#ffcc15',
        
    // '#FFFFFF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF0000', '#00FF00',

    //   Cyan        Black      Red      blue
    '#166f4a', '#161616', '#691616', '#16164a',
    'rgb(255, 121, 159)',
    'rgb(128, 255, 255)',
    // 'rgb(255, 255, 159)',
    'rgb(21, 111, 74)',
    'rgb(105, 22, 22)',
    'rgb(22, 22, 74)',
    'rgb(22, 22, 22)',
    'rgb(105, 22, 74)',
    'rgb(21, 111, 23)',

    // 'rgb(105, 111, 22)',
    // 'rgb(128, 122, 255)',


    '#ffcc15',
    '#ffcc15',
    '#ffcc15',
]


export const COLORS_RGB = [
        
    { r: 22, g: 111, b: 74 },
    { r: 22, g: 22, b: 22 },
    { r: 105, g: 22, b: 22 },
    { r: 255, g: 121, b: 159 },
    { r: 128, g: 255, b: 255 },
    // { r: 255, g: 255, b: 159 },
    { r: 21, g: 111, b: 74 },
    { r: 22, g: 22, b: 74 },
    { r: 22, g: 22, b: 22 },
    { r: 105, g: 22, b: 74 },
    { r: 21, g: 111, b: 23 },
]


