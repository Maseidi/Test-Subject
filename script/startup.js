import { getMapEl, setMapEl, setRoomContainer } from "./elements.js";
import { loadPlayer } from "./player-loader.js";
import { loadCurrentRoom } from "./room-loader.js";
import { addClass } from "./util.js";
import { getMapX, getMapY } from "./variables.js";

export const startUp = () => {
    const root = document.getElementById("root")
    renderMap(root)
    renderRoomContainer()
    renderCurrentRoom()
    renderPlayer()
}

const renderMap = (root) => {
    const map = document.createElement("div")
    addClass(map, 'map')
    map.style.width = `100000px`
    map.style.height = `100000px`
    map.style.backgroundColor = `#2b2b2b`
    map.style.position = `absolute`
    map.style.left = `${getMapX()}px`
    map.style.top = `${getMapY()}px`
    setMapEl(map)
    root.append(map)
}

const renderRoomContainer = () => {
    const roomContainer = document.createElement("div")
    addClass(roomContainer, 'room-container')
    setRoomContainer(roomContainer)
    getMapEl().append(roomContainer)
}

const renderCurrentRoom = () => {
    loadCurrentRoom()
}

const renderPlayer = () => {
    loadPlayer()
}