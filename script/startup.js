import { addControls } from './controls.js'
import {
    getMapEl,
    setHealthStatusContainer,
    setMapEl,
    setPauseContainer,
    setPlayer,
    setRoomContainer,
    setShadowContainer,
} from './elements.js'
import { loadCurrentRoom } from './room-loader.js'
import { playActionMusic, playFootstep } from './sound-manager.js'
import {
    renderAimJoystick,
    renderMovementJoystick,
    renderPauseButton,
    renderReloadButton,
    renderSlots,
    renderSprintButton,
    renderThrowableButtons,
    renderUi,
} from './user-interface.js'
import { appendAll, createAndAddClass, useDeltaTime } from './util.js'
import { getPlayerAngle, getPlayerX, getPlayerY, setMapX, setMapY } from './variables.js'

export let noOffenseCounterLimit = 0

export const startUp = () => {
    addControls()
    renderContainer('pause-container', setPauseContainer)
    renderContainer('health-status-container', setHealthStatusContainer)
    renderShadowContainer()
    renderUi()
    renderMap()
    renderRoomContainer()
    getMapEl().append(renderPlayer())
    loadCurrentRoom()
    centralizePlayer()
    renderMovementJoystick()
    renderAimJoystick()
    renderSprintButton()
    renderReloadButton()
    renderPauseButton()
    renderSlots()
    renderThrowableButtons()
    noOffenseCounterLimit = useDeltaTime(120)
    playActionMusic()
}

const renderContainer = (className, setter) => {
    const container = createAndAddClass('div', className)
    setter(container)
    document.getElementById('root').append(container)
}

const renderShadowContainer = () => {
    renderContainer('shadow-container', setShadowContainer)
    document.querySelector('.shadow-container').append(createAndAddClass('div', 'shadow'))
}

const renderMap = () => {
    const map = createAndAddClass('div', 'map')
    setMapEl(map)
    document.getElementById('root').append(map)
}

const renderRoomContainer = () => {
    const roomContainer = createAndAddClass('div', 'room-container')
    setRoomContainer(roomContainer)
    getMapEl().append(roomContainer)
}

export const renderPlayer = () => {
    const player = createAndAddClass('div', 'player')
    player.id = 'player'
    player.style.left = `${getPlayerX()}px`
    player.style.top = `${getPlayerY()}px`
    const collider = createAndAddClass('div', 'player-collider')
    const body = createAndAddClass('div', 'player-body')
    body.style.transform = `rotateZ(${getPlayerAngle()}deg)`
    const forwardDetector = createAndAddClass('div', 'forward-detector')
    collider.append(body, forwardDetector)
    const leftHand = createAndAddClass('div', 'player-left-hand')
    leftHand.addEventListener('animationiteration', playFootstep)
    const head = createAndAddClass('div', 'player-head')
    const rightHand = createAndAddClass('div', 'player-right-hand')
    appendAll(body, leftHand, head, rightHand)
    player.append(collider, renderLoading())
    setPlayer(player)
    return player
}

const renderLoading = () => {
    const container = createAndAddClass('div', 'loading-container', 'animation')
    const bar = document.createElement('div')
    bar.style.width = '0%'
    container.style.display = 'none'
    container.append(bar)
    return container
}

export const centralizePlayer = () => {
    const xDiff = getPlayerX() - window.innerWidth / 2 + 12
    const yDiff = getPlayerY() - window.innerHeight / 2 + 12
    getMapEl().style.left = `${-xDiff}px`
    getMapEl().style.top = `${-yDiff}px`
    setMapX(-xDiff)
    setMapY(-yDiff)
}
