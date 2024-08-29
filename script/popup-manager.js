import { addClass, appendAll, createAndAddClass } from './util.js'
import { getPopupContainer } from './elements.js'

const popups = new Map([
    ['100', 'Use the lever to toggle the doors']
])

export const renderPopup = (progress) => {
    if ( !popups.get(progress) ) return
    if ( getPopupContainer().firstElementChild ) getPopupContainer().firstElementChild.remove()
    const popup = createAndAddClass('div', 'progress-popup', 'ui-theme')
    const content = document.createElement('p')
    content.textContent = popups.get(progress)
    const close = document.createElement('span')
    close.textContent = 'close'
    close.addEventListener('click', () => closePopup(popup))
    appendAll(popup, content, close)
    getPopupContainer().append(popup)
    setTimeout(() => closePopup(popup), 30000)
}

const closePopup = (popup) => {
    addClass(popup, 'fade-out')
    setTimeout(() => popup.remove(), 1500)
}