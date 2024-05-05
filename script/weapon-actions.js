import { collide } from "./util.js"
import { removeUi, renderUi } from "./user-interface.js"
import { getCurrentRoomSolid, getPlayer } from "./elements.js"
import { OwnedWeapon, getOwnedWeapons } from "./owned-weapons.js"
import { calculateTotalAmmo, updateInventoryWeaponMag, useInventoryResource } from "./inventory.js"
import { 
    getAimMode,
    getEquippedWeapon,
    getReloading,
    getShootCounter,
    getShootPressed,
    getShooting,
    setReloading,
    setShootCounter,
    setShooting,
    setTarget } from "./variables.js"

const EMPTY_WEAPON = new Audio('../assets/audio/empty-weapon.mp3')

export const manageWeaponActions = () => {
    manageAim()
    manageReload()
    manageShoot()
}

let counter = 0
const manageAim = () => {
    if ( getAimMode() ) {
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
    if ( getShooting() ) return
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
    updateInventory(equippedWeapon, currentMag + trade, trade)
}

const manageShoot = () => {
    if ( !getEquippedWeapon() ) return
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    setShootCounter(getShootCounter() + 1)
    if ( getShootCounter() / 60 >= equippedWeapon.getFireRate() ) setShootCounter(getShootCounter() - 1)
    if ( (getShootCounter() + 1) / 60 >= equippedWeapon.getFireRate() ) {
        setShooting(false)
        if ( getAimMode() && getShootPressed() && !getReloading() ) {
            setShooting(true)
            shoot()
            setShootCounter(0)
        }
    }
}

const shoot = () => {
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    const totalAmmo = calculateTotalAmmo()
    let currMag = equippedWeapon.getCurrMag()
    if ( currMag === 0 ) {
        EMPTY_WEAPON.play()
        setShooting(false)
        if ( totalAmmo === 0 ) return
        setupReload()
        return
    }
    currMag--
    updateInventory(equippedWeapon, currMag, 0)
}

const updateInventory = (equippedWeapon, newMag, trade) => {
    const updateWeapon = new OwnedWeapon(
        equippedWeapon.name,
        newMag,
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