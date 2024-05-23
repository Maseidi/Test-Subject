import { addAttribute, collide } from "./util.js"
import { getCurrentRoomSolid, getMapEl, getPlayer } from "./elements.js"
import { getHealth, getMapX, getMapY, getPlayerX, getPlayerY, getRoomLeft, getRoomTop, setHealth, setMapX, setMapY, setNoOffenseCounter, setPlayerX, setPlayerY } from "./variables.js"
import { healthManager } from "./user-interface.js"
import { replaceForwardDetector } from "./player-angle.js"
import { isPlayerVisible } from "./enemy-vision.js"

export const torturerBehavior = (enemy) => {
    switch ( enemy.getAttribute('state') ) {
        case 'investigate':
            handleInvestigationMode(enemy)
            break                     
    }
}

const handleInvestigationMode = (enemy) => {
    isPlayerVisible(enemy)
    const counter = Number(enemy.getAttribute('investigation-counter'))
    if ( counter > 0 ) 
        addAttribute(enemy, 'investigation-counter', counter + 1)
    if ( counter >= 300 ) 
        addAttribute(enemy, 'investigation-counter', 0)
    if ( counter !== 0 ) return
    moveToDestination(enemy, document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))])
}

const moveToDestination = (src, dest) => {
    const srcBound = src.getBoundingClientRect()
    const destBound = dest.getBoundingClientRect()
    let xMultiplier, yMultiplier
    if ( srcBound.left > destBound.left + destBound.width / 2 ) xMultiplier = -1
    else if ( srcBound.right <= destBound.left + destBound.width / 2 ) xMultiplier = 1
    if ( srcBound.top > destBound.top + destBound.height / 2 ) yMultiplier = -1
    else if ( srcBound.bottom <= destBound.top + destBound.height / 2 ) yMultiplier = 1
    calculateAngle(src, xMultiplier, yMultiplier)
    let speed = Number(src.getAttribute("speed"))
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    if ( src.getAttribute('state') === 'investigate' ) {
        speed /= 5
        if ( !xMultiplier && !yMultiplier ) {
            const path = document.getElementById(src.getAttribute('path'))
            const numOfPoints = path.children.length
            const currentPathPoint = Number(src.getAttribute('path-point'))
            let nextPathPoint = currentPathPoint + 1
            if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
            addAttribute(src, 'path-point', nextPathPoint)
            addAttribute(src, 'investigation-counter', 1)
        }
    }
    const currentX = Number(window.getComputedStyle(src).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(src).top.replace('px', ''))
    src.style.left = `${currentX + speed * xMultiplier}px`
    src.style.top = `${currentY + speed * yMultiplier}px`
}

const calculateAngle = (src, x, y) => {
    let newState = Number(src.getAttribute('angle-state'))
    if ( x === 1 && y === 1 )        newState = changeEnemyAngleState(7, src, '100%', '0', '100%', '0')
    else if ( x === 1 && y === -1 )  newState = changeEnemyAngleState(5, src, '100%', '0', '0', '-100%')
    else if ( x === -1 && y === 1 )  newState = changeEnemyAngleState(1, src, '0', '-100%', '100%', '0')    
    else if ( x === -1 && y === -1 ) newState = changeEnemyAngleState(3, src, '0', '-100%', '0', '-100%')
    else if ( x === 1 && !y )        newState = changeEnemyAngleState(6, src, '100%', '0', '50%', '-50%')
    else if ( x === -1 && !y )       newState = changeEnemyAngleState(2, src, '0', '-100%', '50%', '-50%')
    else if ( !x && y === 1 )        newState = changeEnemyAngleState(0, src, '50%', '-50%', '100%', '0')
    else if ( !x && y === -1 )       newState = changeEnemyAngleState(4, src, '50%', '-50%', '0', '-100%')
    let diff = newState - Number(src.getAttribute('angle-state'))
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
    const newAngle = Number(src.getAttribute('angle')) + diff * 45    
    addAttribute(src, 'angle', newAngle)
    addAttribute(src, 'angle-state', newState)
    src.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const changeEnemyAngleState = (state, src, left, translateX, top, translateY) => {
    replaceEnemyVision(src, left, top, translateX, translateY)
    return state
}

const replaceEnemyVision = (src, left, top, translateX, translateY) => {
    const vision = src.firstElementChild.children[1]
    vision.style.left = left
    vision.style.top = top
    vision.style.transform = `translateX(${translateX}) translateY(${translateY})`
}

const moveToPlayer = (enemy) => {
    const next = createAndAddClass('div', 'dest')
    next.style.left = `${enemy.getAttribute('player-x')}px`
    next.style.top = `${enemy.getAttribute('player-y')}px`
    getCurrentRoom().append(next)
    moveToDestination(enemy, next)
    next.remove()
}

const updateDestination = (enemy) => {
    addAttribute(enemy, 'player-x', Math.floor(getPlayerX() - getRoomLeft()))
    addAttribute(enemy, 'player-y', Math.floor(getPlayerY() - getRoomTop()))
}

const manageReached = (enemy) => {
    if ( collide(enemy, getPlayer(), 0) ) hitPlayer(enemy)
}

const hitPlayer = (enemy) => {
    let newHealth = getHealth() - Number(enemy.getAttribute('damage'))
    newHealth = newHealth < 0 ? 0 : newHealth
    setHealth(newHealth)
    healthManager(getHealth())
    knockPlayer(enemy)
    setNoOffenseCounter(1)
}

const knockPlayer = (enemy) => {
    const knock = Number(enemy.getAttribute('knock'))
    const angle = Number(enemy.getAttribute('angle-state'))
    let xAxis, yAxis
    switch ( angle ) {
        case 0:
            xAxis = 0
            yAxis = -1
            replaceForwardDetector('calc(50% - 2px)', '100%')
            break
        case 1:
        case 2:
        case 3:
            xAxis = 1
            yAxis = 0
            replaceForwardDetector('-4px', 'calc(50% - 2px)')
            break
        case 4:
            xAxis = 0
            yAxis = 1
            replaceForwardDetector('calc(50% - 2px)', '-4px')
            break
        case 5:
        case 6:
        case 7:
            xAxis = -1
            yAxis = 0
            replaceForwardDetector('100%', 'calc(50% - 2px)')
            break                
    }
    if ( xAxis === undefined && yAxis === undefined ) return
    if ( getCurrentRoomSolid().find(x => collide(x, getPlayer().firstElementChild.lastElementChild, 12)) !== undefined ) return
    setMapX(xAxis * knock + getMapX())
    setMapY(yAxis * knock + getMapY())
    setPlayerX(-xAxis * knock + getPlayerX())
    setPlayerY(-yAxis * knock + getPlayerY())
    getMapEl().style.left = `${getMapX()}px`
    getMapEl().style.top = `${getMapY()}px`
    getPlayer().style.left = `${getPlayerX()}px`
    getPlayer().style.top = `${getPlayerY()}px`
}