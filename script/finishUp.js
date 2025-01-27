import { removeControls } from './controls.js'
import {
    getAimJoystick,
    getCurrentRoom,
    getDialogueContainer,
    getHealButton,
    getHealthStatusContainer,
    getInteractButton,
    getInventoryButton,
    getMapEl,
    getMovementJoystick,
    getPauseContainer,
    getPlayer,
    getPopupContainer,
    getRoomContainer,
    getRoomNameContainer,
    getShadowContainer,
    getSprintButton,
    getUiEl,
    setAimJoystick,
    setCurrentRoom,
    setDialogueContainer,
    setHealButton,
    setHealthStatusContainer,
    setInteractButton,
    setMapEl,
    setMovementJoystick,
    setPauseContainer,
    setPlayer,
    setPopupContainer,
    setRoomContainer,
    setRoomNameContainer,
    setShadowContainer,
    setSprintButton,
    setUiEl,
} from './elements.js'
import { getGameId, setGameId } from './variables.js'

export const finishUp = () => {
    removeControls()
    removeElement(getRoomNameContainer(), setRoomNameContainer)
    removeElement(getPauseContainer(), setPauseContainer)
    removeElement(getPopupContainer(), setPopupContainer)
    removeElement(getHealthStatusContainer(), setHealthStatusContainer)
    removeElement(getShadowContainer(), setShadowContainer)
    removeElement(getDialogueContainer(), setDialogueContainer)
    removeElement(getUiEl(), setUiEl)
    removeElement(getCurrentRoom(), setCurrentRoom)
    removeElement(getRoomContainer(), setRoomContainer)
    removeElement(getPlayer(), setPlayer)
    removeElement(getMapEl(), setMapEl)
    removeElement(getMovementJoystick(), setMovementJoystick)
    removeElement(getAimJoystick(), setAimJoystick)
    removeElement(getSprintButton(), setSprintButton)
    removeElement(getInventoryButton(), setSprintButton)
    removeElement(getInteractButton(), setInteractButton)
    removeElement(getHealButton(), setHealButton)
    endSession()
}

const removeElement = (elem, setter) => {
    elem?.remove()
    setter(null)
}

const endSession = () => {
    window.clearInterval(getGameId())
    setGameId(null)
}
