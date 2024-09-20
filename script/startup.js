import { renderUi } from './user-interface.js'
import { loadCurrentRoom } from './room-loader.js'
import { appendAll, createAndAddClass } from './util.js'
import { getMapX, getMapY, getPlayerX, getPlayerY, getWindowHeight, getWindowWidth } from './variables.js'
import { 
    getHealthStatusContainer,
    getLightContainer,
    getMapEl,
    getShadowContainer,
    setHealthStatusContainer,
    setLightContainer,
    setMapEl,
    setPauseContainer,
    setPlayer,
    setPopupContainer,
    setRoomContainer,
    setRoomNameContainer, 
    setShadowContainer} from './elements.js'

export const startUp = () => {
    renderRoomNameContainer()
    renderPauseContainer()
    renderPopupContainer()
    renderHealthStatusContainer()
    renderShadowContainer()
    renderLightContainer()
    renderUi()
    renderMap()
    renderRoomContainer()
    renderPlayer()
    renderCurrentRoom()
    centralizePlayer()
}

const renderRoomNameContainer = () => renderContainer('room-name-container', setRoomNameContainer)

const renderPauseContainer = () => renderContainer('pause-container', setPauseContainer)

const renderPopupContainer = () => renderContainer('popupover-container', setPopupContainer)

const renderHealthStatusContainer = () => {
    renderContainer('health-status-container', setHealthStatusContainer)
    const infectedContainer = createAndAddClass('div', 'infected-container')
    const virusBar = createAndAddClass('div', 'virus-bar')
    infectedContainer.append(virusBar)
    getHealthStatusContainer().append(infectedContainer)
}

const renderShadowContainer = () => {
    renderContainer('shadow-container', setShadowContainer)
    const shadow = createAndAddClass('div', 'shadow')
    getShadowContainer().append(shadow)
}

const renderLightContainer = () => {
    renderContainer('light-container', setLightContainer)
    const light = createAndAddClass('div', 'light')
    getLightContainer().append(light)
}

const renderContainer = (className, setter) => {
    const root = document.getElementById('root')
    const popupContainer = createAndAddClass('div', className)
    setter(popupContainer)
    root.append(popupContainer)
}

const renderMap = () => {
    const root = document.getElementById('root')
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
    const player = createAndAddClass('div', 'player')
    player.id = 'player'
    player.style.left = `${getPlayerX()}px`
    player.style.top = `${getPlayerY()}px`
    const playerCollider = createAndAddClass('div', 'player-collider')
    player.append(playerCollider)
    const playerBody = createAndAddClass('div', 'player-body')
    playerBody.style.transform = `rotateZ(0deg)`
    player.setAttribute('angle', 0)
    const forwardDetector = createAndAddClass('div', 'forward-detector')
    const dialogueContainer = createAndAddClass('div', 'player-dialouge-container')
    appendAll(playerCollider, playerBody, forwardDetector, dialogueContainer)
    const leftHand = createAndAddClass('div', 'player-left-hand')
    const playerHead = createAndAddClass('div', 'player-head')
    const rightHand = createAndAddClass('div', 'player-right-hand')
    playerBody.append(leftHand, playerHead, rightHand)
    setPlayer(player)
    getMapEl().append(player)
}

export const centralizePlayer = () => {
    const xDiff = getMapX() + getPlayerX() - window.innerWidth / 2 + 12
    const yDiff = getMapY() + getPlayerY() - window.innerHeight / 2 + 12
    getMapEl().style.transform = `translateX(${-xDiff}px) translateY(${-yDiff}px)`
}