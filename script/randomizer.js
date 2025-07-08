import { startingPistol } from './data-manager.js'
import { Grabber } from './enemy/type/grabber.js'
import { RockCrusher, SoulDrinker, Torturer } from './enemy/type/normal-enemy.js'
import { Ranger } from './enemy/type/ranger.js'
import { Scorcher } from './enemy/type/scorcher.js'
import { Spiker } from './enemy/type/spiker.js'
import { Stinger } from './enemy/type/stinger.js'
import { Tracker } from './enemy/type/tracker.js'
import { getEnemies, getInteractables, getLoaders, getRooms, getWalls } from './entities.js'
import { getGunDetails } from './gun-details.js'
import { Coin, Crate, KeyDrop, Lever, Note } from './interactables.js'
import { BottomLoader, Door, LeftLoader, RightLoader, TopLoader } from './loader.js'
import { KeyLoot, Loot, NoteLoot, RANDOM } from './loot.js'
import { SinglePointPath } from './path.js'
import { Progress } from './progress.js'
import { Room } from './room.js'
import { AABB, difficulties } from './util.js'
import { getDifficulty } from './variables.js'
import { Wall } from './wall.js'

let doorMarks
let availableWeapons
const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const initMarks = () => {
    doorMarks = [
        'Apple',
        'Banana',
        'Cherry',
        'Grape',
        'Mango',
        'Peach',
        'Pineapple',
        'Strawberry',
        'Watermelon',
        'Lemon',
        'Wolf',
        'Lion',
        'Eagle',
        'Bear',
        'Fox',
        'Tiger',
        'Owl',
        'Snake',
        'Scorpion',
        'Shark',
        'Dragon',
        'Phoenix',
        'Griffin',
        'Kraken',
        'Unicorn',
        'Hydra',
        'Basilisk',
        'Chimera',
        'Minotaur',
        'Pegasus',
        'Joy',
        'Fear',
        'Anger',
        'Love',
        'Sadness',
        'Hope',
        'Despair',
        'Greed',
        'Envy',
        'Pride',
        'Rose',
        'Lily',
        'Tulip',
        'Daisy',
        'Orchid',
        'Sunflower',
        'Lavender',
        'Violet',
        'Peony',
        'Iris',
        'Sword',
        'Shield',
        'Helmet',
        'Bow',
        'Dagger',
        'Armor',
        'Spear',
        'Lantern',
        'Gauntlet',
        'Boots',
        'Pawn',
        'Knight',
        'Bishop',
        'Rook',
        'Queen',
        'King',
    ]
}

const initWeapons = () => {
    availableWeapons = getGunDetails()
        .keys()
        .map(item => item)
        .filter(item => item !== startingPistol)
}

export const generateRooms = () => {
    initMarks()
    initWeapons()
    const totalRooms = {
        [difficulties.MILD]: Math.floor(Math.random() * 21 + 67),
        [difficulties.MIDDLE]: Math.floor(Math.random() * 23 + 96),
        [difficulties.SURVIVAL]: Math.floor(Math.random() * 25 + 114),
    }[getDifficulty()]

    let roomsGenerated = [getRooms().get(100)]
    let roomId = 106
    while (roomsGenerated.length < totalRooms) {
        for (const generatedRoom of roomsGenerated) {
            if (!generatedRoom.branchingCount) {
                const currentRoomId = generatedRoom.id
                let numBranchingRooms =
                    currentRoomId === 100 ? 4 : getNumBranchingRooms(generatedRoom.width * generatedRoom.height)
                for (let j = 0; j < numBranchingRooms; j++) {
                    const newRoomId = roomId + 1
                    const { loader: newCurrentRoomLoader, dir } = generateNewLoader(generatedRoom, newRoomId)
                    const newRoom = new Room(
                        newRoomId,
                        Math.floor(Math.random() * 1000 + 750),
                        Math.floor(Math.random() * 1000 + 750),
                        `Room ${newRoomId}`,
                        10,
                        Progress.builder().setProgress2Active(newRoomId * 1000),
                        `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                    )
                    const newRoomLoader = generateNewLoaderAtDirection(
                        newRoom,
                        (() => {
                            if (dir === 'top') return 'bottom'
                            if (dir === 'left') return 'right'
                            if (dir === 'right') return 'left'
                            if (dir === 'bottom') return 'top'
                        })(),
                        currentRoomId,
                        newCurrentRoomLoader.width === 5 ? newCurrentRoomLoader.height : newCurrentRoomLoader.width,
                    )
                    getEnemies().set(newRoomId, [])
                    getInteractables().set(newRoomId, [])
                    getLoaders().set(newRoomId, [...(getLoaders().get(newRoomId) ?? []), newRoomLoader.loader])
                    getLoaders().set(currentRoomId, [...(getLoaders().get(currentRoomId) ?? []), newCurrentRoomLoader])

                    const walls = generateWalls(newRoom)
                    getWalls().set(newRoomId, walls)

                    getRooms().set(newRoomId, newRoom)
                    roomsGenerated.push(newRoom)
                    roomId++
                    if (roomsGenerated.length > totalRooms) break
                }

                generatedRoom.branchingCount = numBranchingRooms
                roomsGenerated.sort((a, b) => a.branchingCount - b.branchingCount)
                if (roomsGenerated.length > totalRooms) break
            }
        }
    }
}

const getNumBranchingRooms = area => {
    if (area >= 500000 && area < 750000) return 1
    else if (area >= 750000 && area < 1000000) return Math.ceil(Math.random() * 2)
    else if (area >= 1000000 && area < 1250000) return Math.ceil(Math.random() * 3)
    else if (area >= 1250000 && area < 1500000) return Math.ceil(Math.random() * 4)
    else if (area >= 1500000 && area < 1750000) return Math.ceil(Math.random() * 5)
    else return Math.ceil(Math.random() * 6)
}

const generateNewLoader = (room, room2Load) => {
    const currentRoomLoaders = getLoaders().get(room.id) ?? []
    const topLoaders = currentRoomLoaders.filter(loader => loader?.top === -26)
    const leftLoaders = currentRoomLoaders.filter(loader => loader?.left === -26)
    const rightLoaders = currentRoomLoaders.filter(loader => loader?.right === -26)
    const bottomLoaders = currentRoomLoaders.filter(loader => loader?.bottom === -26)
    const lowestAmountLoaders = [
        { data: topLoaders, dir: 'top' },
        { data: leftLoaders, dir: 'left' },
        { data: rightLoaders, dir: 'right' },
        { data: bottomLoaders, dir: 'bottom' },
    ]
        .filter((_, index) => {
            if (room.id === 100) {
                return index === 1 || index === 2
            }
            return true
        })
        .sort(() => Math.random() - 0.5)
        .sort((a, b) => a.data.length - b.data.length)[0]

    return generateNewLoaderAtDirection(room, lowestAmountLoaders.dir, room2Load)
}

const generateNewLoaderAtDirection = (room, dir, room2Load, _length) => {
    const currentRoomLoaders = getLoaders().get(room.id) ?? []
    const loadersAtSameDirection = currentRoomLoaders.filter(loader => loader && loader[dir] === -26)
    const length = _length ?? Math.floor(Math.random() * 50) + 100

    let min, max
    let comparator = Number.MIN_SAFE_INTEGER
    if (['top', 'bottom'].includes(dir)) {
        const sorted = loadersAtSameDirection.sort((a, b) => a.left - b.left)
        sorted.unshift({ left: 100, width: 0 })
        sorted.push({ left: room.width - 100, width: 0 })
        for (let i = 0; i < sorted.length; i++) {
            const a = sorted[i].left + 50 + sorted[i].width
            const b = sorted[i + 1]?.left ? sorted[i + 1].left - 50 : room.width - 100
            if (b - a > comparator) {
                min = a
                max = b
                comparator = b - a
            }
        }
        const position = Math.random() * (max - min - length) + min
        var loader =
            dir === 'top' ? new TopLoader(room2Load, length, position) : new BottomLoader(room2Load, length, position)
    } else {
        const sorted = loadersAtSameDirection.sort((a, b) => a.top - b.top)
        sorted.unshift({ top: 100, height: 0 })
        sorted.push({ top: room.height - 100, height: 0 })
        for (let i = 0; i < sorted.length; i++) {
            const a = sorted[i].top + 50 + sorted[i].height
            const b = sorted[i + 1]?.top ? sorted[i + 1].top - 50 : room.height - 100
            if (b - a > comparator) {
                min = a
                max = b
                comparator = b - a
            }
        }
        const position = Math.random() * (max - min - length) + min
        var loader =
            dir === 'left' ? new LeftLoader(room2Load, length, position) : new RightLoader(room2Load, length, position)
    }

    return { loader, dir }
}

const generateWalls = room => {
    const result = []
    const roomArea = (room.width - 300) * (room.height - 300)
    const divider = [5, 6, 7, 8, 9, 10, 11, 12, Infinity].sort(() => Math.random() - 0.5)[0]
    const requiredArea = roomArea / divider

    let currentArea = 0
    const roomMargin = 100

    while (currentArea < requiredArea) {
        const width = Math.floor(Math.random() * 200) + 100
        const height = Math.floor(Math.random() * 200) + 100

        const left = Math.random() * (room.width - 2 * roomMargin - width) + roomMargin
        const top = Math.random() * (room.height - 2 * roomMargin - height) + roomMargin

        if (
            !result.find(wall =>
                AABB(
                    {
                        top: wall.top,
                        left: wall.left,
                        right: wall.left + wall.width,
                        bottom: wall.top + wall.height,
                    },
                    {
                        top,
                        left,
                        right: left + width,
                        bottom: top + height,
                    },
                    120,
                ),
            )
        ) {
            result.push(new Wall(width, height, left, null, top, null, room.background.replace('0.2', '0.4')))
            currentArea += width * height
        }
    }

    return result
}

export const generatePath = () => {
    const usedRooms = [{ id: 100 }]
    const possibleEvents = {
        empty: ['empty'],
        lootOfAnEnemy: ['drop_key', 'drop_note'],
        default: ['key', 'lever', 'note', 'open_door', 'key_in_a_crate', 'note_in_a_crate'],
        bonus: [
            'coin',
            'weapon',
            'exit_key',
            'resources',
            'coin_kill_all',
            'weapon_kill_all',
            'exit_key_kill_all',
            'resources_kill_all',
            'exit_key_in_a_crate',
        ],
        killAll: [
            'spawn_key',
            'spawn_note',
            'spawn_lever',
            'open_the_door_in_the_same_room',
            'spawn_key_and_open_the_door_in_the_same_room',
            'spawn_bote_and_open_the_door_in_the_same_room',
            'spawn_lever_and_open_the_door_in_the_same_room',
        ],
    }

    const exitLevelKeys = []

    while (usedRooms.length < getRooms().size) {
        debugger
        for (const room of usedRooms) {
            debugger
            if (room.dealtWith) continue
            let decisions
            const loaders = getLoaders().get(room.id) ?? []
            const isLeaf = loaders.length === 1
            if (usedRooms.length === getRooms().size) {
                if (exitLevelKeys.length < 4) {
                    decisions = possibleEvents.bonus.filter(ev =>
                        ['exit_key', 'exit_key_kill_all', 'exit_key_in_a_crate'].includes(ev),
                    )
                } else {
                    decisions = Math.random() < 0.5 ? possibleEvents.bonus : possibleEvents.empty
                }
            } else if (room.id === 100) {
                decisions = ['open_door']
            } else if (Math.random() < 0.75) {
                decisions = possibleEvents.killAll
                if (isLeaf && Math.random() < 0.75) {
                    decisions = decisions.filter(ev => !ev.includes('open_the_door_in_the_same_room'))
                }
            } else if (Math.random() < 0.75) {
                decisions = possibleEvents.lootOfAnEnemy
                if (isLeaf) decisions = decisions.filter(ev => ev !== 'open_door')
            } else {
                decisions = possibleEvents.default
            }
            const finalDecision = decisions.sort(() => Math.random() - 0.5)[0]
            handleDecision(finalDecision, room.id, usedRooms, exitLevelKeys)
            room.dealtWith = true
        }
    }
}

let dontCareProgressCounter = Number.MIN_SAFE_INTEGER - 1
const handleDecision = (finalDecision, currentRoomId, usedRooms, exitLevelKeys) => {
    debugger
    spawnRandomEnemies(currentRoomId)
    if (finalDecision === 'drop_key') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        const chosenEnemy = getEnemies()
            .get(currentRoomId)
            .sort(() => Math.random())[0]
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    mark,
                    Progress.builder().setRenderProgress(dontCareProgressCounter--),
                )
            },
            usedRooms,
            currentRoomId,
            4,
        )
        chosenEnemy.loot = new KeyLoot(
            `${mark} key`,
            `A key with the mark of ${mark} hacked on its body`,
            Math.ceil(Math.random() * 15),
            mark,
        )
    } else if (finalDecision === 'drop_note') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        const chosenEnemy = getEnemies()
            .get(currentRoomId)
            .sort(() => Math.random())[0]
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    null,
                    Progress.builder().setRenderProgress(dontCareProgressCounter--),
                    mark,
                )
            },
            usedRooms,
            currentRoomId,
            1,
        )
        chosenEnemy.loot = new NoteLoot(
            `${mark} door`,
            `A note revealing the code for a door`,
            `I found the code for the door with the mark ${mark} on it. It's PLACE_CODE_HERE`,
            mark,
        )
    } else if (finalDecision === 'key') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    mark,
                    Progress.builder().setRenderProgress(dontCareProgressCounter--),
                )
            },
            usedRooms,
            currentRoomId,
            4,
        )
        const position = findPosition([...(getWalls().get(currentRoomId) ?? [])], getRooms().get(currentRoomId), 10, 10)
        const key = new KeyDrop(
            position.x,
            position.y,
            Math.ceil(Math.random() * 15),
            `${mark} key`,
            `A key with the mark of ${mark} hacked on its body`,
            mark,
        )
        getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), key])
    } else if (finalDecision === 'lever') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        const leverProgress2Active = dontCareProgressCounter--
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    null,
                    Progress.builder().setRenderProgress(leverProgress2Active),
                )
            },
            usedRooms,
            currentRoomId,
            3,
        )
        const position = findPosition(
            [...(getWalls().get(currentRoomId) ?? []), ...(getEnemies().get(currentRoomId) ?? [])],
            getRooms().get(currentRoomId),
            60,
            30,
        )
        const leverName = `${alphabets.sorted(() => Math.random() - 0.5)[0]}${
            alphabets.sorted(() => Math.random() - 0.5)[0]
        }${alphabets.sorted(() => Math.random() - 0.5)[0]}-${Math.ceil(Math.random() * 89) + 10}`

        const lever = new Lever(
            position.x,
            position.y,
            leverName,
            Progress.builder().setProgress2Active(leverProgress2Active),
        )
        const note = new Note(
            position.x + 45,
            position.y,
            `About the lever ${leverName}`,
            `Describing the effect of a lever`,
            `All the doors with the mark ${mark} can be opened by pulling the lever ${leverName}`,
        )
        getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), lever, note])
    } else if (finalDecision === 'note') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    null,
                    Progress.builder().setRenderProgress(dontCareProgressCounter--),
                    mark,
                )
            },
            usedRooms,
            currentRoomId,
            1,
        )
        const position = findPosition([...(getWalls().get(currentRoomId) ?? [])], getRooms().get(currentRoomId), 15, 15)
        const note = new Note(
            position.x,
            position.y,
            `For the ${mark} marked one`,
            `A note revealing the code for a door`,
            `If you wonder what that door with the ${mark} mark needs, it's just this code: PLACE_CODE_HERE`,
        )
        getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), note])
    } else if (finalDecision === 'open_door') {
        const loaders = getLoaders().get(currentRoomId)
        const options = loaders.filter(loader => !usedRooms.map(({ id }) => id).includes(Number(loader.className)))
        const selected = options.sort(() => Math.random() - 0.5)[0]
        usedRooms.push({ id: Number(selected.className) })
    } else if (finalDecision === 'key_in_a_crate') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    mark,
                    Progress.builder().setRenderProgress(dontCareProgressCounter--),
                )
            },
            usedRooms,
            currentRoomId,
            4,
        )
        const position = findPosition(
            [...(getWalls().get(currentRoomId) ?? []), ...(getEnemies().get(currentRoomId) ?? [])],
            getRooms().get(currentRoomId),
            35,
            35,
        )
        const crate = new Crate(
            position.x,
            position.y,
            new KeyLoot(
                `${mark} key`,
                `A key with the mark of ${mark} hacked on its body`,
                Math.ceil(Math.random() * 15),
                mark,
            ),
        )
        getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), crate])
    } else if (finalDecision === 'note_in_a_crate') {
        const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
        applyToLoaders(
            selectedRooms => (loader, index) => {
                loader.door = new Door(
                    `Room ${selectedRooms[index]}`,
                    `A door with the mark of ${mark}`,
                    mark,
                    Progress.builder().setRenderProgress(dontCareProgressCounter--),
                )
            },
            usedRooms,
            currentRoomId,
            1,
        )
        const position = findPosition(
            [...(getWalls().get(currentRoomId) ?? []), ...(getEnemies().get(currentRoomId) ?? [])],
            getRooms().get(currentRoomId),
            35,
            35,
        )
        const crate = new Crate(
            position.x,
            position.y,
            new NoteLoot(
                `${mark} door`,
                `A note revealing the code for a door`,
                `I found the code for the door with the mark ${mark} on it. It's PLACE_CODE_HERE`,
                mark,
            ),
        )
        getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), crate])
    } else if (finalDecision === 'spawn_key') {
        const killAll = getEnemies()
            .get(currentRoomId)
            .sort((a, b) => b.renderProgress - a.renderProgress)[0]
        spawnKillAllKey(killAll, usedRooms, currentRoomId)
    } else if (finalDecision === 'spawn_note') {
        const killAll = getEnemies()
            .get(currentRoomId)
            .sort((a, b) => b.renderProgress - a.renderProgress)[0]
        spawnKillAllNote(killAll, usedRooms, currentRoomId)
    } else if (finalDecision === 'spawn_lever') {
        const killAll = getEnemies()
            .get(currentRoomId)
            .sort((a, b) => b.renderProgress - a.renderProgress)[0]
        spawnKillAllLever(killAll, usedRooms, currentRoomId)
    } else if (finalDecision === 'open_the_door_in_the_same_room') {
        openDoorInTheSameRoom(currentRoomId, usedRooms)
    } else if (finalDecision === 'spawn_key_and_open_the_door_in_the_same_room') {
        const killAll = openDoorInTheSameRoom(currentRoomId, usedRooms)
        spawnKillAllKey(killAll, usedRooms, currentRoomId)
    } else if (finalDecision === 'spawn_note_and_open_the_door_in_the_same_room') {
        const killAll = openDoorInTheSameRoom(currentRoomId, usedRooms)
        spawnKillAllNote(killAll, usedRooms, currentRoomId)
    } else if (finalDecision === 'spawn_lever_open_the_door_in_the_same_room') {
        const killAll = openDoorInTheSameRoom(currentRoomId, usedRooms)
        spawnKillAllLever(killAll, usedRooms, currentRoomId)
    } else if (finalDecision === 'empty') {
        getEnemies().set(currentRoomId, [])
    } else if (finalDecision === 'coin') {
        let numberOfCoins = 19
        while (true) {
            numberOfCoins++
            if (Math.random() < 0.2) break
        }
        const killAll = getEnemies()
            .get(currentRoomId)
            .sort((a, b) => b.renderProgress - a.renderProgress)[0]
        const position = findPosition([...(getWalls().get(currentRoomId) ?? [])], getRooms().get(currentRoomId), 15, 15)
        const coin = new Coin(position.x, position.y, numberOfCoins, Progress.builder().setKillAll(killAll))
        getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), coin])
    } else if (finalDecision === 'resources') {
    } else if (finalDecision === 'weapon') {
    } else if (finalDecision === 'exit_key') {
    } else if (finalDecision === 'exit_key_in_a_crate') {
    } else if (finalDecision === 'exit_key_kill_all') {
    }
}

const applyToLoaders = (loaderCb, usedRooms, currentRoomId, maxNumDoorsToUnlock = 3) => {
    const isSoftLocked = checkIfIsSoftLocked(usedRooms, currentRoomId)
    if (isSoftLocked) var compulsaryRoom = getCompulsaryRoom(usedRooms, currentRoomId)

    const rooms2unlock = getRooms()
        .keys()
        .filter(id => !usedRooms.find(room => room.id !== id && (compulsaryRoom ? room.id !== compulsaryRoom : true)))

    if (compulsaryRoom) rooms2unlock.push(compulsaryRoom)

    const selectedRooms = rooms2unlock
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.ceil(Math.random() * (compulsaryRoom ? maxNumDoorsToUnlock - 1 : maxNumDoorsToUnlock)))
    const entrances = selectedRooms.map(
        id =>
            getLoaders()
                .get(id)
                .sort((a, b) => Number(a.className) - Number(b.className))[0].className,
    )
    const loaders = entrances.map((en, index) =>
        getLoaders()
            .get(en)
            .find(loader => Number(loader.className) === selectedRooms[index]),
    )
    loaders.forEach(loaderCb(selectedRooms))
    selectedRooms.forEach(roomId => usedRooms.push({ id: roomId }))
}

const checkIfIsSoftLocked = (usedRooms, currentRoomId) => {
    let found = false
    for (const room of usedRooms) {
        const branches = getLoaders.get(room.id).map(l => Number(l.className))
        for (const branch of branches) {
            const isUsedRoom = usedRooms.find(room => room.id === branch && room.id !== currentRoomId)
            if (isUsedRoom && !isUsedRoom.dealtWith) {
                found = true
                break
            }
        }
        if (found) break
    }
    return !found
}

const getCompulsaryRoom = (usedRooms, currentRoomId) => {
    let result
    const shuffledRooms = usedRooms.sort(() => Math.random() - 0.5)
    for (const room of shuffledRooms) {
        const branches = getLoaders
            .get(room.id)
            .sort(() => Math.random() - 0.5)
            .map(l => Number(l.className))

        for (const branch of branches) {
            const isNotUsedRoom = !usedRooms.find(room => room.id === branch && room.id !== currentRoomId)
            if (isNotUsedRoom) {
                result = branch
                break
            }
        }
        if (result) break
    }
    return result
}

const spawnKillAllKey = (killAll, usedRooms, currentRoomId) => {
    const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
    applyToLoaders(
        selectedRooms => (loader, index) => {
            loader.door = new Door(
                `Room ${selectedRooms[index]}`,
                `A door with the mark of ${mark}`,
                mark,
                Progress.builder().setRenderProgress(dontCareProgressCounter--),
            )
        },
        usedRooms,
        currentRoomId,
        4,
    )
    const position = findPosition([...(getWalls().get(currentRoomId) ?? [])], getRooms().get(currentRoomId), 10, 10)
    const key = new KeyDrop(
        position.x,
        position.y,
        Math.ceil(Math.random() * 15),
        `${mark} key`,
        `A key with the mark of ${mark} hacked on its body`,
        mark,
        Progress.builder().setKillAll(killAll),
    )
    getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), key])
}

const spawnKillAllNote = (killAll, usedRooms, currentRoomId) => {
    const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
    applyToLoaders(
        selectedRooms => (loader, index) => {
            loader.door = new Door(
                `Room ${selectedRooms[index]}`,
                `A door with the mark of ${mark}`,
                null,
                Progress.builder().setRenderProgress(dontCareProgressCounter--),
                mark,
            )
        },
        usedRooms,
        currentRoomId,
        1,
    )
    const position = findPosition([...(getWalls().get(currentRoomId) ?? [])], getRooms().get(currentRoomId), 15, 15)
    const note = new Note(
        position.x,
        position.y,
        `For the ${mark} marked one`,
        `A note revealing the code for a door`,
        `If you wonder what that door with the ${mark} mark needs, it's just this code: PLACE_CODE_HERE`,
        Progress.builder().setKillAll(killAll),
    )
    getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), note])
}

const spawnKillAllLever = (killAll, usedRooms, currentRoomId) => {
    const mark = doorMarks.sort(() => Math.random() - 0.5).shift()
    const leverProgress2Active = dontCareProgressCounter--
    applyToLoaders(
        selectedRooms => (loader, index) => {
            loader.door = new Door(
                `Room ${selectedRooms[index]}`,
                `A door with the mark of ${mark}`,
                null,
                Progress.builder().setRenderProgress(leverProgress2Active),
            )
        },
        usedRooms,
        currentRoomId,
        3,
    )
    const position = findPosition(
        [...(getWalls().get(currentRoomId) ?? []), ...(getEnemies().get(currentRoomId) ?? [])],
        getRooms().get(currentRoomId),
        60,
        30,
    )
    const leverName = `${alphabets.sorted(() => Math.random() - 0.5)[0]}${
        alphabets.sorted(() => Math.random() - 0.5)[0]
    }${alphabets.sorted(() => Math.random() - 0.5)[0]}-${Math.ceil(Math.random() * 89) + 10}`

    const lever = new Lever(
        position.x,
        position.y,
        leverName,
        Progress.builder().setProgress2Active(leverProgress2Active).setKillAll(killAll),
    )
    const note = new Note(
        position.x + 45,
        position.y,
        `About the lever ${leverName}`,
        `Describing the effect of a lever`,
        `All the doors with the mark ${mark} can be opened by pulling the lever ${leverName}`,
        Progress.builder().setKillAll(killAll),
    )
    getInteractables().set(currentRoomId, [...(getInteractables().get(currentRoomId) ?? []), lever, note])
}

const openDoorInTheSameRoom = (currentRoomId, usedRooms) => {
    const killAll = getEnemies()
        .get(currentRoomId)
        .sort((a, b) => b.renderProgress - a.renderProgress)[0]
    const loader2Unlock = getLoaders()
        .get(currentRoomId)
        .filter(l => !usedRooms.find(room => room.id === Number(l.className)))
        .sort(() => Math.random() - 0.5)[0]
    loader2Unlock.door = new Door(
        `Room ${loader2Unlock.className}`,
        `Fetch all souls to retreive your freedom`,
        null,
        Progress.builder().setKillAll(killAll),
    )
    return killAll
}

const spawnRandomEnemies = currentRoomId => {
    const enemies = [Torturer, SoulDrinker, RockCrusher, Ranger, Stinger, Scorcher, Grabber, Tracker]

    const room = getRooms().get(currentRoomId)
    const walls = [...getWalls().get(currentRoomId)]

    const stealth = Math.random() < 0.2

    if (false) {
    } else {
        enemies.push(Spiker)
        const numberOfEnemies = (() => {
            const possibility = (() => {
                if (getDifficulty() === difficulties.MILD) return 0.75
                else if (getDifficulty() === difficulties.MIDDLE) return 0.7
                else return 0.65
            })()

            let count = Math.ceil(Math.random() * 5)
            while (true) {
                count++
                if (Math.random() < possibility) {
                    break
                }
            }
            return count
        })()
        let waves = []
        while (true) {
            const total = waves.reduce((a, b) => a + b, 0)
            if (total >= numberOfEnemies) break
            const currentWaveCount = Math.ceil(Math.random() * (numberOfEnemies - total))
            waves.push(currentWaveCount)
        }

        for (const wave of waves) {
            for (let i = 0; i < wave; i++) {
                const Enemy = enemies.sort(() => Math.random() - 0.5)[0]
                const position = findPosition(walls, room, 50, 50)
                const { x, y } = position
                const level = 1 + (currentRoomId - 100) * 0.1
                const progress = Progress.builder().setRenderProgress((currentRoomId + i) * 1000)
                if (i !== 0) progress.setKillAll(currentRoomId + i - 1 * 1000)
                const instance = new Enemy(level, new SinglePointPath(x, y), new Loot(RANDOM), progress)
                getEnemies().set(currentRoomId, [...(getEnemies().get(currentRoomId) ?? []), instance])
            }
        }
    }
}

const findPosition = (walls, room, width, height) => {
    let x, y
    const roomMargin = 100

    while (true) {
        const left = Math.random() * (room.width - 2 * roomMargin - width) + roomMargin
        const top = Math.random() * (room.height - 2 * roomMargin - height) + roomMargin

        if (
            !walls.find(wall =>
                AABB(
                    {
                        top: wall.top,
                        left: wall.left,
                        right: wall.left + wall.width,
                        bottom: wall.top + wall.height,
                    },
                    {
                        top,
                        left,
                        right: left + width,
                        bottom: top + height,
                    },
                    50,
                ),
            )
        ) {
            walls.push({ left, top, width, height })
            x = left
            y = top
            break
        }
    }

    return { x, y }
}
