import { IS_MOBILE } from './platform.js'

let settings = null
export const setSettings = val => {
    const defaults = getDefaultSettings()
    const controls = Object.fromEntries(
        Object.keys(defaults.controls).map(key => [key, val?.controls?.[key] ?? defaults.controls[key]]),
    )
    settings = {
        ...defaults,
        ...val,
        audio: { ...defaults.audio, ...val?.audio },
        display: { ...defaults.display, ...val?.display },
        controls,
    }
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
        right: 'KeyD',
        reload: 'KeyR',
        slot1: 'Digit1',
        slot2: 'Digit2',
        slot3: 'Digit3',
        slot4: 'Digit4',
        slot5: 'Digit5',
        breakFree: 'KeyF',
        grenade: 'KeyG',
        flashbang: 'KeyZ',
        sprint: 'ShiftLeft',
    },
})
