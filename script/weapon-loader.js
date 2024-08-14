import { getPlayer } from './elements.js'
import { equippedWeaponObj } from './inventory.js'
import { getStat, getWeaponSpecs } from './weapon-specs.js'
import { containsClass, createAndAddClass } from './util.js'

export const renderWeapon = () => {
    const equippedWeapon = equippedWeaponObj()
    const weapon = createAndAddClass('div', 'weapon')
    weapon.style.height = `${getWeaponSpecs().get(equippedWeapon.name).height}px`
    weapon.style.backgroundColor = `${getWeaponSpecs().get(equippedWeapon.name).color}`
    const laser = createAndAddClass('div', 'laser')
    laser.style.height = `${getStat(equippedWeapon.name, 'range', equippedWeapon.rangelvl)}px`
    for ( let i = 0; i < 100; i++ ) {
        const part = document.createElement('div')
        part.style.opacity = `${(100 - (0.9 * i))/100}`
        part.style.backgroundColor = `${getWeaponSpecs().get(equippedWeapon.name).antivirus}`
        laser.append(part)
    }
    weapon.append(laser)
    getPlayer().children[0].children[0].append(weapon)
}

export const removeWeapon = () => 
    Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => containsClass(child, 'weapon'))?.remove()