import { getCurrentRoom, getCurrentRoomExplosions, getMapEl, getPlayer } from './elements.js'
import { getWeaponDetail, getWeaponUpgradableDetail } from './weapon-details.js'
import { getThrowableDetail, isThrowable } from './throwable-details.js'
import { 
    getDownPressed,
    getEntityId,
    getHealth,
    getLeftPressed,
    getRightPressed,
    getThrowCounter,
    getUpPressed,
    setEntityId } from './variables.js'

export const collide = (first, second, offset) => {
    const firstBound = first.getBoundingClientRect()
    const secondBound = second.getBoundingClientRect()
    return firstBound.bottom > secondBound.top - offset &&
        firstBound.right > secondBound.left - offset &&
        firstBound.top < secondBound.bottom + offset &&
        firstBound.left < secondBound.right + offset
}

export const angleOf2Points = (x1, y1, x2, y2) => {
    let sign2 = x1 > x2 ? 1 : -1
    let sign1 = y1 > y2 ? sign2 : -sign2
    return angleFormula(sign1, sign2, x1, y1, x2, y2)
}

const angleFormula = (s1, s2, x1, y1, x2, y2) => {
    let x3 = x1
    let y3 = y2
    let AB = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)  //AB = sqrt((Ax - Bx)^2 + (Ay - By)^2)
    let CB = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2)  //CB = sqrt((Cx - Bx)^2 + (Cy - By)^2)
    let AC = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2)  //AC = sqrt((Ax - Cx)^2 + (Ay - Cy)^2)

    //A^C = arccos((AB^2 + CB^2 - AC^2) / (2 * AB * CB))
    return (s1 * Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI + s2 * 90 
}

export const addClass = (elem, className) => elem.classList.add(className)

export const removeClass = (elem, className) => elem.classList.remove(className)

export const containsClass = (elem, className) => elem?.classList?.contains(className)

export const appendAll = (root, ...elems) => elems.forEach(elem => root.append(elem))

export const isMoving = () => getUpPressed() || getDownPressed() || getLeftPressed() || getRightPressed()

export const addAllAttributes = (elem, ...attrs) => {
    for ( let i = 0; i < attrs.length; i += 2 ) elem.setAttribute(attrs[i], attrs[i+1])
}

export const isNullOrUndefined = (input) => input === null || input === undefined

export const object2Element = (obj) => {
    if ( isNullOrUndefined(obj) ) return document.createElement('div')
    const props = Object.getOwnPropertyNames(obj)
    const elem = document.createElement('div')
    props.filter(prop => !isNullOrUndefined(obj[prop])).forEach(prop => elem.setAttribute(prop, obj[prop]))
    return elem
}

export const element2Object = (elem) => {
    const attrs = elem.attributes
    let obj = {}
    for (const attr of attrs) {
        const name = attr.name
        const attrValue = elem.getAttribute(name)
        if ( name === 'style' || name === 'class' ) continue
        obj = {
            ...obj,
            [name] : isNaN(Number(attrValue)) ? (
                attrValue === 'true' ? true : (
                    attrValue === 'false' ? false : (
                        attrValue
                    )
                )
            ) : Number(attrValue)
        }
    }
    return obj
}

export const createAndAddClass = (type, ...classNames) => {
    const elem = document.createElement(type)
    classNames.forEach((className) => addClass(elem, className))
    return elem
}

export const distance = (x1, y1, x2, y2) =>  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

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
    [-45, 7]
])    

export const nextId = () => {
    const newId = getEntityId()
    setEntityId(getEntityId() + 1)
    return newId
}

export const calculateBulletSpeed = (deg, slope, diffX, diffY, baseSpeed) => {
    let speedX
    let speedY
    if ( (deg < 45 && deg >= 0) || (deg < -135 && deg >= -180) ) {
        speedX = diffX < 0 ? baseSpeed * (1 / slope) : -baseSpeed * (1/ slope)
        speedY = diffY < 0 ? baseSpeed : -baseSpeed
    } else if ( (deg >= 135 && deg < 180) || (deg < 0 && deg >= -45) ) {
        speedX = diffX < 0 ? -baseSpeed * (1 / slope) : baseSpeed * (1/ slope)
        speedY = diffY < 0 ? -baseSpeed : baseSpeed
    } else if ( (deg >= 45 && deg < 90) || (deg < -90 && deg >= -135) ) {
        speedX = diffX < 0 ? baseSpeed : -baseSpeed
        speedY = diffY < 0 ? baseSpeed * slope : -baseSpeed * slope
    } else if ( (deg >= 90 && deg < 135) || (deg < -45 && deg >= -90) ) {
        speedX = diffX < 0 ? -baseSpeed : baseSpeed
        speedY = diffY < 0 ? -baseSpeed * slope : baseSpeed * slope
    }
    return { speedX, speedY }
}

export const addFireEffect = () => {
    const fire = document.createElement('img')
    addClass(fire, 'fire')
    fire.src = `../assets/images/fire.gif`
    return fire
}

export const getProperty = (elem, property, ...toRemoveList) => {
    let res = property === 'transform' ? 
        elem.style.transform : toRemoveList.includes('%') ? 
            elem.style[property] : window.getComputedStyle(elem)[property]

    toRemoveList.forEach(remove => {
        res = res.replace(remove, '')
    })
    return Number(res)
}

export const getEquippedItemDetail = (equipped, detail) =>  
    isThrowable(equipped?.name) ? 
    getThrowableDetail(equipped.name, detail) : 
    ['damage', 'range', 'firerate', 'reloadspeed', 'magazine'].includes(detail) ?
    getWeaponUpgradableDetail(equipped.name, detail, equipped[detail+'lvl']) :
    getWeaponDetail(equipped?.name, detail)

export const isThrowing = () => getThrowCounter() > 0

export const findAttachmentsOnPlayer = (...attachments) => 
    Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => attachments.reduce((a, b) => a || containsClass(child, b), false))
        
export const addExplosion = (left, top) => {
    const explosion = createAndAddClass('div', 'explosion')
    const explosionImage = createAndAddClass('img', 'explosion-img')
    explosionImage.src = `/assets/images/explosion.png`
    explosion.style.left = `${left}px`
    explosion.style.top = `${top}px`
    explosion.setAttribute('time', 0)
    explosion.append(explosionImage)
    getCurrentRoom().append(explosion)
    addClass(getMapEl(), 'explosion-shake')
    setTimeout(() => removeClass(getMapEl(), 'explosion-shake'), 300)
    getCurrentRoomExplosions().push(explosion)
}