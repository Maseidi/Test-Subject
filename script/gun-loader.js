import { getPlayer } from './elements.js'
import { getGunDetail, getGunDetails } from './gun-details.js'
import { getWeaponById } from './loadout.js'
import { IS_MOBILE } from './platform.js'
import { addClass, appendAll, createAndAddClass, findAttachmentsOnPlayer } from './util.js'
import { getEquippedWeaponId } from './variables.js'

export const renderGun = () => {
    const equippedWeapon = getWeaponById(getEquippedWeaponId())
    const weapon = createAndAddClass('div', 'gun')
    const details = getGunDetails().get(equippedWeapon.name)
    weapon.style.height = `${details.height}px`
    weapon.style.backgroundColor = `${details.color}`
    const laser = renderLaser(equippedWeapon.name, details.antivirus)
    const fire = renderGunFire()
    appendAll(weapon, laser, fire)
    getPlayer().firstElementChild.firstElementChild.append(weapon)
}

const renderLaser = (name, color) => {
    const laser = createAndAddClass('div', 'laser')
    if (IS_MOBILE) addClass(laser, 'mobile-laser')
    laser.style.height = `${getGunDetail(name, 'range')}px`
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
