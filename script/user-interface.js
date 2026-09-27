import {
    aimDown,
    aimUp,
    escapeDown,
    fDown,
    flashbangDown,
    grenadeDown,
    managePause,
    movePlayer,
    rDown,
    shiftDown,
    shiftUp,
    stopMovement,
    weaponSlotDown,
} from './actions.js'
import {
    getFlashbangButton,
    getGrenadeButton,
    getPauseContainer,
    getUiEl,
    setAimJoystick,
    setFlashbangButton,
    setGrenadeButton,
    setInteractButton,
    setMovementJoystick,
    setPauseButton,
    setReloadButton,
    setSlotsContainer,
    setSprintButton,
    setUiEl,
} from './elements.js'
import { getReserveAmmo, getThrowableCount, getWeaponById, getWeaponInSlot } from './loadout.js'
import { IS_MOBILE } from './platform.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { addClass, angleOf2Points, appendAll, containsClass, createAndAddClass } from './util.js'
import {
    getAimMode,
    getEquippedWeaponId,
    getGrabbed,
    getHealth,
    getMaxHealth,
    getMaxStamina,
    getStamina,
    setAimJoystickAngle,
    setFoundTarget,
    setIsSearching4Target,
    setPlayerAimAngle,
    setShootPressed,
} from './variables.js'
import { isReloadDisabled } from './weapon-manager.js'

export const renderUi = () => {
    const ui = createAndAddClass('div', 'ui', 'ui-theme')
    setUiEl(ui)
    document.getElementById('root').append(ui)
    const healthBar = createAndAddClass('div', 'health-bar')
    healthBar.append(createAndAddClass('div', 'health'))
    const staminaBar = createAndAddClass('div', 'stamina-bar')
    staminaBar.append(createAndAddClass('div', 'stamina'))
    appendAll(ui, healthBar, staminaBar)
    healthManager(getHealth())
    staminaManager(getStamina())
    renderWeaponUi()
}

export const healthManager = health => {
    const bar = getUiEl()?.querySelector('.health')
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, (health / getMaxHealth()) * 100))}%`
}

export const staminaManager = stamina => {
    const bar = getUiEl()?.querySelector('.stamina')
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, (stamina / getMaxStamina()) * 100))}%`
}

export const renderWeaponUi = () => {
    getUiEl()?.querySelector('.weapon-container')?.remove()
    const weapon = getWeaponById(getEquippedWeaponId())
    if (!weapon || !getUiEl()) return
    const container = createAndAddClass('div', 'weapon-container')
    const icon = createAndAddClass('img', 'weapon-icon')
    icon.src = `./assets/images/${weapon.name}.png`
    icon.alt = weapon.name
    const ammo = createAndAddClass('div', 'ammo-count')
    const magazine = document.createElement('p')
    magazine.textContent = weapon.currmag
    const reserve = document.createElement('p')
    reserve.textContent = getReserveAmmo(weapon)
    appendAll(ammo, magazine, reserve)
    appendAll(container, icon, ammo)
    getUiEl().append(container)
}

export const removeUi = () => getUiEl()?.remove()

export const renderQuit = () => {
    const quit = createAndAddClass('div', 'quit')
    quit.append(Object.assign(document.createElement('p'), { textContent: 'esc' }))
    quit.append(Object.assign(document.createElement('p'), { textContent: 'quit' }))
    addHoverSoundEffect(quit)
    quit.addEventListener('click', quitPage)
    getPauseContainer().lastElementChild.append(quit)
}

export const quitPage = () => {
    const page = getPauseContainer()?.lastElementChild
    if (!page) return
    playClickSoundEffect()
    page.remove()
    managePause()
}

export const renderMovementJoystick = () => renderJoystick('movement', movePlayer, stopMovement, setMovementJoystick)

export const renderAimJoystick = () =>
    renderJoystick(
        'aim',
        angle => {
            setAimJoystickAngle(angle)
            if (!getAimMode()) aimDown()
            setIsSearching4Target(true)
            setPlayerAimAngle(angle)
        },
        () => {
            aimUp()
            setShootPressed(false)
            setIsSearching4Target(false)
            setFoundTarget(null)
        },
        setAimJoystick,
    )

const renderJoystick = (type, onMove, onEnd, setter) => {
    if (!IS_MOBILE) return
    const joystick = createAndAddClass('div', `${type}-joystick`, 'joystick', 'ui-theme')
    const handle = createAndAddClass('div', 'joystick-handle')
    const center = createAndAddClass('div', 'joystick-center')
    joystick.append(handle, center)
    joystick.addEventListener('touchmove', event => {
        event.preventDefault()
        const bounds = joystick.getBoundingClientRect()
        const centerBounds = center.getBoundingClientRect()
        const x = event.targetTouches[0].pageX
        const y = event.targetTouches[0].pageY
        handle.style.left = `${x - bounds.x}px`
        handle.style.top = `${y - bounds.y}px`
        onMove(angleOf2Points(centerBounds.x, centerBounds.y, x, y))
    })
    joystick.addEventListener('touchend', () => {
        onEnd?.()
        handle.style = ''
    })
    setter(joystick)
    document.getElementById('root').append(joystick)
}

export const renderSprintButton = () => renderButton('sprint', shiftDown, shiftUp, setSprintButton)
export const renderPauseButton = () => renderButton('pause', escapeDown, null, setPauseButton)
export const renderReloadButton = () => renderButton('reload', rDown, null, setReloadButton, isReloadDisabled())

export const renderInteractButton = () => {
    if (!getGrabbed()) return
    renderButton('interact', fDown, null, setInteractButton)
}

export const renderThrowableButtons = () => {
    getGrenadeButton()?.remove()
    getFlashbangButton()?.remove()
    renderButton('grenade', grenadeDown, null, setGrenadeButton, getThrowableCount('grenade') === 0)
    renderButton('flashbang', flashbangDown, null, setFlashbangButton, getThrowableCount('flashbang') === 0)
}

const renderButton = (name, onStart, onEnd, setter, disabled = false) => {
    if (!IS_MOBILE) return
    const button = createAndAddClass('div', 'mobile-control-btn', `mobile-${name}-btn`, 'ui-theme')
    const image = new Image()
    image.src = `./assets/images/${name}.png`
    image.alt = name
    button.append(image)
    if (disabled) addClass(button, 'disabled')
    button.addEventListener('touchstart', event => {
        event.preventDefault()
        if (!containsClass(button, 'disabled')) onStart?.()
    })
    if (onEnd) button.addEventListener('touchend', onEnd)
    setter(button)
    document.getElementById('root').append(button)
}

export const renderSlots = () => {
    if (!IS_MOBILE) return
    const container = createAndAddClass('div', 'slot-container')
    for (let slot = 1; slot <= 5; slot++) {
        const weapon = getWeaponInSlot(slot)
        const button = createAndAddClass('div', 'mobile-control-btn', `mobile-slot-${slot}-btn`, 'ui-theme')
        const image = new Image()
        image.src = `./assets/images/${weapon.name}.png`
        image.alt = `slot ${slot}: ${weapon.name}`
        button.append(image)
        button.addEventListener('touchstart', event => {
            event.preventDefault()
            weaponSlotDown(slot)
        })
        container.append(button)
    }
    setSlotsContainer(container)
    document.getElementById('root').append(container)
}
