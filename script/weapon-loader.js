import { getPlayer } from "./elements.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { addClass } from "./util.js"
import { getEquippedWeapon } from "./variables.js"
import { getWeaponSpecs } from "./weapon-specs.js"
import { getUpgradeDetails } from "./weapon-upgrades.js"

export const renderWeapon = () => {
    const ownedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    const weaponSpecs = getWeaponSpecs().get(ownedWeapon.name)
    const weapon = document.createElement("div")
    addClass(weapon, 'weapon')
    weapon.style.height = `${weaponSpecs.height}px`
    weapon.style.backgroundColor = `${weaponSpecs.color}`
    const laser = document.createElement("div")
    addClass(laser, 'laser')
    laser.style.height = `${getUpgradeDetails().get(ownedWeapon.name).range[ownedWeapon.rangeLvl - 1]}px`
    laser.style.backgroundColor = `${weaponSpecs.antiVirus}`
    for ( let i = 0; i < 100; i++ ) laser.append(document.createElement("div"))
    weapon.append(laser)
    getPlayer().children[0].children[0].append(weapon)
}

export const removeWeapon = () => {
    getPlayer().children[0].children[0].children[1]?.remove()
}