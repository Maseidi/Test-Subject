import { enemies } from './enemies.js'
import { dropLoot } from './loot-manager.js'
import { takeDamage } from './player-health.js'
import { manageKnock } from './knock-manager.js'
import { getSpecification, getStat } from './weapon-specs.js'
import { addAttribute, addClass, collide, distance } from './util.js'
import { getCurrentRoomEnemies, getMapEl, getPlayer } from './elements.js'
import { 
    getMapX,
    getMapY,
    getPlayerX,
    getPlayerY,
    getRoomLeft,
    getRoomTop,
    setMapX,
    setMapY,
    setPlayerX,
    setPlayerY,
    setNoOffenseCounter, 
    getNoOffenseCounter,
    getCurrentRoomId} from './variables.js'
import { GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE, CHASE } from './normal-enemy.js'
export const getEnemyState = (enemy) => enemy.getAttribute('state') 

export const moveToDestination = (enemy) => {
    if ( collidePlayer(enemy) ) return
    const { enemyLeft, enemyTop, enemyW } = enemyCoordinates(enemy)
    const { destLeft, destTop, destW } = destinationCoordinates(enemy)
    const { xMultiplier, yMultiplier } = decideDirection(enemyLeft, destLeft, enemyTop, destTop, enemyW, destW)
    calculateAngle(enemy, xMultiplier, yMultiplier)
    const speed = calculateSpeed(enemy, xMultiplier, yMultiplier)
    if ( !xMultiplier && !yMultiplier ) reachedDestination(enemy)
    const currentX = Number(window.getComputedStyle(enemy).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(enemy).top.replace('px', ''))
    enemy.style.left = `${currentX + speed * xMultiplier}px`
    enemy.style.top = `${currentY + speed * yMultiplier}px`
}

const collidePlayer = (enemy) => {
    const state = getEnemyState(enemy)
    if ( ( state !== CHASE && state !== NO_OFFENCE ) || !collide(enemy, getPlayer(), 0) ) return false
    if ( state === CHASE ) hitPlayer(enemy)
    return true
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

const decideDirection = (enemyLeft, destLeft, enemyTop, destTop, enemyW, destW) => {
    let xMultiplier, yMultiplier
    if ( enemyLeft > destLeft + destW / 2 ) xMultiplier = -1
    else if ( enemyLeft + enemyW <= destLeft + destW / 2 ) xMultiplier = 1
    if ( enemyTop > destTop + destW / 2 ) yMultiplier = -1
    else if ( enemyTop + enemyW <= destTop + destW / 2 ) yMultiplier = 1
    return { xMultiplier, yMultiplier }
}

const calculateSpeed = (enemy, xMultiplier, yMultiplier) => {
    let speed = Number(enemy.getAttribute('curr-speed'))
    const state = getEnemyState(enemy)
    if ( state === NO_OFFENCE ) speed /= 2
    else if ( state === INVESTIGATE ) speed = Number(enemy.getAttribute('maxspeed')) / 5
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    return speed
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
            addAttribute(enemy, 'state', LOST)
            addAttribute(enemy, 'lost-counter', '0')
            resetAcceleration(enemy)
            break
        case MOVE_TO_POSITION:
            addAttribute(enemy, 'state', INVESTIGATE)
            resetAcceleration(enemy)
            break                 
    }
}

export const resetAcceleration = (enemy) => {
    addAttribute(enemy, 'acc-counter', 0)
    addAttribute(enemy, 'curr-speed', enemy.getAttribute('acceleration'))
}

export const calculateAngle = (enemy, x, y) => {
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
    if ( newState === currState ) return
    let diff = newState - currState
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
    const newAngle = Number(enemy.getAttribute('angle')) + diff * 45    
    addAttribute(enemy, 'angle', newAngle)
    addAttribute(enemy, 'angle-state', newState)
    enemy.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const changeEnemyAngleState = (state, enemy, translateX, translateY) => {
    replaceEnemyComponent(enemy.firstElementChild.children[1], translateX, translateY)
    replaceEnemyComponent(enemy.firstElementChild.children[2], translateX, translateY)
    return state
}

const replaceEnemyComponent = (component, translateX, translateY) => {
    component.style.left = '50%'
    component.style.top = '50%'
    component.style.transform = `translateX(${translateX}) translateY(${translateY})`
}

const hitPlayer = (enemy) => {
    addClass(enemy.firstElementChild.firstElementChild.firstElementChild, 'attack')
    takeDamage(enemy.getAttribute('damage'))
    knockPlayer(enemy)
    Array.from(getCurrentRoomEnemies())
        .filter(enemy => getEnemyState(enemy) === CHASE)
        .forEach(enemy => addAttribute(enemy, 'state', NO_OFFENCE))
    setNoOffenseCounter(1)
}

const knockPlayer = (enemy) => {
    const knock = Number(enemy.getAttribute('knock'))
    const angle = enemy.getAttribute('angle-state')
    let xAxis, yAxis
    let finalKnock
    switch ( angle ) {
        case '0':
            xAxis = 0
            yAxis = -1
            finalKnock = manageKnock('to-down', getPlayer(), knock)
            break
        case '1':
        case '2':
        case '3':
            xAxis = 1
            yAxis = 0
            finalKnock = manageKnock('to-left', getPlayer(), knock)
            break
        case '4':
            xAxis = 0
            yAxis = 1
            finalKnock = manageKnock('to-up', getPlayer(), knock)
            break
        case '5':
        case '6':
        case '7':
            xAxis = -1
            yAxis = 0
            finalKnock = manageKnock('to-right', getPlayer(), knock)
            break                
    }
    if ( ( xAxis === undefined && yAxis === undefined ) ) return
    setMapX(xAxis * finalKnock + getMapX())
    setMapY(yAxis * finalKnock + getMapY())
    setPlayerX(-xAxis * finalKnock + getPlayerX())
    setPlayerY(-yAxis * finalKnock + getPlayerY())
    getMapEl().style.left = `${getMapX()}px`
    getMapEl().style.top = `${getMapY()}px`
    getPlayer().style.left = `${getPlayerX()}px`
    getPlayer().style.top = `${getPlayerY()}px`
}

export const updateDestinationToPlayer = (enemy) => 
    updateDestination(enemy, Math.floor(getPlayerX() - getRoomLeft()), Math.floor(getPlayerY() - getRoomTop()), 34)

export const updateDestinationToPath = (enemy, path) => {
    const pathCpu = window.getComputedStyle(path)
    updateDestination(enemy, Number(pathCpu.left.replace('px', '')), Number(pathCpu.top.replace('px', '')), 10)
}
    
const updateDestination = (enemy, x, y, width) => {
    addAttribute(enemy, 'dest-x', x)
    addAttribute(enemy, 'dest-y', y)
    addAttribute(enemy, 'dest-w', width)
}

export const notifyEnemy = (dist, enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    if ( distance(playerBound.x, playerBound.y, enemyBound.x, enemyBound.y) <= dist ) {
        if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', CHASE)
        else addAttribute(enemy, 'state', NO_OFFENCE)
        updateDestinationToPlayer(enemy)
    }
    getCurrentRoomEnemies()
        .filter(e => e !== enemy &&
                     (distance(enemy.getBoundingClientRect().x, enemy.getBoundingClientRect().y,
                     e.getBoundingClientRect().x, e.getBoundingClientRect().y) < 500 ) &&
                     getEnemyState(e) !== CHASE && getEnemyState(e) !== NO_OFFENCE
        ).forEach(e => notifyEnemy(Number.MAX_SAFE_INTEGER, e))
}

export const damageEnemy = (enemy, equipped) => {
    let damage = getStat(equipped.name, 'damage', equipped.damagelvl)
    if ( enemy.getAttribute('virus') === getSpecification(equipped.name, 'antivirus') ) damage *= 1.2
    if ( Math.random() < 0.01 ) damage *= (Math.random() + 1)
    const enemyHealth = Number(enemy.getAttribute('health'))
    const newHealth = enemyHealth - damage
    addAttribute(enemy, 'health', newHealth)
    if ( newHealth <= 0 ) {
        const enemyCpu = window.getComputedStyle(enemy)
        addAttribute(enemy, 'left', Number(enemyCpu.left.replace('px', '')))
        addAttribute(enemy, 'top', Number(enemyCpu.top.replace('px', '')))
        dropLoot(enemy)
        const enemiesCopy = enemies.get(getCurrentRoomId())
        enemiesCopy[Number(enemy.getAttribute('index'))].health = 0
        return
    }
    const knockback = getSpecification(equipped.name, 'knockback')
    knockEnemy(enemy, knockback)
    addClass(enemy.firstElementChild.firstElementChild, 'damaged')
    addAttribute(enemy, 'damaged-counter', 6)
}

const knockEnemy = (enemy, knockback) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    let xAxis, yAxis
    if ( enemyBound.left < playerBound.left ) xAxis = -1
    else if ( enemyBound.left >= playerBound.left && enemyBound.right <= playerBound.right ) xAxis = 0
    else xAxis = 1
    if ( enemyBound.bottom < playerBound.top ) yAxis = -1
    else if ( enemyBound.bottom >= playerBound.top && enemyBound.top <= playerBound.bottom ) yAxis = 0
    else yAxis = 1
    const enemyCpu = window.getComputedStyle(enemy)
    const enemyLeft = Number(enemyCpu.left.replace('px', ''))
    const enemyTop = Number(enemyCpu.top.replace('px', ''))
    enemy.style.left = `${enemyLeft + xAxis * knockback}px`
    enemy.style.top = `${enemyTop + yAxis * knockback}px`
}

export const accelerateEnemy = (enemy) => {
    let counter = Number(enemy.getAttribute('acc-counter'))
    counter++
    if ( counter === 60 ) {
        const currSpeed = Number(enemy.getAttribute('curr-speed'))
        const acceleration = Number(enemy.getAttribute('acceleration'))
        const maxSpeed = Number(enemy.getAttribute('maxspeed'))
        let newSpeed = currSpeed + acceleration
        if ( newSpeed > maxSpeed ) newSpeed = maxSpeed
        addAttribute(enemy, 'curr-speed', newSpeed)
        counter = 0
    }  
    addAttribute(enemy, 'acc-counter', counter)
}