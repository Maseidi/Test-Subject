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
    hDown,
    qDown,
    rDown,
    resizeWindow,
    sDown,
    shiftDown,
    shiftUp,
    spaceDown,
    sUp,
    tabDown,
    wDown,
    weaponSlotDown,
    wheelChange,
    wUp,
} from './actions.js'
import { getSettings } from './settings.js'
import { getPlayingMusic } from './sound-manager.js'
import { getPause, getPauseCause, setPause } from './variables.js'

const keyDown = e => {
    e.preventDefault()
    if (!e.repeat) {
        switch (e.code) {
            case getSettings().controls.up:
                wDown()
                break
            case getSettings().controls.left:
                aDown()
                break
            case getSettings().controls.down:
                sDown()
                break
            case getSettings().controls.right:
                dDown()
                break
            case getSettings().controls.slot1:
                weaponSlotDown('1')
                break
            case getSettings().controls.slot2:
                weaponSlotDown('2')
                break
            case getSettings().controls.slot3:
                weaponSlotDown('3')
                break
            case getSettings().controls.slot4:
                weaponSlotDown('4')
                break
            case getSettings().controls.sprint:
                shiftDown()
                break
            case getSettings().controls.interact:
                fDown()
                break
            case getSettings().controls.inventory:
                tabDown()
                break
            case getSettings().controls.reload:
                rDown()
                break
            case 'Escape':
                escapeDown()
                break
            case getSettings().controls.heal:
                hDown()
                break
            case getSettings().controls.lightUp:
                qDown()
                break
            case getSettings().controls.toggleMenu:
                spaceDown()
                break
        }
    }
}

const keyUp = e => {
    switch (e.code) {
        case getSettings().controls.up:
            wUp()
            break
        case getSettings().controls.left:
            aUp()
            break
        case getSettings().controls.down:
            sUp()
            break
        case getSettings().controls.right:
            dUp()
            break
        case getSettings().controls.sprint:
            shiftUp()
            break
    }
}

const backButtonPressed = () => escapeDown()

const visibiltyChange = () => {
    if (document.hidden) {
        if (!getPause()) escapeDown()
        else {
            getPlayingMusic()?.pause()
        }
    } else {
        if (getPause() && !['game-over', 'pause'].includes(getPauseCause())) getPlayingMusic()?.play()
    }
}

export const addControls = () => {
    window.addEventListener('keydown', keyDown, true)
    window.addEventListener('keyup', keyUp, true)
    window.addEventListener('mousemove', aimAngle, true)
    window.addEventListener('mousedown', clickDown, true)
    window.addEventListener('mouseup', clickUp, true)
    window.addEventListener('resize', resizeWindow, true)
    window.addEventListener('wheel', wheelChange, true)
    window.addEventListener('popstate', backButtonPressed, true)
    window.addEventListener('visibilitychange', visibiltyChange, true)
}

export const removeControls = () => {
    window.removeEventListener('keydown', keyDown, true)
    window.removeEventListener('keyup', keyUp, true)
    window.removeEventListener('mousemove', aimAngle, true)
    window.removeEventListener('mousedown', clickDown, true)
    window.removeEventListener('mouseup', clickUp, true)
    window.removeEventListener('resize', resizeWindow, true)
    window.removeEventListener('wheel', wheelChange, true)
    window.removeEventListener('popstate', backButtonPressed, true)
    window.removeEventListener('visibilitychange', visibiltyChange, true)
}
