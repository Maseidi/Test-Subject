import { getDoorObject } from './loader.js'
import { renderPopup } from './popup-manager.js'
import { getCurrentRoomDoors } from './elements.js'
import { renderDialogue } from './dialogue-manager.js'
import { getEnemies, getInteractables } from './entities.js'
import { addClass, element2Object, removeClass } from './util.js'
import { renderInteractable, spawnEnemy } from './room-loader.js'
import { getCurrentRoomId, getPause, getWaitingFunctions, setWaitingFunctions } from './variables.js'

let progress = null
export const setProgress = (val) => {
    progress = val
}
export const getProgress = () => progress

export const initProgress = () => ({
    [Number.MAX_SAFE_INTEGER] : true
})

export const getProgressValueByNumber = (number) => progress[number]

export const activateAllProgresses = (numbers) => {
    if ( !numbers ) return

    const progresses2Active = String(numbers).split(',')
    
    for ( const progress2Active of progresses2Active ) {
        if ( progress[progress2Active] ) continue
        progress = {
            ...progress,
            [progress2Active]: true
        }
        add2Queue(renderPopup,         [progress2Active])
        add2Queue(toggleDoors,         [progress2Active])
        add2Queue(updateEnemies,       [progress2Active])
        add2Queue(renderDialogue,      [progress2Active])
        add2Queue(updateInteractables, [progress2Active])
    }
}

export const deactivateAllProgresses = (numbers) => {
    if ( !numbers ) return

    const progresses2Deactive = String(numbers).split(',')    

    for ( const progress2Deactive of progresses2Deactive ) {
        if ( !progress[progress2Deactive] ) continue
        progress = {
            ...progress,
            [progress2Deactive] : false
        }
        add2Queue(toggleDoors, [progress2Deactive, false])
    }
}

const add2Queue = (func, args) => {
    if ( getPause() ) setWaitingFunctions([...getWaitingFunctions(), {fn: func, args}])
    else func(...args)
}

// Note: Doors with kill all NEVER need a renderProgress property
// Caution: Doors that need a key or code MUST have a renderProgress property!!
const toggleDoors = (number, open = true) => 
    getCurrentRoomDoors()
        .filter(door => door.getAttribute('renderprogress') === number )
        .forEach(door => toggleDoor(door, open))

export const toggleDoor = (door, open = true) => {
    const { renderprogress, ...rest } = element2Object(door)
    if ( open ) {
        addClass(door, 'open')        
        const { progress2active, progress2deactive } = rest
        if ( renderprogress )     activateAllProgresses(renderprogress)
        if ( progress2active )    activateAllProgresses(progress2active)
        if ( progress2deactive )  deactivateAllProgresses(progress2deactive)
        return
    }
    removeClass(door, 'open')
}

const getAliveEnemies = (needIndex = false) =>
    (() => {
        var currEnemies = getEnemies().get(getCurrentRoomId())
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

const updateEnemies = (number) =>
    getEnemies().get(getCurrentRoomId()).forEach(enemy => {
        if ( enemy.health === 0 ) return
        if ( enemy.renderProgress !== number ) return
        spawnEnemy(enemy)
    })

export const updateKillAllEnemies = () => { 
    const aliveEnemies = getAliveEnemies(true)
    getEnemies().get(getCurrentRoomId()).forEach((enemy, index) => {
        if ( !enemy.killAll ) return
        if ( aliveEnemies.find(e => e.index !== index && !e.killAll && Number(e.renderProgress) <= Number(enemy.killAll) ) ) 
            return
        enemy.killAll = null
        spawnEnemy(enemy)
    })
}   

const updateInteractables = (number) =>
    getInteractables().get(getCurrentRoomId()).forEach((int, index) => {
        if ( int.renderProgress !== number ) return
        int.renderProgress = String(Number.MAX_SAFE_INTEGER) 
        renderInteractable(int, index)
    })

export const updateKillAllInteractables = () => {
    const aliveEnemies = getAliveEnemies()
    getInteractables().get(getCurrentRoomId()).forEach((int, index) => {
        if ( !int.killAll ) return
        if ( aliveEnemies.find(enemy => !enemy.killAll && Number(enemy.renderProgress) <= Number(int.killAll) ) ) return
        int.killAll = null
        int.renderProgress = String(Number.MAX_SAFE_INTEGER)
        renderInteractable(int, index)
    })
}