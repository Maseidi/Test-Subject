import { getPlayer } from "./elements.js"
import { createAndAddClass } from "./util.js"
import { getEquippedWeapon } from "./variables.js"
import { getOwnedWeapons } from "./owned-weapons.js"

export const renderWeapon = () => {
    const ownedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    const weapon = createAndAddClass('div', 'weapon')
    weapon.style.height = `${ownedWeapon.getHeight()}px`
    weapon.style.backgroundColor = `${ownedWeapon.getColor()}`
    const laser = createAndAddClass('div', 'laser')
    laser.style.height = `${ownedWeapon.getRange()}px`
    laser.style.backgroundColor = `${ownedWeapon.getAntivirus()}`
    for ( let i = 0; i < 100; i++ ) laser.append(document.createElement("div"))
    weapon.append(laser)
    getPlayer().children[0].children[0].append(weapon)
}

export const removeWeapon = () => {
    getPlayer().children[0].children[0].children[1]?.remove()
}