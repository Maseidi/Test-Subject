import { managePause } from "./controls.js"
import { addClass, appendAll, createAndAddClass } from "./util.js"
import { getPauseContainer, getUiEl, setUiEl } from "./elements.js"
import { calculateTotalAmmo, equippedWeaponFromInventory } from "./inventory.js"
import { getEquippedWeapon, getHealth, getMaxHealth, getMaxStamina, getStamina } from "./variables.js"

export const renderUi = () => {
    renderBackground()
    renderHealthBar()
    renderStaminaBar()
    renderEquippedWeapon()
}

const renderBackground = () => {
    const root = document.getElementById("root")
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

export const healthManager = (inputHealth) => {
    abstractManager(inputHealth, getUiEl().children[0].firstElementChild, getMaxHealth())
}

const renderStaminaBar = () => {
    const staminaBarEl = createAndAddClass('div', 'stamina-bar')
    const staminaEl = createAndAddClass('div', 'stamina')
    staminaBarEl.append(staminaEl)
    getUiEl().append(staminaBarEl)
    staminaManager(getStamina())
}

export const staminaManager = (inputStamina) => {
    abstractManager(inputStamina, getUiEl().children[1].firstElementChild, getMaxStamina())
}

const abstractManager = (input, elem, max) => {
    const decile = input / max * 10
    elem.style.width = `${decile * 10}%`
}

export const renderEquippedWeapon = () => {
    if ( getUiEl().children[2] ) getUiEl().children[2].remove() 
    if ( !getEquippedWeapon() ) return    
    const weaponContainer = createAndAddClass('div', 'weapon-container')
    const weaponIcon = createAndAddClass('img', 'weapon-icon')
    const equippedWeapon = equippedWeaponFromInventory()
    weaponIcon.src = `../assets/images/${equippedWeapon.name}.png`
    addClass(weaponIcon, 'weapon-icon')
    const ammoCount = createAndAddClass('div', 'ammo-count')
    const mag = document.createElement('p')
    mag.textContent = `${equippedWeapon.currmag}`
    const total = document.createElement('p')
    total.textContent = calculateTotalAmmo()
    appendAll(ammoCount, mag, total)
    appendAll(weaponContainer, weaponIcon, ammoCount)
    getUiEl().append(weaponContainer)   
}

export const removeUi = () => {
    getUiEl().remove()
}

export const renderQuit = () => {
    const quitContainer = createAndAddClass('div', 'quit')
    const quitBtn = document.createElement("p")
    quitBtn.textContent = 'esc'
    const quitText = document.createElement("p")
    quitText.textContent = 'quit'
    appendAll(quitContainer, quitBtn, quitText)
    quitContainer.addEventListener('click', () => {
        getPauseContainer().lastElementChild.remove()
        if ( getPauseContainer().children.length === 0 ) managePause()
    })
    getPauseContainer().lastElementChild.append(quitContainer)
}