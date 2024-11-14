import { finishUp } from './finishup.js'
import { getDialogues, getEnemies, getInteractables, getLoaders, getPopups, getRooms, getWalls } from './entities.js'
import { renderDesktop } from './computer.js'
import { renderMainMenu } from './main-menu.js'
import { getPauseContainer } from './elements.js'
import { getIsMapMakerRoot, setIsMapMakerRoot } from './variables.js'
import { setDialogues, setEnemies, setInteractables, setLoaders, setPopups, setRooms, setShop, setWalls } from './mapMaker/variables.js'
import { getMapMakerEl } from './mapMaker/elements.js'
import { appendAll, createAndAddClass } from './util.js'
import { renderMapMaker } from './mapMaker/map-maker.js'
import { quitPage, renderQuit } from './user-interface.js'
import { getShopItems } from './shop-item.js'

// NOTE: Map maker in arguments says that the pause menu is opened at map maker environment
// NOTE: Variable isMapMakerRoot indicates that the game is being play tested through the map maker engine
export const renderPauseMenu = (mapMaker = false) => {
    const background = createAndAddClass('div', 'ui-theme', 'full', 'common')
    background.style.padding = '100px'
    background.append(renderOptionsContainer(mapMaker))
    getPauseContainer().append(background)
    renderQuit()
}

const renderOptionsContainer = (mapMaker) => {
    const options = createAndAddClass('div', 'common-options')
    appendAll(options, ...renderOptions(mapMaker))
    return options
}

const renderOptions = (mapMaker) => {
    const resume = createAndAddClass('div', 'common-option')
    resume.textContent = 'resume'
    resume.addEventListener('click', quitPage)
    const loadGame = createAndAddClass('div', 'common-option')
    loadGame.textContent = 'load game'
    const mainMenu = createAndAddClass('div', 'common-option')
    loadGame.addEventListener('click', () => renderDesktop(true))
    mainMenu.textContent = getIsMapMakerRoot() ? 'return to map maker' : 'return to main menu'
    mainMenu.addEventListener('click', () => renderConfirmReturn2MainMenu(mapMaker))
    return [resume, loadGame, mainMenu]
}

const renderConfirmReturn2MainMenu = (mapMaker) => {
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
        if ( getIsMapMakerRoot() ) return2MapMaker()
        else return2MainMenu(mapMaker)
    })
    getPauseContainer().append(returnPopup)
    appendAll(buttons, cancel, confirm)
    appendAll(returnPopup, title, helper, buttons)
    returnPopupContainer.append(returnPopup)
    getPauseContainer().firstElementChild.append(returnPopupContainer)
}

const closeReturnPopup = () => {
    getPauseContainer().firstElementChild.lastElementChild?.remove()
}

export const return2MainMenu = (mapMaker) => {
    if ( mapMaker ) {
        getPauseContainer().remove()
        getMapMakerEl().remove()
    }
    else finishUp()
    renderMainMenu()
}

const return2MapMaker = () => {
    setIsMapMakerRoot(false)
    finishUp()
    initMapMakerDataWithGameData()
    renderMapMaker()
}

const initMapMakerDataWithGameData = () => {
    setRooms([...getRooms().values()])
    setWalls(getWalls())
    setLoaders(getLoaders())
    setInteractables(getInteractables())
    setEnemies(getEnemies())
    setDialogues(getDialogues())
    setPopups(getPopups())
    setShop(getShopItems())
}