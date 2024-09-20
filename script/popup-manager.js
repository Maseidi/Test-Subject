import { Progress } from './progress.js'
import { activateProgress } from './progress-manager.js'
import { getPopupContainer, getRoomNameContainer } from './elements.js'
import { addAllClasses, addClass, appendAll, createAndAddClass, object2Element, removeClass } from './util.js'

class Popup {
    constructor(message, progress, duration) {
        this.message =         message                   ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? null
        this.duration =        duration                  ?? 30000
    }
}

const popups = [
    new Popup('Use <span>W</span> <span>A</span> <span>S</span> <span>D</span> to move around', 
        Progress.builder().setRenderProgress('1').setProgress2Active('2'), 5000),
    new Popup('Press <span>F</span> to pickup items', Progress.builder().setRenderProgress('2'), 5000),
    new Popup('Use <span>TAB</span> to open inventory', Progress.builder().setRenderProgress('3').setProgress2Active('4'), 5000),
    new Popup('You can do a wide variety of things with any item in your inventory', 
        Progress.builder().setRenderProgress('4').setProgress2Active('5'), 5000
    ),
    new Popup('Open inventory when interacting with doors and use the needed key to open them', 
        Progress.builder().setRenderProgress('6'), 5000
    ),
]

export const renderPopup = (progress) => {
    const popupObj = popups.find(popup => popup.renderProgress === progress)
    if ( !popupObj ) return
    if ( getPopupContainer().firstElementChild ) getPopupContainer().firstElementChild.remove()
    const popup = object2Element(popupObj)
    addAllClasses(popup, 'ui-theme', 'progress-popup', 'animation')
    const content = document.createElement('p')
    content.innerHTML = popupObj.message
    const close = document.createElement('span')
    close.textContent = 'continue'
    close.addEventListener('click', () => closePopup(popup, popupObj.progress2Active))
    appendAll(popup, content, close)
    getPopupContainer().append(popup)
    popup.addEventListener('animationend', () => popupLifetime(popup, popupObj.duration))
}

const popupLifetime = (popup, duration) => {
    addClass(popup, 'timer')
    popup.style.animationDuration = `${duration}ms`
    popup.addEventListener('animationend', () => closePopup(popup, popup.getAttribute('progress2Active')))
}

const closePopup = (popup, active) => {
    removeClass(popup, 'timer')
    popup.style = ''
    addClass(popup, 'popup-fade-out')
    popup.addEventListener('animationend', () => {
        popup.remove()
        activateProgress(active)
    })
}

export const renderRoomName = (name) => {
    if ( getRoomNameContainer().firstElementChild ) getRoomNameContainer().firstElementChild.remove()
    const roomNamePopup = createAndAddClass('div', 'room-name-popup', 'ui-theme', 'room-name-animation', 'animation')
    const chars = name.split('')
    for ( let i = 0; i < chars.length; i++ ) {
        const char = chars[i]
        const charEl = document.createElement('span')
        addClass(charEl, 'animation')
        charEl.textContent = char
        charEl.style.animationDelay = `${i * 100}ms`
        roomNamePopup.append(charEl)
        if ( i === chars.length - 1 ) charEl.addEventListener('animationend', () => roomNameLifetime(roomNamePopup))
    }
    getRoomNameContainer().append(roomNamePopup)
}

const roomNameLifetime = (roomName) => {    
    roomName.addEventListener('animationend', () => {
        addClass(roomName, 'timer')
        roomName.style.animationDuration = `5s`
        roomName.addEventListener('animationend', () => closeRoomName(roomName))
    })
}

const closeRoomName = (roomName) => {
    removeClass(roomName, 'timer')
    roomName.style.animationDuration = ''
    addClass(roomName, 'room-name-fade-out')
    roomName.addEventListener('animationend', () => roomName.remove())
}