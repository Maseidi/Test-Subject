import { finishUp } from './finishUp.js'
import { renderDesktop } from './computer.js'
import { renderMainMenu } from './main-menu.js'
import { getPauseContainer } from './elements.js'
import { appendAll, createAndAddClass } from './util.js'
import { quitPage, renderQuit } from './user-interface.js'

export const renderPauseMenu = () => {
    const background = createAndAddClass('div', 'ui-theme', 'full', 'common')
    background.style.padding = '100px'
    background.append(renderOptionsContainer())
    getPauseContainer().append(background)
    renderQuit()
}

const renderOptionsContainer = () => {
    const options = createAndAddClass('div', 'common-options')
    appendAll(options, ...renderOptions())
    return options
}

const renderOptions = () => {
    const resume = createAndAddClass('div', 'common-option')
    resume.textContent = 'resume'
    resume.addEventListener('click', quitPage)
    const loadGame = createAndAddClass('div', 'common-option')
    loadGame.textContent = 'load game'
    const mainMenu = createAndAddClass('div', 'common-option')
    loadGame.addEventListener('click', () => renderDesktop(true))
    mainMenu.textContent = 'return to main menu'
    mainMenu.addEventListener('click', renderConfirmReturn2MainMenu)
    return [resume, loadGame, mainMenu]
}

const renderConfirmReturn2MainMenu = () => {
    const returnPopupContainer = createAndAddClass('div', 'common-popup-container', 'ui-theme', 'popup-container')
    const returnPopup = createAndAddClass('div', 'common-popup')
    const title = createAndAddClass('p', 'return-title')
    title.textContent = 'Are you sure you wish to return?'
    const helper = createAndAddClass('p', 'return-helper')
    helper.textContent = 'All unsaved progress will be lost'
    const buttons = createAndAddClass('div', 'common-buttons')
    const cancel = createAndAddClass('button', 'popup-cancel')
    cancel.addEventListener('click', closeReturnPopup)
    cancel.textContent = 'cancel'
    const confirm = createAndAddClass('button', 'popup-confirm')
    confirm.textContent = 'yes'
    confirm.addEventListener('click', return2MainMenu)
    getPauseContainer().append(returnPopup)
    appendAll(buttons, cancel, confirm)
    appendAll(returnPopup, title, helper, buttons)
    returnPopupContainer.append(returnPopup)
    getPauseContainer().firstElementChild.append(returnPopupContainer)
}

const closeReturnPopup = () => {
    getPauseContainer().firstElementChild.lastElementChild?.remove()
}

export const return2MainMenu = () => {
    finishUp()
    renderMainMenu()
}