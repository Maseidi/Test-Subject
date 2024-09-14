import { Progress } from './progress.js'
import { activateProgress } from './progress-manager.js'
import { getPopupContainer, getRoomNameContainer } from './elements.js'
import { addClass, appendAll, createAndAddClass, object2Element, removeClass } from './util.js'

class Popup {
    constructor(message, progress, duration) {
        this.message =         message ?? null
        this.renderProgress =  progress?.renderProgress ?? null
        this.progress2Active = progress?.progress2Active ?? null
        this.duration =        duration ?? 1800
    }
}

const popups = [
    new Popup('This is a test message', Progress.builder().setRenderProgress('5').setProgress2Active('6'), 120)
]

export const managePopup = () => {
    const popup = getPopupContainer().firstElementChild
    if ( !popup ) return
    const time = Number(popup.getAttribute('time'))
    if ( time === Number(popup.getAttribute('duration')) ) closePopup(popup, popup.getAttribute('progress2Active'))
    popup.setAttribute('time', time + 1)
}

export const renderPopup = (progress) => {
    const popupObj = popups.find(popup => popup.renderProgress === progress)
    if ( !popupObj ) return
    if ( getPopupContainer().firstElementChild ) getPopupContainer().firstElementChild.remove()
    const popup = object2Element(popupObj)
    addClass(popup, 'progress-popup')
    addClass(popup, 'ui-theme')
    const content = document.createElement('p')
    content.textContent = popupObj.message
    const close = document.createElement('span')
    close.textContent = 'continue'
    close.addEventListener('click', () => closePopup(popup, popupObj.progress2Active))
    appendAll(popup, content, close)
    getPopupContainer().append(popup)
    popup.setAttribute('time', 0)
}

export const closePopup = (popup, active) => {
    addClass(popup, 'popup-fade-out')
    popup.addEventListener('transitionend', () => {
        popup.remove()
        activateProgress(active)
    })
}

export const manageRoomName = () => {
    const roomName = getRoomNameContainer().firstElementChild
    if ( !roomName ) return
    const time = Number(roomName.getAttribute('time'))
    roomName.setAttribute('time', time + 1)
    if ( time !== 300 ) return
    removeClass(roomName, 'room-name-animation')
    addClass(roomName, 'room-name-fade-out')
}

export const renderRoomName = (name) => {
    if ( getRoomNameContainer().firstElementChild ) getRoomNameContainer().firstElementChild.remove()
    const roomNamePopup = createAndAddClass('div', 'room-name-popup', 'ui-theme', 'room-name-animation')
    const chars = name.split('')
    for ( let i = 0; i < chars.length; i++ ) {
        const char = chars[i]
        const charEl = document.createElement('span')
        charEl.textContent = char
        charEl.style.animationDelay = `${i * 100}ms`
        roomNamePopup.append(charEl)
    }
    getRoomNameContainer().append(roomNamePopup)
    roomNamePopup.addEventListener('transitionend', () => roomNamePopup.remove())
    roomNamePopup.setAttribute('time', 0)
}
