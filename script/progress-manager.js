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
    if ( !name || name === 'undefined' || progress[name] ) return
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
        .filter(door => door.getAttribute('removeProgress') === progress )
        .forEach(door => openDoor(door))

export const openDoor = (door) => {
    door.remove()
    const progress2Active = door.getAttribute('progress2Active') 
    if ( progress2Active ) activateProgress(progress2Active)   
}

export const updateKillAllDoors = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    getCurrentRoomDoors().forEach(door => {
        const killAll = door.getAttribute('killAll')
        if ( !killAll ) return
        const needed2beKilled = aliveEnemies.find(enemy => enemy.renderProgress <= killAll)
        if ( !needed2beKilled ) openDoor(door)
    })
}

const updateEnemies = (progress) =>
    enemies.get(getCurrentRoomId())
        .filter(enemy => enemy.renderProgress === progress && enemy.health !== 0 )
        .forEach(enemy => spawnEnemy(enemy, getCurrentRoom()))

export const updateKillAllEnemies = () => {
    // TODO: implement later
    // const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    // enemies.get(getCurrentRoomId()).forEach(enemy => {
    //     if ( enemy.health === 0 || !enemy.killAll || 
    //          !aliveEnemies.find(elem => elem.renderProgress <= enemy.killAll) ) return
    //     enemy.killAll = undefined
    //     spawnEnemy(enemy, getCurrentRoom())
    // })
}

const updateInteractables = (progress) =>
    interactables.get(getCurrentRoomId())
        .map((int, index) => ({...int, index }))
        .filter(int => int.renderProgress === progress)
        .forEach(int => renderInteractable(getCurrentRoom(), int, int.index))

export const updateKillAllInteractables = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    interactables.get(getCurrentRoomId()).forEach((int, index) => {
        if ( !int.killAll || aliveEnemies.find(enemy => enemy.renderProgress <= int.killAll) ) return
        int.killAll = undefined
        renderInteractable(getCurrentRoom(), int, index)
    })
}