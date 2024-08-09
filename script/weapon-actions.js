import { getStat, getWeaponSpecs } from './weapon-specs.js'
import { dropLoot } from './loot-manager.js'
import { collide, containsClass, getEquippedSpec, getProperty, isThrowing } from './util.js'
import { removeUi, renderUi } from './user-interface.js'
import { TRACKER } from './enemy/util/enemy-constants.js'
import { getCurrentRoomEnemies, getCurrentRoomSolid, getPlayer } from './elements.js'
import { 
    calculateTotalAmmo,
    equippedItem,
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
    getThrowCounter,
    setReloading,
    setShootCounter,
    setShooting,
    setTarget, 
    setThrowCounter} from './variables.js'
import { getThrowableSpecs } from './throwable-specs.js'

const EMPTY_WEAPON = new Audio('../assets/audio/empty-weapon.mp3')

let equipped
export const manageWeaponActions = () => {
    equipped = equippedItem()
    manageAim()
    manageReload()
    manageShoot()
    manageThrow()
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
    const range = getEquippedSpec(equipped, 'range')
    const laser = Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => containsClass(child, 'weapon') || containsClass(child, 'throwable')).firstElementChild
    laser.style.height = `${range}px`
    let found = false
    Array.from(laser.children).forEach(elem => {
        elem.style.display = 'block'
        if ( found ) {
            elem.style.display = 'none'
            return
        }
        for ( const solid of getCurrentRoomSolid() ) {
            if ( ( getThrowableSpecs().get(equipped.name) &&
                   !containsClass(solid, 'enemy-collider') &&
                   !containsClass(solid, 'tracker-component') ||
                   getWeaponSpecs().get(equipped.name)
                 ) &&
                collide(elem, solid, 0) ) {
                setTarget(solid)
                found = true
            }
        }
    }) 
}

export const setupReload = () => {    
    if ( getThrowableSpecs().get(equipped.name) ) return
    if ( equipped.currmag === getStat(equipped.name, 'magazine', equipped.magazinelvl) ) return
    if ( calculateTotalAmmo(equipped) === 0 ) return
    if ( getShooting() ) return
    setReloading(true)
}

let reloadCounter = 0
const manageReload = () => {
    if ( getThrowableSpecs().get(equipped?.name) ) return
    if ( !getEquippedWeapon() ) return
    if ( getReloading() ) reloadCounter++
    if ( reloadCounter / 60 >= getStat(equipped.name, 'reloadspeed', equipped.reloadspeedlvl) ) {
        reload()
        setReloading(false)
        reloadCounter = 0
    }
}

const reload = () => {    
    const mag = getStat(equipped.name, 'magazine', equipped.magazinelvl)
    const currentMag = equipped.currmag
    const totalAmmo = calculateTotalAmmo(equipped)
    const need = mag - currentMag
    const trade = need <= totalAmmo ? need : totalAmmo
    updateInventory(equipped, currentMag + trade, trade)
}

const manageShoot = () => {
    if ( !getEquippedWeapon() ) return
    const fireRate = getEquippedSpec(equipped, 'firerate')
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
    if ( getThrowableSpecs().get(equipped.name) ) {
        setThrowCounter(1)
        return
    }
    const totalAmmo = calculateTotalAmmo(equipped)
    let currMag = equipped.currmag
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
    updateInventory(equipped, currMag, 0)
}

const notifyNearbyEnemies = () => getCurrentRoomEnemies().forEach(elem => {
    if ( elem.htmlTag.type === TRACKER ) {
        if ( getNoOffenseCounter() === 0 ) elem.notificationService.notifyEnemy(2000)
    }
    else elem.notificationService.notifyEnemy(800)
})

const manageInteractivity = () => {
    if ( !getTarget() ) return
    let element = getTarget().parentElement
    if ( containsClass(element, TRACKER) ) return
    if ( containsClass(getTarget(), 'weak-point') ) element = getTarget().parentElement.parentElement.parentElement
    const enemy = getCurrentRoomEnemies().find(elem => elem.htmlTag === element)
    if ( containsClass(element, 'enemy') && enemy.health > 0 ) enemy.injuryService.damageEnemy(equipped)
    if ( getTarget()?.getAttribute('name') === 'crate' ) dropLoot(getTarget())
}

const updateInventory = (equipped, newMag, trade) => {
    useInventoryResource(equipped.ammotype, trade)
    updateInventoryWeaponMag(newMag)
    removeUi()
    renderUi()
}

const manageThrow = () => {
    throwAnimation()
}

const throwAnimation = () => {
    if ( isThrowing() ) setThrowCounter(getThrowCounter() + 1)
    else return
    const rightHand = getPlayer().firstElementChild.firstElementChild.children[2]
    const handHeight = getProperty(rightHand, 'height', 'px')
    const handTop = getProperty(rightHand, 'top', 'px')
    const throwable = getPlayer().firstElementChild.firstElementChild.children[3].children[1]
    const throwableTop = getProperty(throwable, 'top', 'px')
    animateThrow(rightHand, 1, 13, `${handHeight - 1}px`, `${handTop + 1}px`)
    animateThrow(rightHand, 14, 14, '2px', '0')
    animateThrow(rightHand, 17, 28, `${handHeight + 1}px`, `${handTop + 0.08}px`)
    animateThrow(rightHand, 45, 45, '', '')
    if ( getThrowCounter() === 45 ) throwable.style.top = ''
    if ( getThrowCounter() > 0 && getThrowCounter() <= 28 ) throwable.style.top = `${throwableTop + 1}px`
    if ( getThrowCounter() === 60 ) setThrowCounter(0)
}

const animateThrow = (hand, start, end, height, top) => {
    if ( !( getThrowCounter() >= start && getThrowCounter() <= end ) ) return
    hand.style.height = height
    hand.style.top = top
}