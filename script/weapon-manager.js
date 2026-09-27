import { manageAimModeAngle } from './angle-manager.js'
import {
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomSolid,
    getCurrentRoomThrowables,
    getPlayer,
    getReloadButton,
    getUiEl,
} from './elements.js'
import { TRACKER } from './enemy/enemy-constants.js'
import { getGunDetail } from './gun-details.js'
import {
    consumeReserveAmmo,
    consumeThrowable,
    getReserveAmmo,
    getThrowableCount,
    getWeaponById,
    setWeaponMagazine,
} from './loadout.js'
import { IS_MOBILE } from './platform.js'
import { getSettings } from './settings.js'
import { playEmptyWeapon, playGunShot, playReload } from './sound-manager.js'
import { renderReloadButton, renderThrowableButtons, renderWeaponUi } from './user-interface.js'
import {
    addAllAttributes,
    addClass,
    appendAll,
    collide,
    containsClass,
    createAndAddClass,
    distance,
    findAttachmentsOnPlayer,
    getProperty,
    getSpeedPerFrame,
    removeClass,
    useDeltaTime,
} from './util.js'
import {
    getAimJoystickAngle,
    getAimMode,
    getAnimatedElements,
    getEquippedWeaponId,
    getFoundTarget,
    getGrabbed,
    getIsSearching4Target,
    getNoOffenseCounter,
    getPause,
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
    setAnimatedElements,
    setFoundTarget,
    setPlayerAimAngle,
    setPlayerAngle,
    setPlayerAngleState,
    setReloading,
    setShootPressed,
    setShootCounter,
    setShooting,
    setSuitableTargetAngle,
    setTargets,
} from './variables.js'

let reloadCounter = 0
let reloadWeaponId = null
let reloadAnimation = null
let aimCounter = 0

const equippedWeapon = () => getWeaponById(getEquippedWeaponId())

export const manageWeaponActions = () => {
    manageReload()
    const equipped = equippedWeapon()
    if (!equipped) return
    manageAim(equipped)
    manageShoot(equipped)
    manageFireAnimation()
    manageMobileAim(equipped)
}

const manageAim = equipped => {
    if (!getAimMode()) return
    aimCounter++
    if (aimCounter < useDeltaTime(6)) return
    aimCounter = 0
    setTargets([])
    const laser = findAttachmentsOnPlayer('gun')?.firstElementChild
    if (!laser) return
    laser.style.height = `${getGunDetail(equipped.name, 'range')}px`
    let blocked = false
    for (const component of laser.children) {
        component.style.visibility = blocked ? 'hidden' : 'visible'
        if (blocked) continue
        for (const solid of getCurrentRoomSolid()) {
            if (!collide(component, solid, 0)) continue
            if (!getTargets().includes(solid)) getTargets().push(solid)
            blocked = !containsClass(solid, 'enemy-collider')
            break
        }
    }
}

export const setupReload = () => {
    const equipped = equippedWeapon()
    if (isReloadDisabled() || getReloading()) return
    reloadCounter = 0
    reloadWeaponId = equipped.id
    setReloading(true)
    playReload(equipped)
    displayReloadPopup(equipped)
}

export const cancelReload = () => {
    if (!getReloading()) return
    setReloading(false)
    reloadCounter = 0
    reloadWeaponId = null
    reloadAnimation?.cancel()
    reloadAnimation = null
    const container = getPlayer()?.children[1]
    if (container) container.style.display = 'none'
}

const displayReloadPopup = equipped => {
    const container = getPlayer().children[1]
    container.style.display = 'block'
    const bar = container.firstElementChild
    reloadAnimation = bar.animate(
        [
            { width: '0%', backgroundColor: 'red' },
            { width: '100%', backgroundColor: 'green' },
        ],
        { duration: getGunDetail(equipped.name, 'reloadspeed') * 1000, fill: 'forwards', iterations: 1 },
    )
    setAnimatedElements([...getAnimatedElements(), reloadAnimation])
    reloadAnimation.addEventListener(
        'finish',
        () => {
            setAnimatedElements(getAnimatedElements().filter(animation => animation !== reloadAnimation))
            container.style.display = 'none'
            reloadAnimation = null
        },
        { once: true },
    )
}

export const isReloadDisabled = () => {
    const equipped = equippedWeapon()
    if (!equipped) return true
    return equipped.currmag >= getGunDetail(equipped.name, 'magazine') || getReserveAmmo(equipped) === 0
}

const manageReload = () => {
    if (!getReloading()) return
    if (getEquippedWeaponId() !== reloadWeaponId) {
        cancelReload()
        return
    }
    const equipped = equippedWeapon()
    reloadCounter++
    if (reloadCounter < getGunDetail(equipped.name, 'reloadspeed') * getSettings().display.fps) return
    const needed = getGunDetail(equipped.name, 'magazine') - equipped.currmag
    const loaded = consumeReserveAmmo(equipped.ammotype, needed)
    setWeaponMagazine(equipped, equipped.currmag + loaded)
    setReloading(false)
    reloadCounter = 0
    reloadWeaponId = null
    renderWeaponUi()
    getReloadButton()?.remove()
    renderReloadButton()
}

const manageShoot = equipped => {
    const requiredFrames = Math.max(1, getGunDetail(equipped.name, 'firerate') * getSettings().display.fps)
    setShootCounter(Math.min(requiredFrames, getShootCounter() + 1))
    setShooting(false)
    if (!getAimMode() || !getShootPressed() || getReloading() || getShootCounter() < requiredFrames) return
    setShooting(true)
    shoot(equipped)
    setShootCounter(0)
}

const shoot = equipped => {
    if (equipped.currmag <= 0) {
        playEmptyWeapon()
        if (getReserveAmmo(equipped) > 0) setupReload()
        return
    }
    playGunShot(equipped.name)
    setWeaponMagazine(equipped, equipped.currmag - 1)
    applyRecoil()
    addFireAnimation()
    notifyNearbyEnemies()
    managePenetration(equipped)
    renderWeaponUi()
}

const applyRecoil = () => {
    const body = getPlayer().firstElementChild.firstElementChild
    const current = getProperty(body, 'transform', 'rotateZ(', 'deg)')
    let angle = current + Math.random() * 7.5 - 3.75
    if (angle > 180) angle -= 360
    if (angle < -180) angle += 360
    setPlayerAimAngle(angle)
    manageAimModeAngle(getPlayer(), angle, getPlayerAngle, setPlayerAngle, setPlayerAngleState)
}

const addFireAnimation = () => {
    const fire = findAttachmentsOnPlayer('gun')?.lastElementChild
    if (!fire || Number(fire.getAttribute('time')) !== 0) return
    fire.style.display = 'block'
    fire.setAttribute('time', 1)
}

const manageFireAnimation = () => {
    const fire = findAttachmentsOnPlayer('gun')?.lastElementChild
    if (!fire) return
    const time = Number(fire.getAttribute('time'))
    if (!time) return
    if (time >= useDeltaTime(6)) {
        fire.setAttribute('time', 0)
        fire.style.display = 'none'
    } else fire.setAttribute('time', time + 1)
}

const notifyNearbyEnemies = () =>
    getCurrentRoomEnemies().forEach(enemy => {
        if (enemy.type !== TRACKER || getNoOffenseCounter() === 0)
            enemy.notificationService.notifyEnemy(enemy.type === TRACKER ? 2000 : 800)
    })

const managePenetration = equipped => {
    getTargets().forEach((target, index) => {
        const enemy = getCurrentRoomEnemies().find(item => item.sprite === target.parentElement)
        if (!enemy || enemy.health <= 0) return
        enemy.injuryService.damageEnemy(
            equipped.name,
            getGunDetail(equipped.name, 'damage') / 2 ** index,
            getGunDetail(equipped.name, 'knock') / 2 ** index,
        )
    })
}

export const throwBuiltIn = name => {
    if (getPause() || getGrabbed() || !consumeThrowable(name)) return false
    const sourceX = getPlayerX() - getRoomLeft() + 17
    const sourceY = getPlayerY() - getRoomTop() + 17
    const angle = getAimMode() ? getPlayerAimAngle() : getPlayerAngle()
    const radians = (angle * Math.PI) / 180
    const speed = getSpeedPerFrame(9)
    const throwable = createAndAddClass('div', 'throwable-item')
    const image = createAndAddClass('img', 'throwable-image')
    image.src = `./assets/images/${name}.png`
    image.alt = name
    throwable.style.left = `${sourceX}px`
    throwable.style.top = `${sourceY}px`
    throwable.append(image)
    appendAll(
        throwable,
        createAndAddClass('div', 'top-collider'),
        createAndAddClass('div', 'left-collider'),
        createAndAddClass('div', 'right-collider'),
        createAndAddClass('div', 'bottom-collider'),
    )
    addAllAttributes(
        throwable,
        'name',
        name,
        'speed-x',
        -Math.sin(radians) * speed,
        'speed-y',
        Math.cos(radians) * speed,
        'distance',
        0,
    )
    getCurrentRoomThrowables().push(throwable)
    getCurrentRoom().append(throwable)
    renderThrowableButtons()
    return true
}

const manageMobileAim = equipped => {
    if (!IS_MOBILE || !getAimMode()) return
    if (getIsSearching4Target()) findMostSuitableTarget(equipped)
    setPlayerAimAngle(getFoundTarget() ? getSuitableTargetAngle() : getAimJoystickAngle())
    setShootPressed(Boolean(getFoundTarget()))
}

const findMostSuitableTarget = equipped => {
    let closest = null
    let closestDistance = Number.MAX_SAFE_INTEGER
    getCurrentRoomEnemies().forEach(enemy => {
        if (enemy.health <= 0 || enemy.wallInTheWay !== false) return
        const targetDistance = distance(enemy.sprite, getPlayer())
        if (targetDistance > getGunDetail(equipped.name, 'range') || targetDistance >= closestDistance) return
        closest = enemy
        closestDistance = targetDistance
    })
    setFoundTarget(closest?.sprite ?? null)
    if (closest) setSuitableTargetAngle(closest.angleService.angle2Player() + 180)
}

export const getThrowableAmount = getThrowableCount
