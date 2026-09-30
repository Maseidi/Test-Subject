import { getPauseContainer } from './elements.js'
import { setEnemies, setLoaders, setRooms, setWalls } from './entities.js'
import { finishUp } from './finish-up.js'
import { renderMainMenu } from './main-menu.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { quitPage, renderQuit } from './user-interface.js'
import { appendAll, createAndAddClass } from './util.js'

export const renderPauseMenu = () => {
    const background = createAndAddClass('div', 'ui-theme', 'full', 'common')
    background.style.padding = '100px'
    const options = createAndAddClass('div', 'common-options')
    options.append(menuButton('resume', quitPage), menuButton('return to main menu', renderReturnConfirmation))
    background.append(options)
    getPauseContainer().append(background)
    renderQuit()
}

const menuButton = (label, action) => {
    const button = createAndAddClass('div', 'common-option')
    button.textContent = label
    addHoverSoundEffect(button)
    button.addEventListener('click', () => {
        playClickSoundEffect()
        action()
    })
    return button
}

const renderReturnConfirmation = () => {
    const overlay = createAndAddClass('div', 'common-popup-container', 'ui-theme', 'popup-container')
    const popup = createAndAddClass('div', 'common-popup')
    const title = Object.assign(document.createElement('p'), { textContent: 'Return to the main menu?' })
    title.className = 'return-title'
    const helper = Object.assign(document.createElement('p'), {
        textContent: 'Progress is saved automatically after each completed room.',
    })
    helper.className = 'return-helper'
    const buttons = createAndAddClass('div', 'common-buttons')
    const cancel = createAndAddClass('button', 'common-button', 'common-button-cancel')
    const confirm = createAndAddClass('button', 'common-button', 'common-button-confirm')
    cancel.type = 'button'
    confirm.type = 'button'
    cancel.textContent = 'cancel'
    confirm.textContent = 'yes'
    addHoverSoundEffect(cancel)
    addHoverSoundEffect(confirm)
    cancel.addEventListener('click', () => {
        playClickSoundEffect()
        overlay.remove()
    })
    confirm.addEventListener('click', () => {
        playClickSoundEffect()
        return2MainMenu()
    })
    appendAll(buttons, cancel, confirm)
    appendAll(popup, title, helper, buttons)
    overlay.append(popup)
    getPauseContainer().lastElementChild.append(overlay)
}

export const return2MainMenu = () => {
    setRooms(new Map())
    setEnemies(new Map())
    setWalls(new Map())
    setLoaders(new Map())
    finishUp()
    renderMainMenu()
}
