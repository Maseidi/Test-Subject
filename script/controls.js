import {
    aDown,
    aimAngle,
    aUp,
    clickDown,
    clickUp,
    dDown,
    dUp,
    escapeDown,
    fDown,
    flashbangDown,
    grenadeDown,
    rDown,
    resizeWindow,
    sDown,
    shiftDown,
    shiftUp,
    sUp,
    wDown,
    weaponSlotDown,
    wheelChange,
    wUp,
} from './actions.js'
import { getSettings } from './settings.js'
import { getPlayingMusic } from './sound-manager.js'
import { getPause } from './variables.js'

const keyDown = event => {
    if (['Tab', 'Space'].includes(event.code)) event.preventDefault()
    if (event.repeat) return
    const controls = getSettings().controls
    const handlers = {
        [controls.up]: wDown,
        [controls.left]: aDown,
        [controls.down]: sDown,
        [controls.right]: dDown,
        [controls.slot1]: () => weaponSlotDown(1),
        [controls.slot2]: () => weaponSlotDown(2),
        [controls.slot3]: () => weaponSlotDown(3),
        [controls.slot4]: () => weaponSlotDown(4),
        [controls.slot5]: () => weaponSlotDown(5),
        [controls.sprint]: shiftDown,
        [controls.breakFree]: fDown,
        [controls.reload]: rDown,
        [controls.grenade]: grenadeDown,
        [controls.flashbang]: flashbangDown,
        Escape: escapeDown,
    }
    handlers[event.code]?.()
}

const keyUp = event => {
    const controls = getSettings().controls
    const handlers = {
        [controls.up]: wUp,
        [controls.left]: aUp,
        [controls.down]: sUp,
        [controls.right]: dUp,
        [controls.sprint]: shiftUp,
    }
    handlers[event.code]?.()
}

const visibilityChange = () => {
    if (document.hidden && !getPause()) escapeDown()
    else if (!document.hidden && getPause()) getPlayingMusic()?.pause()
}

export const addControls = () => {
    window.addEventListener('keydown', keyDown, true)
    window.addEventListener('keyup', keyUp, true)
    window.addEventListener('mousemove', aimAngle, true)
    window.addEventListener('mousedown', clickDown, true)
    window.addEventListener('mouseup', clickUp, true)
    window.addEventListener('resize', resizeWindow, true)
    window.addEventListener('wheel', wheelChange, true)
    window.addEventListener('visibilitychange', visibilityChange, true)
}

export const removeControls = () => {
    window.removeEventListener('keydown', keyDown, true)
    window.removeEventListener('keyup', keyUp, true)
    window.removeEventListener('mousemove', aimAngle, true)
    window.removeEventListener('mousedown', clickDown, true)
    window.removeEventListener('mouseup', clickUp, true)
    window.removeEventListener('resize', resizeWindow, true)
    window.removeEventListener('wheel', wheelChange, true)
    window.removeEventListener('visibilitychange', visibilityChange, true)
}
