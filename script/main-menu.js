import { savedSlotContent } from './computer.js'
import { loadGameFromSlot, prepareNewGameData } from './data-manager.js'
import { getMainMenuEl, setMainMenuEl } from './elements.js'
import { play } from './game.js'
import { loadMapMakerFromSlot, prepareNewMapMakerData } from './mapMaker/data-manager.js'
import { renderMapMaker } from './mapMaker/map-maker.js'
import { IS_MOBILE } from './script.js'
import { getDefaultSettings, getSettings, setSettings } from './settings.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { loadSurvivalFromSlot, prepareNewSurvivalData } from './survival/data-manager.js'
import { addClass, appendAll, containsClass, createAndAddClass, difficulties, removeClass } from './util.js'
import { setDifficulty } from './variables.js'

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
    for (let i = 0; i < chars.length; i++) {
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
    appendAll(options, newGame(), loadGame(), survival())
    handleMapMakerOption(options)
    options.append(settings())
    options.append(lineBar())
    return options
}

const handleContinueOption = options => {
    for (let i = 0; i < 10; i++) {
        if (
            localStorage.getItem('slot-' + (i + 1)) !== 'empty' ||
            localStorage.getItem('survival-slot-' + (i + 1)) !== 'empty'
        ) {
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
        e => {
            playClickSoundEffect()
            addSelectedStyle(e.currentTarget)
            loadLatestSavedSlot()
        },
        getDelay(0),
        getDuration(0),
    )

const handleMapMakerOption = options => options.append(mapMaker())

const mapMaker = () =>
    mainMenuOption(
        'map maker',
        e => {
            playClickSoundEffect()
            addSelectedStyle(e.currentTarget)
            refreshContents(mapMakerOptions())
        },
        getDelay(4),
        getDuration(4),
    )

const getDelay = number => 2 + (isContinueIncluded ? number : number - 1) * 0.1

const getDuration = number => 0.5 + (isContinueIncluded ? number : number - 1) * 0.25

const loadLatestSavedSlot = () =>
    playWithGivenData(() => {
        const latestSlot = localStorage.getItem('last-slot-used')
        if (latestSlot.includes('main-game')) loadGameFromSlot(Number(latestSlot.replace('main-game-', '')))
        else loadSurvivalFromSlot(Number(latestSlot.replace('survival-', '')))
    }, localStorage.getItem('last-slot-used').includes('survival'))

const mainMenuOption = (textContent, onClick, delay, duration) => {
    const option = createAndAddClass('div', 'main-menu-option')
    option.textContent = textContent
    option.addEventListener('animationend', () => {
        addHoverSoundEffect(option)
        option.style.cursor = 'pointer'
        option.addEventListener('click', onClick)
    })
    option.style.animationDelay = delay + 's'
    option.style.animationDuration = duration + 's'
    return option
}

const newGame = () =>
    mainMenuOption(
        'new game',
        e => {
            playClickSoundEffect()
            addSelectedStyle(e.currentTarget)
            refreshContents(newGameOptions())
        },
        getDelay(1),
        getDuration(1),
    )

const addSelectedStyle = elem => {
    Array.from(getMainMenuEl().children[1].children).forEach(child => removeClass(child, 'selected-main-menu-option'))
    addClass(elem, 'selected-main-menu-option')
}

const refreshContents = content => {
    clearContent()
    removeRenderedSettings()
    renderNewContent(content)
}

const clearContent = () => Array.from(getMainMenuEl().children[2].children).forEach(child => child.remove())

const renderNewContent = content => getMainMenuEl().children[2].append(content)

const loadGame = () =>
    mainMenuOption(
        'load game',
        e => {
            playClickSoundEffect()
            addSelectedStyle(e.currentTarget)
            refreshContents(loadGameOptions())
        },
        getDelay(2),
        getDuration(2),
    )

const survival = () =>
    mainMenuOption(
        'survival',
        e => {
            playClickSoundEffect()
            addSelectedStyle(e.currentTarget)
            refreshContents(survivalOptions())
        },
        getDelay(3),
        getDuration(3),
    )

const lineBar = () => createAndAddClass('div', 'main-menu-options-bar')

const content = () => createAndAddClass('div', 'main-menu-content')

const newGameOptions = () => {
    const newGameOptionsContainer = createAndAddClass('div', 'new-game-options')
    Array.from([
        newGameOption(difficulties.MILD),
        newGameOption(difficulties.MIDDLE),
        newGameOption(difficulties.SURVIVAL),
    ]).forEach(option => {
        addHoverSoundEffect(option)
        option.addEventListener('click', e => {
            playClickSoundEffect()
            playWithGivenData(() => prepareNewGameData(e.target.textContent))
        })
        newGameOptionsContainer.append(option)
    })
    return newGameOptionsContainer
}

const newGameOption = difficulty => {
    const option = document.createElement('p')
    option.textContent = difficulty
    return option
}

const loadGameOptions = () => {
    const loadGameOptionsContainer = createAndAddClass('div', 'load-game-options')
    for (let i = 0; i < 10; i++) {
        const option = loadGameOption(i + 1)
        loadGameOptionsContainer.append(option)
    }
    addWheelEvent(loadGameOptionsContainer)
    return loadGameOptionsContainer
}

const survivalOptions = () => {
    const survivalContainer = createAndAddClass('div', 'load-game-options')
    survivalContainer.append(newSurvivalOption())
    for (let i = 0; i < 10; i++) {
        const option = survivalOption(i + 1)
        survivalContainer.append(option)
    }
    addWheelEvent(survivalContainer)
    return survivalContainer
}

const mapMakerOptions = () => {
    const mapMakerOptionsContainer = createAndAddClass('div', 'load-game-options')
    mapMakerOptionsContainer.append(newMapMakerOption())
    for (let i = 0; i < 5; i++) {
        const option = mapMakerOption(i + 1)
        mapMakerOptionsContainer.append(option)
    }
    addWheelEvent(mapMakerOptionsContainer)
    return mapMakerOptionsContainer
}

const newMapMakerOption = () => {
    const slot = createAndAddClass('div', 'load-game-option-empty-slot', 'map-maker-new-game')
    slot.setAttribute('data-testid', 'new-map-maker')
    const word1 = document.createElement('p')
    word1.textContent = 'start'
    const word2 = document.createElement('p')
    word2.textContent = 'new'
    const word3 = document.createElement('p')
    word3.textContent = 'map'
    slot.append(word1, word2, word3)
    addHoverSoundEffect(slot)
    slot.addEventListener('click', () => {
        playClickSoundEffect()
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
    addHoverSoundEffect(slot)
    slot.addEventListener('click', () => {
        playClickSoundEffect()
        playWithGivenData(prepareNewSurvivalData, true)
    })
    return slot
}

const addWheelEvent = element => {
    element.addEventListener(
        'wheel',
        e => {
            if (e.deltaX !== 0) return
            if (e.deltaY > 0) element.scrollLeft += 100
            else element.scrollLeft -= 100
        },
        { passive: true },
    )
}

const loadGameOption = slotNumber => {
    const slotData = localStorage.getItem('slot-' + slotNumber)
    if (slotData === 'empty') return noSavedDataSlot()
    else return slotWithData(slotData, slotNumber)
}

const mapMakerOption = slotNumber => {
    const slotData = localStorage.getItem('map-slot-' + slotNumber)
    if (slotData === 'empty') return noSavedDataSlot()
    else return slotWithData(slotData, slotNumber, true)
}

const survivalOption = slotNumber => {
    const slotData = localStorage.getItem('survival-slot-' + slotNumber)
    if (slotData === 'empty') return noSavedDataSlot()
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
    addHoverSoundEffect(slot)
    if (mapMaker)
        slot.addEventListener('click', () => {
            playClickSoundEffect()
            loadMapMakerWithGivenData(() => loadMapMakerFromSlot(slotNumber))
        })
    else if (survival)
        slot.addEventListener('click', () => {
            playClickSoundEffect()
            playWithGivenData(() => loadSurvivalFromSlot(slotNumber), true)
        })
    else
        slot.addEventListener('click', () => {
            playClickSoundEffect()
            playWithGivenData(() => loadGameFromSlot(slotNumber))
        })
    return slot
}

const playWithGivenData = (loader, survival = false) => {
    getMainMenuEl().remove()
    loader()
    play(false, survival)
}

const loadMapMakerWithGivenData = loader => {
    getMainMenuEl().remove()
    loader()
    setDifficulty(difficulties.MIDDLE)
    renderMapMaker()
}

const settings = () =>
    mainMenuOption(
        'settings',
        e => {
            playClickSoundEffect()
            addSelectedStyle(e.currentTarget)
            refreshContents(settingsOptions())
        },
        getDelay(5),
        getDuration(5),
    )

const settingsOptions = () => {
    const settingsContainer = createAndAddClass('div', 'new-game-options')
    Array.from(
        IS_MOBILE
            ? [
                  settingOption('Audio', renderAudioSettings),
                  settingOption('Display', renderDisplaySettings),
                  settingOption('reset settings', resetAllSettings),
              ]
            : [
                  settingOption('Audio', renderAudioSettings),
                  settingOption('Display', renderDisplaySettings),
                  settingOption('Controls', renderControlsSetting),
                  settingOption('reset settings', resetAllSettings),
              ],
    ).forEach(option => {
        addHoverSoundEffect(option)
        settingsContainer.append(option)
    })
    return settingsContainer
}

const refreshSettings = option => {
    Array.from(option.parentElement.children).forEach(child => removeClass(child, 'selected-main-menu-option'))
    addClass(option, 'selected-main-menu-option')
}

const settingOption = (textContent, onClick) => {
    const option = document.createElement('p')
    option.textContent = textContent
    option.addEventListener('click', e => {
        playClickSoundEffect()
        refreshSettings(e.currentTarget)
        removeRenderedSettings()
        onClick(e)
    })
    return option
}

const removeRenderedSettings = () => {
    if (
        getMainMenuEl().lastElementChild &&
        containsClass(getMainMenuEl().lastElementChild, 'setting-options-container')
    )
        getMainMenuEl().lastElementChild.remove()
}

const renderAudioSettings = () => {
    const audioSettingsContainer = createAndAddClass('div', 'setting-options-container')
    const sound = soundRange()
    const music = musicRange()
    const ui = uiSoundRange()
    appendAll(audioSettingsContainer, sound, ui, music)
    getMainMenuEl().append(audioSettingsContainer)
}

const soundRange = () =>
    renderRange('Sound effects', 'sound-range', getSettings().audio.sound, value => (getSettings().audio.sound = value))

const uiSoundRange = () =>
    renderRange('UI Sound effects', 'ui-range', getSettings().audio.ui, value => (getSettings().audio.ui = value))

const musicRange = () =>
    renderRange('Music', 'music-range', getSettings().audio.music, value => (getSettings().audio.music = value))

const renderRange = (labelText, id, value, onChange) => {
    const container = createAndAddClass('div', 'setting-option')
    const label = document.createElement('label')
    label.htmlFor = id
    label.textContent = labelText
    const input = document.createElement('input')
    input.id = id
    input.type = 'range'
    input.min = 0
    input.max = 1
    input.step = 0.1
    input.setAttribute('value', value)
    input.addEventListener('change', e => {
        onChange(e.target.value)
        localStorage.setItem('settings', JSON.stringify(getSettings()))
    })
    appendAll(container, label, input)
    return container
}

const renderDisplaySettings = () => {
    const displaySettingsContainer = createAndAddClass('div', 'setting-options-container')
    const fps = fpsAutocomplete(getSettings().display.fps, value => (getSettings().display.fps = value))
    appendAll(displaySettingsContainer, fps)
    getMainMenuEl().append(displaySettingsContainer)
}

const fpsAutocomplete = (value, onChange) => {
    const container = createAndAddClass('div', 'setting-option')
    const label = document.createElement('label')
    label.htmlFor = 'fps'
    label.textContent = 'FPS'
    const select = document.createElement('select')
    select.id = 'fps'
    Array.from([30, 45, 60, 90, 120, 144, 165, 240]).forEach(item => {
        const option = document.createElement('option')
        option.textContent = item
        option.value = item
        select.append(option)
    })
    select.addEventListener('change', e => {
        onChange(e.target.value)
        localStorage.setItem('settings', JSON.stringify(getSettings()))
    })
    select.value = value
    appendAll(container, label, select)
    return container
}

let waitingControl = null
const renderControlsSetting = () => {
    const controlSettingsContainer = createAndAddClass('div', 'setting-options-container', 'control-options-cotainer')
    const btn = controlBtnGenerator()
    const up = btn('move up', 'up')
    const left = btn('move left', 'left')
    const down = btn('move down', 'down')
    const right = btn('move right', 'right')
    const heal = btn('heal', 'heal')
    const reload = btn('reload', 'reload')
    const slot1 = btn('slot1', 'slot1')
    const slot2 = btn('slot2', 'slot2')
    const slot3 = btn('slot3', 'slot3')
    const slot4 = btn('slot4', 'slot4')
    const interact = btn('interact', 'interact')
    const inventory = btn('inventory', 'inventory')
    const sprint = btn('sprint', 'sprint')
    const lightUp = btn('light up torch', 'lightUp')
    controlSettingsContainer.append(
        up,
        left,
        down,
        right,
        heal,
        reload,
        slot1,
        slot2,
        slot3,
        slot4,
        interact,
        inventory,
        sprint,
        lightUp,
    )
    getMainMenuEl().append(controlSettingsContainer)
}

const controlBtnGenerator = () => {
    let counter = 0
    return (textContent, value) => {
        counter++
        return controlBtn(textContent, value, counter)
    }
}

const formatButtonText = value => value.replace('Digit', '').replace('Key', '')
const controlBtn = (textContent, key, index) => {
    const container = createAndAddClass('div', 'control-setting-container')
    container.setAttribute('tabindex', index)
    const text = createAndAddClass('p', 'control-setting-text')
    text.textContent = textContent
    const btn = createAndAddClass('div', 'control-setting-btn')
    btn.id = `${key}-control-btn`
    btn.textContent = formatButtonText(getSettings().controls[key])
    appendAll(container, text, btn)
    addHoverSoundEffect(container)
    container.addEventListener('click', e => {
        playClickSoundEffect()
        addClass(e.currentTarget, 'waiting')
        waitingControl = e.currentTarget
    })
    container.addEventListener('keydown', e => {
        e.preventDefault()
        if (!containsClass(container, 'waiting')) return
        const repeated = Object.entries(getSettings().controls).find(([prop, value]) => value === e.code)
        if (repeated) {
            const prop = repeated[0]
            document.getElementById(`${prop}-control-btn`).textContent = formatButtonText(getSettings().controls[key])
            getSettings().controls[prop] = getSettings().controls[key]
        }
        getSettings().controls[key] = e.code
        btn.textContent = formatButtonText(e.code)
        localStorage.setItem('settings', JSON.stringify(getSettings()))
    })
    container.addEventListener('focusout', e => removeClass(e.currentTarget, 'waiting'))
    return container
}

const resetAllSettings = () => {
    setSettings(getDefaultSettings())
    localStorage.removeItem('settings')
}
