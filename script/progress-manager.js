import { getCurrentRoomEnemies } from './elements.js'
import { getEnemies } from './entities.js'
import { refillAllAmmo } from './loadout.js'
import { clearPlayerStatusEffects, restoreHealth } from './player-health.js'
import { spawnEnemyAtFarthestPoint, setRoomDoorsOpen } from './room-loader.js'
import { getSettings } from './settings.js'
import { renderWeaponUi, staminaManager } from './user-interface.js'
import {
    getCurrentRoomId,
    getMaxStamina,
    setStamina,
} from './variables.js'

const SPAWN_INTERVAL_SECONDS = 1

let progress = {}
let spawnCounter = 0
let autoSaveHandler = () => {}

export const roomEnteredFlag = room => `ROOM_${room}_ENTERED`
export const roomCombatActiveFlag = room => `ROOM_${room}_COMBAT_ACTIVE`
export const roomClearedFlag = room => `ROOM_${room}_CLEARED`

export const setProgress = value => (progress = value ?? {})
export const getProgress = () => ({ ...progress })
export const getInitialProgress = () => ({})
export const hasProgress = flag => Boolean(progress[flag])
export const setAutoSaveHandler = handler => (autoSaveHandler = handler)

export const activateProgress = flag => {
    if (flag) progress[flag] = true
}

export const initializeRoomCombat = () => {
    const roomId = getCurrentRoomId()
    activateProgress(roomEnteredFlag(roomId))
    spawnCounter = 0

    if (hasProgress(roomClearedFlag(roomId))) {
        setRoomDoorsOpen(true)
        return
    }

    activateProgress(roomCombatActiveFlag(roomId))
    setRoomDoorsOpen(false)
    spawnNextPendingEnemy(roomId)
}

export const manageRoomCombat = () => {
    const roomId = getCurrentRoomId()
    if (hasProgress(roomClearedFlag(roomId))) return

    const allEnemies = getEnemies().get(roomId)
    const pending = allEnemies.filter(enemy => enemy.health > 0 && enemy.spawnState === 'pending')
    if (pending.length) {
        spawnCounter++
        const interval = Math.max(1, Math.round(getSettings().display.fps * SPAWN_INTERVAL_SECONDS))
        if (spawnCounter >= interval) {
            spawnNextPendingEnemy(roomId)
            spawnCounter = 0
        }
        return
    }

    if (getCurrentRoomEnemies().some(enemy => enemy.health > 0)) return
    completeRoom(roomId)
}

const spawnNextPendingEnemy = roomId => {
    const allEnemies = getEnemies().get(roomId)
    const enemy = allEnemies.find(candidate => candidate.health > 0 && candidate.spawnState === 'pending')
    if (!enemy) return false
    enemy.index = allEnemies.indexOf(enemy)
    spawnEnemyAtFarthestPoint(enemy)
    return true
}

const completeRoom = roomId => {
    progress[roomCombatActiveFlag(roomId)] = false
    activateProgress(roomClearedFlag(roomId))
    setRoomDoorsOpen(true)
    refillPlayerForNextRoom()
    autoSaveHandler()
}

const refillPlayerForNextRoom = () => {
    restoreHealth()
    setStamina(getMaxStamina())
    clearPlayerStatusEffects()
    refillAllAmmo()
    staminaManager(getMaxStamina())
    renderWeaponUi()
}
