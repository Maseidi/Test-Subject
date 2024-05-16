import { addAttribute } from "./util.js"

export const moveToDestination = (src, dest) => {
    const srcBound = src.getBoundingClientRect()
    const destBound = dest.getBoundingClientRect()
    let xMultiplier, yMultiplier
    if ( srcBound.left > destBound.right ) xMultiplier = -1
    else if ( srcBound.right < destBound.left ) xMultiplier = 1
    if ( srcBound.top > destBound.bottom ) yMultiplier = -1
    else if ( srcBound.bottom < destBound.top ) yMultiplier = 1
    let speed = Number(src.getAttribute("speed"))
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    const degree = calculateDegree(xMultiplier, yMultiplier)
    const currentX = Number(window.getComputedStyle(src).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(src).top.replace('px', ''))
    src.style.left = `${currentX + speed * xMultiplier}px`
    src.style.top = `${currentY + speed * yMultiplier}px`
    if ( degree === undefined ) return
    src.firstElementChild.firstElementChild.style.transform = `rotateZ(${degree}deg)`
    addAttribute(src, 'degree', degree)
}

const calculateDegree = (x, y) => {
    let degree
    if ( x === 1 && y === 1 )        degree = -45
    else if ( x === 1 && y === -1 )  degree = -135
    else if ( x === -1 && y === 1 )  degree = 45
    else if ( x === -1 && y === -1 ) degree = 135
    else if ( x === 1 && !y )        degree = -90
    else if ( x === -1 && !y )       degree = 90
    else if ( !x && y === 1 )        degree = 0
    else if ( !x && y === -1 )       degree = 180
    return degree
}