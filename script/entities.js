import { buildEnemy } from './enemy/enemy-factory.js'
import { getDifficulty } from './variables.js'

let rooms = null
export const setRooms = val => {
    rooms = val
}
export const getRooms = () => rooms

let walls = null
export const setWalls = val => {
    walls = val
}
export const getWalls = () => walls

let loaders = null
export const setLoaders = val => {
    loaders = val
}
export const getLoaders = () => loaders

let enemies = null
export const setEnemies = val => {
    enemies = val
}
export const getEnemies = () => enemies

export const getInitialEnemies = inputEnemies => {
    const result = new Map([])
    for (const [roomId, enemiesOfRoom] of inputEnemies.entries()) {
        result.set(
            roomId,
            enemiesOfRoom.map(enemy => buildEnemy(enemy)).filter(enemy => enemy.difficulties.includes(getDifficulty())),
        )
    }
    return result
}

let interactables = new Map([])
export const setInteractables = val => {
    interactables = val
}
export const getInteractables = () => interactables

export const getInitialInteractables = inputInteractables => {
    const result = new Map([])
    for (const [roomId, interactablesOfRoom] of inputInteractables.entries()) {
        result.set(
            roomId,
            interactablesOfRoom.map(int => ({ ...int })).filter(int => int.difficulties.includes(getDifficulty())),
        )
    }
    return result
}

let dialogues = null
export const setDialogues = val => {
    dialogues = val
}
export const getDialogues = () => dialogues

let popups = null
export const setPopups = val => {
    popups = val
}
export const getPopups = () => popups
