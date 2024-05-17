import { getCurrentRoomSolid, getCurrentRoomTrackers } from "./elements.js"
import { addAttribute, distance } from "./util.js"

export const findNextBestMove = (enemy, player) => {
    const validTrackers = findValidTrackers(enemy, player)
    const nextMove = findBestHeuristic(validTrackers, enemy, player)
    return nextMove.getAttribute('id')
}

const findValidTrackers = (enemy, player) => {
    const enemyBound = enemy.getBoundingClientRect()
    const solidArray = getCurrentRoomSolid().filter(solid => solid.getAttribute('side') === 'false')
    const trackersCopy = getCurrentRoomTrackers().map(elem => elem)
    trackersCopy.push(player)
    return trackersCopy.filter(tracker => {
        const trackerBound = tracker.getBoundingClientRect()
        if ( trackerBound.bottom <= enemyBound.top && trackerBound.left >= enemyBound.right ) {
            for ( let i = 0; i < solidArray.length; i++ ) {
                const solidBound = solidArray[i].getBoundingClientRect()
                if (solidBound.top < enemyBound.top && 
                    solidBound.left > enemyBound.right && 
                    solidBound.right < trackerBound.left && 
                    solidBound.bottom > trackerBound.bottom ) return false
            }
            return true
        } else if ( trackerBound.bottom <= enemyBound.top && trackerBound.right < enemyBound.left ) {
            for ( let i = 0; i < solidArray.length; i++ ) {
                const solidBound = solidArray[i].getBoundingClientRect()
                if (solidBound.top < enemyBound.top && 
                    solidBound.right < enemyBound.left && 
                    solidBound.left > trackerBound.right && 
                    solidBound.bottom > trackerBound.bottom ) return false
            }
            return true
        } else if ( trackerBound.top > enemyBound.bottom && trackerBound.left >= enemyBound.right ) {
            for ( let i = 0; i < solidArray.length; i++ ) {
                const solidBound = solidArray[i].getBoundingClientRect()
                if (solidBound.bottom > enemyBound.bottom && 
                    solidBound.left > enemyBound.right && 
                    solidBound.right < trackerBound.left && 
                    solidBound.top < trackerBound.top ) return false
            }
            return true
        } else if ( trackerBound.top > enemyBound.bottom && trackerBound.right < enemyBound.left ) {
            for ( let i = 0; i < solidArray.length; i++ ) {
                const solidBound = solidArray[i].getBoundingClientRect()
                if (solidBound.bottom > enemyBound.bottom && 
                    solidBound.right < enemyBound.left && 
                    solidBound.left > trackerBound.right &&
                    solidBound.top < trackerBound.top ) return false
            }
            return true
        }
    })
}

const findBestHeuristic = (validTrackers, enemy, player) => {
    const next = validTrackers.sort((a, b) => heuristic(a, enemy, player) - heuristic(b, enemy, player))
    return next.includes(player) ? player : next[0]
}

const heuristic = (input, enemy, player) => {
    const enemyDistance = distance(input, enemy)
    const playerDistance = distance(input, player)
    return enemyDistance + playerDistance
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