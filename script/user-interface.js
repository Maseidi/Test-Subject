import {
    aimDown,
    aimUp,
    escapeDown,
    fDown,
    hDown,
    managePause,
    movePlayer,
    rDown,
    shiftDown,
    shiftUp,
    spaceDown,
    stopMovement,
    tabDown,
    weaponSlotDown,
} from './actions.js'
import {
    getPauseContainer,
    getToggleMenuButton,
    getUiEl,
    setAimJoystick,
    setHealButton,
    setInteractButton,
    setInventoryButton,
    setMovementJoystick,
    setPauseButton,
    setReloadButton,
    setSlotsContainer,
    setSprintButton,
    setThrowButton,
    setToggleMenuButton,
    setUiEl,
} from './elements.js'
import {
    calculateThrowableAmount,
    calculateTotalAmmo,
    countItem,
    findEquippedWeaponById,
    getInventory,
    updateInteractablePopups,
} from './inventory.js'
import { IS_MOBILE } from './script.js'
import {
    addHoverSoundEffect,
    playClickSoundEffect,
} from './sound-manager.js'
import { isThrowable } from './throwable-details.js'
import { addClass, angleOf2Points, appendAll, containsClass, createAndAddClass, removeClass } from './util.js'
import {
    getAimMode,
    getDraggedItem,
    getElementInteractedWith,
    getEquippedWeaponId,
    getGrabbed,
    getHealth,
    getMaxHealth,
    getMaxStamina,
    getPauseCause,
    getStamina,
    getWeaponWheel,
    setAimJoystickAngle,
    setFoundTarget,
    setIsSearching4Target,
    setPlayerAimAngle,
    setShootPressed,
} from './variables.js'
import { isReloadDisabled } from './weapon-manager.js'

export const renderUi = () => {
    renderBackground()
    renderHealthBar()
    renderStaminaBar()
    renderWeaponUi()
}

const renderBackground = () => {
    const root = document.getElementById('root')
    const ui = createAndAddClass('div', 'ui', 'ui-theme')
    setUiEl(ui)
    root.append(ui)
}

const renderHealthBar = () => {
    const healthBarEl = createAndAddClass('div', 'health-bar')
    const healthEl = createAndAddClass('div', 'health')
    healthBarEl.append(healthEl)
    getUiEl().append(healthBarEl)
    healthManager(getHealth())
}

export const healthManager = inputHealth =>
    abstractManager(inputHealth, getUiEl().firstElementChild.firstElementChild, getMaxHealth())

const renderStaminaBar = () => {
    const staminaBarEl = createAndAddClass('div', 'stamina-bar')
    const staminaEl = createAndAddClass('div', 'stamina')
    staminaBarEl.append(staminaEl)
    getUiEl().append(staminaBarEl)
    staminaManager(getStamina())
}

export const staminaManager = inputStamina =>
    abstractManager(inputStamina, getUiEl().children[1].firstElementChild, getMaxStamina())

const abstractManager = (input, elem, max) => (elem.style.width = `${(input / max) * 100}%`)

export const renderWeaponUi = () => {
    if (getUiEl().children[2]) getUiEl().children[2].remove()
    if (!getEquippedWeaponId()) return
    const equippedWeapon = findEquippedWeaponById()
    const throwable = isThrowable(equippedWeapon.name)
    const weaponContainer = createAndAddClass('div', 'weapon-container')
    const weaponIcon = createAndAddClass('img', 'weapon-icon')
    weaponIcon.src = `../assets/images/${equippedWeapon.name}.png`
    addClass(weaponIcon, 'weapon-icon')
    const ammoCount = createAndAddClass('div', 'ammo-count')
    if (!throwable) {
        var mag = document.createElement('p')
        mag.textContent = `${equippedWeapon.currmag}`
    }
    const total = document.createElement('p')
    total.textContent = throwable ? calculateThrowableAmount() : calculateTotalAmmo()
    if (!throwable) ammoCount.append(mag)
    ammoCount.append(total)
    appendAll(weaponContainer, weaponIcon, ammoCount)
    getUiEl().append(weaponContainer)
}

export const removeUi = () => getUiEl().remove()

export const renderQuit = (mapMaker = false) => {
    const quitContainer = createAndAddClass('div', 'quit')
    const quitBtn = document.createElement('p')
    quitBtn.textContent = 'esc'
    const quitText = document.createElement('p')
    quitText.textContent = 'quit'
    appendAll(quitContainer, quitBtn, quitText)
    addHoverSoundEffect(quitContainer)
    quitContainer.addEventListener('click', () => quitPage(mapMaker))
    getPauseContainer().lastElementChild.append(quitContainer)
}

export const quitPage = mapMaker => {
    if (getDraggedItem()) return
    const last = getPauseContainer().lastElementChild
    if (Array.from(last.children).find(child => containsClass(child, 'popup-container'))) return
    if (getToggleMenuButton()) getToggleMenuButton().style.visibility = 'visible'
    playClickSoundEffect()
    last.remove()
    updateInteractablePopups()
    if (
        !mapMaker &&
        (getPauseContainer().children.length === 0 || (getPauseContainer().children.length === 1 && getGrabbed()))
    )
        managePause()
}

export const itemNotification = name => {
    const container = createAndAddClass('div', 'item-container')
    const item = createAndAddClass('img', 'item-img')
    item.src = `../assets/images/${name}.png`
    const amount = createAndAddClass('p', 'item-amount')
    amount.textContent = countItem(name)
    appendAll(container, item, amount)
    return container
}

export const addMessage = (input, popup) => {
    const message = popup.lastElementChild
    message.textContent = input
    addClass(message, 'message-animation')
    message.addEventListener('animationend', () => {
        removeClass(message, 'message-animation')
        message.textContent = ''
    })
}

export const renderMovementJoystick = () => renderJoystick('movement', movePlayer, stopMovement, setMovementJoystick)

export const renderAimJoystick = () =>
    renderJoystick(
        'aim',
        angle => {
            if (angle) setAimJoystickAngle(angle)
            if (!getAimMode()) aimDown()
            if (!isThrowable(findEquippedWeaponById()?.name)) setIsSearching4Target(true)
            else setPlayerAimAngle(angle)
        },
        () => {
            aimUp()
            setShootPressed(false)
            setIsSearching4Target(false)
            setFoundTarget(false)
        },
        setAimJoystick,
    )

const renderJoystick = (type, onTouchMove, onTouchEnd, setter) => {
    if (!IS_MOBILE) return
    const root = document.getElementById('root')
    const joystick = createAndAddClass('div', `${type}-joystick`, 'joystick', 'ui-theme')
    const handle = createAndAddClass('div', 'joystick-handle')
    joystick.append(handle)
    const center = createAndAddClass('div', 'joystick-center')
    joystick.append(center)
    joystick.addEventListener('touchmove', e => {
        e.preventDefault()
        const { x, y } = joystick.getBoundingClientRect()
        let { x: centerX, y: centerY, width: centerW, height: centerH } = center.getBoundingClientRect()
        centerX -= centerW / 2
        centerY -= centerH / 2
        const newX = e.targetTouches[0].pageX
        const newY = e.targetTouches[0].pageY
        handle.style.left = `${newX - x}px`
        handle.style.top = `${newY - y}px`
        const angle = angleOf2Points(centerX, centerY, newX, newY)
        onTouchMove(angle)
    })
    joystick.addEventListener('touchend', () => {
        onTouchEnd?.()
        handle.style = ''
    })
    setter(joystick)
    root.append(joystick)
}

export const renderSprintButton = () => renderButton('sprint', null, shiftUp, setSprintButton, shiftDown)

export const renderInventoryButton = () => renderButton('inventory', tabDown, null, setInventoryButton)

export const renderInteractButton = () =>
    renderButton('interact', fDown, null, setInteractButton, null, getElementInteractedWith() === null && !getGrabbed())

export const renderHealButton = () =>
    renderButton('heal', hDown, null, setHealButton, null, getHealth() >= getMaxHealth() || countItem('bandage') === 0)

export const renderReloadButton = () =>
    renderButton('reload', rDown, null, setReloadButton, null, isReloadDisabled(false))

export const renderPauseButton = () => renderButton('pause', escapeDown, null, setPauseButton)

export const renderThrowButton = () => {
    if (!isThrowable(findEquippedWeaponById()?.name)) return
    renderButton('throw', () => setShootPressed(true), null, setThrowButton, null, !getAimMode())
}

export const renderToggleMenuButton = () => renderButton('cart', spaceDown, null, setToggleMenuButton)

const renderButton = (name, onTouchStart, onTouchEnd, setter, onTouchEvenOnDisabled, disabledPredicate) => {
    const root = document.getElementById('root')
    const button = getButton(name, onTouchStart, onTouchEnd, setter, onTouchEvenOnDisabled, disabledPredicate)
    if (!button) return
    root.append(button)
}

const getButton = (name, onTouchStart, onTouchEnd, setter, onTouchEvenOnDisabled, disabledPredicate) => {
    if (!IS_MOBILE) return
    const button = createAndAddClass('div', 'mobile-control-btn', `mobile-${name}-btn`, 'ui-theme')
    const image = new Image()
    image.src = `./assets/images/${name}.png`
    button.append(image)
    if (disabledPredicate === true) addClass(button, 'disabled')
    button.addEventListener('touchstart', e => {
        e.preventDefault()
        onTouchEvenOnDisabled?.()
        if (!containsClass(e.currentTarget, 'disabled')) onTouchStart?.()
    })
    if (onTouchEnd) button.addEventListener('touchend', onTouchEnd)
    setter?.(button)
    return button
}

export const renderSlots = () => {
    if (!IS_MOBILE) return
    const root = document.getElementById('root')
    const slotsContainer = createAndAddClass('div', 'slot-container')
    for (let i = 0; i < 4; i++) {
        const button = getButton(`slot-${i + 1}`, () => weaponSlotDown(i + 1))
        if (getWeaponWheel()[i] !== null) {
            const flattenedInventory = getInventory().flat()
            const name = flattenedInventory.find(item => item?.id === getWeaponWheel()[i]).name
            button.firstElementChild.src = `./assets/images/${name}.png`
        }
        slotsContainer.append(button)
    }
    setSlotsContainer(slotsContainer)
    root.append(slotsContainer)
}
