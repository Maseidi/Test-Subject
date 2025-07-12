import { managePause } from './actions.js'
import { getPopupContainer } from './elements.js'
import { getPopups } from './entities.js'
import { activateAllProgresses } from './progress-manager.js'
import { playClickSoundEffect } from './sound-manager.js'
import { appendAll, createAndAddClass } from './util.js'
import { setPauseCause } from './variables.js'

export class Popup {
    constructor(message, progress) {
        this.message = message ?? null
        this.renderProgress = progress?.renderProgress ?? null
        this.progress2Active = progress?.progress2Active ?? []
    }
}

export const renderPopup = progress => {
    const popupObj = getPopups()?.find(popup => Number(popup.renderProgress) === Number(progress))
    if (!popupObj) return
    const { message, progress2Active } = popupObj
    if (getPopupContainer().firstElementChild) getPopupContainer().firstElementChild.remove()
    const popup = createAndAddClass('div', 'ui-theme', 'hint-popup', 'animation')
    const contentContainer = document.createElement('div')
    const content = document.createElement('p')
    content.innerHTML = typeof message === 'function' ? message() : message
    const continueBtn = document.createElement('span')
    continueBtn.addEventListener('click', () => {
        playClickSoundEffect()
        activateAllProgresses(progress2Active)
        managePause()
        popup.remove()
    })
    continueBtn.textContent = 'continue'
    appendAll(contentContainer, content, continueBtn)
    popup.append(contentContainer)
    getPopupContainer().append(popup)
    setPauseCause('popup')
    managePause()
}
