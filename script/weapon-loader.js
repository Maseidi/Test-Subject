import { getPlayer } from './elements.js'
import { getEquippedWeaponObject } from './variables.js'
import { appendAll, createAndAddClass, findAttachmentsOnPlayer } from './util.js'
import { getWeaponUpgradableDetail, getWeaponDetails } from './weapon-details.js'

export const renderWeapon = () => {
    const equippedWeapon = getEquippedWeaponObject()
    const weapon = createAndAddClass('div', 'weapon')
    const details = getWeaponDetails().get(equippedWeapon.name)
    weapon.style.height = `${details.height}px`
    weapon.style.backgroundColor = `${details.color}`
    const laser = renderLaser(equippedWeapon.name, equippedWeapon.rangelvl, details.antivirus)
    const fire = renderWeaponFire()
    appendAll(weapon, laser, fire)
    getPlayer().children[0].children[0].append(weapon)
}

const renderLaser = (name, rangeLevel, color) => {
    const laser = createAndAddClass('div', 'laser')
    laser.style.height = `${getWeaponUpgradableDetail(name, 'range', rangeLevel)}px`
    for ( let i = 0; i < 100; i++ ) {
        const part = document.createElement('div')
        part.style.opacity = `${(100 - (0.9 * i))/100}`
        part.style.backgroundColor = color
        laser.append(part)
    }
    return laser
}

const renderWeaponFire = () => {
    const weaponFire = createAndAddClass('img', 'weapon-fire')
    weaponFire.setAttribute('time', 0)
    weaponFire.src = '/assets/images/weapon-fire.png'
    weaponFire.style.display = 'none'
    return weaponFire
}

export const removeWeapon = () => findAttachmentsOnPlayer('weapon')?.remove()