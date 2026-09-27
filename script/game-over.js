import { managePause } from './actions.js'
import { hasAutoSave, loadAutoSave, prepareNewGameData } from './data-manager.js'
import { getGrabBar, getPauseContainer, getPlayer } from './elements.js'
import { finishUp } from './finish-up.js'
import { recordCampaignDeath } from './campaign-stats.js'
import { play } from './game.js'
import { return2MainMenu } from './pause-menu.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { addClass, appendAll, createAndAddClass, removeAllClasses, removeEquipped } from './util.js'
import { getHealth, getPauseCause, setPauseCause } from './variables.js'

export const manageGameOver = () => {
    if (getHealth() !== 0 || getPauseCause() === 'game-over') return
    recordCampaignDeath()
    setPauseCause('game-over')
    managePause()
    const body = getPlayer().firstElementChild.firstElementChild
    body.style.transition = 'unset'
    addClass(getPlayer(), 'dead-player')
    removeAllClasses(getPlayer(), 'aim', 'throwable-aim')
    getGrabBar()?.remove()
    removeEquipped()
    appendAll(body, createAndAddClass('div', 'left-leg'), createAndAddClass('div', 'right-leg'))
    window.setTimeout(renderGameOverScreen, 700)
}

const renderGameOverScreen = () => {
    const screen = createAndAddClass('div', 'full', 'ui-theme', 'game-over')
    const options = createAndAddClass('div', 'game-over-contents', 'common-options')
    options.append(Object.assign(document.createElement('h1'), { textContent: 'You are dead' }))
    options.append(gameOverButton(hasAutoSave() ? 'continue from autosave' : 'restart', restart))
    options.append(gameOverButton('return to main menu', return2MainMenu))
    screen.append(options)
    getPauseContainer().append(screen)
}

const gameOverButton = (label, action) => {
    const button = createAndAddClass('div', 'common-option')
    button.textContent = label
    addHoverSoundEffect(button)
    button.addEventListener('click', () => {
        playClickSoundEffect()
        action()
    })
    return button
}

const restart = () => {
    finishUp()
    if (hasAutoSave()) loadAutoSave()
    else prepareNewGameData()
    play()
}
