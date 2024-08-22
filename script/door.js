import { activateProgress, getProgress } from './progress.js'
import { enemies } from './enemy/util/enemies.js'
import { getCurrentRoomId } from './variables.js'
import { getCurrentRoomDoors } from './elements.js'

export class Door {
    constructor(color, progress, heading, popup, progress2Active, killAll) {
        this.color = color
        this.progress = progress
        this.heading = heading
        this.popup = popup
        this.progress2Active = progress2Active
        this.killAll = killAll
    }
}

export const updateDoorStates = (progress) => 
    Array.from(getCurrentRoomDoors())
        .filter(door => door.getAttribute('progress') === progress )
        .forEach(door => openDoor(door))

export const updateKillAllDoorStates = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    for ( const door of getCurrentRoomDoors() ) {
        const killAll = door.getAttribute('killAll') 
        if ( !killAll ) continue 
        const needed2beKilled = aliveEnemies.find(enemy => enemy.progress <= killAll)
        if ( !needed2beKilled ) openDoor(door)
    }
}    

const openDoor = (door) => {
    door.remove()
    const progress2Active = door.getAttribute('progress2Active') 
    if ( progress2Active ) activateProgress(progress2Active)   
    console.log(getProgress());
                     
}