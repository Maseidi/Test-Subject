import { addAttribute } from "./util.js"

export const findPath = (enemy, player) => aStar(enemy, player, [])

const aStar = (enemy, player, path) => {
    return ['tracker-7']
}

export const moveToDestination = (src, dest) => {
    const srcBound = src.getBoundingClientRect()
    const destBound = dest.getBoundingClientRect()
    let xMultiplier, yMultiplier
    if ( srcBound.left > destBound.right - srcBound.width / 2 ) xMultiplier = -1
    else if ( srcBound.right < destBound.left + srcBound.width / 2 ) xMultiplier = 1
    if ( srcBound.top > destBound.bottom - srcBound.height / 2 ) yMultiplier = -1
    else if ( srcBound.bottom < destBound.top + srcBound.height / 2 ) yMultiplier = 1
    let speed = Number(src.getAttribute("speed"))
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    const currentX = Number(window.getComputedStyle(src).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(src).top.replace('px', ''))
    src.style.left = `${currentX + speed * xMultiplier}px`
    src.style.top = `${currentY + speed * yMultiplier}px`
    calculateDegree(src, xMultiplier, yMultiplier)
}

const calculateDegree = (src, x, y) => {
    let newState = Number(src.getAttribute('state'))
    if ( x === 1 && y === 1 )        newState = 7
    else if ( x === 1 && y === -1 )  newState = 5
    else if ( x === -1 && y === 1 )  newState = 1
    else if ( x === -1 && y === -1 ) newState = 3
    else if ( x === 1 && !y )        newState = 6
    else if ( x === -1 && !y )       newState = 2
    else if ( !x && y === 1 )        newState = 0
    else if ( !x && y === -1 )       newState = 4
    let diff = newState - Number(src.getAttribute('state'))
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
    const newAngle = Number(src.getAttribute('angle')) + diff * 45    
    addAttribute(src, 'angle', newAngle)
    addAttribute(src, 'state', newState)
    src.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}