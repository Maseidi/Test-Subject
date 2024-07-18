import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from './enemy-state.js'
import { 
    accelerateEnemy,
    collidePlayer,
    getEnemyState,
    notifyEnemy,
    resetAcceleration,
    setEnemyState,
    switch2ChaseMode,
    updateDestination2Path, 
    updateDestination2Player} from './enemy-actions.js'
import { addAttribute } from './util.js'
import { findPath } from './enemy-path-finding.js'

export const spikerEnemyBehavior = (enemy) => {
    console.log(enemy.getAttribute('investigation-counter'));
    handleRotation(enemy)
    switch ( getEnemyState(enemy) ) {
        case INVESTIGATE:
            handleInvestigationState(enemy)
            break
        case CHASE:
        case NO_OFFENCE:    
            handleChaseState(enemy)
            break
        case GUESS_SEARCH:
            handleGuessSearchState(enemy)
            break
        case LOST:
            handleLostState(enemy)
            break    
        case MOVE_TO_POSITION:
            handleMove2PositionState(enemy)
            break
    }
}

const handleRotation = (enemy) => {
    const angle = enemy.firstElementChild.firstElementChild.style.transform.replace('rotateZ(', '').replace('deg)', '') || 0
    const currSpeed = Number(enemy.getAttribute('curr-speed'))
    let newAngle = Number(angle) + currSpeed
    if ( newAngle > 360 ) newAngle = 0
    enemy.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const handleInvestigationState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const path = document.getElementById(enemy.getAttribute('path'))
    const counter = Number(enemy.getAttribute('investigation-counter'))
    if ( counter > 0 ) addAttribute(enemy, 'investigation-counter', counter + 1)
    if ( counter >= 300 ) addAttribute(enemy, 'investigation-counter', 0)
    if ( counter !== 0 ) return
    const dest = path.children[Number(enemy.getAttribute('path-point'))]
    updateDestination2Path(enemy, dest)
    displaceEnemy(enemy)
}

const displaceEnemy = (enemy) => {
    findPath(enemy)
    move2Destination(enemy)
}

const move2Destination = (enemy) => {
    if ( collidePlayer(enemy) ) return
    const { enemyLeft, enemyTop, enemyW } = enemyCoordinates(enemy)
    const { destLeft, destTop, destW } = destinationCoordinates(enemy)
    const { xMultiplier, yMultiplier } = decideDirection(enemy, enemyLeft, destLeft, enemyTop, destTop, enemyW, destW)
    calculateAngle(enemy, xMultiplier, yMultiplier)
    const speed = calculateSpeed(enemy, xMultiplier, yMultiplier)
    manageAxis(enemy, xMultiplier, yMultiplier)
    if ( xMultiplier === 0 && yMultiplier === 0 ) reachedDestination(enemy)
    const currentX = Number(window.getComputedStyle(enemy).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(enemy).top.replace('px', ''))
    enemy.style.left = `${currentX + speed * xMultiplier}px`
    enemy.style.top = `${currentY + speed * yMultiplier}px`
}

const enemyCoordinates = (enemy) => {
    const enemyCpu = window.getComputedStyle(enemy)
    const enemyLeft = Number(enemyCpu.left.replace('px', ''))
    const enemyTop = Number(enemyCpu.top.replace('px', ''))
    const enemyW = Number(enemyCpu.width.replace('px', ''))
    return {enemyLeft, enemyTop, enemyW}
}

const destinationCoordinates = (enemy) => {
    const pathFindingX = enemy.getAttribute('path-finding-x')
    const pathFindingY = enemy.getAttribute('path-finding-y')
    const destLeft = pathFindingX === 'null' ? Number(enemy.getAttribute('dest-x')) : Number(pathFindingX)
    const destTop = pathFindingY === 'null' ? Number(enemy.getAttribute('dest-y')) : Number(pathFindingY)
    const destW = pathFindingX === 'null' ? Number(enemy.getAttribute('dest-w')) : 10
    return {destLeft, destTop, destW}
}

const decideDirection = (enemy, enemyLeft, destLeft, enemyTop, destTop, enemyW, destW) => {
    const axis = Number(enemy.getAttribute('axis'))
    let xMultiplier, yMultiplier
    const pathFindingX = enemy.getAttribute('path-finding-x')
    const pathFindingY = enemy.getAttribute('path-finding-y')
    if ( pathFindingX !== 'null' && pathFindingY !== 'null' ) {
        if ( enemyLeft > destLeft + destW / 2 ) xMultiplier = -1
        else if ( enemyLeft + enemyW <= destLeft + destW / 2 ) xMultiplier = 1
        if ( enemyTop > destTop + destW / 2 ) yMultiplier = -1
        else if ( enemyTop + enemyW <= destTop + destW / 2 ) yMultiplier = 1
        return { xMultiplier, yMultiplier }
    }
    if ( axis === 1 ) {
        if ( enemyLeft > destLeft + destW / 2 ) xMultiplier = -1
        else if ( enemyLeft + enemyW <= destLeft + destW / 2 ) xMultiplier = 1
        yMultiplier = 0
    } else {
        if ( enemyTop > destTop + destW / 2 ) yMultiplier = -1
        else if ( enemyTop + enemyW <= destTop + destW / 2 ) yMultiplier = 1
        xMultiplier = 0
    }
    return { xMultiplier, yMultiplier }
}

const calculateAngle = (enemy, x, y) => {
    const currState = Number(enemy.getAttribute('angle-state'))
    let newState = currState
    if ( x === 1 && y === 1 )        newState = changeEnemyAngleState(7, enemy, '0', '0')
    else if ( x === 1 && y === -1 )  newState = changeEnemyAngleState(5, enemy, '0', '-100%')
    else if ( x === -1 && y === 1 )  newState = changeEnemyAngleState(1, enemy, '-100%', '0')    
    else if ( x === -1 && y === -1 ) newState = changeEnemyAngleState(3, enemy, '-100%', '-100%')
    else if ( x === 1 && !y )        newState = changeEnemyAngleState(6, enemy, '0', '-50%')
    else if ( x === -1 && !y )       newState = changeEnemyAngleState(2, enemy, '-100%', '-50%')
    else if ( !x && y === 1 )        newState = changeEnemyAngleState(0, enemy, '-50%', '0')
    else if ( !x && y === -1 )       newState = changeEnemyAngleState(4, enemy, '-50%', '-100%')
    addAttribute(enemy, 'angle-state', newState)
}

const changeEnemyAngleState = (state, enemy, translateX, translateY) => {
    const forwardDetector = enemy.firstElementChild.children[2]
    forwardDetector.style.left = '50%'
    forwardDetector.style.top = '50%'
    forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
    return state
}

const calculateSpeed = (enemy, xMultiplier, yMultiplier) => {
    let speed = Number(enemy.getAttribute('curr-speed'))
    const state = getEnemyState(enemy)
    if ( state === NO_OFFENCE ) speed /= 2
    else if ( state === INVESTIGATE ) speed = Number(enemy.getAttribute('maxspeed')) / 5
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    return speed
}

const manageAxis = (enemy, xMultiplier, yMultiplier) => {
    if ( xMultiplier === undefined ) addAttribute(enemy, 'axis', 2)
    else if ( yMultiplier === undefined ) addAttribute(enemy, 'axis', 1)
    if ( xMultiplier === undefined || yMultiplier === undefined ) resetAcceleration(enemy)
}

const reachedDestination = (enemy) => {
    if ( enemy.getAttribute('path-finding-x') !== 'null' ) {
        addAttribute(enemy, 'path-finding-x', null)
        addAttribute(enemy, 'path-finding-y', null)
        return
    }
    switch ( getEnemyState(enemy) ) {
        case INVESTIGATE:
            const path = document.getElementById(enemy.getAttribute('path'))
            const numOfPoints = path.children.length
            const currentPathPoint = Number(enemy.getAttribute('path-point'))
            let nextPathPoint = currentPathPoint + 1
            if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
            addAttribute(enemy, 'path-point', nextPathPoint)
            addAttribute(enemy, 'investigation-counter', 1)
            break
        case GUESS_SEARCH:
            setEnemyState(enemy, LOST)
            addAttribute(enemy, 'lost-counter', '0')
            resetAcceleration(enemy)
            break
        case MOVE_TO_POSITION:
            setEnemyState(enemy, INVESTIGATE)
            resetAcceleration(enemy)
            break                 
    }
}

const playerLocated = (enemy) => {
    const visible = isPlayerVisible(enemy)
    if ( visible ) switch2ChaseMode(enemy)
    return visible
}

const isPlayerVisible = (enemy) => enemy.getAttribute('wall-in-the-way') === 'false'

const handleChaseState = (enemy) => {
    accelerateEnemy(enemy)
    if ( isPlayerVisible(enemy) ) notifyEnemy(Number.MAX_SAFE_INTEGER, enemy)
    else {
        setEnemyState(enemy, GUESS_SEARCH)
        addAttribute(enemy, 'guess-counter', 1)
    }
    displaceEnemy(enemy)
}

const handleGuessSearchState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    let guessCounter = Number(enemy.getAttribute('guess-counter'))
    if ( guessCounter > 0 ) {
        guessCounter++
        addAttribute(enemy, 'guess-counter', guessCounter)
    }
    if ( guessCounter !== 0 && guessCounter <= 15 ) updateDestination2Player(enemy)
    else addAttribute(enemy, 'guess-counter', 0)
    displaceEnemy(enemy)
}

const handleLostState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const counter = Number(enemy.getAttribute('lost-counter'))
    if ( counter === 600 ) {
        setEnemyState(enemy, MOVE_TO_POSITION)
        return
    }
    addAttribute(enemy, 'lost-counter', counter + 1)
}

const handleMove2PositionState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    const dest = document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))]
    updateDestination2Path(enemy, dest)
    displaceEnemy(enemy)
}