import {
    getCurrentRoom,
    getCurrentRoomDoors,
    getCurrentRoomEnemies,
    getCurrentRoomLoaders,
    getCurrentRoomPowerUps,
    getCurrentRoomSolid,
    getRoomContainer,
    setCurrentRoom,
    setCurrentRoomBullets,
    setCurrentRoomDoors,
    setCurrentRoomEnemies,
    setCurrentRoomExplosions,
    setCurrentRoomFlames,
    setCurrentRoomLoaders,
    setCurrentRoomPoisons,
    setCurrentRoomPowerUps,
    setCurrentRoomSolid,
    setCurrentRoomThrowables,
} from './elements.js'
import { CHASE, SCORCHER, SPIKER } from './enemy/enemy-constants.js'
import { getEnemies, getLoaders, getRooms, getWalls } from './entities.js'
import { hasProgress, initializeRoomCombat, roomClearedFlag } from './progress-manager.js'
import {
    ANGLE_STATE_MAP,
    addClass,
    addFireEffect,
    appendAll,
    createAndAddClass,
    renderShadow,
} from './util.js'
import {
    getCurrentRoomId,
    getPlayerX,
    getPlayerY,
    getRoomLeft,
    getRoomTop,
    setStunnedCounter,
} from './variables.js'
import { Wall } from './wall.js'

export const loadCurrentRoom = () => {
    setStunnedCounter(0)
    if (getCurrentRoomId() !== 50) document.querySelector('.campaign-boss-health')?.remove()
    initializeElements()
    renderRoom()
    renderWalls()
    renderLoaders()
    renderPreviouslyActiveEnemies()
    initializeRoomCombat()
}

const initializeElements = () => {
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    setCurrentRoomEnemies([])
    setCurrentRoomBullets([])
    setCurrentRoomFlames([])
    setCurrentRoomPoisons([])
    setCurrentRoomThrowables([])
    setCurrentRoomExplosions([])
    setCurrentRoomDoors([])
    setCurrentRoomPowerUps([])
}

const renderRoom = () => {
    const roomObject = getRooms().get(getCurrentRoomId())
    const room = createAndAddClass('div', 'room', `room-${getCurrentRoomId()}`)
    room.style.width = `${roomObject.width}px`
    room.style.height = `${roomObject.height}px`
    room.style.left = `${getRoomLeft()}px`
    room.style.top = `${getRoomTop()}px`
    room.style.background = roomObject.background
    renderShadow(roomObject.brightness * 10)
    setCurrentRoom(room)
    getRoomContainer().append(room)
}

const renderWalls = () => {
    ;[...getWalls().get(getCurrentRoomId()), ...getSideWalls()].forEach((wallObject, index) => {
        const wall = createAndAddClass('div', 'solid', 'wall')
        wall.id = `wall-${index + 1}`
        wall.style.width = `${wallObject.width}px`
        wall.style.height = `${wallObject.height}px`
        wall.style.backgroundColor = wallObject.background
        if (wallObject.left !== null) wall.style.left = `${wallObject.left}px`
        else if (wallObject.right !== null) wall.style.right = `${wallObject.right}px`
        if (wallObject.top !== null) wall.style.top = `${wallObject.top}px`
        else if (wallObject.bottom !== null) wall.style.bottom = `${wallObject.bottom}px`
        wall.setAttribute('side', Boolean(wallObject.side))
        if (!wallObject.side) createTrackers(wall, wallObject)
        getCurrentRoom().append(wall)
        getCurrentRoomSolid().push(wall)
    })
}

const getSideWalls = () => {
    const result = []
    const room = getRooms().get(getCurrentRoomId())
    const all = getAllLoaders()
    for (const side of ['top', 'bottom', 'left', 'right']) {
        const horizontal = ['top', 'bottom'].includes(side)
        const positionKey = horizontal ? 'left' : 'top'
        const sizeKey = horizontal ? 'width' : 'height'
        const fullLength = horizontal ? room.width : room.height
        let cursor = 0
        for (const loader of all[side]) {
            const start = loader[positionKey]
            if (start > cursor) {
                result.push(
                    new Wall(
                        horizontal ? start - cursor : 5,
                        horizontal ? 5 : start - cursor,
                        side === 'left' ? 0 : horizontal ? cursor : null,
                        side === 'right' ? 0 : null,
                        side === 'top' ? 0 : !horizontal ? cursor : null,
                        side === 'bottom' ? 0 : null,
                        null,
                        true,
                    ),
                )
            }
            cursor = Math.max(cursor, start + loader[sizeKey])
        }
        if (cursor < fullLength) {
            result.push(
                new Wall(
                    horizontal ? fullLength - cursor : 5,
                    horizontal ? 5 : fullLength - cursor,
                    side === 'left' ? 0 : horizontal ? cursor : null,
                    side === 'right' ? 0 : null,
                    side === 'top' ? 0 : !horizontal ? cursor : null,
                    side === 'bottom' ? 0 : null,
                    null,
                    true,
                ),
            )
        }
    }
    return result
}

const getAllLoaders = () => ({
    top: filterLoadersByPosition('top'),
    left: filterLoadersByPosition('left'),
    right: filterLoadersByPosition('right'),
    bottom: filterLoadersByPosition('bottom'),
})

const filterLoadersByPosition = side => {
    const horizontal = ['top', 'bottom'].includes(side)
    const size = horizontal ? 'height' : 'width'
    const position = horizontal ? 'left' : 'top'
    return getLoaders()
        .get(getCurrentRoomId())
        .filter(loader => loader[size] === 5 && loader[side] === -26)
        .sort((a, b) => a[position] - b[position])
}

const createTrackers = (solid, wall) => {
    const corners = [
        ['tl', wall.left !== 0 && wall.top !== 0],
        ['tr', wall.right !== 0 && wall.top !== 0],
        ['bl', wall.left !== 0 && wall.bottom !== 0],
        ['br', wall.right !== 0 && wall.bottom !== 0],
    ]
    corners.filter(([, enabled]) => enabled).forEach(([name]) => solid.append(createAndAddClass('div', name)))
}

const renderLoaders = () => {
    const open = hasProgress(roomClearedFlag(getCurrentRoomId()))
    getLoaders()
        .get(getCurrentRoomId())
        .forEach(loaderObject => {
            const loader = createAndAddClass('div', String(loaderObject.className), 'loader')
            loader.style.width = `${loaderObject.width}px`
            loader.style.height = `${loaderObject.height}px`
            if (loaderObject.left !== null) loader.style.left = `${loaderObject.left}px`
            else if (loaderObject.right !== null) loader.style.right = `${loaderObject.right}px`
            if (loaderObject.top !== null) loader.style.top = `${loaderObject.top}px`
            else if (loaderObject.bottom !== null) loader.style.bottom = `${loaderObject.bottom}px`
            loader.dataset.open = String(open || !loaderObject.door)
            if (loaderObject.door) renderDoor(loaderObject, open)
            getCurrentRoom().append(loader)
            getCurrentRoomLoaders().push(loader)
        })
}

const renderDoor = (loader, open) => {
    const door = createAndAddClass('div', 'door', loader.width > loader.height ? `ver-${loader.door.type}` : `hor-${loader.door.type}`)
    door.setAttribute('target-room', loader.className)
    door.setAttribute('campaign', true)
    door.style.width = `${loader.width}px`
    door.style.height = `${loader.height}px`
    const positions = { left: loader.left, right: loader.right, top: loader.top, bottom: loader.bottom }
    Object.entries(positions).forEach(([direction, value]) => {
        if (value === null) return
        door.style[direction] = `${Math.abs(value) === 26 ? 0 : value}px`
    })
    if (open) addClass(door, 'open')
    else getCurrentRoomSolid().push(door)
    getCurrentRoomDoors().push(door)
    getCurrentRoom().append(door)
}

export const setRoomDoorsOpen = open => {
    getCurrentRoomDoors().forEach(door => {
        door.classList.toggle('open', open)
        if (open) setCurrentRoomSolid(getCurrentRoomSolid().filter(solid => solid !== door))
        else if (!getCurrentRoomSolid().includes(door)) getCurrentRoomSolid().push(door)
    })
    getCurrentRoomLoaders().forEach(loader => (loader.dataset.open = String(open)))
}

const renderPreviouslyActiveEnemies = () => {
    getEnemies()
        .get(getCurrentRoomId())
        .forEach((enemy, index) => {
            enemy.index = index
            if (enemy.health > 0 && enemy.spawnState === 'active') spawnEnemy(enemy)
        })
}

export const spawnEnemy = enemyObject => {
    if (getCurrentRoomEnemies().includes(enemyObject)) return
    initializeEnemyStats(enemyObject)
    createPath(enemyObject)
    const enemy = createAndAddClass('div', enemyObject.type, 'enemy')
    enemy.style.left = `${enemyObject.x}px`
    enemy.style.top = `${enemyObject.y}px`
    const collider = createAndAddClass('div', 'enemy-collider', `${enemyObject.type}-collider`)
    const body = createAndAddClass('div', 'enemy-body', `${enemyObject.type}-body`, 'body-transition')
    body.style.transform = `rotateZ(${enemyObject.angle}deg)`
    body.style.backgroundColor = enemyObject.virus
    if (enemyObject.type === SPIKER) body.classList.remove('body-transition')
    defineEnemyComponents(enemyObject, body)
    const vision = createAndAddClass('div', 'vision')
    vision.style.height = `${enemyObject.vision}px`
    appendAll(collider, body, vision)
    enemy.append(collider)
    getCurrentRoom().append(enemy)
    enemyObject.sprite = enemy
    enemyObject.spawnState = 'active'
    body.addEventListener('transitionend', () => (enemyObject.isTransitioning = false))
    getCurrentRoomEnemies().push(enemyObject)
    getCurrentRoomSolid().push(collider)
}

export const selectFarthestSpawnPoint = (spawnPoints, activeEnemies, playerX, playerY) => {
    const available = spawnPoints.filter(point =>
        activeEnemies.every(enemy => Math.hypot(point.x - enemy.x, point.y - enemy.y) >= 80),
    )
    const candidates = available.length ? available : spawnPoints
    return [...candidates].sort(
        (a, b) =>
            Math.hypot(b.x + 27.5 - playerX, b.y + 27.5 - playerY) -
            Math.hypot(a.x + 27.5 - playerX, a.y + 27.5 - playerY),
    )[0]
}

export const spawnEnemyAtFarthestPoint = enemyObject => {
    const room = getRooms().get(getCurrentRoomId())
    const playerX = getPlayerX() - getRoomLeft() + 17
    const playerY = getPlayerY() - getRoomTop() + 17
    const spawnPoints = room.spawnPoints?.length
        ? room.spawnPoints
        : [{ x: enemyObject.x, y: enemyObject.y }]
    const point = selectFarthestSpawnPoint(
        spawnPoints,
        getCurrentRoomEnemies().filter(enemy => enemy.health > 0),
        playerX,
        playerY,
    )

    enemyObject.x = point.x
    enemyObject.y = point.y
    enemyObject.waypoint ??= { points: [] }
    enemyObject.waypoint.points ??= []
    enemyObject.waypoint.points[0] = { x: point.x, y: point.y }
    spawnEnemy(enemyObject)
}

const initializeEnemyStats = enemy => {
    enemy.angle = Math.ceil(Math.random() * 8) * 45 - 180
    enemy.angleState = ANGLE_STATE_MAP.get(enemy.angle)
    enemy.state = CHASE
    enemy.investigationCounter = 0
    enemy.pathPoint = 0
    enemy.pathFindingX = null
    enemy.pathFindingY = null
    enemy.currentSpeed = enemy.acceleration
    enemy.accelerationCounter = 0
    enemy.notificationService.updateDestination2Player()
}

const createPath = enemy => {
    const path = document.createElement('div')
    path.id = `path-${enemy.index}`
    for (const pointObject of enemy.waypoint.points) {
        const point = createAndAddClass('div', 'path-point')
        point.style.left = `${pointObject.x}px`
        point.style.top = `${pointObject.y}px`
        path.append(point)
    }
    getCurrentRoom().append(path)
}

const defineEnemyComponents = (enemy, body) => {
    for (let index = 1; index < enemy.components; index++) {
        const fireComponent = index === enemy.components - 1 && enemy.type === SCORCHER
        const component = fireComponent ? addFireEffect() : document.createElement('div')
        if (!fireComponent) component.style.backgroundColor = enemy.virus
        addClass(component, `${enemy.type}-component`)
        body.append(component)
    }
}

export const spawnPowerUp = (type, left, top) => {
    const powerUp = createAndAddClass('div', 'power-up', 'animation')
    powerUp.dataset.powerUp = type
    powerUp.style.left = `${left}px`
    powerUp.style.top = `${top}px`
    const image = new Image()
    image.src = type === 'health' ? './assets/images/bandage.png' : './assets/images/smgAmmo.png'
    image.alt = type === 'health' ? 'full health' : 'maximum ammo'
    powerUp.append(image)
    getCurrentRoom().append(powerUp)
    getCurrentRoomPowerUps().push(powerUp)
    return powerUp
}
