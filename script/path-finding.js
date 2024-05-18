import { addAttribute } from "./util.js"

export const moveToDestination = (src, dest) => {
    const srcBound = src.getBoundingClientRect()
    const destBound = dest.getBoundingClientRect()
    let xMultiplier, yMultiplier
    if ( srcBound.left > destBound.right ) xMultiplier = -1
    else if ( srcBound.right < destBound.left ) xMultiplier = 1
    if ( srcBound.top > destBound.bottom ) yMultiplier = -1
    else if ( srcBound.bottom < destBound.top ) yMultiplier = 1
    calculateAngle(src, xMultiplier, yMultiplier)
    let speed = Number(src.getAttribute("speed"))
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    const currentX = Number(window.getComputedStyle(src).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(src).top.replace('px', ''))
    src.style.left = `${currentX + speed * xMultiplier}px`
    src.style.top = `${currentY + speed * yMultiplier}px`
}

const calculateAngle = (src, x, y) => {
    let newState = Number(src.getAttribute('state'))
    if ( x === 1 && y === 1 )        newState = changeEnemyState(7, src, '100%', 'calc(100% + 4px)')
    else if ( x === 1 && y === -1 )  newState = changeEnemyState(5, src, '100%', '-4px')
    else if ( x === -1 && y === 1 )  newState = changeEnemyState(1, src, '-4px', 'calc(100% + 4px)')
    else if ( x === -1 && y === -1 ) newState = changeEnemyState(3, src, '-4px', '-4px')
    else if ( x === 1 && !y )        newState = changeEnemyState(6, src, '100%', 'calc(50% - 2px)')
    else if ( x === -1 && !y )       newState = changeEnemyState(2, src, '-4px', 'calc(50% - 2px)')
    else if ( !x && y === 1 )        newState = changeEnemyState(0, src, 'calc(50% - 2px)', '100%')
    else if ( !x && y === -1 )       newState = changeEnemyState(4, src, 'calc(50% - 2px)', '-4px')
    let diff = newState - Number(src.getAttribute('state'))
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
    const newAngle = Number(src.getAttribute('angle')) + diff * 45    
    addAttribute(src, 'angle', newAngle)
    addAttribute(src, 'state', newState)
    src.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const changeEnemyState = (state, src, left, top) => {
    replaceEnemyForwardDetector(src, left, top)
    return state
}

const replaceEnemyForwardDetector = (src, left, top) => {
    const forwardDetector = src.firstElementChild.lastElementChild
    forwardDetector.style.left = left
    forwardDetector.style.top = top
}