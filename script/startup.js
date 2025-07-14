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
import { playFootstep, playPeaceMusic } from './sound-manager.js'
import { getChaos } from './survival/variables.js'
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
    renderThrowButton,
    renderToggleMenuButton,
    renderUi,
} from './user-interface.js'
import { addClass, appendAll, createAndAddClass, difficulties, useDeltaTime } from './util.js'
import { getDifficulty, getInfection, getIsSurvival, getPlayerAngle, getPlayerX, getPlayerY, setMapX, setMapY } from './variables.js'

export let noOffenseCounterLimit
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
    renderThrowButton()
    renderPauseButton()
    renderSlots()
    handeNoOffenceCounterLimit()
    if (getChaos() !== 0 && getIsSurvival()) renderToggleMenuButton()
    if (getIsSurvival()) playPeaceMusic()
}

const renderRoomNameContainer = () => renderContainer('room-name-container', setRoomNameContainer)

export const renderPauseContainer = () => renderContainer('pause-container', setPauseContainer)

const renderPopupContainer = () => renderContainer('popover-container', setPopupContainer)

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
    player.append(renderLoading())
    setPlayer(player)
    return player
}

const renderLoading = () => {
    const loadingContainer = createAndAddClass('div', 'loading-container', 'animation')
    const loadingBar = document.createElement('div')
    appendAll(loadingContainer, loadingBar)
    loadingBar.style.width = '0%'
    loadingContainer.style.display = 'none'
    return loadingContainer
}

export const centralizePlayer = () => {
    const xDiff = getPlayerX() - window.innerWidth / 2 + 12
    const yDiff = getPlayerY() - window.innerHeight / 2 + 12
    getMapEl().style.left = `${-xDiff}px`
    getMapEl().style.top = `${-yDiff}px`
    setMapX(-xDiff)
    setMapY(-yDiff)
}

const handeNoOffenceCounterLimit = () => {
    if (getDifficulty() === difficulties.MILD) noOffenseCounterLimit = useDeltaTime(150)
    else if (getDifficulty() === difficulties.MIDDLE) noOffenseCounterLimit = useDeltaTime(120)
    else noOffenseCounterLimit = useDeltaTime(90)
}
