import { getPlayer } from './elements.js'
import { getEquippedWeaponObject } from './variables.js'
import { getWeaponUpgradableDetail, getWeaponDetails } from './weapon-details.js'
import { createAndAddClass, findAttachmentsOnPlayer } from './util.js'

export const renderWeapon = () => {
    const equippedWeapon = getEquippedWeaponObject()
    const weapon = createAndAddClass('div', 'weapon')
    const details = getWeaponDetails().get(equippedWeapon.name)
    weapon.style.height = `${details.height}px`
    weapon.style.backgroundColor = `${details.color}`
    const laser = createAndAddClass('div', 'laser')
    laser.style.height = `${getWeaponUpgradableDetail(equippedWeapon.name, 'range', equippedWeapon.rangelvl)}px`
    for ( let i = 0; i < 100; i++ ) {
        const part = document.createElement('div')
        part.style.opacity = `${(100 - (0.9 * i))/100}`
        part.style.backgroundColor = `${details.antivirus}`
        laser.append(part)
    }
    weapon.append(laser)
    getPlayer().children[0].children[0].append(weapon)
}

export const removeWeapon = () => findAttachmentsOnPlayer('weapon')?.remove()