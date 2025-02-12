import { getPlayer } from './elements.js'
import { getGunDetails, getGunUpgradableDetail } from './gun-details.js'
import { findEquippedWeaponById } from './inventory.js'
import { IS_MOBILE } from './script.js'
import { addClass, appendAll, createAndAddClass, findAttachmentsOnPlayer } from './util.js'

export const renderGun = () => {
    const equippedWeapon = findEquippedWeaponById()
    const weapon = createAndAddClass('div', 'gun')
    const details = getGunDetails().get(equippedWeapon.name)
    weapon.style.height = `${details.height}px`
    weapon.style.backgroundColor = `${details.color}`
    const laser = renderLaser(equippedWeapon.name, equippedWeapon.rangelvl, details.antivirus)
    const fire = renderGunFire()
    appendAll(weapon, laser, fire)
    getPlayer().firstElementChild.firstElementChild.append(weapon)
}

const renderLaser = (name, rangeLevel, color) => {
    const laser = createAndAddClass('div', 'laser')
    if (IS_MOBILE) addClass(laser, 'mobile-laser')
    laser.style.height = `${getGunUpgradableDetail(name, 'range', rangeLevel)}px`
    for (let i = 0; i < 100; i++) {
        const part = document.createElement('div')
        part.style.opacity = `${(100 - 0.9 * i) / 100}`
        part.style.backgroundColor = color
        laser.append(part)
    }
    return laser
}

const renderGunFire = () => {
    const weaponFire = createAndAddClass('img', 'gun-fire')
    weaponFire.setAttribute('time', 0)
    weaponFire.src = './assets/images/gun-fire.png'
    weaponFire.style.display = 'none'
    return weaponFire
}

export const removeWeapon = () => findAttachmentsOnPlayer('gun')?.remove()
