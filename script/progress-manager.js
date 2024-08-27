import { getCurrentRoomId } from './variables.js'
import { enemies } from './enemy/util/enemies.js'
import { interactables } from './interactables.js'
import { renderDoor, renderInteractable, spawnEnemy } from './room-loader.js'
import { getCurrentRoom, getCurrentRoomDoors } from './elements.js'
import { loaders } from './loaders.js'

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
    openDoors(name)
    updateEnemies(name)
    updateInteractables(name)
}

export const deactiveProgress = (name) => {
    progress = {
        ...progress,
        [name] : false
    }
    closeDoors(name)
}

const openDoors = (name) => 
    getCurrentRoomDoors()
        .filter(door => door.getAttribute('removeProgress') === name )
        .forEach(door => openDoor(door))

export const openDoor = (door) => {
    door.remove()
    const progress2Active = door.getAttribute('progress2Active')
    if ( progress2Active ) activateProgress(progress2Active)
}

const closeDoors = (name) => {
    loaders.get(getCurrentRoomId())
        .filter(loader => loader.door && loader.door.removeProgress === name)
        .forEach(loader => closeDoor(loader))
}

const closeDoor = (loader) => renderDoor(loader, getCurrentRoom())

export const updateKillAllDoors = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    getCurrentRoomDoors().forEach(door => {
        const killAll = Number(door.getAttribute('killAll'))
        if ( !killAll ) return
        const needed2beKilled = aliveEnemies.find(enemy => Number(enemy.renderProgress) <= killAll)
        if ( !needed2beKilled ) openDoor(door)
    })
}

const updateEnemies = (name) =>
    enemies.get(getCurrentRoomId())
        .filter(enemy => enemy.renderProgress === name && enemy.health !== 0 )
        .forEach(enemy => {
            enemy.killAll = undefined
            enemy.renderProgress = '0'
            spawnEnemy(enemy, getCurrentRoom())
        })

export const updateKillAllEnemies = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    enemies.get(getCurrentRoomId()).forEach(enemy => {
        if ( enemy.health === 0 || !enemy.killAll || 
             aliveEnemies.find(elem => Number(elem.renderProgress) <= Number(enemy.killAll)) ) return
        enemy.killAll = undefined
        enemy.renderProgress = '0'
        spawnEnemy(enemy, getCurrentRoom())
    })
}

const updateInteractables = (name) =>
    interactables.get(getCurrentRoomId())
        .map((int, index) => ({...int, index }))
        .filter(int => int.renderProgress === name)
        .forEach(int => {
            int.killAll = undefined
            int.renderProgress = '0'
            renderInteractable(getCurrentRoom(), int, int.index)
        })

export const updateKillAllInteractables = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    interactables.get(getCurrentRoomId()).forEach((int, index) => {
        if ( !int.killAll || aliveEnemies.find(enemy => Number(enemy.renderProgress) <= Number(int.killAll)) ) return
        int.killAll = undefined
        int.renderProgress = '0'
        renderInteractable(getCurrentRoom(), int, index)
    })
}