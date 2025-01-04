import { play } from './game.js'
import { finishUp } from './finishup.js'
import { renderDesktop } from './computer.js'
import { playTest } from './mapMaker/map-maker.js'
import { getChaos } from './survival/variables.js'
import { managePause, unequipTorch } from './actions.js'
import { return2MainMenu, return2MapMaker } from './pause-menu.js'
import { loadGameFromSlot, prepareNewGameData } from './data-manager.js'
import { getGrabBar, getPauseContainer, getPlayer } from './elements.js'
import { addClass, appendAll, createAndAddClass, removeAllClasses, removeEquipped } from './util.js'
import { getDifficulty, getHealth, getIsMapMakerRoot, getIsSurvival, getPlaythroughId, setPauseCause } from './variables.js'

export const manageGameOver = () => {
    if ( getHealth() !== 0 ) return
    removeSavedSurvivals()
    setTimeout(() => renderGameOverScreen(), 1000)
    setPauseCause('game-over')
    managePause()
    const playerBody = getPlayer().firstElementChild.firstElementChild
    playerBody.style.transition = 'unset'
    addClass(getPlayer(), 'dead-player')
    removeAllClasses(getPlayer(), 'aim', 'throwable-aim')
    getGrabBar()?.remove()
    unequipTorch()
    removeEquipped()
    appendAll(playerBody, createAndAddClass('div', 'left-leg'), createAndAddClass('div', 'right-leg'))
}

const removeSavedSurvivals = () => {
    for ( let i = 0; i < 10; i++ )
        if ( JSON.parse(localStorage.getItem(`slot-${i+1}-variables`))?.playthroughId === getPlaythroughId() ) 
            localStorage.setItem(`slot-${i+1}`, 'empty')
}

const renderGameOverScreen = () => {
    const gameOverContainer = createAndAddClass('div', 'full', 'ui-theme', 'game-over')
    const gameOverContents = createAndAddClass('div', 'game-over-contents', 'common-options')
    const title = document.createElement('h1')
    title.textContent = getIsSurvival() ? `you survived ${getChaos()} ${getChaos() === 1 ? 'round' : 'rounds'}` : 'You are dead'
    const continueOption = createAndAddClass('div', 'common-option')
    continueOption.textContent = getIsSurvival() ? `try again` : 'continue'
    continueOption.addEventListener('click', () => {
        if ( getIsMapMakerRoot() ) {
            finishUp()
            playTest()
        }
        else if ( getIsSurvival() ) playWithGivenData(() => prepareNewGameData(getDifficulty()))
        else if (hasSaveInPlaythrogh() ) loadLatestSavedSlot()
        else                             startNewGame()
    })
    const loadGame = createAndAddClass('div', 'common-option')
    loadGame.addEventListener('click', () => renderDesktop(true))
    loadGame.textContent = 'load game'
    const mainMenu = createAndAddClass('div', 'common-option')
    mainMenu.textContent = 'return to main menu'
    mainMenu.addEventListener('click', () => return2MainMenu())
    appendAll(gameOverContents, title, continueOption)
    if ( getIsSurvival() )           appendAll(gameOverContents, mainMenu)    
    else if ( !getIsMapMakerRoot() ) appendAll(gameOverContents, loadGame, mainMenu)
    else {
        const mapMaker = createAndAddClass('div', 'common-option')
        mapMaker.textContent = 'return to map maker'
        mapMaker.addEventListener('click', return2MapMaker)
        gameOverContents.append(mapMaker)
    }    
    gameOverContainer.append(gameOverContents)
    getPauseContainer().append(gameOverContainer)
}

const hasSaveInPlaythrogh = () =>
    new Array(10)
        .fill(null)
        .map((item, index) => JSON.parse(localStorage.getItem(`slot-${index+1}-variables`)))
        .find(item => item?.playthroughId === getPlaythroughId())

const loadLatestSavedSlot = () => playWithGivenData(() => loadGameFromSlot(Number(localStorage.getItem('last-slot-used'))))

const startNewGame = () => playWithGivenData(() => prepareNewGameData(getDifficulty()))

const playWithGivenData = (loader) => {
    finishUp()
    loader()
    play(false, true)
}