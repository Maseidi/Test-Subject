import { play } from './game.js'
import { finishUp } from './finishUp.js'
import { managePause } from './actions.js'
import { renderDesktop } from './computer.js'
import { return2MainMenu } from './pause-menu.js'
import { loadGameFromSlot } from './data-manager.js'
import { getPauseContainer, getPlayer } from './elements.js'
import { addClass, appendAll, createAndAddClass } from './util.js'
import { getHealth, getPlaythroughId, setPauseCause } from './variables.js'

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
    const content2Render = []
    const title = document.createElement('h1')
    title.textContent = 'You are dead'
    content2Render.push(title)
    if ( hasSaveInPlaythrogh() ) {
        const continueOption = createAndAddClass('div', 'common-option')
        continueOption.textContent = 'continue'
        continueOption.addEventListener('click', loadLatestSavedSlot)
        content2Render.push(continueOption)
    }
    const loadGame = createAndAddClass('div', 'common-option')
    loadGame.addEventListener('click', () => renderDesktop(true))
    loadGame.textContent = 'load game'
    content2Render.push(loadGame)
    const mainMenu = createAndAddClass('div', 'common-option')
    mainMenu.textContent = 'return to main menu'
    mainMenu.addEventListener('click', return2MainMenu)
    content2Render.push(mainMenu)
    appendAll(gameOverContents, ...content2Render)
    gameOverContainer.append(gameOverContents)
    getPauseContainer().append(gameOverContainer)
}

const hasSaveInPlaythrogh = () =>
    new Array(10)
        .fill(null)
        .map((item, index) => JSON.parse(localStorage.getItem(`slot-${index+1}-variables`)))
        .find(item => item?.playthroughId === getPlaythroughId())

const loadLatestSavedSlot = () => {
    finishUp()
    loadGameFromSlot(Number(localStorage.getItem('last-slot-used')))
    play()
}