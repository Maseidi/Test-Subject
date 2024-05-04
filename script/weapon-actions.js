import { collide, containsClass } from "./util.js"
import { removeUi, renderUi } from "./user-interface.js"
import { OwnedWeapon, getOwnedWeapons } from "./owned-weapons.js"
import { getEquippedWeapon, getReloading, getShootCounter, getShootPressed, getShooting, setReloading, setShootCounter, setTarget } from "./variables.js"
import { getCurrentRoomSolid, getPlayer } from "./elements.js"
import { calculateTotalAmmo, updateInventoryWeaponMag, useInventoryResource } from "./inventory.js"

const EMPTY_WEAPON = new Audio('../assets/audio/empty-weapon.mp3')

export const manageWeaponActions = () => {
    manageAim()
    manageReload()
    manageShoot()
}

let counter = 0
const manageAim = () => {
    if ( containsClass(getPlayer(), 'aim') ) {
        counter++
        if ( counter === 12 ) {
            counter = 0
            setTarget(null)
        } 
        if ( counter === 0 ) {
            const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
            const range = equippedWeapon.getRange()
            const laser = getPlayer().children[0].children[0].children[1].children[0]
            laser.style.height = `${range}px`
            Array.from(laser.children).forEach((elem, index) => {
                for ( const solid of getCurrentRoomSolid() ) {
                    if ( collide(elem, solid, 0) ) {
                        setTarget(solid)
                        laser.style.height = `${index/100 * range}px`
                        return
                    }
                }
            })
        }
    }
}

export const setupReload = () => {
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    if ( equippedWeapon.getCurrMag() === equippedWeapon.getMagazine() ) return
    if ( calculateTotalAmmo() === 0 ) return
    setReloading(true)
}

let reloadCounter = 0
const manageReload = () => {
    if ( !getEquippedWeapon() ) return
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    if ( getReloading() ) reloadCounter++
    if ( reloadCounter / 60 >= equippedWeapon.getReloadSpeed() ) {
        reload()
        setReloading(false)
        reloadCounter = 0
    }
}

const reload = () => {
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    const mag = equippedWeapon.getMagazine()
    const currentMag = equippedWeapon.getCurrMag()
    const totalAmmo = calculateTotalAmmo()
    const need = mag - currentMag
    const trade = need <= totalAmmo ? need : totalAmmo
    const updateWeapon = new OwnedWeapon(
        equippedWeapon.name,
        currentMag + trade,
        equippedWeapon.damageLvl,
        equippedWeapon.rangeLvl,
        equippedWeapon.reloadSpeedLvl,
        equippedWeapon.magazineLvl,
        equippedWeapon.fireRateLvl)
    useInventoryResource(equippedWeapon.getAmmoType(), trade)    
    getOwnedWeapons().set(getEquippedWeapon(), updateWeapon)
    updateInventoryWeaponMag()
    removeUi()
    renderUi()
}

const manageShoot = () => {
    if ( !getEquippedWeapon() ) return
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    setShootCounter(getShootCounter() + 1)
    if ( getShootCounter() / 60 > equippedWeapon.getFireRate() ) setShootCounter(getShootCounter() - 1)
    if ( getShootCounter() / 60 === equippedWeapon.getFireRate() ) {
        if ( getShootPressed() ) {
            shoot()
            setShootCounter(0)
        }
    }
}

const shoot = () => {
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    const totalAmmo = calculateTotalAmmo()
    let currMag = equippedWeapon.getCurrMag()
    if ( totalAmmo === 0 && currMag === 0 ) {
        EMPTY_WEAPON.play()
        return
    }
    if ( currMag === 0 ) {
        setupReload()
        return
    }
    currMag--
    const updateWeapon = new OwnedWeapon(
        equippedWeapon.name,
        currMag,
        equippedWeapon.damageLvl,
        equippedWeapon.rangeLvl,
        equippedWeapon.reloadSpeedLvl,
        equippedWeapon.magazineLvl,
        equippedWeapon.fireRateLvl)
    getOwnedWeapons().set(getEquippedWeapon(), updateWeapon)
    removeUi()
    renderUi()
}