import { play } from './game.js'
import { finishUp } from './finishup.js'
import { managePause } from './actions.js'
import { renderDesktop } from './computer.js'
import { return2MainMenu } from './pause-menu.js'
import { getPauseContainer, getPlayer } from './elements.js'
import { addClass, appendAll, createAndAddClass } from './util.js'
import { loadGameFromSlot, prepareNewGameData } from './data-manager.js'
import { getDifficulty, getHealth, getPlaythroughId, setPauseCause } from './variables.js'

export const manageGameOver = () => {
    if ( getHealth() !== 0 ) return
    setTimeout(() => renderGameOverScreen(), 1000)
    setPauseCause('game-over')
    managePause()
    const playerBody = getPlayer().firstElementChild.firstElementChild
    playerBody.style.transition = 'unset'
    addClass(getPlayer(), 'dead-player')
    appendAll(playerBody, createAndAddClass('div', 'left-leg'), createAndAddClass('div', 'right-leg'))
}

const renderGameOverScreen = () => {
    const gameOverContainer = createAndAddClass('div', 'full', 'ui-theme', 'game-over')
    const gameOverContents = createAndAddClass('div', 'game-over-contents', 'common-options')
    const title = document.createElement('h1')
    title.textContent = 'You are dead'
    const continueOption = createAndAddClass('div', 'common-option')
    continueOption.textContent = 'continue'
    continueOption.addEventListener('click', hasSaveInPlaythrogh() ? loadLatestSavedSlot : startNewGame)
    const loadGame = createAndAddClass('div', 'common-option')
    loadGame.addEventListener('click', () => renderDesktop(true))
    loadGame.textContent = 'load game'
    const mainMenu = createAndAddClass('div', 'common-option')
    mainMenu.textContent = 'return to main menu'
    mainMenu.addEventListener('click', return2MainMenu)
    appendAll(gameOverContents, title, continueOption, loadGame, mainMenu)
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
    play()
}