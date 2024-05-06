import { addClass, appendAll } from "./util.js"
import { getPauseContainer, getUiEl, setUiEl } from "./elements.js"
import { calculateTotalAmmo } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { getEquippedWeapon, getHealth, getMaxHealth, getMaxStamina, getStamina } from "./variables.js"

export const renderUi = () => {
    renderBackground()
    renderHealthBar()
    renderStaminaBar()
    renderEquippedWeapon()
}

const renderBackground = () => {
    const root = document.getElementById("root")
    const ui = document.createElement("div")
    addClass(ui, 'ui')
    addClass(ui, 'ui-theme')
    setUiEl(ui)
    root.append(ui)
}

const renderHealthBar = () => {
    const healthBarEl = document.createElement('div')
    addClass(healthBarEl, 'health-bar')
    const healthEl = document.createElement('div')
    addClass(healthEl, 'health')
    healthBarEl.append(healthEl)
    getUiEl().append(healthBarEl)
    healthManager(getHealth())
}

export const healthManager = (inputHealth) => {
    abstractManager(inputHealth, getUiEl().children[0].firstElementChild, getMaxHealth())
}

const renderStaminaBar = () => {
    const staminaBarEl = document.createElement('div')
    addClass(staminaBarEl, 'stamina-bar')
    const staminaEl = document.createElement('div')
    addClass(staminaEl, 'stamina')
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
    const weaponContainer = document.createElement('div')
    addClass(weaponContainer, 'weapon-container')
    const weaponIcon = document.createElement('img')
    addClass(weaponIcon, 'weapon-icon')
    weaponIcon.src = `../assets/images/${getOwnedWeapons().get(getEquippedWeapon()).name}.png`
    addClass(weaponIcon, 'weapon-icon')
    const ammoCount = document.createElement('div')
    addClass(ammoCount, 'ammo-count')
    const mag = document.createElement('p')
    mag.textContent = `${getOwnedWeapons().get(getEquippedWeapon()).getCurrMag()}`
    const total = document.createElement('p')
    total.textContent = calculateTotalAmmo()
    appendAll(ammoCount, [mag, total])
    appendAll(weaponContainer, [weaponIcon, ammoCount])
    getUiEl().append(weaponContainer)   
}

export const removeUi = () => {
    getUiEl().remove()
}

export const renderQuit = (func) => {
    const quitContainer = document.createElement("div")
    addClass(quitContainer, 'quit')
    const quitBtn = document.createElement("p")
    quitBtn.textContent = 'esc'
    const quitText = document.createElement("p")
    quitText.textContent = 'quit'
    appendAll(quitContainer, [quitBtn, quitText])
    quitContainer.addEventListener('click', func)
    getPauseContainer().firstElementChild.append(quitContainer)
}