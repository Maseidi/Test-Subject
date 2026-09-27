import { hasAutoSave, loadAutoSave, prepareNewGameData } from './data-manager.js'
import { getMainMenuEl, setMainMenuEl } from './elements.js'
import { play } from './game.js'
import { IS_MOBILE } from './platform.js'
import { getDefaultSettings, getSettings, setSettings } from './settings.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { addClass, appendAll, createAndAddClass, removeClass } from './util.js'

export const renderMainMenu = () => {
    const menu = createAndAddClass('div', 'ui-theme', 'main-menu')
    appendAll(menu, renderTitle(), renderOptions(), createAndAddClass('div', 'main-menu-content'))
    document.getElementById('root').append(menu)
    setMainMenuEl(menu)
}

const renderTitle = () => {
    const title = createAndAddClass('div', 'game-title')
    title.textContent = 'test subject'
    return title
}

const renderOptions = () => {
    const options = createAndAddClass('div', 'main-menu-options')
    if (hasAutoSave()) options.append(menuOption('continue', () => startGame(loadAutoSave)))
    options.append(
        menuOption('new game', () => startGame(prepareNewGameData)),
        menuOption('settings', showSettings),
        createAndAddClass('div', 'main-menu-options-bar'),
    )
    return options
}

const menuOption = (label, action) => {
    const option = createAndAddClass('div', 'main-menu-option')
    option.textContent = label
    addHoverSoundEffect(option)
    option.addEventListener('click', event => {
        playClickSoundEffect()
        selectOption(event.currentTarget)
        action()
    })
    return option
}

const selectOption = option => {
    Array.from(option.parentElement.children).forEach(child => removeClass(child, 'selected-main-menu-option'))
    addClass(option, 'selected-main-menu-option')
}

const startGame = loader => {
    getMainMenuEl().remove()
    loader()
    play()
}

const showSettings = () => {
    const content = getMainMenuEl().querySelector('.main-menu-content')
    content.replaceChildren()
    const categories = createAndAddClass('div', 'new-game-options')
    const choices = [
        ['Audio', renderAudioSettings],
        ['Display', renderDisplaySettings],
        ...(!IS_MOBILE ? [['Controls', renderControlSettings]] : []),
        ['reset settings', resetSettings],
    ]
    choices.forEach(([label, action]) => {
        const option = document.createElement('p')
        option.textContent = label
        addHoverSoundEffect(option)
        option.addEventListener('click', () => {
            playClickSoundEffect()
            getMainMenuEl().querySelector('.setting-options-container')?.remove()
            action()
        })
        categories.append(option)
    })
    content.append(categories)
}

const settingsPanel = () => {
    const panel = createAndAddClass('div', 'setting-options-container')
    getMainMenuEl().append(panel)
    return panel
}

const renderAudioSettings = () => {
    const panel = settingsPanel()
    panel.append(
        rangeSetting('Sound effects', getSettings().audio.sound, value => (getSettings().audio.sound = value)),
        rangeSetting('UI sound effects', getSettings().audio.ui, value => (getSettings().audio.ui = value)),
        rangeSetting('Music', getSettings().audio.music, value => (getSettings().audio.music = value)),
    )
}

const rangeSetting = (labelText, value, update) => {
    const row = createAndAddClass('div', 'setting-option')
    const label = document.createElement('label')
    label.textContent = labelText
    const input = document.createElement('input')
    input.type = 'range'
    input.min = 0
    input.max = 1
    input.step = 0.1
    input.value = value
    input.addEventListener('change', event => {
        update(Number(event.target.value))
        persistSettings()
    })
    row.append(label, input)
    return row
}

const renderDisplaySettings = () => {
    const panel = settingsPanel()
    const row = createAndAddClass('div', 'setting-option')
    const label = document.createElement('label')
    label.textContent = 'FPS'
    const select = document.createElement('select')
    ;[30, 45, 60, 90, 120, 144, 165, 240].forEach(value => {
        const option = document.createElement('option')
        option.value = value
        option.textContent = value
        select.append(option)
    })
    select.value = getSettings().display.fps
    select.addEventListener('change', event => {
        getSettings().display.fps = Number(event.target.value)
        persistSettings()
    })
    row.append(label, select)
    panel.append(row)
}

const CONTROL_LABELS = {
    up: 'move up',
    left: 'move left',
    down: 'move down',
    right: 'move right',
    sprint: 'sprint',
    reload: 'reload',
    slot1: 'pistol',
    slot2: 'shotgun',
    slot3: 'rifle',
    slot4: 'smg',
    slot5: 'magnum',
    grenade: 'grenade',
    flashbang: 'flashbang',
    breakFree: 'break free',
}

const renderControlSettings = () => {
    const panel = settingsPanel()
    panel.classList.add('control-options-cotainer')
    Object.entries(CONTROL_LABELS).forEach(([key, label]) => panel.append(controlSetting(key, label)))
}

const controlSetting = (key, label) => {
    const row = createAndAddClass('div', 'control-setting-container')
    row.tabIndex = 0
    row.append(Object.assign(createAndAddClass('p', 'control-setting-text'), { textContent: label }))
    const button = createAndAddClass('div', 'control-setting-btn')
    button.textContent = formatKey(getSettings().controls[key])
    row.append(button)
    row.addEventListener('click', () => addClass(row, 'waiting'))
    row.addEventListener('keydown', event => {
        event.preventDefault()
        if (event.code === 'Escape' || !row.classList.contains('waiting')) return
        for (const [otherKey, value] of Object.entries(getSettings().controls)) {
            if (value === event.code) getSettings().controls[otherKey] = getSettings().controls[key]
        }
        getSettings().controls[key] = event.code
        button.textContent = formatKey(event.code)
        removeClass(row, 'waiting')
        persistSettings()
    })
    row.addEventListener('focusout', () => removeClass(row, 'waiting'))
    return row
}

const formatKey = value => value.replace(/^(Digit|Key)/, '')
const persistSettings = () => localStorage.setItem('settings', JSON.stringify(getSettings()))
const resetSettings = () => {
    setSettings(getDefaultSettings())
    localStorage.removeItem('settings')
    showSettings()
}
