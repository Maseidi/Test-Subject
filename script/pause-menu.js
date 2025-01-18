import { renderDesktop } from './computer.js'
import { getPauseContainer } from './elements.js'
import { finishUp } from './finishup.js'
import { renderMainMenu } from './main-menu.js'
import { getMapMakerEl } from './mapMaker/elements.js'
import { pauseFn, renderMapMaker } from './mapMaker/map-maker.js'
import {
    setDialogues,
    setEnemies,
    setInteractables,
    setLoaders,
    setPopups,
    setRooms,
    setShop,
    setWalls,
} from './mapMaker/variables.js'
import { quitPage, renderQuit } from './user-interface.js'
import { appendAll, createAndAddClass } from './util.js'
import { getIsMapMakerRoot, setIsMapMakerRoot } from './variables.js'

// NOTE: Map maker in arguments says that the pause menu is opened at map maker environment
// NOTE: Variable isMapMakerRoot indicates that the game is being play tested through the map maker engine
export const renderPauseMenu = (mapMaker = false) => {
    const background = createAndAddClass('div', 'ui-theme', 'full', 'common')
    background.style.padding = '100px'
    background.append(renderOptionsContainer(mapMaker))
    getPauseContainer().append(background)
    renderQuit(mapMaker)
}

const renderOptionsContainer = mapMaker => {
    const options = createAndAddClass('div', 'common-options')
    appendAll(options, ...renderOptions(mapMaker))
    return options
}

const renderOptions = mapMaker => {
    const options = []
    const resume = createAndAddClass('div', 'common-option')
    resume.textContent = 'resume'
    if (mapMaker) resume.addEventListener('click', () => getPauseContainer().lastElementChild.remove())
    else resume.addEventListener('click', () => quitPage())
    options.push(resume)
    const loadGame = createAndAddClass('div', 'common-option')
    loadGame.textContent = 'load game'
    if (!getIsMapMakerRoot() && !mapMaker) options.push(loadGame)
    loadGame.addEventListener('click', () => renderDesktop(true))
    const mainMenu = createAndAddClass('div', 'common-option')
    mainMenu.textContent = getIsMapMakerRoot() ? 'return to map maker' : 'return to main menu'
    mainMenu.addEventListener('click', () => renderConfirmReturn2MainMenu(mapMaker))
    options.push(mainMenu)
    return options
}

const renderConfirmReturn2MainMenu = mapMaker => {
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
    confirm.addEventListener('click', () => {
        if (getIsMapMakerRoot()) return2MapMaker()
        else return2MainMenu(mapMaker)
    })
    getPauseContainer().append(returnPopup)
    appendAll(buttons, cancel, confirm)
    appendAll(returnPopup, title, helper, buttons)
    returnPopupContainer.append(returnPopup)
    getPauseContainer().lastElementChild.append(returnPopupContainer)
}

const closeReturnPopup = () => getPauseContainer().lastElementChild.lastElementChild?.remove()

export const return2MainMenu = mapMaker => {
    setRooms([])
    setEnemies(new Map([]))
    setWalls(new Map([]))
    setInteractables(new Map([]))
    setLoaders(new Map([]))
    setDialogues([])
    setPopups([])
    setShop([])

    if (mapMaker) {
        window.removeEventListener('keydown', pauseFn, true)
        getPauseContainer().remove()
        getMapMakerEl().remove()
    } else finishUp()
    renderMainMenu()
}

export const return2MapMaker = () => {
    setIsMapMakerRoot(false)
    finishUp()
    renderMapMaker()
}
