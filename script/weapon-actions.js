import { dropLoot } from './loot-manager.js'
import { removeThrowable } from './throwable-loader.js'
import { removeUi, renderUi } from './user-interface.js'
import { getThrowableSpecs } from './throwable-specs.js'
import { TRACKER } from './enemy/util/enemy-constants.js'
import { getStat, getWeaponSpecs } from './weapon-specs.js'
import { 
    calculateTotalAmmo,
    equippedWeaponObj,
    updateInventoryWeaponMag,
    useInventoryResource } from './inventory.js'
import { 
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomSolid,
    getCurrentRoomThrowables,
    getPlayer } from './elements.js'
import { 
    addAllAttributes,
    addClass,
    angleOf2Points,
    appendAll,
    calculateBulletSpeed,
    collide,
    containsClass,
    createAndAddClass,
    getEquippedSpec,
    getProperty,
    isMoving,
    isThrowing,
    removeClass } from './util.js'
import { 
    getAimMode,
    getEquippedWeaponId,
    getNoOffenseCounter,
    getPlayerX,
    getPlayerY,
    getReloading,
    getRoomLeft,
    getRoomTop,
    getShootCounter,
    getShootPressed,
    getShooting,
    getTarget,
    getThrowCounter,
    getWeaponWheel,
    setAimMode,
    setEquippedWeaponId,
    setReloading,
    setShootCounter,
    setShooting,
    setTarget, 
    setThrowCounter,
    setWeaponWheel} from './variables.js'

const EMPTY_WEAPON = new Audio('../assets/audio/empty-weapon.mp3')

let equipped
export const manageWeaponActions = () => {
    equipped = equippedWeaponObj()
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
    if ( !getEquippedWeaponId() ) return
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
    if ( !getEquippedWeaponId() ) return
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
    throwItem()
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
    animateThrow(rightHand, 29, 29, '', '')
    if ( getThrowCounter() === 29 ) throwable.style.top = ''
    if ( getThrowCounter() > 0 && getThrowCounter() <= 28 ) throwable.style.top = `${throwableTop + 1}px`
    if ( getThrowCounter() === 60 ) setThrowCounter(0)
}

const animateThrow = (hand, start, end, height, top) => {
    if ( !( getThrowCounter() >= start && getThrowCounter() <= end ) ) return
    hand.style.height = height
    hand.style.top = top
}

const throwItem = () => {
    if ( getThrowCounter() !== 28 ) return 
    const { srcX, srcY } = getSourceCoordinates()
    const { destX, destY } = getDestinationCoordinates()
    const diffY = destY - srcY
    const diffX = destX - srcX
    const deg = angleOf2Points(srcX, srcY, destX, destY)
    const slope = Math.abs(diffY / diffX)
    const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX, 8)
    const item = createAndAddClass('div', 'throwable-item')
    const image = createAndAddClass('img', 'throwable-image')
    image.src = `/assets/images/${equipped.name}.png`
    item.style.left = `${srcX}px`
    item.style.top = `${srcY}px`
    item.append(image)
    appendColliders(item)
    addAllAttributes(
        item,
        'name', equipped.name,
        'speed-x', speedX,
        'speed-y', speedY,
        'distance', 0,
        'diff-x', diffX,
        'diff-y', diffY,
        'deg', deg,
        'base-speed', 8,
        'acc-counter', 0,
        'time', 0
    )
    updateInventoryItem()
    getCurrentRoomThrowables().push(item)
    getCurrentRoom().append(item)
}

const getSourceCoordinates = () => {
    const playerX = getPlayer().getBoundingClientRect().x
    const playerY = getPlayer().getBoundingClientRect().y
    const throwable = getPlayer().firstElementChild.firstElementChild.children[3].children[1]
    const throwableX = throwable.getBoundingClientRect().x
    const throwableY = throwable.getBoundingClientRect().y
    const diffX = throwableX - playerX
    const diffY = throwableY - playerY
    const srcX = ( getPlayerX() - getRoomLeft() ) + diffX
    const srcY = ( getPlayerY() - getRoomTop() ) + diffY
    return { srcX, srcY }
}

const getDestinationCoordinates = () => {
    const playerX = getPlayer().getBoundingClientRect().x
    const playerY = getPlayer().getBoundingClientRect().y
    const target = getPlayer().firstElementChild.firstElementChild.children[3].children[2]
    const targetX = target.getBoundingClientRect().x
    const targetY = target.getBoundingClientRect().y
    const diffX = targetX - playerX
    const diffY = targetY - playerY
    const destX = ( getPlayerX() - getRoomLeft() ) + diffX
    const destY = ( getPlayerY() - getRoomTop() ) + diffY
    return { destX, destY }
}

const appendColliders = (throwable) => {
    const top = createAndAddClass('div', 'top-collider')
    const left = createAndAddClass('div', 'left-collider')
    const right = createAndAddClass('div', 'right-collider')
    const bottom = createAndAddClass('div', 'bottom-collider')
    appendAll(throwable, top, left, right, bottom)
}

const updateInventoryItem = () => {
    unequipThrowable()
    useInventoryResource(equipped.name, 1)
    removeUi()
    renderUi()
}

const unequipThrowable = () => {
    if ( equipped.amount !== 1 ) return
    setAimMode(false)
    removeThrowable()
    setThrowCounter(0)
    setShooting(false)
    setEquippedWeaponId(null)
    removeClass(getPlayer(), 'throwable-aim')
    if (isMoving()) addClass(getPlayer(), 'walk')
    const rightHand = getPlayer().firstElementChild.firstElementChild.children[2]
    rightHand.style.top = ''
    rightHand.style.height = ''
    setWeaponWheel(getWeaponWheel().map(weapon => weapon === equipped.id ? null : weapon))
}