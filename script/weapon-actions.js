import { collide } from "./util.js"
import { getStat } from "./weapon-specs.js"
import { removeUi, renderUi } from "./user-interface.js"
import { getCurrentRoomSolid, getPlayer } from "./elements.js"
import { calculateTotalAmmo, equippedWeaponFromInventory, updateInventoryWeaponMag, useInventoryResource } from "./inventory.js"
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

let equippedWeapon
export const manageWeaponActions = () => {
    equippedWeapon = equippedWeaponFromInventory()
    manageAim()
    manageReload()
    manageShoot()
}

let counter = 0
const manageAim = () => {
    if ( getAimMode() ) {
        counter++
        if ( counter === 20 ) {
            counter = 0
            setTarget(null)
        } 
        if ( counter === 0 ) {       
            const range = getStat(equippedWeapon.name, 'range', equippedWeapon.rangelvl)
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
    if ( equippedWeapon.currmag === getStat(equippedWeapon.name, 'magazine', equippedWeapon.magazinelvl) ) return
    if ( calculateTotalAmmo() === 0 ) return
    if ( getShooting() ) return
    setReloading(true)
}

let reloadCounter = 0
const manageReload = () => {
    if ( !getEquippedWeapon() ) return
    if ( getReloading() ) reloadCounter++
    if ( reloadCounter / 60 >= getStat(equippedWeapon.name, 'reloadspeed', equippedWeapon.reloadspeedlvl) ) {
        reload()
        setReloading(false)
        reloadCounter = 0
    }
}

const reload = () => {
    const mag = getStat(equippedWeapon.name, 'magazine', equippedWeapon.magazinelvl)
    const currentMag = equippedWeapon.currmag
    const totalAmmo = calculateTotalAmmo()
    const need = mag - currentMag
    const trade = need <= totalAmmo ? need : totalAmmo
    updateInventory(equippedWeapon, currentMag + trade, trade)
}

const manageShoot = () => {
    if ( !getEquippedWeapon() ) return
    const fireRate = getStat(equippedWeapon.name, 'firerate', equippedWeapon.fireratelvl)
    setShootCounter(getShootCounter() + 1)
    if ( getShootCounter() / 60 >= fireRate ) setShootCounter(getShootCounter() - 1)
    if ( (getShootCounter() + 1) / 60 >= fireRate ) {
        setShooting(false)
        if ( getAimMode() && getShootPressed() && !getReloading() ) {
            setShooting(true)
            shoot()
            setShootCounter(0)
        }
    }
}

const shoot = () => {
    const totalAmmo = calculateTotalAmmo()
    let currMag = equippedWeapon.currmag
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
    useInventoryResource(equippedWeapon.ammotype, trade)    
    updateInventoryWeaponMag(newMag)
    removeUi()
    renderUi()
}