import { dropLoot } from "./loot-manager.js"
import { takeDamage } from "./player-health.js"
import { replaceForwardDetector } from "./player-angle.js"
import { getSpecification, getStat } from "./weapon-specs.js"
import { addAttribute, addClass, collide, distance, removeClass } from "./util.js"
import { getCurrentRoomEnemies, getCurrentRoomSolid, getMapEl, getPlayer } from "./elements.js"
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
    setNoOffenseCounter } from "./variables.js"

export const moveToDestination = (enemy) => {
    const enemyCpu = window.getComputedStyle(enemy)
    const enemyLeft = parseInt(enemyCpu.left)
    const enemyTop = parseInt(enemyCpu.top)
    const enemyW = parseInt(enemyCpu.width)
    const destLeft = Number(enemy.getAttribute('dest-x'))
    const destTop = Number(enemy.getAttribute('dest-y'))
    const destW = Number(enemy.getAttribute('dest-w'))
    let xMultiplier, yMultiplier
    if ( enemyLeft > destLeft + destW / 2 ) xMultiplier = -1
    else if ( enemyLeft + enemyW <= destLeft + destW / 2 ) xMultiplier = 1
    if ( enemyTop > destTop + destW / 2 ) yMultiplier = -1
    else if ( enemyTop + enemyW <= destTop + destW / 2 ) yMultiplier = 1
    calculateAngle(enemy, xMultiplier, yMultiplier)
    let speed = Number(enemy.getAttribute("speed"))
    if ( enemy.getAttribute('state') === 'no-offence' ) speed /= 2
    if ( enemy.getAttribute('state') === 'investigate' ) speed /= 5
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    else if ( !xMultiplier && !yMultiplier ) {
        switch ( enemy.getAttribute('state') ) {
            case 'investigate':
                const path = document.getElementById(enemy.getAttribute('path'))
                const numOfPoints = path.children.length
                const currentPathPoint = Number(enemy.getAttribute('path-point'))
                let nextPathPoint = currentPathPoint + 1
                if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
                addAttribute(enemy, 'path-point', nextPathPoint)
                addAttribute(enemy, 'investigation-counter', 1)
                break
            case 'chase':
                if ( collide(enemy, getPlayer(), 0) ) hitPlayer(enemy)
                else { 
                    addAttribute(enemy, 'state', 'lost')
                    addAttribute(enemy, 'lost-counter', '0')
                }
                break
            case 'move-to-position':
                addAttribute(enemy, 'state', 'investigate')
                break                 
        }
    }
    const currentX = parseInt(window.getComputedStyle(enemy).left)
    const currentY = parseInt(window.getComputedStyle(enemy).top)
    enemy.style.left = `${currentX + speed * xMultiplier}px`
    enemy.style.top = `${currentY + speed * yMultiplier}px`
}

export const calculateAngle = (enemy, x, y) => {
    let newState = Number(enemy.getAttribute('angle-state'))
    if ( x === 1 && y === 1 )        newState = changeEnemyAngleState(7, enemy, '100%', '0', '100%', '0')
    else if ( x === 1 && y === -1 )  newState = changeEnemyAngleState(5, enemy, '100%', '0', '0', '-100%')
    else if ( x === -1 && y === 1 )  newState = changeEnemyAngleState(1, enemy, '0', '-100%', '100%', '0')    
    else if ( x === -1 && y === -1 ) newState = changeEnemyAngleState(3, enemy, '0', '-100%', '0', '-100%')
    else if ( x === 1 && !y )        newState = changeEnemyAngleState(6, enemy, '100%', '0', '50%', '-50%')
    else if ( x === -1 && !y )       newState = changeEnemyAngleState(2, enemy, '0', '-100%', '50%', '-50%')
    else if ( !x && y === 1 )        newState = changeEnemyAngleState(0, enemy, '50%', '-50%', '100%', '0')
    else if ( !x && y === -1 )       newState = changeEnemyAngleState(4, enemy, '50%', '-50%', '0', '-100%')
    let diff = newState - Number(enemy.getAttribute('angle-state'))
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
    const newAngle = Number(enemy.getAttribute('angle')) + diff * 45    
    addAttribute(enemy, 'angle', newAngle)
    addAttribute(enemy, 'angle-state', newState)
    enemy.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const changeEnemyAngleState = (state, enemy, left, translateX, top, translateY) => {
    replaceEnemyVision(enemy, left, top, translateX, translateY)
    return state
}

const replaceEnemyVision = (enemy, left, top, translateX, translateY) => {
    const vision = enemy.firstElementChild.children[1]
    vision.style.left = left
    vision.style.top = top
    vision.style.transform = `translateX(${translateX}) translateY(${translateY})`
}

const hitPlayer = (enemy) => {
    addClass(enemy.firstElementChild.firstElementChild.firstElementChild, 'attack')
    takeDamage(enemy.getAttribute('damage'))
    knockPlayer(enemy)
    Array.from(getCurrentRoomEnemies())
        .filter(enemy => enemy.getAttribute('state') === 'chase')
        .forEach(enemy => addAttribute(enemy, 'state', 'no-offence'))
    setNoOffenseCounter(1)
}

const knockPlayer = (enemy) => {
    const knock = Number(enemy.getAttribute('knock'))
    const angle = enemy.getAttribute('angle-state')
    let xAxis, yAxis
    switch ( angle ) {
        case '0':
            xAxis = 0
            yAxis = -1
            replaceForwardDetector('calc(50% - 2px)', '100%')
            break
        case '1':
        case '2':
        case '3':
            xAxis = 1
            yAxis = 0
            replaceForwardDetector('-4px', 'calc(50% - 2px)')
            break
        case '4':
            xAxis = 0
            yAxis = 1
            replaceForwardDetector('calc(50% - 2px)', '-4px')
            break
        case '5':
        case '6':
        case '7':
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

export const updateDestinationToPlayer = (enemy) => 
    updateDestination(enemy, Math.floor(getPlayerX() - getRoomLeft()), Math.floor(getPlayerY() - getRoomTop()), 34)

export const updateDestinationToPath = (enemy, path) => {
    const pathCpu = window.getComputedStyle(path)
    updateDestination(enemy, parseInt(pathCpu.left), parseInt(pathCpu.top), 10)
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
        const state = enemy.getAttribute('state')
        if (state !== 'chase' && state !== 'no-offence') addAttribute(enemy, 'state', 'chase')
        updateDestinationToPlayer(enemy)
    }
}

export const damageEnemy = (enemy, equipped) => {
    let damage = getStat(equipped.name, 'damage', equipped.damagelvl)
    if ( enemy.getAttribute('virus') === getSpecification(equipped.name, 'antivirus') ) damage *= 1.2
    const enemyHealth = Number(enemy.getAttribute('health'))
    const newHealth = enemyHealth - damage
    addAttribute(enemy, 'health', newHealth)
    if ( newHealth <= 0 ) {
        const enemyCpu = window.getComputedStyle(enemy)
        addAttribute(enemy, 'left', parseInt(enemyCpu.left))
        addAttribute(enemy, 'top', parseInt(enemyCpu.top))
        dropLoot(enemy)
        return
    }
    const knockback = getSpecification(equipped.name, 'knockback')
    knockEnemy(enemy, knockback)
    addClass(enemy.firstElementChild.firstElementChild, 'damaged')
    setTimeout(() => removeClass(enemy.firstElementChild.firstElementChild, 'damaged'), 100)
}

const knockEnemy = (enemy, knockback) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    let xAxis, yAxis
    if ( enemyBound.left < playerBound.left ) xAxis = -1
    else if ( enemyBound.left >= playerBound.left || enemyBound.right <= playerBound.right ) xAxis = 0
    else xAxis = 1
    if ( enemyBound.bottom < playerBound.top ) yAxis = -1
    else if ( enemyBound.bottom >= playerBound.top || enemyBound.top <= playerBound.bottom ) yAxis = 0
    else yAxis = 1
    const enemyCpu = window.getComputedStyle(enemy)
    const enemyLeft = parseInt(enemyCpu.left)
    const enemyTop = parseInt(enemyCpu.top)
    enemy.style.left = `${enemyLeft + xAxis * knockback}px`
    enemy.style.top = `${enemyTop + yAxis * knockback}px`
}