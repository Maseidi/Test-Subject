import { buildCampaign } from './campaign-builder.js'
import { resetCampaignStatistics, recordCampaignSave } from './campaign-stats.js'
import { buildEnemy } from './enemy/enemy-factory.js'
import { getEnemies, getLoaders, getRooms, getWalls, setEnemies, setLoaders, setRooms, setWalls } from './entities.js'
import { getLoadoutState, getWeaponWheel, resetLoadout, restoreLoadoutState } from './loadout.js'
import { getInitialProgress, getProgress, setAutoSaveHandler, setProgress } from './progress-manager.js'
import {
    getSerializableVariables,
    resetTransientVariables,
    restoreSerializableVariables,
    setCurrentRoomId,
    setEquippedWeaponId,
    setHealth,
    setMapX,
    setMapY,
    setMaxHealth,
    setMaxStamina,
    setPlayerX,
    setPlayerY,
    setPlaythroughId,
    setRoomLeft,
    setRoomTop,
    setStamina,
    setTimesSaved,
    setWeaponWheel,
} from './variables.js'

const AUTO_SAVE_KEY = 'test-subject-autosave'

const mapToObject = map => Object.fromEntries(map.entries())
const objectToMap = object => new Map(Object.entries(object ?? {}).map(([key, value]) => [Number(key), value]))

const enemyData = enemy => ({
    type: enemy.type,
    waypoint: enemy.waypoint,
    x: enemy.x,
    y: enemy.y,
    level: enemy.level,
    spawnState: enemy.health <= 0 ? 'dead' : enemy.spawnState,
    virus: enemy.virus,
    knockImmune: enemy.knockImmune,
    healthMultiplier: enemy.healthMultiplier,
    health: enemy.health,
    maxHealth: enemy.maxHealth,
})

const serializeEnemies = () =>
    Object.fromEntries(
        Array.from(getEnemies().entries(), ([roomId, enemies]) => [roomId, enemies.map(enemyData)]),
    )

const hydrateEnemies = input =>
    new Map(
        Object.entries(input ?? {}).map(([roomId, enemies]) => [
            Number(roomId),
            enemies.map(enemy => buildEnemy(enemy)),
        ]),
    )

const initializeCampaign = campaign => {
    setRooms(campaign.rooms)
    setWalls(campaign.walls)
    setLoaders(campaign.loaders)
    setEnemies(
        new Map(
            Array.from(campaign.enemies.entries(), ([roomId, enemies]) => [
                roomId,
                enemies.map(enemy => buildEnemy(enemy)),
            ]),
        ),
    )
}

export const prepareNewGameData = () => {
    const playthroughId = Date.now()
    initializeCampaign(buildCampaign())
    resetLoadout()
    setProgress(getInitialProgress())
    resetTransientVariables()
    setMapX(0)
    setMapY(0)
    setRoomLeft(200)
    setRoomTop(200)
    setPlayerX(700)
    setPlayerY(700)
    setCurrentRoomId(1)
    setMaxStamina(600)
    setStamina(600)
    setMaxHealth(300)
    setHealth(300)
    setTimesSaved(0)
    setPlaythroughId(playthroughId)
    setWeaponWheel(getWeaponWheel())
    setEquippedWeaponId(getWeaponWheel()[0])
    resetCampaignStatistics(playthroughId)
    localStorage.removeItem(AUTO_SAVE_KEY)
}

export const autoSaveGame = () => {
    const variables = getSerializableVariables()
    variables.timesSaved = (variables.timesSaved ?? 0) + 1
    setTimesSaved(variables.timesSaved)
    const snapshot = {
        version: 3,
        savedAt: Date.now(),
        rooms: mapToObject(getRooms()),
        walls: mapToObject(getWalls()),
        loaders: mapToObject(getLoaders()),
        enemies: serializeEnemies(),
        progress: getProgress(),
        loadout: getLoadoutState(),
        variables,
    }
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(snapshot))
    recordCampaignSave()
}

export const hasAutoSave = () => Boolean(localStorage.getItem(AUTO_SAVE_KEY))

export const loadAutoSave = () => {
    const snapshot = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY))
    if (!snapshot) throw new Error('No autosave exists')
    const rooms = objectToMap(snapshot.rooms)
    const generatedRooms = buildCampaign().rooms
    rooms.forEach((room, roomId) => {
        if (!room.spawnPoints?.length) room.spawnPoints = generatedRooms.get(roomId)?.spawnPoints ?? []
    })
    setRooms(rooms)
    setWalls(objectToMap(snapshot.walls))
    setLoaders(objectToMap(snapshot.loaders))
    setEnemies(hydrateEnemies(snapshot.enemies))
    setProgress(snapshot.progress)
    restoreLoadoutState(snapshot.loadout)
    restoreSerializableVariables(snapshot.variables)
    resetTransientVariables()
    setWeaponWheel(getWeaponWheel())
    if (!getLoadoutState().weapons.some(weapon => weapon.id === snapshot.variables?.equippedWeaponId))
        setEquippedWeaponId(getWeaponWheel()[0])
}

setAutoSaveHandler(autoSaveGame)
