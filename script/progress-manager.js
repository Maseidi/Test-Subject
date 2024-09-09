import { renderPopup } from './popup-manager.js'
import { getCurrentRoomId } from './variables.js'
import { enemies } from './enemy/util/enemies.js'
import { addClass, removeClass } from './util.js'
import { interactables } from './interactables.js'
import { renderInteractable, spawnEnemy } from './room-loader.js'
import { getCurrentRoom, getCurrentRoomDoors } from './elements.js'

let progress = {
    '0' : true,
    '1' : true,
    '2' : true,
    '200': true
}

export const getProgress = () => progress

export const findProgressByName = (name) => progress[name]

export const activateProgress = (name) => {
    if ( !name || progress[name] ) return
    progress = {
        ...progress,
        [name]: true
    }
    renderPopup(name)
    openDoors(name)
    updateEnemies(name)
    updateInteractables(name)
}

export const deactivateProgress = (name) => {
    if ( !name || !progress[name] ) return
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
    addClass(door, 'open')
    const progress2Active = door.getAttribute('progress2Active')
    const progress2Deactive = door.getAttribute('progress2Deactive')
    if ( progress2Active ) activateProgress(progress2Active)
    if ( progress2Deactive ) deactivateProgress(progress2Deactive)
}

const closeDoors = (name) => 
    getCurrentRoomDoors()
        .filter(door => door.getAttribute('removeProgress') === name)
        .forEach(door => removeClass(door, 'open'))

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
            enemy.killAll = null
            enemy.renderProgress = '0'
            spawnEnemy(enemy, getCurrentRoom())
        })

export const updateKillAllEnemies = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    enemies.get(getCurrentRoomId()).forEach(enemy => {
        if ( enemy.health === 0 || !enemy.killAll || 
             aliveEnemies.find(elem => Number(elem.renderProgress) <= Number(enemy.killAll)) ) return
        enemy.killAll = null
        enemy.renderProgress = '0'
        spawnEnemy(enemy, getCurrentRoom())
    })
}

const updateInteractables = (name) =>
    interactables.get(getCurrentRoomId())
        .map((int, index) => ({...int, index }))
        .filter(int => int.renderProgress === name)
        .forEach(int => {
            int.killAll = null
            int.renderProgress = '0'
            renderInteractable(getCurrentRoom(), int, int.index)
        })

export const updateKillAllInteractables = () => {
    const aliveEnemies = enemies.get(getCurrentRoomId()).filter(enemy => enemy.health !== 0)
    interactables.get(getCurrentRoomId()).forEach((int, index) => {
        if ( !int.killAll || aliveEnemies.find(enemy => Number(enemy.renderProgress) <= Number(int.killAll)) ) return
        int.killAll = null
        int.renderProgress = '0'
        renderInteractable(getCurrentRoom(), int, index)
    })
}