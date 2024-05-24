import { dropLoot } from "./loot-manager.js"
import { takeDamage } from "./player-health.js"
import { replaceForwardDetector } from "./player-angle.js"
import { getSpecification, getStat } from "./weapon-specs.js"
import { addAttribute, addClass, collide, createAndAddClass, distance, removeClass } from "./util.js"
import { getCurrentRoom, getCurrentRoomEnemies, getCurrentRoomSolid, getMapEl, getPlayer } from "./elements.js"
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

export const moveToDestination = (src, dest) => {
    const srcBound = src.getBoundingClientRect()
    const destBound = dest.getBoundingClientRect()
    let xMultiplier, yMultiplier
    if ( srcBound.left > destBound.left + destBound.width / 2 ) xMultiplier = -1
    else if ( srcBound.right <= destBound.left + destBound.width / 2 ) xMultiplier = 1
    if ( srcBound.top > destBound.top + destBound.height / 2 ) yMultiplier = -1
    else if ( srcBound.bottom <= destBound.top + destBound.height / 2 ) yMultiplier = 1
    calculateAngle(src, xMultiplier, yMultiplier)
    let speed = Number(src.getAttribute("speed"))
    if ( src.getAttribute('state') === 'no-offence' ) speed /= 2
    if ( src.getAttribute('state') === 'investigate' ) speed /= 5
    if ( xMultiplier && yMultiplier ) speed /= 1.41
    else if ( !xMultiplier && !yMultiplier ) {
        switch ( src.getAttribute('state') ) {
            case 'investigate':
                const path = document.getElementById(src.getAttribute('path'))
                const numOfPoints = path.children.length
                const currentPathPoint = Number(src.getAttribute('path-point'))
                let nextPathPoint = currentPathPoint + 1
                if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
                addAttribute(src, 'path-point', nextPathPoint)
                addAttribute(src, 'investigation-counter', 1)
                break
            case 'chase':
                if ( collide(src, getPlayer(), 0) ) hitPlayer(src)
                else { 
                    addAttribute(src, 'state', 'lost')
                    addAttribute(src, 'lost-counter', '0')
                }
                break
            case 'move-to-position':
                addAttribute(src, 'state', 'investigate')
                break                 
        }
    }
    const currentX = Number(window.getComputedStyle(src).left.replace('px', ''))
    const currentY = Number(window.getComputedStyle(src).top.replace('px', ''))
    src.style.left = `${currentX + speed * xMultiplier}px`
    src.style.top = `${currentY + speed * yMultiplier}px`
}

export const calculateAngle = (src, x, y) => {
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

export const updateDestination = (enemy) => {
    addAttribute(enemy, 'player-x', Math.floor(getPlayerX() - getRoomLeft()))
    addAttribute(enemy, 'player-y', Math.floor(getPlayerY() - getRoomTop()))
}

export const moveToPlayer = (enemy) => {
    const next = createAndAddClass('div', 'dest')
    next.style.left = `${enemy.getAttribute('player-x')}px`
    next.style.top = `${enemy.getAttribute('player-y')}px`
    getCurrentRoom().append(next)
    moveToDestination(enemy, next)
    next.remove()
}

export const notifyEnemy = (dist, enemy) => {
    const state = enemy.getAttribute('state')
    if ( state === 'chase' || state === 'no-offence' ) return
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    if ( distance(playerBound.x, playerBound.y, enemyBound.x, enemyBound.y) <= dist ) {
        addAttribute(enemy, 'state', 'chase')
        updateDestination(enemy)
    }
}

export const damageEnemy = (enemy, equipped) => {
    const damage = getStat(equipped.name, 'damage', equipped.damagelvl)
    const enemyHealth = Number(enemy.getAttribute('health'))
    const newHealth = enemyHealth - damage
    addAttribute(enemy, 'health', newHealth)
    if ( newHealth <= 0 ) {
        const enemyCpu = window.getComputedStyle(enemy)
        addAttribute(enemy, 'left', enemyCpu.left.replace('px', ''))
        addAttribute(enemy, 'top', enemyCpu.top.replace('px', ''))
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
    const enemyLeft = Number(enemyCpu.left.replace('px', ''))
    const enemyTop = Number(enemyCpu.top.replace('px', ''))
    enemy.style.left = `${enemyLeft + xAxis * knockback}px`
    enemy.style.top = `${enemyTop + yAxis * knockback}px`
}