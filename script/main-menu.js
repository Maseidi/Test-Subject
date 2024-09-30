import { getMainMenuEl, setMainMenuEl } from './elements.js'
import { play } from './game.js'
import { appendAll, createAndAddClass } from './util.js'

export const renderMainMenu = () => {
    const root = document.getElementById('root')
    const mainMenuContainer = createAndAddClass('div', 'ui-theme', 'main-menu')
    appendAll(mainMenuContainer, mainMenuHeader(), options())
    root.append(mainMenuContainer)
    setMainMenuEl(mainMenuContainer)
}

const mainMenuHeader = () => {
    const gameTitle = createAndAddClass('div', 'game-title')
    const gameName = 'test subject'
    const chars = gameName.split('')
    for ( let i = 0; i < chars.length; i++ ) {
        const char = chars[i]
        const charEl = document.createElement('span')
        charEl.textContent = char
        charEl.style.animationDelay = `${Math.floor(Math.random() * 1000) + 1000}ms`
        gameTitle.append(charEl)
    }
    return gameTitle
}

const options = () => {
    const options = createAndAddClass('div', 'main-menu-options')
    appendAll(options, newGame(), loadGame(), lineBar())
    return options
}

const newGame = () => {
    const newGame = createAndAddClass('div', 'main-menu-option')
    newGame.textContent = 'new game'
    newGame.addEventListener('animationend', () => {
        newGame.style.cursor = 'pointer'
        newGame.addEventListener('click', () => {
            console.log(1);
        })
    })
    newGame.style.animationDelay = '1.6s'
    return newGame
}

const loadGame = () => {
    const loadGame = createAndAddClass('div', 'main-menu-option')
    loadGame.textContent = 'load game'
    loadGame.addEventListener('animationend', () => {
        loadGame.style.cursor = 'pointer'
        loadGame.addEventListener('click', () => {
            console.log(2);
        })
    })
    loadGame.style.animationDelay = '1.65s'
    return loadGame
}

const lineBar = () => {
    const bar = createAndAddClass('div', 'main-menu-options-bar')
    return bar
}