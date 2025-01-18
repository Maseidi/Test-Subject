import { buildEnemy } from '../enemy/enemy-factory.js'
import {
    getDialogues,
    getEnemies,
    getInteractables,
    getLoaders,
    getPopups,
    getRoomBeingMade,
    getRooms,
    getShop,
    getSpawnRoom,
    getSpawnX,
    getSpawnY,
    getTimesSaved,
    getWalls,
    setDialogues,
    setEnemies,
    setInteractables,
    setItemBeingModified,
    setLoaders,
    setPopups,
    setRoomBeingMade,
    setRooms,
    setShop,
    setSpawnRoom,
    setSpawnX,
    setSpawnY,
    setTimesSaved,
    setWalls,
} from './variables.js'

export const prepareNewMapMakerData = () => {
    setRoomBeingMade(null)
    setItemBeingModified(null)
    setRooms([])
    setWalls(new Map([]))
    setLoaders(new Map([]))
    setInteractables(new Map([]))
    setEnemies(new Map([]))
    setPopups([])
    setDialogues([])
    setShop([])
    setSpawnRoom(null)
    setSpawnX(20)
    setSpawnY(20)
    setTimesSaved(0)
}

export const saveMapMakerAtSlot = slotNumber => {
    setTimesSaved(getTimesSaved() + 1)
    saveStats(slotNumber)
    saveRooms(slotNumber)
    saveWalls(slotNumber)
    saveLoaders(slotNumber)
    saveInteractables(slotNumber)
    saveEnemies(slotNumber)
    saveShopItems(slotNumber)
    savePopups(slotNumber)
    saveDialogues(slotNumber)
}

const saveStats = slotNumber =>
    localStorage.setItem(
        `map-slot-${slotNumber}`,
        JSON.stringify({
            spawnX: getSpawnX(),
            spawnY: getSpawnY(),
            timeStamp: Date.now(),
            saves: getTimesSaved(),
            spawnId: getSpawnRoom(),
            rooms: getRooms().length,
            currentRoom: getRoomBeingMade(),
            spawn: getRooms().find(room => room.id === getSpawnRoom())?.label || 'Not Assigned',
        }),
    )

const saveRooms = slotNumber => simpleSave(slotNumber, 'rooms', getRooms())

const simpleSave = (slotNumber, postfix, data2save) =>
    localStorage.setItem(`map-slot-${slotNumber}-${postfix}`, JSON.stringify(data2save))

const saveWalls = slotNumber => saveMapAsString(slotNumber, 'walls', getWalls())

const saveLoaders = slotNumber => saveMapAsString(slotNumber, 'loaders', getLoaders())

const saveInteractables = slotNumber => saveMapAsString(slotNumber, 'interactables', getInteractables())

const saveMapAsString = (slotNumber, entityType, entities) => {
    let data2save = {}
    for (const [key, entitiesOfKey] of entities.entries()) {
        data2save = {
            ...data2save,
            [key]: entitiesOfKey,
        }
    }
    localStorage.setItem(`map-slot-${slotNumber}-${entityType}`, JSON.stringify(data2save))
}

const saveEnemies = slotNumber => {
    let data2save = {}
    for (const [roomId, enemies] of getEnemies().entries()) {
        data2save = {
            ...data2save,
            [roomId]: enemies.map(enemy => {
                let result = {}
                Object.getOwnPropertyNames(enemy).forEach(name => {
                    if (name.toLowerCase().includes('service')) return
                    result = {
                        ...result,
                        [name]: enemy[name],
                    }
                })
                return result
            }),
        }
    }

    localStorage.setItem(`map-slot-${slotNumber}-enemies`, JSON.stringify(data2save))
}

const saveShopItems = slotNumber => simpleSave(slotNumber, 'shop-items', getShop())

const savePopups = slotNumber => simpleSave(slotNumber, 'popups', getPopups())

const saveDialogues = slotNumber => simpleSave(slotNumber, 'dialogues', getDialogues())

export const loadMapMakerFromSlot = slotNumber => {
    loadStats(slotNumber)
    loadRooms(slotNumber)
    loadWalls(slotNumber)
    loadLoaders(slotNumber)
    loadInteractables(slotNumber)
    loadEnemies(slotNumber)
    loadShopItems(slotNumber)
    loadPopups(slotNumber)
    loadDialogues(slotNumber)
}

const loadStats = slotNumber => {
    const { saves, spawnId, spawnX, spawnY, currentRoom } = JSON.parse(localStorage.getItem(`map-slot-${slotNumber}`))
    setTimesSaved(saves)
    setSpawnRoom(spawnId)
    setSpawnX(spawnX)
    setSpawnY(spawnY)
    setRoomBeingMade(currentRoom)
}

const loadRooms = slotNumber => simpleLoad(slotNumber, 'rooms', setRooms)

const simpleLoad = (slotNumber, postfix, setter) =>
    setter(JSON.parse(localStorage.getItem(`map-slot-${slotNumber}-${postfix}`)))

const loadWalls = slotNumber => loadStringAsMap(slotNumber, 'walls', setWalls)

const loadStringAsMap = (slotNumber, entityType, setter, toNumber = true) => {
    const data2Load = new Map([])
    const data = JSON.parse(localStorage.getItem(`map-slot-${slotNumber}-${entityType}`))
    Object.getOwnPropertyNames(data).forEach(name => data2Load.set(toNumber ? Number(name) : name, data[name]))
    setter(data2Load)
}

const loadLoaders = slotNumber => loadStringAsMap(slotNumber, 'loaders', setLoaders)

const loadInteractables = slotNumber => loadStringAsMap(slotNumber, 'interactables', setInteractables)

const loadEnemies = slotNumber => {
    const data2Load = new Map([])
    const data = JSON.parse(localStorage.getItem(`map-slot-${slotNumber}-enemies`))
    Object.getOwnPropertyNames(data).forEach(name => {
        data2Load.set(
            Number(name),
            data[name].map(enemy => buildEnemy(enemy)),
        )
    })
    setEnemies(data2Load)
}

const loadShopItems = slotNumber => simpleLoad(slotNumber, 'shop-items', setShop)

const loadPopups = slotNumber => simpleLoad(slotNumber, 'popups', setPopups)

const loadDialogues = slotNumber => simpleLoad(slotNumber, 'dialogues', setDialogues)
