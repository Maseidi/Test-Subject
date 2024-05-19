import { getCurrentRoom } from "./elements.js"
import { addAttribute, createAndAddClass } from "./util.js"

export const moveToPlayer = (enemy) => {
    const next = createAndAddClass('div', 'dest')
    next.style.left = `${enemy.getAttribute('player-x')}px`
    next.style.top = `${enemy.getAttribute('player-y')}px`
    getCurrentRoom().append(next)
    moveToDestination(enemy, next)
    next.remove()
}

const moveToDestination = (src, dest) => {
    const srcBound = src.getBoundingClientRect()
    const destBound = dest.getBoundingClientRect()
    let xMultiplier, yMultiplier
    if ( srcBound.left > destBound.left + destBound.width / 2 ) xMultiplier = -1
    else if ( srcBound.right <= destBound.left + destBound.width / 2 ) xMultiplier = 1
    if ( srcBound.top > destBound.top + destBound.height / 2 ) yMultiplier = -1
    else if ( srcBound.bottom <= destBound.top + destBound.height / 2 ) yMultiplier = 1
    if ( !xMultiplier && !yMultiplier ) addAttribute(src, 'state', 'reached')
    calculateAngle(src, xMultiplier, yMultiplier)
    let speed = Number(src.getAttribute("speed"))
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    const currentX = Number(window.getComputedStyle(src).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(src).top.replace('px', ''))
    src.style.left = `${currentX + speed * xMultiplier}px`
    src.style.top = `${currentY + speed * yMultiplier}px`
}

const calculateAngle = (src, x, y) => {
    let newState = Number(src.getAttribute('angle-state'))
    if ( x === 1 && y === 1 )        newState = changeEnemyState(7, src, '100%', '0', '100%', '0')
    else if ( x === 1 && y === -1 )  newState = changeEnemyState(5, src, '100%', '0', '0', '-100%')
    else if ( x === -1 && y === 1 )  newState = changeEnemyState(1, src, '0', '-100%', '100%', '0')    
    else if ( x === -1 && y === -1 ) newState = changeEnemyState(3, src, '0', '-100%', '0', '-100%')
    else if ( x === 1 && !y )        newState = changeEnemyState(6, src, '100%', '0', '50%', '-50%')
    else if ( x === -1 && !y )       newState = changeEnemyState(2, src, '0', '-100%', '50%', '-50%')
    else if ( !x && y === 1 )        newState = changeEnemyState(0, src, '50%', '-50%', '100%', '0')
    else if ( !x && y === -1 )       newState = changeEnemyState(4, src, '50%', '-50%', '0', '-100%')
    let diff = newState - Number(src.getAttribute('angle-state'))
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
    const newAngle = Number(src.getAttribute('angle')) + diff * 45    
    addAttribute(src, 'angle', newAngle)
    addAttribute(src, 'angle-state', newState)
    src.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const changeEnemyState = (state, src, left, translateX, top, translateY) => {
    replaceEnemyForwardDetector(src, left, top, translateX, translateY)
    replaceEnemyVision(src, left, top, translateX, translateY)
    return state
}

const replaceEnemyForwardDetector = (src, left, top, translateX, translateY) => {
    const forwardDetector = src.firstElementChild.lastElementChild
    forwardDetector.style.left = left
    forwardDetector.style.top = top
    forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
}

const replaceEnemyVision = (src, left, top, translateX, translateY) => {
    const vision = src.firstElementChild.children[1]
    vision.style.left = left
    vision.style.top = top
    vision.style.transform = `translateX(${translateX}) translateY(${translateY})`
}