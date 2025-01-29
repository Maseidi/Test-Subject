import { exitAim } from './actions.js'
import { manageAimModeAngle } from './angle-manager.js'
import {
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomSolid,
    getCurrentRoomThrowables,
    getPlayer,
    getReloadButton,
    getSlotsContainer,
    getThrowButton,
    getUiEl,
} from './elements.js'
import { TRACKER } from './enemy/enemy-constants.js'
import { getGunDetail, getGunUpgradableDetail, isGun } from './gun-details.js'
import {
    calculateThrowableAmount,
    calculateTotalAmmo,
    findEquippedWeaponById,
    updateInventoryWeaponMag,
    useInventoryResource,
} from './inventory.js'
import { dropLoot } from './loot-manager.js'
import { IS_MOBILE } from './script.js'
import { playEmptyWeapon, playGunShot, playReload } from './sound-manager.js'
import { isThrowable } from './throwable-details.js'
import { removeThrowable } from './throwable-loader.js'
import { renderReloadButton, renderSlots, renderThrowButton } from './user-interface.js'
import {
    addAllAttributes,
    addClass,
    angleOf2Points,
    appendAll,
    calculateBulletSpeed,
    collide,
    containsClass,
    createAndAddClass,
    distance,
    findAttachmentsOnPlayer,
    getEquippedItemDetail,
    getProperty,
    isMoving,
    isThrowing,
    removeClass,
} from './util.js'
import {
    getAimJoystickAngle,
    getAimMode,
    getCriticalChance,
    getEquippedWeaponId,
    getFoundTarget,
    getIsSearching4Target,
    getNoAimAfterThrow,
    getNoOffenseCounter,
    getPlayerAimAngle,
    getPlayerAngle,
    getPlayerX,
    getPlayerY,
    getReloading,
    getRoomLeft,
    getRoomTop,
    getShootCounter,
    getShootPressed,
    getSuitableTargetAngle,
    getTargets,
    getThrowCounter,
    getWeaponWheel,
    setAimMode,
    setCriticalChance,
    setEquippedWeaponId,
    setFoundTarget,
    setPlayerAimAngle,
    setPlayerAngle,
    setPlayerAngleState,
    setReloading,
    setShootCounter,
    setShooting,
    setShootPressed,
    setSuitableTargetAngle,
    setTargets,
    setThrowCounter,
    setWeaponWheel,
} from './variables.js'

let equipped
export const manageWeaponActions = () => {
    equipped = findEquippedWeaponById()
    manageAim()
    manageReload()
    manageShoot()
    manageFireAnimation()
    manageThrow()
    if (IS_MOBILE) manageMobileAim()
}

let counter = 0
const manageAim = () => {
    if (!getAimMode()) return
    counter++
    if (counter === 5) {
        counter = 0
        setTargets([])
    }
    if (counter !== 0) return
    const range = getEquippedItemDetail(equipped, 'range')
    const laser = findAttachmentsOnPlayer('throwable', 'gun').firstElementChild
    laser.style.height = `${range}px`
    let found = false
    let intersectedWithWall = false
    Array.from(laser.children).forEach(elem => {
        elem.style.visibility = found ? 'hidden' : 'visible'
        if (intersectedWithWall) return
        for (const solid of getCurrentRoomSolid()) {
            if (
                ((isThrowable(equipped.name) && !containsClass(solid, 'enemy-collider')) || isGun(equipped.name)) &&
                collide(elem, solid, 0)
            ) {
                if (!getTargets().includes(solid)) getTargets().push(solid)
                intersectedWithWall = !containsClass(solid, 'enemy-collider') && solid.getAttribute('name') !== 'crate'
                found = true
            }
        }
    })
}

export const setupReload = () => {
    if (isReloadDisabled()) return
    if (!getReloading()) playReload(equipped)
    setReloading(true)
}

export const isReloadDisabled = (local = true) => {
    const innerEquipped = local ? equipped : findEquippedWeaponById()
    if (!innerEquipped) return true
    if (isThrowable(innerEquipped.name)) return true
    if (innerEquipped.currmag === getGunUpgradableDetail(innerEquipped.name, 'magazine', innerEquipped.magazinelvl))
        return true
    if (calculateTotalAmmo() === 0) return true
    return false
}

let reloadCounter = 0
const manageReload = () => {
    if (isThrowable(equipped?.name)) return
    if (!getEquippedWeaponId()) return
    if (getReloading()) reloadCounter++
    if (reloadCounter / 60 >= getGunUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl)) {
        reload()
        setReloading(false)
        reloadCounter = 0
    }
}

const reload = () => {
    const mag = getGunUpgradableDetail(equipped.name, 'magazine', equipped.magazinelvl)
    const currentMag = equipped.currmag
    const totalAmmo = calculateTotalAmmo()
    const need = mag - currentMag
    const trade = need <= totalAmmo ? need : totalAmmo
    useAmmoFromInventory(currentMag + trade, trade)
    getReloadButton()?.remove()
    renderReloadButton()
}

const manageShoot = () => {
    if (!getEquippedWeaponId()) return
    const fireRate = getEquippedItemDetail(equipped, 'firerate')
    setShootCounter(getShootCounter() + 1)
    if (getShootCounter() / 60 >= fireRate) setShootCounter(getShootCounter() - 1)
    if ((getShootCounter() + 1) / 60 >= fireRate) {
        setShooting(false)
        if (getAimMode() && getShootPressed() && !getReloading()) {
            setShooting(true)
            shoot()
            setShootCounter(0)
        }
    }
}

const shoot = () => {
    if (isThrowable(equipped.name)) {
        setThrowCounter(1)
        return
    }
    const totalAmmo = calculateTotalAmmo()
    let currMag = equipped.currmag
    if (currMag === 0) {
        playEmptyWeapon()
        setShooting(false)
        if (totalAmmo === 0) return
        setupReload()
        return
    }
    playGunShot(equipped.name)
    currMag--
    applyRecoil()
    addFireAnimation()
    notifyNearbyEnemies()
    managePenetration()
    useAmmoFromInventory(currMag, 0)
    getReloadButton()?.remove()
    renderReloadButton()
}

const applyRecoil = () => {
    const currAngle = getProperty(getPlayer().firstElementChild.firstElementChild, 'transform', 'rotateZ(', 'deg)')
    let newAngle = currAngle + (Math.ceil(Math.random() * 7.5) - 3.75)
    if (newAngle > 180) newAngle -= 360
    else if (newAngle < -180) newAngle += 360
    setPlayerAimAngle(newAngle)
    manageAimModeAngle(getPlayer(), getPlayerAimAngle(), getPlayerAngle, setPlayerAngle, setPlayerAngleState)
}

const addFireAnimation = () => {
    const weaponFire = findAttachmentsOnPlayer('gun').lastElementChild
    if (!Number(weaponFire.getAttribute('time')) === 0) return
    weaponFire.style.display = 'block'
    weaponFire.setAttribute('time', 1)
}

const notifyNearbyEnemies = () =>
    getCurrentRoomEnemies().forEach(elem => {
        if (elem.sprite.type === TRACKER) {
            if (getNoOffenseCounter() === 0) elem.notificationService.notifyEnemy(2000)
        } else elem.notificationService.notifyEnemy(800)
    })

const managePenetration = () => {
    if (getTargets().length === 0) return
    for (let i = 0; i < getTargets().length; i++) {
        const target = getTargets()[i]
        let element = target.parentElement
        const enemy = getCurrentRoomEnemies().find(elem => elem.sprite === element)
        const absoluteDamage = getEquippedItemDetail(equipped, 'damage') / Math.pow(2, i)
        const absoluteKnock = getEquippedItemDetail(equipped, 'knock') / Math.pow(2, i)
        if (containsClass(element, 'enemy') && enemy?.health > 0 && absoluteDamage >= 10) {
            enemy.injuryService.damageEnemy(
                equipped.name,
                absoluteDamage,
                getGunDetail(equipped.name, 'antivirus'),
                absoluteKnock,
            )
        }
        if (target?.getAttribute('name') === 'crate') dropLoot(target)
    }
}

const useAmmoFromInventory = (newMag, trade) => {
    useInventoryResource(equipped.ammotype, trade)
    updateInventoryWeaponMag(newMag)
    const ammoCount = getUiEl().children[2].children[1]
    const mag = ammoCount.firstElementChild
    const totalAmmo = ammoCount.children[1]
    mag.textContent = newMag
    totalAmmo.textContent = calculateTotalAmmo()
}

const manageFireAnimation = () => {
    if (!getAimMode() || isThrowable(findEquippedWeaponById().name)) return
    const weaponFire = findAttachmentsOnPlayer('gun').lastElementChild
    const time = Number(weaponFire.getAttribute('time'))
    if (time === 0) return
    if (time === 6) {
        weaponFire.setAttribute('time', 0)
        weaponFire.style.display = 'none'
    } else weaponFire.setAttribute('time', time + 1)
}

const manageThrow = () => {
    throwAnimation()
    throwItem()
}

const throwAnimation = () => {
    if (!isThrowing()) return
    setThrowCounter(getThrowCounter() + 1)
    const rightHand = getPlayer().firstElementChild.firstElementChild.children[2]
    const handHeight = getProperty(rightHand, 'height', 'px')
    const handTop = getProperty(rightHand, 'top', 'px')
    const throwable = findAttachmentsOnPlayer('throwable').children[1]
    const throwableTop = getProperty(throwable, 'top', 'px')
    animateThrow(rightHand, 1, 8, `${handHeight - 1}px`, `${handTop + 1}px`)
    animateThrow(rightHand, 9, 9, '2px', '0')
    animateThrow(rightHand, 10, 18, `${handHeight + 1}px`, `${handTop + 0.08}px`)
    animateThrow(rightHand, 19, 19, '', '')
    if (getThrowCounter() === 19) {
        setThrowCounter(0)
        throwable.style.top = ''
        if (getNoAimAfterThrow()) {
            exitAim()
            return
        }
    }
    if (getThrowCounter() > 0 && getThrowCounter() <= 18) throwable.style.top = `${throwableTop + 1}px`
}

const animateThrow = (hand, start, end, height, top) => {
    if (!(getThrowCounter() >= start && getThrowCounter() <= end)) return
    hand.style.height = height
    hand.style.top = top
}

const throwItem = () => {
    if (getThrowCounter() !== 18) return
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
        'name',
        equipped.name,
        'speed-x',
        speedX,
        'speed-y',
        speedY,
        'distance',
        0,
        'diff-x',
        diffX,
        'diff-y',
        diffY,
        'deg',
        deg,
        'base-speed',
        8,
        'acc-counter',
        0,
        'time',
        0,
    )
    useThrowableFromInventory()
    getCurrentRoomThrowables().push(item)
    getCurrentRoom().append(item)
    getThrowButton()?.remove()
    renderThrowButton()
}

const getSourceCoordinates = () => {
    const { x: playerX, y: playerY } = getPlayer().getBoundingClientRect()
    const throwable = findAttachmentsOnPlayer('throwable').children[1]
    const { x: throwableX, y: throwableY } = throwable.getBoundingClientRect()
    const diffX = throwableX - playerX
    const diffY = throwableY - playerY
    const srcX = getPlayerX() - getRoomLeft() + diffX
    const srcY = getPlayerY() - getRoomTop() + diffY
    return { srcX, srcY }
}

const getDestinationCoordinates = () => {
    const { x: playerX, y: playerY } = getPlayer().getBoundingClientRect()
    const target = findAttachmentsOnPlayer('throwable').children[2]
    const { x: targetX, y: targetY } = target.getBoundingClientRect()
    const diffX = targetX - playerX
    const diffY = targetY - playerY
    const destX = getPlayerX() - getRoomLeft() + diffX
    const destY = getPlayerY() - getRoomTop() + diffY
    return { destX, destY }
}

const appendColliders = throwable =>
    appendAll(
        throwable,
        createAndAddClass('div', 'top-collider'),
        createAndAddClass('div', 'left-collider'),
        createAndAddClass('div', 'right-collider'),
        createAndAddClass('div', 'bottom-collider'),
    )

const useThrowableFromInventory = () => {
    const ammoCount = getUiEl().children[2].children[1]
    const totalAmmo = calculateThrowableAmount()
    useInventoryResource(equipped.name, 1)
    if (totalAmmo === 1) {
        ammoCount.parentElement.remove()
        unEquipThrowable()
        getSlotsContainer()?.remove()
        renderSlots()
        getThrowButton()?.remove()
        renderThrowButton()
    } else ammoCount.firstElementChild.textContent = totalAmmo - 1
}

const unEquipThrowable = () => {
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
    setWeaponWheel(getWeaponWheel().map(weapon => (weapon === equipped.id ? null : weapon)))
}

export const useLuckPills = pills => {
    if (getCriticalChance() === 20) return
    setCriticalChance(getCriticalChance() + 0.019 >= 0.19 ? 0.2 : getCriticalChance() + 0.019)
    pills.amount -= 1
}

const manageMobileAim = () => {
    findMostSuitableTarget()
    autoAim2Target()
    shootWhenTargetDetected()
}

let targetCounter = 0
const findMostSuitableTarget = () => {
    targetCounter = targetCounter + 1 > 30 ? 0 : targetCounter + 1
    if (targetCounter !== 10) return
    if (!getIsSearching4Target()) return
    if (!getAimMode()) return

    setFoundTarget(null)
    setSuitableTargetAngle(null)

    let minDistance = Number.MAX_SAFE_INTEGER
    const { x: x1, y: y1, width: w1, height: h1 } = getPlayer().getBoundingClientRect()
    const playerCenterX = x1 + w1 / 2
    const playerCenterY = y1 + h1 / 2

    getCurrentRoomEnemies().forEach(enemy => {
        if (!['out-of-range', false].includes(enemy.wallInTheWay)) return
        const item = enemy.sprite
        const distance2Player = distance(item, player)
        if (distance2Player > getGunUpgradableDetail(equipped.name, 'range', equipped.rangelvl)) return
        const { x: x2, y: y2, width: w2, height: h2 } = item.getBoundingClientRect()
        const angle2Item = angleOf2Points(playerCenterX, playerCenterY, x2 + w2 / 2, y2 + h2 / 2)
        const joystickAngle = getAimJoystickAngle()
        if (distance2Player < minDistance && getCurrentDiff(angle2Item, joystickAngle) < 20) {
            minDistance = distance2Player
            setFoundTarget(item)
            setSuitableTargetAngle(angle2Item)
        }
    })
}

const getCurrentDiff = (angle2Item, joystickAngle) => {
    if (joystickAngle >= -180 && joystickAngle < -90) {
        if (angle2Item >= 90 && angle2Item < 180) angle2Item -= 360
    } else if (joystickAngle >= 90 && joystickAngle < 180) {
        if (angle2Item >= -180 && angle2Item < -90) angle2Item += 360
    }
    return Math.abs(angle2Item - joystickAngle)
}

const autoAim2Target = () => setPlayerAimAngle(getFoundTarget() ? getSuitableTargetAngle() : getAimJoystickAngle())

const shootWhenTargetDetected = () => {
    if (!getFoundTarget() || getTargets()[0] !== getFoundTarget().firstElementChild) {
        setShootPressed(false)
        return
    }
    setShootPressed(true)
}
