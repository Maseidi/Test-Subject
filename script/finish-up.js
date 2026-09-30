import { removeControls } from './controls.js'
import * as elements from './elements.js'
import { setPlayingMusic } from './sound-manager.js'
import { getGameId, setGameId } from './variables.js'

const removableElements = [
    ['getPauseContainer', 'setPauseContainer'],
    ['getHealthStatusContainer', 'setHealthStatusContainer'],
    ['getShadowContainer', 'setShadowContainer'],
    ['getUiEl', 'setUiEl'],
    ['getCurrentRoom', 'setCurrentRoom'],
    ['getRoomContainer', 'setRoomContainer'],
    ['getPlayer', 'setPlayer'],
    ['getMapEl', 'setMapEl'],
    ['getMovementJoystick', 'setMovementJoystick'],
    ['getAimJoystick', 'setAimJoystick'],
    ['getSprintButton', 'setSprintButton'],
    ['getInteractButton', 'setInteractButton'],
    ['getReloadButton', 'setReloadButton'],
    ['getGrenadeButton', 'setGrenadeButton'],
    ['getFlashbangButton', 'setFlashbangButton'],
    ['getPauseButton', 'setPauseButton'],
    ['getSlotsContainer', 'setSlotsContainer'],
]

export const finishUp = () => {
    setPlayingMusic(null)
    removeControls()
    removableElements.forEach(([getter, setter]) => {
        elements[getter]()?.remove()
        elements[setter](null)
    })
    window.clearInterval(getGameId())
    setGameId(null)
}
