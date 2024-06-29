import { isPlayerVisible } from './enemy-vision.js'
import { getNoOffenseCounter } from './variables.js'
import { manageAimModeAngle } from './player-angle.js'
import { getCurrentRoomSolid, getPlayer } from './elements.js'
import { handleGuessSearchState, handleLostState, handleMoveToPositionState } from './normal-enemy.js'
import { 
    updateDestinationToPlayer,
    updateDestinationToPath,
    notifyEnemy, 
    accelerateEnemy,
    getEnemyState,
    displaceEnemy,
    checkSuroundings,
    playerLocated} from './enemy-actions.js' 
import { 
    addAttribute,
    addClass,
    angleOfTwoPoints,
    collide,
    containsClass,
    createAndAddClass,
    distance,
    removeClass } from './util.js'    
import { 
    CHASE,
    GO_FOR_MELEE,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MAKE_DECISION,
    MOVE_TO_POSITION,
    NO_OFFENCE } from './enemy-state.js'


let angle
export const rangerEnemyBehavior = (enemy) => {
    const body = enemy.firstElementChild.firstElementChild
    angle = angleToPlayer(enemy)
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

const angleToPlayer = (enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    return angleOfTwoPoints(enemyBound.x + enemyBound.width / 2, enemyBound.y + enemyBound.height / 2, 
                            playerBound.x + playerBound.width / 2, playerBound.y + playerBound.height / 2)
}

const renderEnemyLaser = (enemy) => {
    const collider = enemy.firstElementChild
    if ( containsClass(collider.lastElementChild, 'ranger-laser') ) {
        const laser = collider.lastElementChild
        laser.style.transform = `rotateZ(${angle}deg)`
        return
    }
    const laser = createAndAddClass('div', 'ranger-laser')
    laser.style.height = `${enemy.getAttribute('range')}px`
    for ( let i = 0; i < 100; i++ ) {
        const laserComponent = document.createElement('div')
        laser.append(laserComponent)
    }
    collider.append(laser)
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
    if ( distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y) < enemy.getAttribute('range') * (2 / 3) && 
         enemy.getAttribute('wall-in-the-way') === 'false' ) {
        addAttribute(enemy, 'state', MAKE_DECISION)
        return true
    }
    return false
}

const handleMakeDecisionState = (enemy) => {
    wallsInTheWay(enemy)
    if ( enemy.getAttribute('wall-in-the-way') === 'true' ) return
    updateDestinationToPlayer(enemy)
    addAttribute(enemy, 'aim-angle', angle)
    manageAimModeAngle(enemy)
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    const dist = distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y)
    if ( dist > enemy.getAttribute('range') ) {
        if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', CHASE)
        else addAttribute(enemy, 'state', NO_OFFENCE)
        return
    } else if ( dist < enemy.getAttribute('range') / 3 ) {
        addAttribute(enemy, 'state', GO_FOR_MELEE)
        return
    }
    decideAttack(enemy)
}

const wallsInTheWay = (enemy) => {
    let wallCheckCounter = Number(enemy.getAttribute('wall-check-counter')) || 1
    wallCheckCounter = wallCheckCounter + 1 === 16 ? 0 : wallCheckCounter + 1
    addAttribute(enemy, 'wall-check-counter', wallCheckCounter)
    if ( wallCheckCounter !== 15 ) return
    const walls = Array.from(getCurrentRoomSolid()).filter(solid => !containsClass(solid, 'enemy-collider'))
    const laser = enemy.firstElementChild.lastElementChild
    for ( const component of laser.children ) {
        if ( collide(component, getPlayer(), 0) ) {
            addAttribute(enemy, 'wall-in-the-way', 'false')
            return
        }
        for ( const wall of walls )
            if ( collide(component, wall, 0) ) {
                if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', CHASE)
                else addAttribute(enemy, 'state', NO_OFFENCE)
                addAttribute(enemy, 'wall-in-the-way', 'true')
                return
            }
    }    
    addAttribute(enemy, 'wall-in-the-way', 'false')   
}

const decideAttack = (enemy) => {
    let decisionTimer = Number(enemy.getAttribute('decision-timer')) || 1
    decisionTimer++
    if ( decisionTimer === 30 ) decisionTimer = 0
    addAttribute(enemy, 'decision-timer', decisionTimer)
    if ( decisionTimer === 0 ) {
        // TODO add other states
    }
}