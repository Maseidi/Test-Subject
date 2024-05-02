import { getMapEl, setMapEl, setPauseContainer, setRoomContainer } from "./elements.js"
import { loadPlayer } from "./player-loader.js"
import { loadCurrentRoom } from "./room-loader.js"
import { addClass } from "./util.js"
import { getMapX, getMapY } from "./variables.js"

export const startUp = () => {
    renderPauseContainer()
    renderMap()
    renderRoomContainer()
    renderCurrentRoom()
    renderPlayer()
}

const renderMap = () => {
    const root = document.getElementById("root")
    const map = document.createElement("div")
    addClass(map, 'map')
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

const renderPauseContainer = () => {
    const root = document.getElementById("root")
    const pauseContainer = document.createElement("div")
    addClass(pauseContainer, 'pause-container')
    setPauseContainer(pauseContainer)
    root.append(pauseContainer)
}

const renderCurrentRoom = () => {
    loadCurrentRoom()
}

const renderPlayer = () => {
    loadPlayer()
}