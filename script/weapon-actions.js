import { getStat } from './weapon-specs.js'
import { dropLoot } from './loot-manager.js'
import { TRACKER } from './enemy/util/enemy-constants.js'
import { collide, containsClass } from './util.js'
import { removeUi, renderUi } from './user-interface.js'
import { getCurrentRoomEnemies, getCurrentRoomSolid, getPlayer } from './elements.js'
import { 
    calculateTotalAmmo,
    equippedWeaponFromInventory,
    updateInventoryWeaponMag,
    useInventoryResource } from './inventory.js'
import { 
    getAimMode,
    getEquippedWeapon,
    getNoOffenseCounter,
    getReloading,
    getShootCounter,
    getShootPressed,
    getShooting,
    getTarget,
    setReloading,
    setShootCounter,
    setShooting,
    setTarget } from './variables.js'

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
    if ( !getAimMode() ) return
    counter++
    if ( counter === 15 ) {
        counter = 0
        setTarget(null)
    } 
    if ( counter !== 0 ) return       
    const range = getStat(equippedWeapon.name, 'range', equippedWeapon.rangelvl)
    const laser = Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => containsClass(child, 'weapon')).firstElementChild
    laser.style.height = `${range}px`
    let found = false
    Array.from(laser.children).forEach((elem, index) => {
        if ( found ) return
        for ( const solid of getCurrentRoomSolid() ) {
            if ( collide(elem, solid, 0) ) {
                setTarget(solid)
                laser.style.height = `${index/100 * range}px`
                found = true
            }
        }
    })
    
}

export const setupReload = () => {
    if ( equippedWeapon.currmag === getStat(equippedWeapon.name, 'magazine', equippedWeapon.magazinelvl) ) return
    if ( calculateTotalAmmo(equippedWeapon) === 0 ) return
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
    const totalAmmo = calculateTotalAmmo(equippedWeapon)
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
    const totalAmmo = calculateTotalAmmo(equippedWeapon)
    let currMag = equippedWeapon.currmag
    if ( currMag === 0 ) {
        EMPTY_WEAPON.play()
        setShooting(false)
        if ( totalAmmo === 0 ) return
        setupReload()
        return
    }
    currMag--
    notifyNearbyEnemies()
    manageInteractivity()
    updateInventory(equippedWeapon, currMag, 0)
}

const notifyNearbyEnemies = () => getCurrentRoomEnemies().forEach(elem => {
    if ( elem.htmlTag.type === TRACKER ) {
        if ( getNoOffenseCounter() === 0 ) elem.notifyEnemy(2000)
    }
    else elem.notifyEnemy(800)
})

const manageInteractivity = () => {
    if ( !getTarget() ) return
    let element = getTarget().parentElement
    if ( containsClass(element, TRACKER) ) return
    if ( containsClass(getTarget(), 'weak-point') ) element = getTarget().parentElement.parentElement.parentElement
    const enemy = getCurrentRoomEnemies().find(elem => elem.htmlTag === element)
    if ( containsClass(element, 'enemy') && enemy.health > 0 ) enemy.damageEnemy(equippedWeapon)
    if ( getTarget()?.getAttribute('name') === 'crate' ) dropLoot(getTarget())
}

const updateInventory = (equippedWeapon, newMag, trade) => {
    useInventoryResource(equippedWeapon.ammotype, trade)
    updateInventoryWeaponMag(newMag)
    removeUi()
    renderUi()
}