import { Door } from './loader.js'

const ROOM_COUNT = 50
const ENEMY_LEVEL = 2.5
const ENEMY_TYPES = [
    'torturer',
    'soul-drinker',
    'rock-crusher',
    'ranger',
    'spiker',
    'tracker',
    'grabber',
    'scorcher',
    'stinger',
]
const COLORS = ['red', 'green', 'yellow', 'blue', 'purple']
const SIDES = ['top', 'right', 'bottom', 'left']
const OPPOSITE = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }

const seededRandom = seed => {
    let value = seed >>> 0
    return () => {
        value = (value * 1664525 + 1013904223) >>> 0
        return value / 4294967296
    }
}

const emptyRoomMap = () => new Map(Array.from({ length: ROOM_COUNT }, (_, index) => [index + 1, []]))

const overlaps = (a, b, margin = 0) =>
    a.left < b.left + b.width + margin &&
    a.left + a.width + margin > b.left &&
    a.top < b.top + b.height + margin &&
    a.top + a.height + margin > b.top

const makeWalls = (room, random) => {
    const walls = []
    const targetCount = 2 + (room.id % 5)
    let attempts = 0
    while (walls.length < targetCount && attempts++ < 300) {
        const horizontal = random() < 0.5
        const width = horizontal ? 150 + Math.floor(random() * 210) : 55 + Math.floor(random() * 65)
        const height = horizontal ? 55 + Math.floor(random() * 65) : 150 + Math.floor(random() * 210)
        const candidate = {
            width,
            height,
            left: 140 + Math.floor(random() * (room.width - width - 280)),
            right: null,
            top: 140 + Math.floor(random() * (room.height - height - 280)),
            bottom: null,
            background: room.id % 2 ? '#59636a' : '#62685f',
            side: false,
        }
        if (walls.some(wall => overlaps(candidate, wall, 100))) continue
        walls.push(candidate)
    }
    return walls
}

const makeSpawnPoints = (room, walls, random) => {
    const inset = 90
    const pointSize = 55
    const points = []
    const candidates = [
        { x: inset, y: inset },
        { x: Math.floor(room.width / 2 - pointSize / 2), y: inset },
        { x: room.width - inset - pointSize, y: inset },
        { x: room.width - inset - pointSize, y: Math.floor(room.height / 2 - pointSize / 2) },
        { x: room.width - inset - pointSize, y: room.height - inset - pointSize },
        { x: Math.floor(room.width / 2 - pointSize / 2), y: room.height - inset - pointSize },
        { x: inset, y: room.height - inset - pointSize },
        { x: inset, y: Math.floor(room.height / 2 - pointSize / 2) },
    ]
    const safe = point => {
        const bounds = { left: point.x, top: point.y, width: pointSize, height: pointSize }
        if (walls.some(wall => overlaps(bounds, wall, 70))) return false
        return points.every(other => Math.hypot(point.x - other.x, point.y - other.y) >= 130)
    }

    candidates.forEach(point => {
        if (safe(point)) points.push(point)
    })
    for (let attempt = 0; points.length < 8 && attempt < 500; attempt++) {
        const point = {
            x: inset + Math.floor(random() * (room.width - pointSize - inset * 2)),
            y: inset + Math.floor(random() * (room.height - pointSize - inset * 2)),
        }
        if (safe(point)) points.push(point)
    }
    return points
}

const loaderForSide = (target, side, offset, door) => ({
    className: target,
    width: ['top', 'bottom'].includes(side) ? 110 : 5,
    height: ['left', 'right'].includes(side) ? 110 : 5,
    left: side === 'left' ? -26 : ['top', 'bottom'].includes(side) ? offset : null,
    right: side === 'right' ? -26 : null,
    top: side === 'top' ? -26 : ['left', 'right'].includes(side) ? offset : null,
    bottom: side === 'bottom' ? -26 : null,
    door,
})

const doorOffset = (room, side, random) => {
    const length = ['top', 'bottom'].includes(side) ? room.width : room.height
    return 100 + Math.floor(random() * (length - 310))
}

const chooseExitSide = (roomId, incomingSide) => {
    const start = (roomId * 7 + Math.floor(roomId / 3)) % SIDES.length
    for (let offset = 0; offset < SIDES.length; offset++) {
        const side = SIDES[(start + offset) % SIDES.length]
        if (side !== incomingSide) return side
    }
    return 'right'
}

const connectRooms = (rooms, loaders) => {
    let incomingSide = null
    for (let roomId = 1; roomId < ROOM_COUNT; roomId++) {
        const current = rooms.get(roomId)
        const next = rooms.get(roomId + 1)
        const random = seededRandom(7001 + roomId * 991)
        const outgoingSide = chooseExitSide(roomId, incomingSide)
        const nextIncomingSide = OPPOSITE[outgoingSide]
        const currentDoor = new Door(1 + (roomId % 2))
        const nextDoor = new Door(1 + ((roomId + 1) % 2))
        loaders.get(roomId).push(
            loaderForSide(roomId + 1, outgoingSide, doorOffset(current, outgoingSide, random), currentDoor),
        )
        loaders.get(roomId + 1).push(
            loaderForSide(roomId, nextIncomingSide, doorOffset(next, nextIncomingSide, random), nextDoor),
        )
        incomingSide = nextIncomingSide
    }
}

const safeSpawnPosition = (room, walls, occupied, random) => {
    for (let attempt = 0; attempt < 500; attempt++) {
        const point = {
            left: 90 + Math.floor(random() * (room.width - 180)),
            top: 90 + Math.floor(random() * (room.height - 180)),
            width: 55,
            height: 55,
        }
        if (walls.some(wall => overlaps(point, wall, 75))) continue
        if (occupied.some(other => Math.hypot(point.left - other.x, point.top - other.y) < 70)) continue
        return { x: point.left, y: point.top }
    }
    const index = occupied.length
    return { x: 100 + (index % 10) * 80, y: 100 + Math.floor(index / 10) * 80 }
}

const enemyForRoom = (room, walls, occupied, random, type = null) => {
    const { x, y } = safeSpawnPosition(room, walls, occupied, random)
    occupied.push({ x, y })
    return {
        type: type ?? ENEMY_TYPES[Math.floor(random() * ENEMY_TYPES.length)],
        waypoint: { points: [{ x, y }] },
        x,
        y,
        level: ENEMY_LEVEL,
        spawnState: 'pending',
        virus: COLORS[Math.floor(random() * COLORS.length)],
        knockImmune: type === 'campaign-boss',
        healthMultiplier: 1,
    }
}

const makeEnemies = (room, walls) => {
    const random = seededRandom(3109 + room.id * 1613)
    const total = room.id + 5
    const occupied = []
    const enemies = []
    for (let index = 0; index < total; index++) {
        const boss = room.id === ROOM_COUNT && index === total - 1
        enemies.push(enemyForRoom(room, walls, occupied, random, boss ? 'campaign-boss' : null))
    }
    return enemies
}

export const buildCampaign = () => {
    const rooms = new Map()
    const walls = emptyRoomMap()
    const loaders = emptyRoomMap()
    const enemies = emptyRoomMap()

    for (let id = 1; id <= ROOM_COUNT; id++) {
        const room = {
            id,
            width: 1000 + (id % 5) * 120,
            height: 1000 + ((id * 3) % 5) * 110,
            brightness: 10,
            background: id % 3 === 0 ? '#687177' : id % 3 === 1 ? '#777e83' : '#70766f',
            spawnPoints: [],
        }
        rooms.set(id, room)
        const roomWalls = makeWalls(room, seededRandom(1013 + id * 811))
        room.spawnPoints = makeSpawnPoints(room, roomWalls, seededRandom(5003 + id * 1291))
        walls.set(id, roomWalls)
        enemies.set(id, makeEnemies(room, roomWalls))
    }

    connectRooms(rooms, loaders)
    return { rooms, walls, loaders, enemies }
}

export const getRoomCount = () => ROOM_COUNT
