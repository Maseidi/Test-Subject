import { getRoomNameContainer } from './elements.js'
import { getSettings } from './settings.js'
import { addAllAttributes, addClass, createAndAddClass } from './util.js'

export const renderRoomName = name => {
    if (getRoomNameContainer().firstElementChild) getRoomNameContainer().firstElementChild.remove()
    const roomNamePopup = createAndAddClass('div', 'room-name-popup', 'ui-theme', 'room-name-animation', 'animation')
    const chars = name.split('')
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        const charEl = document.createElement('span')
        addClass(charEl, 'animation')
        charEl.textContent = char
        charEl.style.animationDelay = `${i * 100}ms`
        roomNamePopup.append(charEl)
    }
    addAllAttributes(roomNamePopup, 'timer', 0, 'duration', 5 * getSettings().display.fps, 'fade-out', 5000)
    getRoomNameContainer().append(roomNamePopup)
}
