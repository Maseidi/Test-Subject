import { dropLoot } from './loot-manager.js'
import { isThrowable } from './throwable-details.js'
import { removeThrowable } from './throwable-loader.js'
import { TRACKER } from './enemy/util/enemy-constants.js'
import { getWeaponUpgradableDetail, isWeapon } from './weapon-details.js'
import { 
    calculateThrowableAmount,
    calculateTotalAmmo,
    equippedWeaponObj,
    updateInventoryWeaponMag,
    useInventoryResource } from './inventory.js'
import { 
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomSolid,
    getCurrentRoomThrowables,
    getPlayer, 
    getUiEl} from './elements.js'
import { 
    addAllAttributes,
    addClass,
    angleOf2Points,
    appendAll,
    calculateBulletSpeed,
    collide,
    containsClass,
    createAndAddClass,
    findAttachmentsOnPlayer,
    getEquippedItemDetail,
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
    const range = getEquippedItemDetail(equipped, 'range')
    const laser = findAttachmentsOnPlayer('throwable', 'weapon').firstElementChild
    laser.style.height = `${range}px`
    let found = false
    Array.from(laser.children).forEach(elem => {
        elem.style.display = 'block'
        if ( found ) {
            elem.style.display = 'none'
            return
        }
        for ( const solid of getCurrentRoomSolid() ) {
            if ( ( isThrowable(equipped.name) &&
                   !containsClass(solid, 'enemy-collider') &&
                   !containsClass(solid, 'tracker-component') ||
                   isWeapon(equipped.name)
                 ) &&
                collide(elem, solid, 0) ) {
                setTarget(solid)
                found = true
            }
        }
    }) 
}

export const setupReload = () => {    
    if ( isThrowable(equipped.name) ) return
    if ( equipped.currmag === getWeaponUpgradableDetail(equipped.name, 'magazine', equipped.magazinelvl) ) return
    if ( calculateTotalAmmo(equipped) === 0 ) return
    if ( getShooting() ) return
    setReloading(true)
}

let reloadCounter = 0
const manageReload = () => {
    if ( isThrowable(equipped?.name) ) return
    if ( !getEquippedWeaponId() ) return
    if ( getReloading() ) reloadCounter++
    if ( reloadCounter / 60 >= getWeaponUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl) ) {
        reload()
        setReloading(false)
        reloadCounter = 0
    }
}

const reload = () => {    
    const mag = getWeaponUpgradableDetail(equipped.name, 'magazine', equipped.magazinelvl)
    const currentMag = equipped.currmag
    const totalAmmo = calculateTotalAmmo(equipped)
    const need = mag - currentMag
    const trade = need <= totalAmmo ? need : totalAmmo
    useAmmoFromInventory(equipped, currentMag + trade, trade)
}

const manageShoot = () => {
    if ( !getEquippedWeaponId() ) return
    const fireRate = getEquippedItemDetail(equipped, 'firerate')
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
    if ( isThrowable(equipped.name) ) {
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
    useAmmoFromInventory(equipped, currMag, 0)
}

const notifyNearbyEnemies = () => getCurrentRoomEnemies().forEach(elem => {
    if ( elem.sprite.type === TRACKER ) {
        if ( getNoOffenseCounter() === 0 ) elem.notificationService.notifyEnemy(2000)
    }
    else elem.notificationService.notifyEnemy(800)
})

const manageInteractivity = () => {
    if ( !getTarget() ) return
    let element = getTarget().parentElement
    if ( containsClass(element, TRACKER) ) return
    if ( containsClass(getTarget(), 'weak-point') ) element = getTarget().parentElement.parentElement.parentElement
    const enemy = getCurrentRoomEnemies().find(elem => elem.sprite === element)
    if ( containsClass(element, 'enemy') && enemy.health > 0 ) enemy.injuryService.damageEnemy(equipped)
    if ( getTarget()?.getAttribute('name') === 'crate' ) dropLoot(getTarget())
}

const useAmmoFromInventory = (equipped, newMag, trade) => {
    useInventoryResource(equipped.ammotype, trade)
    updateInventoryWeaponMag(equipped, newMag)
    const ammoCount = getUiEl().children[2].children[1]
    const mag = ammoCount.children[0]
    const totalAmmo = ammoCount.children[1]
    mag.textContent = newMag
    totalAmmo.textContent = calculateTotalAmmo(equipped)
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
    const throwable = findAttachmentsOnPlayer('throwable').children[1]
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
    useThrowableFromInventory()
    getCurrentRoomThrowables().push(item)
    getCurrentRoom().append(item)
}

const getSourceCoordinates = () => {
    const { x: playerX, y: playerY } = getPlayer().getBoundingClientRect()
    const throwable = findAttachmentsOnPlayer('throwable').children[1]
    const { x: throwableX, y: throwableY } = throwable.getBoundingClientRect()
    const diffX = throwableX - playerX
    const diffY = throwableY - playerY
    const srcX = ( getPlayerX() - getRoomLeft() ) + diffX
    const srcY = ( getPlayerY() - getRoomTop() ) + diffY
    return { srcX, srcY }
}

const getDestinationCoordinates = () => {
    const { x: playerX, y: playerY } = getPlayer().getBoundingClientRect()
    const target = findAttachmentsOnPlayer('throwable').children[2]
    const { x: targetX, y: targetY } = target.getBoundingClientRect()
    const diffX = targetX - playerX
    const diffY = targetY - playerY
    const destX = ( getPlayerX() - getRoomLeft() ) + diffX
    const destY = ( getPlayerY() - getRoomTop() ) + diffY
    return { destX, destY }
}

const appendColliders = (throwable) => 
    appendAll(
        throwable, 
        createAndAddClass('div', 'top-collider'), 
        createAndAddClass('div', 'left-collider'), 
        createAndAddClass('div', 'right-collider'), 
        createAndAddClass('div', 'bottom-collider')
    )

const useThrowableFromInventory = () => {
    unEquipThrowable()
    useInventoryResource(equipped.name, 1)
    const ammoCount = getUiEl().children[2].children[1]
    const totalAmmo = calculateThrowableAmount(equipped)
    if ( totalAmmo === 0 ) ammoCount.parentElement.remove()
    else ammoCount.firstElementChild.textContent = totalAmmo
}

const unEquipThrowable = () => {
    if ( calculateThrowableAmount(equipped) !== 1 ) return
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