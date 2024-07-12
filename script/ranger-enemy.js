import { isPlayerVisible } from './enemy-vision.js'
import { manageAimModeAngle } from './player-angle.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from './variables.js'
import { getCurrentRoom, getCurrentRoomRangerBullets, getCurrentRoomSolid, getPlayer } from './elements.js'
import { 
    updateDestinationToPlayer,
    getEnemyState, 
    setEnemyState, 
    switch2ChaseMode,
    resetAcceleration} from './enemy-actions.js' 
import { 
    handleChaseState,
    handleGuessSearchState,
    handleInvestigationState,
    handleLostState,
    handleMove2PositionState } from './normal-enemy.js'
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
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MAKE_DECISION,
    MOVE_TO_POSITION,
    NO_OFFENCE } from './enemy-state.js'

let angle
export const rangerEnemyBehavior = (enemy) => {
    const body = enemy.firstElementChild.firstElementChild
    angle = angle2Player(enemy)
    renderEnemyLaser(enemy)
    removeClass(body, 'no-transition')
    switch ( getEnemyState(enemy) ) {
        case INVESTIGATE:
            handleInvestigationState(enemy)
            break
        case CHASE:
            if ( switch2MakeDecisionState(enemy) ) return
        case NO_OFFENCE:
            handleChaseState(enemy)
            break
        case MAKE_DECISION:
            addClass(body, 'no-transition')
            handleMakeDecisionState(enemy)
            break
        case GO_FOR_RANGED:
            addClass(body, 'no-transition')
            handleRangedAttackState(enemy)    
            break
        case GO_FOR_MELEE:
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

const angle2Player = (enemy) => {
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

const switch2MakeDecisionState = (enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    wallsInTheWay(enemy)
    if ( distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y) < enemy.getAttribute('range') && 
         enemy.getAttribute('wall-in-the-way') === 'false' ) {
        setEnemyState(enemy, MAKE_DECISION)
        return true
    }
    return false
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
                switch2ChaseMode(enemy)
                addAttribute(enemy, 'wall-in-the-way', 'true')
                return
            }
    }
    addAttribute(enemy, 'wall-in-the-way', 'false')
}

const handleMakeDecisionState = (enemy) => {
    wallsInTheWay(enemy)
    if ( enemy.getAttribute('wall-in-the-way') === 'true' ) return
    updateDestinationToPlayer(enemy)
    updateAngle2Player(enemy)
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    const dist = distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y)
    if ( dist > enemy.getAttribute('range') ) {
        switch2ChaseMode(enemy)
        return
    } else if ( dist < enemy.getAttribute('range') / 3 ) {
        setEnemyState(enemy, GO_FOR_MELEE)
        return
    }
    decideAttack(enemy)
}

const updateAngle2Player = (enemy) => {
    addAttribute(enemy, 'aim-angle', angle)
    manageAimModeAngle(enemy)
}

const decideAttack = (enemy) => {
    let decisionTimer = Number(enemy.getAttribute('decision-timer')) || 1
    decisionTimer++
    if ( decisionTimer === 30 ) decisionTimer = 0
    addAttribute(enemy, 'decision-timer', decisionTimer)
    if ( decisionTimer === 0 ) {
        const decision = Math.random()
        if ( decision < 0.8 ) setEnemyState(enemy, GO_FOR_RANGED)
        else setEnemyState(enemy, GO_FOR_MELEE)
        addAttribute(enemy, 'decision-timer', 1)
    }
}

const handleRangedAttackState = (enemy) => {
    let shootCounter = Number(enemy.getAttribute('shoot-counter'))
    shootCounter++
    if ( shootCounter == 90 ) {
        addAttribute(enemy, 'shoot-counter', -1)
        return
    }
    if ( !isPlayerVisible(enemy) || wallsInTheWay(enemy) ) {
        setEnemyState(enemy, CHASE)
        addAttribute(enemy, 'shoot-counter', -1)
        return
    }
    if ( shootCounter > 29 ) updateAngle2Player(enemy)
    addAttribute(enemy, 'shoot-counter', shootCounter)
    shootAnimation(enemy)
    if ( shootCounter !== 15 ) return
    shoot(enemy)
}

const shootAnimation = (enemy) => {
    const body = enemy.firstElementChild.firstElementChild
    const shootCounter = Number(enemy.getAttribute('shoot-counter'))
    let currAngle = +body.style.transform.replace('rotateZ(', '').replace('deg)', '')
    if ( shootCounter < 15 ) body.style.transform = `rotateZ(${currAngle + 12}deg)`
    else if ( shootCounter < 29 ) body.style.transform = `rotateZ(${currAngle - 12}deg)`
}

const shoot = (enemy) => {
    const enemyCpu = window.getComputedStyle(enemy)
    const { x: srcX, y: srcY } = { x: +enemyCpu.left.replace('px', '') + 16, y: +enemyCpu.top.replace('px', '') + 16 }
    const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
    const deg = angleOfTwoPoints(srcX, srcY, destX, destY)
    const diffY = destY - srcY
    const diffX = destX - srcX
    const slope = Math.abs(diffY / diffX)
    const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX)
    const bullet = createAndAddClass('div', 'ranger-bullet')
    addAttribute(bullet, 'speed-x', speedX)
    addAttribute(bullet, 'speed-y', speedY)
    addAttribute(bullet, 'damage', enemy.getAttribute('damage'))
    bullet.style.left = `${srcX}px`
    bullet.style.top = `${srcY}px`
    bullet.style.backgroundColor = `${enemy.getAttribute('virus')}`
    getCurrentRoom().append(bullet)
    getCurrentRoomRangerBullets().push(bullet)
    resetAcceleration(enemy)
}

const calculateBulletSpeed = (deg, slope, diffX, diffY) => {
    let speedX
    let speedY
    const baseSpeed = 10
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