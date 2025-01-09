import { play } from './game.js'
import { setDifficulty } from './variables.js'
import { savedSlotContent } from './computer.js'
import { renderMapMaker } from './mapMaker/map-maker.js'
import { getMainMenuEl, setMainMenuEl } from './elements.js'
import { loadGameFromSlot, prepareNewGameData } from './data-manager.js'
import { loadMapMakerFromSlot, prepareNewMapMakerData } from './mapMaker/data-manager.js'
import { loadSurvivalFromSlot, prepareNewSurvivalData } from './survival/data-manager.js'
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
    appendAll(options, survival())
    // appendAll(options, newGame(), loadGame(), survival())
    // handleMapMakerOption(options)
    options.append(lineBar())
    return options
}

const handleContinueOption = (options) => {
    for ( let i = 0; i < 10; i++ ) {
        if ( localStorage.getItem('slot-' + ( i + 1 )) !== 'empty' || 
             localStorage.getItem('survival-slot-' + ( i + 1 )) !== 'empty' ) {
                
                options.append(continueOption())
                isContinueIncluded = true
                break
        }
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
    
const handleMapMakerOption = (options) => options.append(mapMaker())
    
const mapMaker = () => 
    mainMenuOption(
        'map maker', 
        (e) => {
            addSelectedStyle(e.currentTarget)
            refreshContents(mapMakerOptions())
        },
        getDelay(4),
        getDuration(4)
    )    

const getDelay = (number) => 2 + ( isContinueIncluded ? number : number - 1 ) * 0.1

const getDuration = (number) => 0.5 + ( isContinueIncluded ? number : number - 1 ) * 0.25

const loadLatestSavedSlot = () => playWithGivenData(() => {
    const latestSlot = localStorage.getItem('last-slot-used')
    if ( latestSlot.includes('main-game') ) loadGameFromSlot(Number(latestSlot.replace('main-game-', '')))
    else loadSurvivalFromSlot(Number(latestSlot.replace('survival-', '')))
}, localStorage.getItem('last-slot-used').includes('survival'))

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

const survival = () => 
    mainMenuOption(
        'survival', 
        (e) => {
            addSelectedStyle(e.currentTarget)
            refreshContents(survivalOptions())
        },
        getDelay(3),
        getDuration(3)
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
        option.addEventListener('click', (e) => playWithGivenData(() => prepareNewGameData(e.target.textContent)))
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

const survivalOptions = () => {
    const survivalContainer = createAndAddClass('div', 'load-game-options')
    survivalContainer.append(newSurvivalOption())
    for ( let i = 0; i < 10; i++ ) {
        const option = survivalOption(i + 1)
        survivalContainer.append(option)
    }
    addWheelEvent(survivalContainer)
    return survivalContainer
}

const mapMakerOptions = () => {
    const mapMakerOptionsContainer = createAndAddClass('div', 'load-game-options')
    mapMakerOptionsContainer.append(newMapMakerOption())
    for ( let i = 0; i < 5; i++ ) {
        const option = mapMakerOption(i + 1)
        mapMakerOptionsContainer.append(option)
    }
    addWheelEvent(mapMakerOptionsContainer)
    return mapMakerOptionsContainer
}

const newMapMakerOption = () => {
    const slot = createAndAddClass('div', 'load-game-option-empty-slot', 'map-maker-new-game')
    const word1 = document.createElement('p')
    word1.textContent = 'start'
    const word2 = document.createElement('p')
    word2.textContent = 'new'
    const word3 = document.createElement('p')
    word3.textContent = 'map'
    slot.append(word1, word2, word3)
    slot.addEventListener('click', () => {
        getMainMenuEl().remove()
        prepareNewMapMakerData()
        setDifficulty(difficulties.MIDDLE)
        renderMapMaker()
    })
    return slot
}

const newSurvivalOption = () => {
    const slot = createAndAddClass('div', 'load-game-option-empty-slot', 'map-maker-new-game')
    const word1 = document.createElement('p')
    word1.textContent = 'start'
    const word2 = document.createElement('p')
    word2.textContent = 'new'
    const word3 = document.createElement('p')
    word3.textContent = 'game'
    slot.append(word1, word2, word3)
    slot.addEventListener('click', () => playWithGivenData(prepareNewSurvivalData, true))
    return slot
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

const survivalOption = (slotNumber) => {
    const slotData = localStorage.getItem('survival-slot-' + slotNumber)
    if ( slotData === 'empty' ) return noSavedDataSlot()
    else return slotWithData(slotData, slotNumber, false, true)
}

const noSavedDataSlot = () => {
    const slot = createAndAddClass('div', 'load-game-option-empty-slot')
    const word1 = document.createElement('p')
    word1.textContent = 'no'
    const word2 = document.createElement('p')
    word2.textContent = 'saved'
    const word3 = document.createElement('p')
    word3.textContent = 'data'
    slot.append(word1, word2, word3)
    return slot
}

const slotWithData = (slotData, slotNumber, mapMaker, survival) => {
    const elements = savedSlotContent(slotData, mapMaker, survival)
    const slot = createAndAddClass('div', 'load-game-option-full-slot')
    elements.forEach(elem => slot.append(elem))
    if ( mapMaker ) slot.addEventListener('click', () => loadMapMakerWithGivenData(() => loadMapMakerFromSlot(slotNumber)))
    else if ( survival ) slot.addEventListener('click', () => playWithGivenData(() => loadSurvivalFromSlot(slotNumber), true))
    else slot.addEventListener('click', () => playWithGivenData(() => loadGameFromSlot(slotNumber)))
    return slot
}

const playWithGivenData = (loader, survival = false) => {
    getMainMenuEl().remove()
    loader()
    play(false, survival)
}

const loadMapMakerWithGivenData = (loader) => {
    getMainMenuEl().remove()
    loader()
    setDifficulty(difficulties.MIDDLE)
    renderMapMaker()
}