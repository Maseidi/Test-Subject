import { managePause } from './controls.js'
import { addClass, appendAll, createAndAddClass } from './util.js'
import { getPauseContainer, getUiEl, setUiEl } from './elements.js'
import { calculateThrowableAmount, calculateTotalAmmo, equippedItem } from './inventory.js'
import { getDraggedItem, getEquippedWeapon, getHealth, getMaxHealth, getMaxStamina, getStamina } from './variables.js'
import { getThrowableSpecs } from './throwable-specs.js'

export const renderUi = () => {
    renderBackground()
    renderHealthBar()
    renderStaminaBar()
    renderEquippedWeapon()
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

export const healthManager = (inputHealth) => 
    abstractManager(inputHealth, getUiEl().children[0].firstElementChild, getMaxHealth())

const renderStaminaBar = () => {
    const staminaBarEl = createAndAddClass('div', 'stamina-bar')
    const staminaEl = createAndAddClass('div', 'stamina')
    staminaBarEl.append(staminaEl)
    getUiEl().append(staminaBarEl)
    staminaManager(getStamina())
}

export const staminaManager = (inputStamina) => 
    abstractManager(inputStamina, getUiEl().children[1].firstElementChild, getMaxStamina())

const abstractManager = (input, elem, max) => elem.style.width = `${input / max * 100}%`

export const renderEquippedWeapon = () => {
    if ( getUiEl().children[2] ) getUiEl().children[2].remove() 
    if ( !getEquippedWeapon() ) return
    const equippedWeapon = equippedItem()
    if ( getThrowableSpecs().get(equippedWeapon.name) ) {
        renderEquippedThrowable(equippedWeapon)
        return
    }
    const weaponContainer = createAndAddClass('div', 'weapon-container')
    const weaponIcon = createAndAddClass('img', 'weapon-icon')
    weaponIcon.src = `../assets/images/${equippedWeapon.name}.png`
    addClass(weaponIcon, 'weapon-icon')
    const ammoCount = createAndAddClass('div', 'ammo-count')
    const mag = document.createElement('p')
    mag.textContent = `${equippedWeapon.currmag}`
    const total = document.createElement('p')
    total.textContent = calculateTotalAmmo(equippedWeapon)
    appendAll(ammoCount, mag, total)
    appendAll(weaponContainer, weaponIcon, ammoCount)
    getUiEl().append(weaponContainer)
}

const renderEquippedThrowable = (equippedThrowable) => {
    const throwableContainer = createAndAddClass('div', 'weapon-container')
    const throwableIcon = createAndAddClass('img', 'weapon-icon')
    throwableIcon.src = `../assets/images/${equippedThrowable.name}.png`
    addClass(throwableIcon, 'weapon-icon')
    const ammoCount = createAndAddClass('div', 'ammo-count')
    const total = document.createElement('p')
    total.textContent = calculateThrowableAmount(equippedThrowable)
    appendAll(ammoCount, total)
    appendAll(throwableContainer, throwableIcon, ammoCount)
    getUiEl().append(throwableContainer)
}

export const removeUi = () => getUiEl().remove()

export const renderQuit = () => {
    const quitContainer = createAndAddClass('div', 'quit')
    const quitBtn = document.createElement('p')
    quitBtn.textContent = 'esc'
    const quitText = document.createElement('p')
    quitText.textContent = 'quit'
    appendAll(quitContainer, quitBtn, quitText)
    quitContainer.addEventListener('click', quitPage)
    getPauseContainer().lastElementChild.append(quitContainer)
}

export const quitPage = () => {
    if ( getDraggedItem() ) return
    getPauseContainer().lastElementChild.remove()
    if ( getPauseContainer().children.length === 0 ) managePause()
}