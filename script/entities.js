import { buildEnemy } from './enemy/enemy-factory.js'
import { getDifficulty } from './variables.js'

let rooms = []
export const setRooms = (val) => {
    rooms = val
}
export const getRooms = () => rooms

let walls = new Map([])
export const setWalls = (val) => {
    walls = val
}
export const getWalls = () => walls

let loaders = new Map([])
export const setLoaders = (val) => {
    loaders = val
}
export const getLoaders = () => loaders

export const initLoaders = () => new Map([])

let enemies = new Map([])
export const setEnemies = (val) => {
    enemies = val
}
export const getEnemies = () => enemies

export const initEnemies = (inputEnemies) => {
    const result = new Map([])
    for ( const [roomId, enemiesOfRoom] of inputEnemies.entries() ) {
        result.set(roomId, enemiesOfRoom.map(enemy => buildEnemy(enemy))
            .filter(enemy => enemy.difficulties.includes(getDifficulty()))
        )
    }
    setEnemies(result)
}

let interactables = new Map([])
export const setInteractables = (val) => {
    interactables = val
}
export const getInteractables = () => interactables

export const initInteractables = (inputInteractables) => {
    const result = new Map([])
    for ( const [roomId, interactablesOfRoom] of inputInteractables.entries() ) {
        result.set(roomId, interactablesOfRoom.map(int => ({...int}))
            .filter(int => int.difficulties.includes(getDifficulty()))
        )
    }
    setInteractables(result)
}

let dialogues = []
export const setDialogues = (val) => {
    dialogues = val
}
export const getDialogues = () => dialogues

let popups = []
export const setPopups = (val) => {
    popups = val
}
export const getPopups = () => popups