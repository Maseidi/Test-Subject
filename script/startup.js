import { createAndAddClass } from "./util.js"
import { renderUi } from "./user-interface.js"
import { loadPlayer } from "./player-loader.js"
import { loadCurrentRoom } from "./room-loader.js"
import { getMapX, getMapY, getPlayerX, getPlayerY } from "./variables.js"
import { getMapEl, setMapEl, setPauseContainer, setRoomContainer } from "./elements.js"

export const startUp = () => {
    renderPauseContainer()
    renderUi()
    renderMap()
    renderRoomContainer()
    renderCurrentRoom()
    renderPlayer()
    centralizePlayer()
}

const renderPauseContainer = () => {
    const root = document.getElementById("root")
    const pauseContainer = createAndAddClass('div', 'pause-container')
    setPauseContainer(pauseContainer)
    root.append(pauseContainer)
}

const renderMap = () => {
    const root = document.getElementById("root")
    const map = createAndAddClass('div', 'map')
    map.style.left = `${getMapX()}px`
    map.style.top = `${getMapY()}px`
    setMapEl(map)
    root.append(map)
}

const renderRoomContainer = () => {
    const roomContainer = createAndAddClass('div', 'room-container')
    setRoomContainer(roomContainer)
    getMapEl().append(roomContainer)
}

const renderCurrentRoom = () => {
    loadCurrentRoom()
}

const renderPlayer = () => {
    loadPlayer()
}

const centralizePlayer = () => {
    const xDiff = getMapX() + getPlayerX() - window.innerWidth / 2
    const yDiff = getMapY() + getPlayerY() - window.innerHeight / 2
    getMapEl().style.transform = `translateX(${-xDiff}px) translateY(${-yDiff}px)`
}