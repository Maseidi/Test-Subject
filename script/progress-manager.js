import { getDoorObject } from './loaders.js'
import { renderPopup } from './popup-manager.js'
import { getCurrentRoomId } from './variables.js'
import { enemies } from './enemy/util/enemies.js'
import { interactables } from './interactables.js'
import { getCurrentRoomDoors } from './elements.js'
import { renderDialogue } from './dialogue-manager.js'
import { addClass, element2Object, removeClass } from './util.js'
import { renderInteractable, spawnEnemy } from './room-loader.js'

let progress = {
    [Number.MAX_SAFE_INTEGER] : true,
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
    toggleDoors(name)
    updateEnemies(name)
    renderDialogue(name)
    updateInteractables(name)
}

export const deactivateProgress = (name) => {
    if ( !name || !progress[name] ) return
    progress = {
        ...progress,
        [name] : false
    }
    toggleDoors(name, false)
}

// Note: Doors with kill all NEVER need a renderProgress property
// Caution: Doors that need a key or code MUST have a renderProgress property!!
const toggleDoors = (name, open = true) => 
    getCurrentRoomDoors()
        .filter(door => door.getAttribute('renderprogress') === name )
        .forEach(door => toggleDoor(door, open))

export const toggleDoor = (door, open = true) => {
    const { renderprogress, ...rest } = element2Object(door)
    if ( open ) {
        addClass(door, 'open')        
        const { progress2active, progress2deactive } = rest
        if ( renderprogress )     activateProgress(renderprogress)
        if ( progress2active )    activateProgress(progress2active)
        if ( progress2deactive )  deactivateProgress(progress2deactive)
        return
    }
    removeClass(door, 'open')
}

const getAliveEnemies = (needIndex = false) =>
    (() => {
        var currEnemies = enemies.get(getCurrentRoomId())
        if ( needIndex ) currEnemies = currEnemies.map((enemy, index) => ({...enemy, index}))
        return currEnemies
    })().filter(enemy => enemy.health !== 0)

export const updateKillAllDoors = () => {
    const aliveEnemies = getAliveEnemies()
    getCurrentRoomDoors().forEach(door => {
        const killAll = door.getAttribute('killAll')
        if ( !killAll || aliveEnemies.find(enemy => !enemy.killAll && Number(enemy.renderProgress) <= Number(killAll))) 
            return
        door.removeAttribute('killAll')
        getDoorObject(door).killAll = null
        toggleDoor(door)
    })
}

const updateEnemies = (name) =>
    enemies.get(getCurrentRoomId()).forEach(enemy => {
        if ( enemy.health === 0 ) return
        if ( enemy.renderProgress !== name ) return
        enemy.killAll = null
        enemy.renderProgress = String(Number.MAX_SAFE_INTEGER)
        spawnEnemy(enemy)
    })

export const updateKillAllEnemies = () => { 
    const aliveEnemies = getAliveEnemies(true)
    enemies.get(getCurrentRoomId()).forEach((enemy, index) => {
        if ( !enemy.killAll ) return
        if ( aliveEnemies.find(e => e.index !== index && !e.killAll && Number(e.renderProgress) <= Number(enemy.killAll) ) ) 
            return
        enemy.killAll = null
        enemy.renderProgress = String(Number.MAX_SAFE_INTEGER)
        spawnEnemy(enemy)
    })
}   

const updateInteractables = (name) =>
    interactables.get(getCurrentRoomId()).forEach((int, index) => {
        if ( int.renderProgress !== name ) return 
        int.killAll = null
        int.renderProgress = String(Number.MAX_SAFE_INTEGER)
        renderInteractable(int, index)
    })

export const updateKillAllInteractables = () => {
    const aliveEnemies = getAliveEnemies()
    interactables.get(getCurrentRoomId()).forEach((int, index) => {
        if ( !int.killAll || aliveEnemies.find(enemy => !enemy.killAll && Number(enemy.renderProgress) <= Number(int.killAll) ) ) 
            return
        int.killAll = null
        int.renderProgress = String(Number.MAX_SAFE_INTEGER)
        renderInteractable(int, index)
    })
}