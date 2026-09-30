import {
    getAimJoystick,
    getFlashbangButton,
    getGrabBar,
    getGrenadeButton,
    getInteractButton,
    getMovementJoystick,
    getPauseButton,
    getPauseContainer,
    getPlayer,
    getReloadButton,
    getSlotsContainer,
    getSprintButton,
    getUiEl,
} from './elements.js'
import { renderGun } from './gun-loader.js'
import { getWeaponInSlot } from './loadout.js'
import { renderPauseMenu } from './pause-menu.js'
import { damagePlayer } from './player-health.js'
import { playEquip, getPlayingMusic, getPlayingSoundEffects } from './sound-manager.js'
import { centralizePlayer } from './startup.js'
import {
    renderAimJoystick,
    renderInteractButton,
    renderMovementJoystick,
    renderPauseButton,
    renderReloadButton,
    renderSlots,
    renderSprintButton,
    renderThrowableButtons,
    renderUi,
    renderWeaponUi,
} from './user-interface.js'
import {
    addClass,
    angleOf2Points,
    exitAimModeAnimation,
    getProperty,
    isMoving,
    removeAllClasses,
    removeClass,
    removeEquipped,
    renderErrorMessage,
} from './util.js'
import {
    getAimMode,
    getAnimatedElements,
    getDownPressed,
    getEquippedWeaponId,
    getGrabbed,
    getLeftPressed,
    getPause,
    getPauseCause,
    getPoisoned,
    getRefillStamina,
    getReloading,
    getRightPressed,
    getShooting,
    getSprintPressed,
    getUpPressed,
    getWaitingFunctions,
    getWeaponWheel,
    setAimMode,
    setDownPressed,
    setEquippedWeaponId,
    setLeftPressed,
    setPause,
    setPauseCause,
    setPlayerAimAngle,
    setRightPressed,
    setShootCounter,
    setShootPressed,
    setSprintPressed,
    setUpPressed,
    setWaitingFunctions,
} from './variables.js'
import { cancelReload, setupReload, throwBuiltIn } from './weapon-manager.js'

export const movePlayer = angle => {
    stopMovement()
    if (angle >= -22.5 && angle < 22.5) sDown()
    else if (angle >= 22.5 && angle < 67.5) {
        sDown()
        aDown()
    } else if (angle >= 67.5 && angle < 112.5) aDown()
    else if (angle >= 112.5 && angle < 157.5) {
        aDown()
        wDown()
    } else if (angle >= 157.5 || angle < -157.5) wDown()
    else if (angle >= -157.5 && angle < -112.5) {
        wDown()
        dDown()
    } else if (angle >= -112.5 && angle < -67.5) dDown()
    else {
        dDown()
        sDown()
    }
}

export const wDown = () => enableDirection(getUpPressed, getDownPressed, setUpPressed, setDownPressed)
export const aDown = () => enableDirection(getLeftPressed, getRightPressed, setLeftPressed, setRightPressed)
export const sDown = () => enableDirection(getDownPressed, getUpPressed, setDownPressed, setUpPressed)
export const dDown = () => enableDirection(getRightPressed, getLeftPressed, setRightPressed, setLeftPressed)

const enableDirection = (getPressed, getOpposite, setPressed, setOpposite) => {
    if (getOpposite()) return
    if (getPoisoned()) setOpposite(true)
    else setPressed(true)
    if (!getAimMode() && !getPause() && !getGrabbed()) addClass(getPlayer(), 'walk')
}

export const weaponSlotDown = slot => {
    if (getPause() || getShooting() || getGrabbed()) return
    const weapon = getWeaponInSlot(slot)
    if (!weapon || getEquippedWeaponId() === weapon.id) return
    cancelReload()
    removeEquipped()
    setEquippedWeaponId(weapon.id)
    setShootCounter(Number.MAX_SAFE_INTEGER)
    playEquip(weapon.name)
    renderUiControlsForWeapon()
    if (getAimMode()) renderGun()
}

const renderUiControlsForWeapon = () => {
    renderWeaponUi()
    getReloadButton()?.remove()
    renderReloadButton()
}

export const shiftDown = () => {
    if (getRefillStamina()) addClass(getPlayer(), 'walk')
    setSprintPressed(true)
    if (!isMoving() || getPause() || getGrabbed()) return
    setAimMode(false)
    exitAimModeAnimation()
    removeEquipped()
}

export const shiftUp = () => {
    setSprintPressed(false)
    if (!isMoving()) removeAllClasses(getPlayer(), 'run', 'walk')
    else if (!getAimMode() && !getGrabbed() && !getPause()) addClass(getPlayer(), 'walk')
}

export const fDown = () => {
    if (!getGrabbed()) return
    const bar = getGrabBar()
    const slider = bar?.lastElementChild
    if (!bar?.isConnected || !slider) return
    const current = getProperty(slider, 'left', '%') * 10
    for (const part of ['first', 'second', 'third']) {
        const start = Number(bar.getAttribute(part))
        if (current >= start && current <= start + 100 && bar.getAttribute(`${part}-done`) !== 'true') {
            bar.setAttribute(`${part}-done`, true)
            addClass(bar, `${part}-ok`)
            return
        }
    }
    damagePlayer(Number(bar.getAttribute('damage')))
}

export const managePause = () => {
    if (!getPlayer()) return
    setPause(!getPause())
    if (getPause()) pauseGame()
    else resumeGame()
}

const pauseGame = () => {
    removeAllClasses(getPlayer(), 'run', 'walk')
    document.querySelectorAll('.animation').forEach(element => (element.style.animationPlayState = 'paused'))
    getAnimatedElements().forEach(animation => animation.pause())
    removeControlsFromScreen()
    getPlayingSoundEffects().forEach(effect => effect.pause())
    getPlayingMusic()?.pause()
}

const removeControlsFromScreen = () => {
    getUiEl()?.remove()
    getMovementJoystick()?.remove()
    getAimJoystick()?.remove()
    getSprintButton()?.remove()
    getInteractButton()?.remove()
    getReloadButton()?.remove()
    getGrenadeButton()?.remove()
    getFlashbangButton()?.remove()
    getPauseButton()?.remove()
    getSlotsContainer()?.remove()
    if (getPlayer()?.children[1]) getPlayer().children[1].style.opacity = '0'
}

const resumeGame = () => {
    setPauseCause(null)
    document.querySelectorAll('.animation').forEach(element => (element.style.animationPlayState = 'running'))
    getAnimatedElements().forEach(animation => animation.play())
    renderUi()
    renderMovementJoystick()
    renderAimJoystick()
    renderSprintButton()
    renderReloadButton()
    renderPauseButton()
    renderSlots()
    renderThrowableButtons()
    if (getGrabbed()) renderInteractButton()
    if (getPlayer()?.children[1]) getPlayer().children[1].style.opacity = '1'
    getWaitingFunctions().forEach(item => item.fn(...item.args))
    setWaitingFunctions([])
    getPlayingSoundEffects().forEach(effect => effect.play())
    getPlayingMusic()?.play()
    if (isMoving() && !getAimMode()) addClass(getPlayer(), 'walk')
}

export const rDown = () => {
    if (getPause() || getGrabbed() || !getEquippedWeaponId()) return
    setupReload()
}

export const grenadeDown = () => throwBuiltIn('grenade')
export const flashbangDown = () => throwBuiltIn('flashbang')

export const escapeDown = () => {
    if (!getPause()) {
        setPauseCause('pause')
        managePause()
        renderPauseMenu()
        return
    }
    if (getPauseCause() === 'pause') {
        getPauseContainer().lastElementChild?.remove()
        managePause()
    }
}

export const stopMovement = () => {
    wUp()
    aUp()
    sUp()
    dUp()
}

export const wUp = () => disableDirection(setUpPressed, setDownPressed)
export const aUp = () => disableDirection(setLeftPressed, setRightPressed)
export const sUp = () => disableDirection(setDownPressed, setUpPressed)
export const dUp = () => disableDirection(setRightPressed, setLeftPressed)

const disableDirection = (setPressed, setOpposite) => {
    if (getPoisoned()) setOpposite(false)
    else setPressed(false)
    if (!isMoving()) removeAllClasses(getPlayer(), 'run', 'walk')
}

export const aimAngle = event => {
    if (getPause()) return
    const bounds = getPlayer().getBoundingClientRect()
    const angle = angleOf2Points(bounds.x + 17, bounds.y + 17, event.clientX, event.clientY)
    if (Number.isFinite(angle)) setPlayerAimAngle(angle)
}

export const clickDown = event => {
    if (event.button === 0) {
        setShootPressed(true)
        if (getReloading() && getAimMode()) renderErrorMessage("Can't shoot while reloading")
    } else if (event.button === 2) aimDown()
}

export const clickUp = event => {
    if (event.button === 0) setShootPressed(false)
    else if (event.button === 2) aimUp()
}

export const aimDown = () => {
    if (getGrabbed() || !getEquippedWeaponId() || getPause()) return
    setAimMode(true)
    removeAllClasses(getPlayer(), 'walk', 'run')
    addClass(getPlayer(), 'aim')
    renderGun()
}

export const aimUp = () => {
    if (getGrabbed() || !getEquippedWeaponId()) return
    setAimMode(false)
    exitAimModeAnimation()
    removeEquipped()
    if (isMoving() && !getPause()) addClass(getPlayer(), 'walk')
}

export const wheelChange = event => {
    const currentIndex = getWeaponWheel().indexOf(getEquippedWeaponId())
    const direction = event.deltaY > 0 ? 1 : -1
    const nextIndex = (Math.max(0, currentIndex) + direction + getWeaponWheel().length) % getWeaponWheel().length
    weaponSlotDown(nextIndex + 1)
}

export const resizeWindow = () => centralizePlayer()
