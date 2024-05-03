import { addClass } from "./util.js"
import { getUiEl, setUiEl } from "./elements.js"
import { getEquippedWeapon, getHealth, getMaxHealth, getMaxStamina, getStamina } from "./variables.js"
import { getOwnedWeapons } from "./owned-weapons.js"

export const loadUi = () => {
    const root = document.getElementById("root")
    const ui = document.createElement("div")
    addClass(ui, 'ui')
    const healthBarEl = loadHealthBar()
    const staminaBarEl = loadStaminaBar()
    ui.append(healthBarEl)
    ui.append(staminaBarEl)
    setUiEl(ui)
    root.append(ui)
}

const loadHealthBar = () => {
    const healthBarEl = document.createElement('div')
    addClass(healthBarEl, 'health-bar')
    const healthEl = document.createElement('div')
    addClass(healthEl, 'health')
    healthManager(getHealth(), healthEl)
    healthBarEl.append(healthEl)
    return healthBarEl
}

export const healthManager = (inputHealth, healthEl) => {
    abstractManager(inputHealth, healthEl, getMaxHealth())
}

const loadStaminaBar = () => {
    const staminaBarEl = document.createElement('div')
    addClass(staminaBarEl, 'stamina-bar')
    const staminaEl = document.createElement('div')
    addClass(staminaEl, 'stamina')
    staminaManager(getStamina(), staminaEl)
    staminaBarEl.append(staminaEl)
    return staminaBarEl
}

export const staminaManager = (inputStamina, staminaEl) => {
    abstractManager(inputStamina, staminaEl, getMaxStamina())
}

const abstractManager = (input, elem, max) => {
    const decile = input / max * 10
    elem.style.width = `${decile * 10}%`
}

export const uiEquipWeapon = () => {
    if ( getUiEl().children[2] ) getUiEl().children[2].remove() 
    const weaponContainer = document.createElement('div')
    addClass(weaponContainer, 'weapon-container')
    const weaponIcon = document.createElement('img')
    addClass(weaponIcon, 'weapon-icon')
    weaponContainer.append(weaponIcon)
    getUiEl().append(weaponContainer)   
    weaponIcon.src = `../assets/images/${getOwnedWeapons().get(getEquippedWeapon()).name}.png`
    addClass(weaponIcon, 'weapon-icon')
}