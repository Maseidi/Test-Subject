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