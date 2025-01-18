import { removeControls } from './controls.js'
import {
    getCurrentRoom,
    getDialogueContainer,
    getHealthStatusContainer,
    getMapEl,
    getPauseContainer,
    getPlayer,
    getPopupContainer,
    getRoomContainer,
    getRoomNameContainer,
    getShadowContainer,
    getUiEl,
    setCurrentRoom,
    setDialogueContainer,
    setHealthStatusContainer,
    setMapEl,
    setPauseContainer,
    setPlayer,
    setPopupContainer,
    setRoomContainer,
    setRoomNameContainer,
    setShadowContainer,
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
    endSession()
}

const removeElement = (elem, setter) => {
    elem.remove()
    setter(null)
}

const endSession = () => {
    window.clearInterval(getGameId())
    setGameId(null)
}
