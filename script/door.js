import { enemies } from './enemy/util/enemies.js'
import { getCurrentRoomId } from './variables.js'
import { getCurrentRoomDoors } from './elements.js'
import { activateProgress } from './progress.js'

export class Door {
    constructor(color, progress, heading, popup, activeProgress, killAll) {
        this.color = color
        this.progress = progress
        this.heading = heading
        this.popup = popup
        this.activeProgress = activeProgress
        this.killAll = killAll
    }
}

export const updateDoorStates = (progress) => 
    Array.from(getCurrentRoomDoors()).filter(door => door.getAttribute('progress') === progress ).forEach(door => door.remove())

export const updateKillAllDoorStates = (progress) => {
    const exists = enemies.get(getCurrentRoomId()).find(enemy => !(enemy.health === 0 && enemy.progress <= progress))
    if ( exists ) return
    Array.from(getCurrentRoomDoors()).filter(door => door.killAll === progress).forEach(door => {
        activateProgress(door.activeProgress)
    })
}