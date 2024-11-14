import { play } from './game.js'
import { savedSlotContent } from './computer.js'
import { getMainMenuEl, setMainMenuEl } from './elements.js'
import { loadGameFromSlot, prepareNewGameData } from './data-manager.js'
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
    appendAll(options, newGame(), loadGame())
    handleMapMakerOption(options)
    options.append(lineBar())
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
            loadLatestSavedSlot()
        },
        getDelay(0),
        getDuration(0)
    )
    
const handleMapMakerOption = (options) => {
    for ( let i = 0; i < 5; i++ )
        if ( localStorage.getItem('slot-' + ( i + 1 )) !== 'empty' ) {
            if ( Number(JSON.parse(localStorage.getItem('slot-' + ( i + 1 ))).rounds) > 0 ) options.append(mapMaker())
            break
        }
}
    
const mapMaker = () => 
    mainMenuOption(
        'map maker', 
        (e) => {
            addSelectedStyle(e.currentTarget)
            refreshContents(mapMakerOptions())
        },
        getDelay(3),
        getDuration(3)
    )    

const getDelay = (number) => 2 + ( isContinueIncluded ? number : number - 1 ) * 0.1

const getDuration = (number) => 0.5 + ( isContinueIncluded ? number : number - 1 ) * 0.25

const loadLatestSavedSlot = () => 
    playGameWithGivenData(() => loadGameFromSlot(Number(localStorage.getItem('last-slot-used'))))

const mainMenuOption = (textContent, onClick, delay, duration) => {
    const option = createAndAddClass('div', 'main-menu-option')
    option.textContent = textContent
    option.addEventListener('animationend', 
        () => {
            option.style.cursor = 'pointer'
            option.addEventListener('click', onClick)
        }
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
            refreshContents(loadGameOptions())
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
        option.addEventListener('click', (e) => playGameWithGivenData(() => prepareNewGameData(e.target.textContent)))
        newGameOptionsContainer.append(option)
    })

    return newGameOptionsContainer
}

const newGameOption = (difficulty) => {
    const option = document.createElement('p')
    option.textContent = difficulty
    return option
}

const loadGameOptions = () => {
    const loadGameOptionsContainer = createAndAddClass('div', 'load-game-options')
    for ( let i = 0; i < 10; i++ ) {
        const option = loadGameOption(i + 1)
        loadGameOptionsContainer.append(option)
    }
    addWheelEvent(loadGameOptionsContainer)
    return loadGameOptionsContainer
}

const mapMakerOptions = () => {
    const mapMakerOptionsContainer = createAndAddClass('div', 'load-game-options')
    for ( let i = 0; i < 5; i++ ) {
        const option = mapMakerOption(i + 1)
        mapMakerOptionsContainer.append(option)
    }
    addWheelEvent(mapMakerOptionsContainer)
    return mapMakerOptionsContainer
}

const addWheelEvent = (element) => {
    element.addEventListener('wheel', (e) => {
        if ( e.deltaX !== 0 ) return
        if ( e.deltaY > 0 ) element.scrollLeft += 100;
        else element.scrollLeft -= 100;
    }, {passive: true});
}

const loadGameOption = (slotNumber) => {
    const slotData = localStorage.getItem('slot-' + slotNumber)
    if ( slotData === 'empty' ) return noSavedDataSlot()
    else return slotWithData(slotData, slotNumber)
}

const mapMakerOption = (slotNumber) => {
    const slotData = localStorage.getItem('map-slot-' + slotNumber)
    if ( slotData === 'empty' ) return noSavedDataSlot()
    else return slotWithData(slotData, slotNumber, true)
}

const noSavedDataSlot = () => {    
    const slot = createAndAddClass('div', 'load-game-option-empty-slot')
    const word1 = document.createElement('p')
    word1.textContent = 'No'
    const word2 = document.createElement('p')
    word2.textContent = 'saved'
    const word3 = document.createElement('p')
    word3.textContent = 'data'
    slot.append(word1, word2, word3)
    return slot
}

const slotWithData = (slotData, slotNumber, mapMaker) => {
    const elements = savedSlotContent(slotData, mapMaker)
    const slot = createAndAddClass('div', 'load-game-option-full-slot')
    elements.forEach(elem => slot.append(elem))
    slot.addEventListener('click', () => playGameWithGivenData(() => loadGameFromSlot(slotNumber)))
    return slot
}

const playGameWithGivenData = (loader) => {
    getMainMenuEl().remove()
    loader()
    play()
}