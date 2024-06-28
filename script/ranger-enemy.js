import { findPath } from "./enemy-path-finding.js"
import { isPlayerVisible } from "./enemy-vision.js"
import { getNoOffenseCounter } from "./variables.js"
import { getCurrentRoomSolid, getPlayer } from "./elements.js"
import { 
    calculateAngle,
    moveToDestination,
    updateDestinationToPlayer,
    updateDestinationToPath,
    notifyEnemy, 
    accelerateEnemy,
    getEnemyState} from "./enemy-actions.js" 
import { 
    ANGLE_STATE_MAP,
    addAttribute,
    addClass,
    angleOfTwoPoints,
    collide,
    containsClass,
    createAndAddClass,
    distance,
    removeClass } from "./util.js"    
import { 
    CAMP,
    CHASE,
    GO_FOR_MELEE,
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MAKE_DECISION,
    MOVE_TO_POSITION,
    NO_OFFENCE } from "./enemy-state.js"


let angle
let range
export const rangerEnemyBehavior = (enemy) => {
    const body = enemy.firstElementChild.firstElementChild
    angle = angleToPlayer(enemy)
    defineRange(enemy)
    range = Number(enemy.getAttribute('range'))
    renderEnemyLaser(enemy)
    removeClass(body, 'no-transition')
    switch ( getEnemyState(enemy) ) {
        case INVESTIGATE:
            handleInvestigationState(enemy)
            break
        case CHASE:
        case NO_OFFENCE:
            handleChaseState(enemy)
            break
        case MAKE_DECISION:
            addClass(body, 'no-transition')
            handleMakeDecisionState(enemy)
            break
        case GO_FOR_RANGED:
            handleGoForRangedState(enemy)
            break    
        case GUESS_SEARCH:
            handleGuessSearchState(enemy)
            break    
        case LOST:
            handleLostState(enemy)
            break
        case MOVE_TO_POSITION:
            handleMoveToPositionState(enemy)
            break
    }
}

const defineRange = (enemy) => {
    if ( enemy.getAttribute('range') ) return
    addAttribute(enemy, 'range', Math.floor(300 + Math.random() * 500))
}

const angleToPlayer = (enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    return angleOfTwoPoints(enemyBound.x + enemyBound.width / 2, enemyBound.y + enemyBound.height / 2, 
                            playerBound.x + playerBound.width / 2, playerBound.y + playerBound.height / 2)
}

const handleInvestigationState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const path = document.getElementById(enemy.getAttribute('path'))
    const counter = Number(enemy.getAttribute('investigation-counter'))
    if ( counter > 0 ) addAttribute(enemy, 'investigation-counter', counter + 1)
    if ( counter && counter !== 300 && counter % 100 === 0 ) checkSuroundings(enemy)
    if ( counter >= 300 ) addAttribute(enemy, 'investigation-counter', 0)
    if ( counter !== 0 ) return
    if ( path.children.length === 1 ) checkSuroundings(enemy)
    const dest = path.children[Number(enemy.getAttribute('path-point'))]
    updateDestinationToPath(enemy, dest)
    displaceEnemy(enemy)
}

const handleChaseState = (enemy) => {  
    accelerateEnemy(enemy)
    if ( switchToDecisionMakingState(enemy) ) return
    if ( isPlayerVisible(enemy) ) notifyEnemy(Number.MAX_SAFE_INTEGER, enemy)
    else {
        addAttribute(enemy, 'state', GUESS_SEARCH)
        addAttribute(enemy, 'guess-counter', 1)
    }
    displaceEnemy(enemy)
}

const switchToDecisionMakingState = (enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    wallsInTheWay(enemy)
    if ( distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y) < range * (2 / 3) && 
         enemy.getAttribute('wall-in-the-way') === 'false' ) {
        addAttribute(enemy, 'state', MAKE_DECISION)
        return true
    }
    return false
}

const renderEnemyLaser = (enemy) => {
    const collider = enemy.firstElementChild
    if ( containsClass(collider.lastElementChild, 'ranger-laser') ) {
        const laser = collider.lastElementChild
        laser.style.transform = `rotateZ(${angle}deg)`
        return
    }
    const laser = createAndAddClass('div', 'ranger-laser')
    laser.style.height = `${range}px`
    for ( let i = 0; i < 100; i++ ) {
        const laserComponent = document.createElement('div')
        laser.append(laserComponent)
    }
    collider.append(laser)
}

const manageAimAngle = (enemy) => {
    addAttribute(enemy, 'aim-angle', angle)
    enemy.firstElementChild.firstElementChild.style.transform = `rotateZ(${angle}deg)`
    handleBreakpoints(enemy)
}

const handleBreakpoints = (enemy) => {
    const aimAngle = Number(enemy.getAttribute('aim-angle')) 
    const angle = Number(enemy.getAttribute('angle'))
    const sign = aimAngle < 0 ? -1 : 1
    const q = aimAngle / (sign * 45)
    if ( (q - Math.floor(q)) < 0.5 ) addAttribute(enemy, 'angle', sign * Math.floor(q) * 45)
    else addAttribute(enemy, 'angle', sign * (Math.floor(q) + 1) * 45)
    addAttribute(enemy, 'angle-state', ANGLE_STATE_MAP.get(angle))
}

const handleMakeDecisionState = (enemy) => {
    wallsInTheWay(enemy)
    if ( enemy.getAttribute('wall-in-the-way') === 'true' ) return
    updateDestinationToPlayer(enemy)
    manageAimAngle(enemy)
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    const dist = distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y)
    if ( dist > range ) {
        if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', CHASE)
        else addAttribute(enemy, 'state', NO_OFFENCE)
        return
    } else if ( dist < range / 3 ) {
        addAttribute(enemy, 'state', GO_FOR_MELEE)
        return
    }
    decideAttack(enemy)
}

const decideAttack = (enemy) => {
    let decisionTimer = Number(enemy.getAttribute('decision-timer')) || 1
    decisionTimer++
    if ( decisionTimer === 30 ) decisionTimer = 0
    addAttribute(enemy, 'decision-timer', decisionTimer)
    if ( decisionTimer === 0 ) {
        addAttribute(enemy, 'state', GO_FOR_RANGED)
        // const random = Math.random()
        // if ( random < 0.7 ) addAttribute(enemy, 'state', GO_FOR_RANGED)
        // else if ( random >= 0.7 && random < 0.9 ) addAttribute(enemy, 'state', GO_FOR_MELEE)
        // else addAttribute(enemy, 'state', CAMP)    
    }
}

const wallsInTheWay = (enemy) => {
    let wallCheckCounter = Number(enemy.getAttribute('wall-check-counter')) || 1
    wallCheckCounter = wallCheckCounter + 1 === 16 ? 0 : wallCheckCounter + 1
    addAttribute(enemy, 'wall-check-counter', wallCheckCounter)
    if ( wallCheckCounter !== 15 ) return
    const walls = Array.from(getCurrentRoomSolid()).filter(solid => !containsClass(solid, 'enemy-collider'))
    const laser = enemy.firstElementChild.lastElementChild
    for ( const component of laser.children )
        for ( const wall of walls ) {
            if ( collide(component, getPlayer(), 0) ) {
                addAttribute(enemy, 'wall-in-the-way', 'false')
                return
            }
            if ( collide(component, wall, 0) ) {
                if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', CHASE)
                else addAttribute(enemy, 'state', NO_OFFENCE)
                addAttribute(enemy, 'wall-in-the-way', 'true')
                return
            }
        }
    addAttribute(enemy, 'wall-in-the-way', 'false')   
}

const handleGoForRangedState = (enemy) => {
    const bullet = enemy.firstElementChild.firstElementChild.children[4]
    const bulletBound = bullet.getBoundingClientRect()
    const enemyBound = enemy.getBoundingClientRect()
    if ( bullet.getAttribute('state') === 'move-to-destination' ) {
        const x = Number(bullet.getAttribute('x'))
        const y = Number(bullet.getAttribute('y'))
        const speedX = Number(bullet.getAttribute('speed-x'))
        const speedY = Number(bullet.getAttribute('speed-y'))
        const newX = x + speedX
        const newY = y + speedY
        addAttribute(bullet, 'x', newX)
        addAttribute(bullet, 'y', newY)
        bullet.style.left = `${newX}px`
        bullet.style.top = `${newY}px`
        if ( distance(bulletBound.x, bulletBound.y, enemyBound.x, enemyBound.y) > range ) {
            addAttribute(bullet, 'state', 'move-to-source')
        }
    }
    if ( enemy.getAttribute('shooting') === 'true' ) return
    const body = enemy.firstElementChild.firstElementChild
    const angle = Number(enemy.getAttribute('aim-angle'))
    body.style.transform = `rotateZ(${angle + 180}deg)`
    addAttribute(enemy, 'shooting', true)
    const { srcX, srcY } = { srcX: bulletBound.x, srcY: bulletBound.y }
    const dest = enemy.firstElementChild.lastElementChild.lastElementChild
    const destBound = dest.getBoundingClientRect()
    const { destX, destY } = { destX: destBound.x, destY: destBound.y }
    const deltaY = destY - srcY
    const deltaX = destX - srcX
    const slope = Math.abs(deltaY / deltaX)
    const speedX = deltaX < 0 ? -10 : 10
    const speedY = deltaY < 0 ? -10 * slope : 10 * slope
    addAttribute(bullet, 'speed-x', speedX)
    addAttribute(bullet, 'speed-y', speedY)
    addAttribute(bullet, 'x', 6)
    addAttribute(bullet, 'y', -18)
    addAttribute(bullet, 'state', 'move-to-destination')
}

const handleGuessSearchState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    let guessCounter = Number(enemy.getAttribute('guess-counter'))
    if ( guessCounter > 0 ) {
        guessCounter++
        addAttribute(enemy, 'guess-counter', guessCounter)
    }
    if ( guessCounter !== 0 && guessCounter <= 15 ) updateDestinationToPlayer(enemy)
    else addAttribute(enemy, 'guess-counter', 0)
    displaceEnemy(enemy)
}

const handleLostState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const counter = Number(enemy.getAttribute('lost-counter'))
    if ( counter === 600 ) {
        addAttribute(enemy, 'state', MOVE_TO_POSITION)
        return
    }
    if ( counter % 120 === 0 ) checkSuroundings(enemy)
    addAttribute(enemy, 'lost-counter', counter + 1)
}

const handleMoveToPositionState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    const dest = document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))]
    updateDestinationToPath(enemy, dest)
    displaceEnemy(enemy)
}

const playerLocated = (enemy) => {
    let result = false
    if ( isPlayerVisible(enemy) ) { 
        if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', CHASE)
        else addAttribute(enemy, 'state', NO_OFFENCE)   
        result = true
    }
    return result
}

const checkSuroundings = (enemy) => {
    const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
    const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
    calculateAngle(enemy, x, y)
}

const displaceEnemy = (enemy) => {
    findPath(enemy)
    moveToDestination(enemy)
}