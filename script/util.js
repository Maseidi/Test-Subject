import {
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomExplosions,
    getMapEl,
    getPlayer,
    getShadowContainer,
} from './elements.js'
import { getGunDetail, getGunUpgradableDetail } from './gun-details.js'
import { removeWeapon } from './gun-loader.js'
import { ADRENALINE, ENERGY_DRINK, HEALTH_POTION, LUCK_PILLS } from './loot.js'
import { getSettings } from './settings.js'
import { playExplosion } from './sound-manager.js'
import { getThrowableDetail, isThrowable } from './throwable-details.js'
import { removeThrowable } from './throwable-loader.js'
import {
    getDownPressed,
    getEntityId,
    getHealth,
    getLeftPressed,
    getPlayerX,
    getPlayerY,
    getPlayingDialogue,
    getReloading,
    getRightPressed,
    getRoomLeft,
    getRoomTop,
    getThrowCounter,
    getUpPressed,
    setEntityId,
} from './variables.js'

export const collide = (first, second, offset) => {
    const firstBound = first.getBoundingClientRect()
    const secondBound = second.getBoundingClientRect()
    return (
        firstBound.bottom > secondBound.top - offset &&
        firstBound.right > secondBound.left - offset &&
        firstBound.top < secondBound.bottom + offset &&
        firstBound.left < secondBound.right + offset
    )
}

export const angleOf2Points = (x1, y1, x2, y2) => {
    let sign2 = x1 > x2 ? 1 : -1
    let sign1 = y1 > y2 ? sign2 : -sign2
    return angleFormula(sign1, sign2, x1, y1, x2, y2)
}

const angleFormula = (s1, s2, x1, y1, x2, y2) => {
    let x3 = x1
    let y3 = y2
    let AB = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) //AB = sqrt((Ax - Bx)^2 + (Ay - By)^2)
    let CB = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2) //CB = sqrt((Cx - Bx)^2 + (Cy - By)^2)
    let AC = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2) //AC = sqrt((Ax - Cx)^2 + (Ay - Cy)^2)

    //A^C = arccos((AB^2 + CB^2 - AC^2) / (2 * AB * CB))
    return (s1 * Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI + s2 * 90
}

export const addClass = (elem, className) => elem.classList.add(className)

export const removeClass = (elem, className) => elem.classList.remove(className)

export const addAllClasses = (root, ...classNames) => classNames.forEach(className => addClass(root, className))

export const removeAllClasses = (root, ...classNames) => classNames.forEach(className => removeClass(root, className))

export const containsClass = (elem, className) => elem?.classList?.contains(className)

export const appendAll = (root, ...elems) => elems.forEach(elem => root.append(elem))

export const isMoving = () => getUpPressed() || getDownPressed() || getLeftPressed() || getRightPressed()

export const addAllAttributes = (elem, ...attrs) => {
    for (let i = 0; i < attrs.length; i += 2) elem.setAttribute(attrs[i], attrs[i + 1])
}

export const object2Element = obj => {
    if (obj == null) return document.createElement('div')
    const props = Object.getOwnPropertyNames(obj)
    const elem = document.createElement('div')
    props.filter(prop => obj[prop] != null).forEach(prop => elem.setAttribute(prop, obj[prop]))
    return elem
}

export const element2Object = elem => {
    const attrs = elem.attributes
    let obj = {}
    for (const attr of attrs) {
        const name = attr.name
        const attrValue = elem.getAttribute(name)
        if (name === 'style' || name === 'class') continue
        obj = {
            ...obj,
            [name]: isNaN(Number(attrValue))
                ? attrValue === 'true'
                    ? true
                    : attrValue === 'false'
                    ? false
                    : attrValue
                : Number(attrValue),
        }
    }
    return obj
}

export const createAndAddClass = (type, ...classNames) => {
    const elem = document.createElement(type)
    classNames.forEach(className => addClass(elem, className))
    return elem
}

export const distance = (first, second) => {
    const { x: x1, y: y1, width: w1, height: h1 } = first.getBoundingClientRect()
    const { x: x2, y: y2, width: w2, height: h2 } = second.getBoundingClientRect()
    return distanceFormula(x1 + w1 / 2, y1 + h1 / 2, x2 + w2 / 2, y2 + h2 / 2)
}

export const distanceFormula = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

export const isLowHealth = () => getHealth() <= 20

export const ANGLE_STATE_MAP = new Map([
    [0, 0],
    [45, 1],
    [90, 2],
    [135, 3],
    [180, 4],
    [-180, 4],
    [-135, 5],
    [-90, 6],
    [-45, 7],
])

export const nextId = () => {
    const newId = getEntityId()
    setEntityId(getEntityId() + 1)
    return newId
}

export const calculateBulletSpeed = (deg, slope, diffX, diffY, baseSpeed) => {
    const diffxSpeed = Math.sign(diffX) * baseSpeed
    const diffySpeed = Math.sign(diffY) * baseSpeed

    if ((deg < 45 && deg >= 0) || (deg < -135 && deg >= -180)) {
        var speedX = -diffxSpeed * (1 / slope)
        var speedY = -diffySpeed
    } else if ((deg >= 135 && deg < 180) || (deg < 0 && deg >= -45)) {
        var speedX = diffxSpeed * (1 / slope)
        var speedY = diffySpeed
    } else if ((deg >= 45 && deg < 90) || (deg < -90 && deg >= -135)) {
        var speedX = -diffxSpeed
        var speedY = -diffySpeed * slope
    } else if ((deg >= 90 && deg < 135) || (deg < -45 && deg >= -90)) {
        var speedX = diffxSpeed
        var speedY = diffySpeed * slope
    }
    return { speedX, speedY }
}

export const addFireEffect = () => {
    const fire = document.createElement('img')
    addClass(fire, 'fire')
    fire.src = `./assets/images/fire.gif`
    fire.setAttribute('draggable', false)
    return fire
}

export const getProperty = (elem, property, ...toRemoveList) => {
    let res =
        property === 'transform'
            ? elem.style.transform
            : toRemoveList.includes('%')
            ? elem.style[property]
            : window.getComputedStyle(elem)[property]

    toRemoveList.forEach(remove => {
        res = res.replace(remove, '')
    })
    return Number(res)
}

export const getEquippedItemDetail = (equipped, detail) => {
    if (isThrowable(equipped?.name)) return getThrowableDetail(equipped.name, detail)

    if (['damage', 'range', 'firerate', 'reloadspeed', 'magazine'].includes(detail))
        return getGunUpgradableDetail(equipped.name, detail, equipped[detail + 'lvl'])

    return getGunDetail(equipped?.name, detail)
}

export const isThrowing = () => getThrowCounter() > 0

export const findAttachmentsOnPlayer = (...attachments) =>
    Array.from(getPlayer().firstElementChild.firstElementChild.children).find(child =>
        attachments.reduce((a, b) => a || containsClass(child, b), false),
    )

export const addExplosion = (left, top) => {
    const explosion = createAndAddClass('div', 'explosion')
    const explosionImage = createAndAddClass('img', 'explosion-img')
    explosionImage.src = `./assets/images/explosion.png`
    explosion.style.left = `${left}px`
    explosion.style.top = `${top}px`
    explosion.setAttribute('time', 0)
    explosion.append(explosionImage)
    playExplosion()
    getCurrentRoom().append(explosion)
    addAllClasses(getMapEl(), 'explosion-shake', 'animation')
    getMapEl().addEventListener('animationend', () => removeAllClasses(getMapEl(), 'explosion-shake', 'animation'))
    getCurrentRoomExplosions().push(explosion)
}

export const exitAimModeAnimation = () => {
    removeClass(getPlayer(), 'aim')
    removeClass(getPlayer(), 'throwable-aim')
}

export const removeEquipped = () => {
    removeWeapon()
    removeThrowable()
}

export const isStatUpgrader = item => [ADRENALINE, HEALTH_POTION, ENERGY_DRINK, LUCK_PILLS].includes(item.name)

export const renderShadow = brightness => {
    if (brightness === 100) return
    else
        getShadowContainer().firstElementChild.style.background = `radial-gradient(circle at center,transparent,black ${
            brightness * 10
        }px)`
}

export const difficulties = {
    MILD: 'mild',
    MIDDLE: 'middle',
    SURVIVAL: 'survival',
}

export const isAble2Interact = () =>
    !getPlayingDialogue() && !getCurrentRoomEnemies().find(enemy => enemy.health !== 0) && !getReloading()

export const getDifficultyList = difficulty => {
    if (difficulty === difficulties.MILD) return [difficulties.MILD, difficulties.MIDDLE, difficulties.SURVIVAL]
    else if (difficulty === difficulties.MIDDLE) return [difficulties.MIDDLE, difficulties.SURVIVAL]
    else return [difficulties.SURVIVAL]
}

export const getMapWithArrayValuesByKey = (map, key) => map.get(key) || []

export const addSplatter = () => {
    const splatter = createAndAddClass('img', 'splatter', 'fade-out', 'animation')
    splatter.src = `./assets/images/splatter.png`
    splatter.setAttribute('draggable', false)
    splatter.style.left = `${getPlayerX() - getRoomLeft() + 17}px`
    splatter.style.top = `${getPlayerY() - getRoomTop() + 17}px`
    getCurrentRoom().append(splatter)
    splatter.style.animationDuration = `10s`
    splatter.addEventListener('animationend', () => splatter.remove())
}

export const getSpeedPerFrame = speed => (speed * 60) / getSettings().display.fps

export const useDeltaTime = time => Math.floor((time / 60) * getSettings().display.fps)
