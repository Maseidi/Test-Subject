import { play } from './game.js'
import { prepareNewGameData } from './data-manager.js'
import { getMainMenuEl, setMainMenuEl } from './elements.js'
import { addClass, appendAll, createAndAddClass, difficulties, removeClass } from './util.js'

let isContinueIncluded = null
export const renderMainMenu = () => {
    const root = document.getElementById('root')
    const mainMenuContainer = createAndAddClass('div', 'ui-theme', 'main-menu')
    appendAll(mainMenuContainer, mainMenuHeader(), options(), content())
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
    handleContinueOption(options)
    appendAll(options, newGame(), loadGame(), lineBar())
    return options
}

const handleContinueOption = (options) => {
    for ( let i = 0; i < 10; i++ )
        if ( localStorage.getItem('slot-' + ( i + 1 )) !== 'empty' ) {
            options.append(continueOption())
            isContinueIncluded = true
            break
        }
    isContinueIncluded = false   
}

const continueOption = () => 
    mainMenuOption(
        'continue', 
        (e) => {
            addSelectedStyle(e.currentTarget)
            console.log(0);
        },
        getDelay(0),
        getDuration(0)
    )

const getDelay = (number) => 2 + ( isContinueIncluded ? number : number - 1 ) * 0.1

const getDuration = (number) => 0.5 + ( isContinueIncluded ? number : number - 1 ) * 0.25

const mainMenuOption = (textContent, onClick, delay, duration) => {
    const option = createAndAddClass('div', 'main-menu-option')
    option.textContent = textContent
    option.addEventListener('animationend', () => {
        option.style.cursor = 'pointer'
        option.addEventListener('click', onClick)}
    )
    option.style.animationDelay = delay + 's'
    option.style.animationDuration = duration + 's'
    return option
}

const newGame = () => 
    mainMenuOption(
        'new game', 
        (e) => {
            addSelectedStyle(e.currentTarget)
            refreshContents(newGameOptions())
        },
        getDelay(1),
        getDuration(1)
    )

const addSelectedStyle = (elem) => {
    Array.from(getMainMenuEl().children[1].children)
        .forEach(child => removeClass(child, 'selected-main-menu-option'))
    addClass(elem, 'selected-main-menu-option')
}

const refreshContents = (content) => {
    clearContent()
    renderNewContent(content)
}

const clearContent = () => Array.from(getMainMenuEl().children[2].children).forEach(child => child.remove())

const renderNewContent = (content) => getMainMenuEl().children[2].append(content)

const loadGame = () => 
    mainMenuOption(
        'load game', 
        (e) => {
            addSelectedStyle(e.currentTarget)
            console.log(2);
        },
        getDelay(2),
        getDuration(2)
    )

const lineBar = () => createAndAddClass('div', 'main-menu-options-bar')

const content = () => createAndAddClass('div', 'main-menu-content')

const newGameOptions = () => {
    const newGameOptionsContainer = createAndAddClass('div', 'new-game-options')

    Array.from([
        newGameOption(difficulties.MILD), 
        newGameOption(difficulties.MIDDLE), 
        newGameOption(difficulties.SURVIVAL)
    ]).forEach(option => {
        option.addEventListener('click', (e) => {
            getMainMenuEl().remove()
            prepareNewGameData(e.target.textContent)
            play()
        })
        newGameOptionsContainer.append(option)
    })

    return newGameOptionsContainer
}

const newGameOption = (difficulty) => {
    const option = document.createElement('p')
    option.textContent = difficulty
    return option
}