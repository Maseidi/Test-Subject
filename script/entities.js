let rooms = new Map()
let walls = new Map()
let loaders = new Map()
let enemies = new Map()

export const setRooms = value => (rooms = value)
export const getRooms = () => rooms
export const setWalls = value => (walls = value)
export const getWalls = () => walls
export const setLoaders = value => (loaders = value)
export const getLoaders = () => loaders
export const setEnemies = value => (enemies = value)
export const getEnemies = () => enemies
