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