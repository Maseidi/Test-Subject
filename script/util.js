import {
    getCurrentRoom,
    getCurrentRoomExplosions,
    getMapEl,
    getPlayer,
    getShadowContainer,
} from './elements.js'
import { removeWeapon } from './gun-loader.js'
import { getSettings } from './settings.js'
import { playExplosion } from './sound-manager.js'
import {
    getDownPressed,
    getHealth,
    getLeftPressed,
    getPlayerX,
    getPlayerY,
    getMaxHealth,
    getRightPressed,
    getRoomLeft,
    getRoomTop,
    getUpPressed,
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
    if (x1 === x2 && y1 === y2) return 0
    return (Math.atan2(x1 - x2, y2 - y1) * 180) / Math.PI
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

export const isLowHealth = () => getHealth() <= getMaxHealth() * 0.2

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

export const addFireEffect = () => {
    const fire = document.createElement('img')
    addClass(fire, 'fire')
    fire.src = `./assets/images/fire.webp`
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

// Throwables no longer put the player into a dedicated throw animation/state.
export const isThrowing = () => false

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
}

export const renderShadow = brightness => {
    const shadow = getShadowContainer().firstElementChild
    shadow.style.background = brightness >= 100
        ? 'transparent'
        : `radial-gradient(circle at center,transparent,black ${brightness * 10}px)`
}

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

export const renderErrorMessage = text => {
    if (getPlayer().children[2]) getPlayer().children[2].remove()
    const message = createAndAddClass('p', 'error-message', 'animation')
    message.textContent = text
    getPlayer().append(message)
}
