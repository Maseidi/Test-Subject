import { enemies } from './enemy/util/enemies.js'
import { getCurrentRoomId } from './variables.js'
import { getCurrentRoomDoors } from './elements.js'

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
    Array.from(getCurrentRoomDoors())
        .filter(door => door.getAttribute('progress') === progress )
        .forEach(door => door.remove())

export const updateKillAllDoorStates = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    for ( const door of getCurrentRoomDoors() ) {
        const killAll = door.getAttribute('killAll') 
        if ( !killAll ) continue 
        for ( const enemy of aliveEnemies ) {
            if ( enemy.progress <= killAll ) continue
            door.remove()
        }
    }
}        