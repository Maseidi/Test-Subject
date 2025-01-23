import { getCurrentRoomLoaders, getCurrentRoomSolid, getMapEl, getPlayer } from './elements.js'
import { getGunDetail } from './gun-details.js'
import { containsClass, getProperty } from './util.js'
import {
    getHealth,
    getMapX,
    getMapY,
    getPlayerAimAngle,
    getPlayerX,
    getPlayerY,
    setMapX,
    setMapY,
    setPlayerX,
    setPlayerY,
} from './variables.js'

const knockObject = (direction, entity, knock) => directionMapper.get(direction).callback(entity, knock)

const handleDownKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getSolidObjects(entity), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.top + 5 > entityBound.bottom && horizontalPredicate(solidBound, entityBound))
        .sort((a, b) => a.top - b.top)[0]
    if (!wallBound) return knock
    const distance = wallBound.top - entityBound.bottom
    if (distance < knock) return distance
    else return knock
}

const handleRightKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getSolidObjects(entity), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.left + 5 > entityBound.right && verticalPredicate(solidBound, entityBound))
        .sort((a, b) => a.left - b.left)[0]
    if (!wallBound) return knock
    const distance = wallBound.left - entityBound.right
    if (distance < knock) return distance
    else return knock
}

const handleLeftKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getSolidObjects(entity), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.right - 5 < entityBound.left && verticalPredicate(solidBound, entityBound))
        .sort((a, b) => b.right - a.right)[0]
    if (!wallBound) return knock
    const distance = entityBound.left - wallBound.right
    if (distance < knock) return distance
    else return knock
}

const handleUpKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getSolidObjects(entity), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.bottom - 5 < entityBound.top && horizontalPredicate(solidBound, entityBound))
        .sort((a, b) => b.bottom - a.bottom)[0]
    if (!wallBound) return knock
    const distance = entityBound.top - wallBound.bottom
    if (distance < knock) return distance
    else return knock
}

const directionMapper = new Map([
    ['U', { callback: handleUpKnock, x: 0, y: 1 }],
    ['L', { callback: handleLeftKnock, x: 1, y: 0 }],
    ['D', { callback: handleDownKnock, x: 0, y: -1 }],
    ['R', { callback: handleRightKnock, x: -1, y: 0 }],
])

const verticalPredicate = (a, b) =>
    (a.top < b.bottom && b.bottom < a.bottom) ||
    (a.bottom > b.top && b.top > a.top) ||
    (a.top > b.top && b.bottom > a.top) ||
    (a.bottom < b.bottom && b.top < a.bottom)

const horizontalPredicate = (a, b) =>
    (a.left < b.left && b.left < a.right) ||
    (a.right > b.right && b.right > a.left) ||
    (a.left > b.left && b.right > a.left) ||
    (a.right < b.right && b.left < a.right)

const getSolidObjects = entity =>
    containsClass(entity, 'enemy')
        ? getCurrentRoomSolid().filter(solid => !containsClass(solid, 'enemy-collider'))
        : getCurrentRoomSolid()

export const knockPlayer = (direction, knock) => {
    if (getHealth() === 0) return
    const finalKnock = knockObject(direction, getPlayer(), knock)
    const { x, y } = directionMapper.get(direction)
    setMapX(x * finalKnock + getMapX())
    setMapY(y * finalKnock + getMapY())
    setPlayerX(-x * finalKnock + getPlayerX())
    setPlayerY(-y * finalKnock + getPlayerY())
    getMapEl().style.left = `${getMapX()}px`
    getMapEl().style.top = `${getMapY()}px`
    getPlayer().style.left = `${getPlayerX()}px`
    getPlayer().style.top = `${getPlayerY()}px`
}

export const knockEnemy = (enemy, gunName) => {
    const sprite = enemy.sprite
    const knock = getGunDetail(gunName, 'knock')
    const playerAngle = getPlayerAimAngle()

    const currentEnemyLeft = getProperty(sprite, 'left', 'px')
    const currentEnemyTop = getProperty(sprite, 'top', 'px')

    if ((playerAngle >= 0 && playerAngle < 45) || (playerAngle >= -45 && playerAngle < 0)) {
        const y = currentEnemyTop + knockObject('D', sprite, knock)
        enemy.y = y
        sprite.style.top = `${y}px`
    } else if (playerAngle >= 45 && playerAngle < 135) {
        const x = currentEnemyLeft - knockObject('L', sprite, knock)
        enemy.x = x
        sprite.style.left = `${x}px`
    } else if ((playerAngle >= 135 && playerAngle < 180) || (playerAngle >= -180 && playerAngle < -135)) {
        const y = currentEnemyTop - knockObject('U', sprite, knock)
        enemy.y = y
        sprite.style.top = `${y}px`
    } else {
        const x = currentEnemyLeft + knockObject('R', sprite, knock)
        enemy.x = x
        sprite.style.left = `${x}px`
    }
}
