let roomBeingMade = null
export const setRoomBeingMade = (val) => {
    roomBeingMade = val
}
export const getRoomBeingMade = () => roomBeingMade

let itemBeingModified = null
export const setItemBeingModified = (val) => {
    itemBeingModified = val
}
export const getItemBeingModified = () => itemBeingModified

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

let interactables = new Map([])
export const setInteractables = (val) => {
    interactables = val
}
export const getInteractables = () => interactables

let enemies = new Map([])
export const setEnemies = (val) => {
    enemies = val
}
export const getEnemies = () => enemies

let popups = []
export const setPopups = (val) => {
    popups = val
}
export const getPopups = () => popups

let dialogues = []
export const setDialogues = (val) => {
    dialogues = val
}
export const getDialogues = () => dialogues

let shop = []
export const setShop = (val) => {
    shop = val
}
export const getShop = () => shop

let spawnRoom = null
export const setSpawnRoom = (val) => {
    spawnRoom = val
}
export const getSpawnRoom = () => spawnRoom

let spawnX = 20
export const setSpawnX = (val) => {
    spawnX = val
}
export const getSpawnX = () => spawnX

let spawnY = 20
export const setSpawnY = (val) => {
    spawnY = val
}
export const getSpawnY = () => spawnY