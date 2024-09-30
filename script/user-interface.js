import { managePause } from './actions.js'
import { isThrowable } from './throwable-details.js'
import { getPauseContainer, getUiEl, setUiEl } from './elements.js'
import { addClass, appendAll, containsClass, createAndAddClass } from './util.js'
import { calculateThrowableAmount, calculateTotalAmmo, findEquippedWeaponById, updateInteractablePopups } from './inventory.js'
import { 
    getDraggedItem,
    getEquippedWeaponId,
    getHealth,
    getMaxHealth,
    getMaxStamina,
    getStamina } from './variables.js'

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
    healthBarEl.style.width = `${getMaxHealth() * 390 / 100}px`
    const healthEl = createAndAddClass('div', 'health')
    healthBarEl.append(healthEl)
    getUiEl().append(healthBarEl)
    healthManager(getHealth())
}

export const healthManager = (inputHealth) => 
    abstractManager(inputHealth, getUiEl().firstElementChild.firstElementChild, getMaxHealth())

const renderStaminaBar = () => {
    const staminaBarEl = createAndAddClass('div', 'stamina-bar')
    staminaBarEl.style.width = `${getMaxStamina() * 390 / 600}px`
    const staminaEl = createAndAddClass('div', 'stamina')
    staminaBarEl.append(staminaEl)
    getUiEl().append(staminaBarEl)
    staminaManager(getStamina())
}

export const staminaManager = (inputStamina) => 
    abstractManager(inputStamina, getUiEl().children[1].firstElementChild, getMaxStamina())

const abstractManager = (input, elem, max) => elem.style.width = `${input / max * 100}%`

export const renderWeaponUi = () => {
    if ( getUiEl().children[2] ) getUiEl().children[2].remove() 
    if ( !getEquippedWeaponId() ) return
    const equippedWeapon = findEquippedWeaponById()
    const predicate = isThrowable(equippedWeapon.name) 
    const weaponContainer = createAndAddClass('div', 'weapon-container')
    const weaponIcon = createAndAddClass('img', 'weapon-icon')
    weaponIcon.src = `../assets/images/${equippedWeapon.name}.png`
    addClass(weaponIcon, 'weapon-icon')
    const ammoCount = createAndAddClass('div', 'ammo-count')
    if ( !predicate ) {
        var mag = document.createElement('p')
        mag.textContent = `${equippedWeapon.currmag}`
    }
    const total = document.createElement('p')
    total.textContent = predicate ? calculateThrowableAmount() : calculateTotalAmmo()
    if ( !predicate )  ammoCount.append(mag)
    ammoCount.append(total)
    appendAll(weaponContainer, weaponIcon, ammoCount)
    getUiEl().append(weaponContainer)
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
    const last = getPauseContainer().lastElementChild 
    if ( Array.from(last.children).find(child => containsClass(child, 'popup-container')) ) return
    last.remove()
    updateInteractablePopups()
    if ( getPauseContainer().children.length === 0 ) managePause()
}