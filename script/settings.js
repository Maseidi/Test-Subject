import { IS_MOBILE } from './script.js'

let settings = null
export const setSettings = val => {
    settings = val
    settings.display.fps = Number(settings.display.fps)
}
export const getSettings = () => settings

export const getDefaultSettings = () => ({
    audio: {
        ui: 0.1,
        sound: 0.3,
        music: 0.6,
    },
    display: {
        fps: IS_MOBILE ? 30 : 60,
    },
    controls: {
        up: 'KeyW',
        left: 'KeyA',
        down: 'KeyS',
        heal: 'KeyH',
        right: 'KeyD',
        reload: 'KeyR',
        slot1: 'Digit1',
        slot2: 'Digit2',
        slot3: 'Digit3',
        slot4: 'Digit4',
        lightUp: 'KeyQ',
        interact: 'KeyF',
        inventory: 'Tab',
        sprint: 'ShiftLeft',
    },
})
