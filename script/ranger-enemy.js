import { manageAimModeAngle } from './player-angle.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from './variables.js'
import { getCurrentRoom, getCurrentRoomRangerBullets, getPlayer } from './elements.js'
import { 
    updateDestination2Player,
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

export const rangerEnemyBehavior = (enemy) => {
    transferEnemy(enemy, false)
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
            handleMakeDecisionState(enemy)
            break
        case GO_FOR_RANGED:
            handleRangedAttackState(enemy)    
            break
        case GO_FOR_MELEE:
            handleMeleeAttackState(enemy)
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

const transferEnemy = (enemy, toggle) => {
    const body = enemy.firstElementChild.firstElementChild
    if ( toggle ) addClass(body, 'no-transition')
    else removeClass(body, 'no-transition')
}

const switch2MakeDecisionState = (enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    if ( distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y) < enemy.getAttribute('vision') && 
         enemy.getAttribute('wall-in-the-way') === 'false' ) {
        setEnemyState(enemy, MAKE_DECISION)
        return true
    }
    return false
}

const handleMakeDecisionState = (enemy) => {
    if ( enemy.getAttribute('wall-in-the-way') !== 'false' ) return
    updateDestination2Player(enemy)
    transferEnemy(enemy, true)
    updateAngle2Player(enemy)
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    const dist = distance(enemyBound.x, enemyBound.y, playerBound.x, playerBound.y)
    if ( dist > enemy.getAttribute('vision') ) {
        switch2ChaseMode(enemy)
        return
    } else if ( dist < enemy.getAttribute('vision') / 3 ) {
        setEnemyState(enemy, GO_FOR_MELEE)
        return
    }
    decideAttack(enemy)
}

const updateAngle2Player = (enemy) => {
    addAttribute(enemy, 'aim-angle', 
        enemy.firstElementChild.children[1].style.transform.replace('rotateZ(', '').replace('deg)', ''))
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
    transferEnemy(enemy, true)
    let shootCounter = Number(enemy.getAttribute('shoot-counter'))
    shootCounter++
    if ( shootCounter === 90 ) {
        if (  distance(enemy.getBoundingClientRect().x, enemy.getBoundingClientRect().y, 
              getPlayer().getBoundingClientRect().x, getPlayer().getBoundingClientRect().y) > 
              enemy.getAttribute('vision') ||
              enemy.getAttribute('wall-in-the-way') !== 'false' || 
              Math.random() < 0.01 )
            setEnemyState(enemy, GO_FOR_MELEE)
        addAttribute(enemy, 'shoot-counter', -1)
        return
    }
    if ( shootCounter > 29 ) updateAngle2Player(enemy)
    addAttribute(enemy, 'shoot-counter', shootCounter)
    shootAnimation(enemy)
    if ( shootCounter !== 15 ) return
    shoot(enemy)
}

const handleMeleeAttackState = (enemy) => {
    if ( Math.random() < 0.001 ) {
        setEnemyState(enemy, GO_FOR_RANGED)
        return
    }
    handleChaseState(enemy)
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