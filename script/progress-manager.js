import { renderDialogue } from './dialogue-manager.js'
import { getCurrentRoomDoors } from './elements.js'
import { getEnemies, getInteractables } from './entities.js'
import { getDoorObject } from './loader.js'
import { renderPopup } from './popup-manager.js'
import { renderInteractable, spawnEnemy } from './room-loader.js'
import { addClass, element2Object, removeClass } from './util.js'
import { getCurrentRoomId, getPause, getWaitingFunctions, setWaitingFunctions } from './variables.js'

let progress = null
export const setProgress = val => {
    progress = val
}
export const getProgress = () => progress

export const getInitialProgress = () => ({
    [Number.MAX_SAFE_INTEGER]: true,
})

export const getProgressValueByNumber = number => progress[number]

export const activateAllProgresses = numbers => {
    if (!numbers) return

    if (numbers === '9999999999') localStorage.setItem('survival-tutorial-done', 'DONE')

    const progresses2Active = String(numbers).split(',')

    for (const progress2Active of progresses2Active) {
        if (progress[progress2Active]) continue
        progress = {
            ...progress,
            [progress2Active]: true,
        }
        add2Queue(renderPopup, [progress2Active])
        add2Queue(toggleDoors, [progress2Active])
        add2Queue(updateEnemies, [progress2Active])
        add2Queue(renderDialogue, [progress2Active])
        add2Queue(updateInteractables, [progress2Active])
    }
}

export const deactivateAllProgresses = numbers => {
    if (!numbers) return

    const progresses2Deactive = String(numbers).split(',')

    for (const progress2Deactive of progresses2Deactive) {
        if (!progress[progress2Deactive]) continue
        progress = {
            ...progress,
            [progress2Deactive]: false,
        }
        add2Queue(toggleDoors, [progress2Deactive, false])
    }
}

const add2Queue = (func, args) => {
    if (getPause()) setWaitingFunctions([...getWaitingFunctions(), { fn: func, args }])
    else func(...args)
}

// Note: Doors with kill all NEVER need a renderProgress property
// Caution: Doors that need a key or code MUST have a renderProgress property!
const toggleDoors = (number, open = true) =>
    getCurrentRoomDoors()
        .filter(door => Number(door.getAttribute('renderprogress')) === Number(number))
        .forEach(door => toggleDoor(door, open))

export const toggleDoor = (door, open = true) => {
    if (!open) {
        removeClass(door, 'open')
        return
    }
    addClass(door, 'open')
    const { renderprogress, progress2active, progress2deactive } = element2Object(door)
    if (renderprogress) activateAllProgresses(renderprogress)
    if (progress2active) activateAllProgresses(progress2active)
    if (progress2deactive) deactivateAllProgresses(progress2deactive)
}

const getAliveEnemies = (needIndex = false) =>
    (() => {
        var currEnemies = getEnemies().get(getCurrentRoomId())
        if (needIndex) currEnemies = currEnemies.map((enemy, index) => ({ ...enemy, index }))
        return currEnemies
    })().filter(enemy => enemy.health !== 0)

export const updateKillAllDoors = () => {
    const aliveEnemies = getAliveEnemies()
    getCurrentRoomDoors().forEach(door => {
        const killAll = door.getAttribute('killAll')
        if (!killAll || aliveEnemies.find(enemy => !enemy.killAll && Number(enemy.renderProgress) <= Number(killAll)))
            return
        door.removeAttribute('killAll')
        getDoorObject(door).killAll = null
        toggleDoor(door)
    })
}

const updateEnemies = number =>
    getEnemies()
        .get(getCurrentRoomId())
        .forEach(enemy => {
            if (enemy.health === 0) return
            if (Number(enemy.renderProgress) !== Number(number)) return
            spawnEnemy(enemy)
        })

export const updateKillAllEnemies = () => {
    const aliveEnemies = getAliveEnemies(true)
    getEnemies()
        .get(getCurrentRoomId())
        .forEach((enemy, index) => {
            if (!enemy.killAll) return
            if (
                aliveEnemies.find(
                    e => e.index !== index && (!e.killAll || Number(e.renderProgress) <= Number(enemy.killAll)),
                )
            )
                return
            enemy.killAll = null
            spawnEnemy(enemy)
        })
}

const updateInteractables = number =>
    getInteractables()
        .get(getCurrentRoomId())
        .forEach((int, index) => {
            if (Number(int.renderProgress) !== Number(number)) return
            int.renderProgress = String(Number.MAX_SAFE_INTEGER)
            renderInteractable(int, index)
        })

export const updateKillAllInteractables = () => {
    const aliveEnemies = getAliveEnemies()
    getInteractables()
        .get(getCurrentRoomId())
        .forEach((int, index) => {
            if (!int.killAll) return
            if (aliveEnemies.find(enemy => !enemy.killAll && Number(enemy.renderProgress) <= Number(int.killAll)))
                return
            int.killAll = null
            int.renderProgress = String(Number.MAX_SAFE_INTEGER)
            renderInteractable(int, index)
        })
}
