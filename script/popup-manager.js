import { getPopupContainer } from './elements.js'
import { getPopups } from './entities.js'
import { getSettings } from './settings.js'
import { addAllAttributes, appendAll, createAndAddClass } from './util.js'

export class Popup {
    constructor(message, progress, duration) {
        this.message = message ?? null
        this.renderProgress = progress?.renderProgress ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration = duration ?? 30000
    }
}

export const renderPopup = progress => {
    const popupObj = getPopups()?.find(popup => popup.renderProgress === progress)
    if (!popupObj) return
    const { message, duration, progress2Active } = popupObj
    if (getPopupContainer().firstElementChild) getPopupContainer().firstElementChild.remove()
    const popup = createAndAddClass('div', 'ui-theme', 'hint-popup', 'animation')
    const content = document.createElement('p')
    content.innerHTML = typeof message === 'function' ? message() : message
    appendAll(popup, content)
    addAllAttributes(
        popup,
        'timer',
        0,
        'duration',
        (duration / 1000) * getSettings().display.fps,
        'progress2active',
        progress2Active,
        'fade-out',
        500,
    )
    getPopupContainer().append(popup)
}
