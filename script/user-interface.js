import { managePause } from './actions.js'
import { getPauseContainer, getUiEl, setUiEl } from './elements.js'
import {
    calculateThrowableAmount,
    calculateTotalAmmo,
    countItem,
    findEquippedWeaponById,
    updateInteractablePopups,
} from './inventory.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { isThrowable } from './throwable-details.js'
import { addClass, appendAll, containsClass, createAndAddClass, removeClass } from './util.js'
import {
    getDraggedItem,
    getEquippedWeaponId,
    getGrabbed,
    getHealth,
    getMaxHealth,
    getMaxStamina,
    getStamina,
} from './variables.js'

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
    healthBarEl.style.width = `390px`
    const healthEl = createAndAddClass('div', 'health')
    healthBarEl.append(healthEl)
    getUiEl().append(healthBarEl)
    healthManager(getHealth())
}

export const healthManager = inputHealth =>
    abstractManager(inputHealth, getUiEl().firstElementChild.firstElementChild, getMaxHealth())

const renderStaminaBar = () => {
    const staminaBarEl = createAndAddClass('div', 'stamina-bar')
    staminaBarEl.style.width = `390px`
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
