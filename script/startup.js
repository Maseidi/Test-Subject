import { addControls } from './controls.js'
import {
    getHealthStatusContainer,
    getMapEl,
    getShadowContainer,
    setDialogueContainer,
    setHealthStatusContainer,
    setMapEl,
    setPauseContainer,
    setPlayer,
    setPopupContainer,
    setRoomContainer,
    setRoomNameContainer,
    setShadowContainer,
} from './elements.js'
import { renderVirusIcon } from './player-health.js'
import { loadCurrentRoom } from './room-loader.js'
import { IS_MOBILE } from './script.js'
import { playFootstep } from './sound-manager.js'
import {
    renderAimJoystick,
    renderHealButton,
    renderInteractButton,
    renderInventoryButton,
    renderMovementJoystick,
    renderPauseButton,
    renderReloadButton,
    renderSlots,
    renderSprintButton,
    renderUi,
} from './user-interface.js'
import { addClass, appendAll, createAndAddClass } from './util.js'
import { getInfection, getPlayerAngle, getPlayerX, getPlayerY, setMapX, setMapY } from './variables.js'

export const startUp = () => {
    addControls()
    renderRoomNameContainer()
    renderPauseContainer()
    renderPopupContainer()
    renderHealthStatusContainer()
    renderShadowContainer()
    renderDialogueContainer()
    renderUi()
    renderMap()
    renderRoomContainer()
    getMapEl().append(renderPlayer())
    renderCurrentRoom()
    centralizePlayer()
    renderMovementJoystick()
    renderAimJoystick()
    renderSprintButton()
    renderInventoryButton()
    renderInteractButton()
    renderHealButton()
    renderReloadButton()
    renderPauseButton()
    renderSlots()
}

const renderRoomNameContainer = () => renderContainer('room-name-container', setRoomNameContainer)

export const renderPauseContainer = () => renderContainer('pause-container', setPauseContainer)

const renderPopupContainer = () => renderContainer('popupover-container', setPopupContainer)

const renderHealthStatusContainer = () => {
    renderContainer('health-status-container', setHealthStatusContainer)
    const infectedContainer = createAndAddClass('div', 'infected-container')
    if (IS_MOBILE) addClass(infectedContainer, 'mobile-infected-container')
    const virusBar = createAndAddClass('div', 'virus-bar')
    infectedContainer.append(virusBar)
    getHealthStatusContainer().append(infectedContainer)
    getInfection().forEach(virus => renderVirusIcon(virus))
}

const renderShadowContainer = () => {
    renderContainer('shadow-container', setShadowContainer)
    const shadow = createAndAddClass('div', 'shadow')
    getShadowContainer().append(shadow)
}

const renderDialogueContainer = () => renderContainer('dialouge-container', setDialogueContainer)

const renderContainer = (className, setter) => {
    const root = document.getElementById('root')
    const container = createAndAddClass('div', className)
    setter(container)
    root.append(container)
}

const renderMap = () => {
    const root = document.getElementById('root')
    const map = createAndAddClass('div', 'map')
    setMapEl(map)
    root.append(map)
}

const renderRoomContainer = () => {
    const roomContainer = createAndAddClass('div', 'room-container')
    setRoomContainer(roomContainer)
    getMapEl().append(roomContainer)
}

const renderCurrentRoom = () => loadCurrentRoom()

export const renderPlayer = () => {
    const player = createAndAddClass('div', 'player')
    player.id = 'player'
    player.style.left = `${getPlayerX()}px`
    player.style.top = `${getPlayerY()}px`
    const playerCollider = createAndAddClass('div', 'player-collider')
    player.append(playerCollider)
    const playerBody = createAndAddClass('div', 'player-body')
    playerBody.style.transform = `rotateZ(${getPlayerAngle()}deg)`
    const forwardDetector = createAndAddClass('div', 'forward-detector')
    const dialogueContainer = createAndAddClass('div', 'player-dialouge-container')
    appendAll(playerCollider, playerBody, forwardDetector, dialogueContainer)
    const leftHand = createAndAddClass('div', 'player-left-hand')
    leftHand.addEventListener('animationiteration', playFootstep)
    const playerHead = createAndAddClass('div', 'player-head')
    const rightHand = createAndAddClass('div', 'player-right-hand')
    playerBody.append(leftHand, playerHead, rightHand)
    setPlayer(player)
    return player
}

export const centralizePlayer = () => {
    const xDiff = getPlayerX() - window.innerWidth / 2 + 12
    const yDiff = getPlayerY() - window.innerHeight / 2 + 12
    getMapEl().style.left = `${-xDiff}px`
    getMapEl().style.top = `${-yDiff}px`
    setMapX(-xDiff)
    setMapY(-yDiff)
}
