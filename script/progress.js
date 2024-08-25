import { getCurrentRoomId } from './variables.js'
import { enemies } from './enemy/util/enemies.js'
import { interactables } from './interactables.js'
import { renderInteractable, spawnEnemy } from './room-loader.js'
import { getCurrentRoom, getCurrentRoomDoors } from './elements.js'

let progress = {
    '0' : true,
    '1' : true,
    '2' : true,
}

export const getProgress = () => progress

export const findProgressByName = (name) => progress[name]

export const activateProgress = (name) => {
    if ( !name ) return
    if ( progress[name] ) return
    progress = {
        ...progress,
        [name]: true
    }
    updateDoors(name)
    updateEnemies(name)
    updateInteractables(name)
}

const updateDoors = (progress) => 
    getCurrentRoomDoors()
        .filter(door => door.getAttribute('progress') === progress )
        .forEach(door => openDoor(door))

export const openDoor = (door) => {
    door.remove()
    const progress2Active = door.getAttribute('progress2Active') 
    if ( progress2Active ) activateProgress(progress2Active)   
}

export const updateKillAllDoors = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    for ( const door of getCurrentRoomDoors() ) {
        const killAll = door.getAttribute('killAll')
        if ( !killAll ) continue
        const needed2beKilled = aliveEnemies.find(enemy => enemy.progress <= killAll)
        if ( !needed2beKilled ) openDoor(door)
    }
}

const updateEnemies = (progress) =>
    enemies.get(getCurrentRoomId())
        .filter(enemy => enemy.progress === progress && enemy.health !== 0 )
        .forEach(enemy => spawnEnemy(enemy, getCurrentRoom()))

const updateInteractables = (progress) =>
    interactables.get(getCurrentRoomId())
        .map((int, index) => ({...int, index }))
        .filter(int => int.progress === progress)
        .forEach(int => renderInteractable(getCurrentRoom(), int, int.index))

export const updateKillAllInteractables = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    interactables.get(getCurrentRoomId()).forEach((int, index) => {
        if ( !int.killAll || aliveEnemies.find(enemy => enemy.progress <= int.killAll) ) return
        int.killAll = undefined
        renderInteractable(getCurrentRoom(), int, index)
    })
}