import { getPlayer } from "./elements.js"
import { createAndAddClass } from "./util.js"
import { getStat, getWeaponSpecs } from "./weapon-specs.js"
import { equippedWeaponFromInventory } from "./inventory.js"

export const renderWeapon = () => {
    const equippedWeapon = equippedWeaponFromInventory()
    const weapon = createAndAddClass('div', 'weapon')
    weapon.style.height = `${getWeaponSpecs().get(equippedWeapon.name).height}px`
    weapon.style.backgroundColor = `${getWeaponSpecs().get(equippedWeapon.name).color}`
    const laser = createAndAddClass('div', 'laser')
    laser.style.height = `${getStat(equippedWeapon.name, 'range', equippedWeapon.rangelvl)}px`
    laser.style.backgroundColor = `${getWeaponSpecs().get(equippedWeapon.name).antivirus}`
    for ( let i = 0; i < 100; i++ ) laser.append(document.createElement("div"))
    weapon.append(laser)
    getPlayer().children[0].children[0].append(weapon)
}

export const removeWeapon = () => getPlayer().children[0].children[0].children[1]?.remove()