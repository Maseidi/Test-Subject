import { managePause } from './actions.js'
import { loadGameFromSlot, saveGameAtSlot } from './data-manager.js'
import { getPauseContainer, getToggleMenuButton } from './elements.js'
import { finishUp } from './finish-up.js'
import { play } from './game.js'
import { countItem, useInventoryResource } from './inventory.js'
import { saveMapMakerAtSlot } from './mapMaker/data-manager.js'
import { activateAllProgresses } from './progress-manager.js'
import { addHoverSoundEffect, playClickSoundEffect } from './sound-manager.js'
import { countItemStash, getStash, setStash } from './stash.js'
import { loadSurvivalFromSlot, saveSurvivalAtSlot } from './survival/data-manager.js'
import { addMessage, itemNotification, renderQuit } from './user-interface.js'
import { appendAll, createAndAddClass } from './util.js'
import { getIsSurvival, setPauseCause } from './variables.js'

export const turnOnComputer = () => {
    setPauseCause('save')
    managePause()
    renderDesktop()
    if (getToggleMenuButton()) getToggleMenuButton().style.visibility = 'hidden'
}

// NOTE: Map maker in arguments says that the pause menu is opened at map maker environment
// NOTE: Variable isMapMakerRoot indicates that the game is being play tested through the map maker engine
export const renderDesktop = (load = false, mapMaker = false) => {
    const desktop = createAndAddClass('div', 'desktop', 'ui-theme')
    const content2Render = []
    if (!load && !mapMaker) content2Render.push(itemNotification('harddrive'))
    content2Render.push(contents(load, mapMaker))
    appendAll(desktop, ...content2Render)
    getPauseContainer().append(desktop)
    renderQuit(mapMaker)
}

const contents = (load, mapMaker) => {
    const content = createAndAddClass('div', 'desktop-content')
    appendAll(content, title(), slots(load, mapMaker))
    return content
}

const title = () => {
    const title = createAndAddClass('p', 'desktop-title')
    title.textContent = 'slots'
    return title
}

const slots = (load, mapMaker) => {
    const slots = createAndAddClass('div', 'desktop-slots')
    if (mapMaker) slots.style.height = 'max-content'
    for (let i = 0; i < (mapMaker ? 5 : 10); i++) {
        const slotData = localStorage.getItem(
            mapMaker ? 'map-slot-' + (i + 1) : getIsSurvival() ? 'survival-slot-' + (i + 1) : 'slot-' + (i + 1),
        )
        const isNotEmpty = slotData !== 'empty'
        const className = isNotEmpty ? 'desktop-slot' : 'desktop-empty-slot'
        const slot = createAndAddClass('div', className)
        appendAll(slot, ...(isNotEmpty ? savedSlotContent(slotData, mapMaker, getIsSurvival()) : noSaveData()))
        if (!load)
            slot.addEventListener('click', () => {
                playClickSoundEffect()
                renderSaveConfirmPopup(i + 1, isNotEmpty, mapMaker)
            })
        if (isNotEmpty && load)
            slot.addEventListener('click', () => {
                playClickSoundEffect()
                renderLoadConfirmPopup(i + 1)
            })
        slots.append(slot)
    }
    return slots
}

export const savedSlotContent = (slotData, mapMaker, survival) => {
    if (mapMaker) return mapMakerSlotContent(slotData)
    else if (survival) return survivalSlotContent(slotData)
    else return gamePlaySlotContent(slotData)
}

const mapMakerSlotContent = slotData => {
    const { timeStamp, spawn, rooms, saves } = JSON.parse(slotData)
    const timeStampEl = document.createElement('div')
    timeStampEl.textContent = 'Date: ' + new Date(timeStamp).toLocaleString()
    const savesEl = document.createElement('div')
    savesEl.textContent = 'Saves: ' + saves
    const spawnEl = document.createElement('div')
    spawnEl.textContent = 'Spawn: ' + spawn
    const roomsEl = document.createElement('div')
    roomsEl.textContent = 'Total rooms: ' + rooms
    return [timeStampEl, savesEl, spawnEl, roomsEl]
}

const survivalSlotContent = slotData => {
    const { timeStamp, saves, chaos } = JSON.parse(slotData)
    const timeStampEl = document.createElement('div')
    timeStampEl.textContent = 'Date: ' + new Date(timeStamp).toLocaleString()
    const savesEl = document.createElement('div')
    savesEl.textContent = 'Saves: ' + saves
    const chaosEl = document.createElement('div')
    chaosEl.textContent = 'Chaos: ' + chaos
    return [timeStampEl, savesEl, chaosEl]
}

const gamePlaySlotContent = slotData => {
    const { timeStamp, room, saves, difficulty, rounds } = JSON.parse(slotData)
    const timeStampEl = document.createElement('div')
    timeStampEl.textContent = 'Date: ' + new Date(timeStamp).toLocaleString()
    const roomEl = document.createElement('div')
    roomEl.textContent = 'Room: ' + room
    const savesEl = document.createElement('div')
    savesEl.textContent = 'Saves: ' + saves
    const difficultyEl = document.createElement('div')
    difficultyEl.textContent = 'Difficulty: ' + difficulty.toUpperCase()
    const roundsEl = document.createElement('div')
    roundsEl.textContent = 'Round: ' + rounds
    return [timeStampEl, roomEl, savesEl, difficultyEl, roundsEl]
}

const noSaveData = () => {
    const content = document.createElement('p')
    content.textContent = 'No Save Data'
    return [content]
}

const renderSaveConfirmPopup = (slotNumber, isNotEmpty, mapMaker) => {
    const title = isNotEmpty
        ? 'This might overwrite previous saved data. Do you wish to continue?'
        : 'Use this slot to save data?'

    const savePopupContainer = createAndAddClass('div', 'common-popup-container', 'ui-theme', 'popup-container')
    const savePopup = createAndAddClass('div', 'common-popup')
    const titleEl = createAndAddClass('p', 'save-title')
    titleEl.textContent = title
    const buttons = createAndAddClass('div', 'common-buttons')
    const cancel = createAndAddClass('button', 'popup-cancel')
    addHoverSoundEffect(cancel)
    cancel.addEventListener('click', () => {
        playClickSoundEffect()
        closeSavePopup()
    })
    cancel.textContent = 'cancel'
    const confirm = createAndAddClass('button', 'popup-confirm')
    addHoverSoundEffect(confirm)
    confirm.addEventListener('click', () => {
        playClickSoundEffect()
        confirmSave(slotNumber, mapMaker)
    })
    if (mapMaker) {
        const confirmMessage = document.createElement('p')
        confirmMessage.textContent = 'confirm'
        appendAll(confirm, confirmMessage)
    } else {
        const hardDriveAmount = document.createElement('p')
        hardDriveAmount.textContent = 1
        const hardDriveImage = document.createElement('img')
        hardDriveImage.src = './assets/images/harddrive.png'
        appendAll(confirm, hardDriveAmount, hardDriveImage)
    }
    appendAll(buttons, cancel, confirm)
    const message = createAndAddClass('p', 'message')
    appendAll(savePopup, titleEl, buttons, message)
    savePopupContainer.append(savePopup)
    getPauseContainer().lastElementChild.append(savePopupContainer)
}

const confirmSave = (slotNumber, mapMaker = false) => {
    if (getIsSurvival()) {
        confirmSurvivalSave(slotNumber)
        return
    }
    if (mapMaker) {
        saveMapMakerAtSlot(slotNumber)
        reRenderDesktop(true)
        return
    }
    if (countItem('harddrive') === 0) {
        addComputerMessage('Out of hard drive memory')
        return
    }
    activateAllProgresses(8002)
    useInventoryResource('harddrive', 1)
    saveGameAtSlot(slotNumber)
    reRenderDesktop(false)
}

const confirmSurvivalSave = slotNumber => {
    const inventoryHardDrives = countItem('harddrive') ?? 0
    const stashHardDrives = countItemStash('harddrive') ?? 0
    if (inventoryHardDrives + stashHardDrives === 0) {
        addComputerMessage('Out of hard drive memory')
        return
    }
    if (inventoryHardDrives > 0) useInventoryResource('harddrive', 1)
    else {
        if (stashHardDrives === 1) setStash(getStash().filter(item => item.name !== 'harddrive'))
        else getStash().find(item => item.name === 'harddrive').amount -= 1
    }
    saveSurvivalAtSlot(slotNumber)
    reRenderDesktop(false)
}

const reRenderDesktop = mapMaker => {
    closeSavePopup()
    getPauseContainer().firstElementChild.remove()
    renderDesktop(false, mapMaker)
}

const addComputerMessage = input =>
    addMessage(input, getPauseContainer().lastElementChild.lastElementChild.firstElementChild)

const closeSavePopup = () => getPauseContainer().lastElementChild.lastElementChild.remove()

const renderLoadConfirmPopup = slotNumber => {
    const loadPopupContainer = createAndAddClass('div', 'common-popup-container', 'ui-theme', 'popup-container')
    const loadPopup = createAndAddClass('div', 'common-popup')
    const title = createAndAddClass('p', 'load-title')
    title.textContent = 'Are you sure you wish to load?'
    const helper = createAndAddClass('p', 'load-helper')
    helper.textContent = 'All unsaved progress will be lost'
    const buttons = createAndAddClass('div', 'common-buttons')
    const cancel = createAndAddClass('button', 'popup-cancel')
    addHoverSoundEffect(cancel)
    cancel.addEventListener('click', () => {
        playClickSoundEffect()
        closeLoadPopup()
    })
    cancel.textContent = 'cancel'
    const confirm = createAndAddClass('button', 'popup-confirm')
    confirm.textContent = 'yes'
    addHoverSoundEffect(confirm)
    confirm.addEventListener('click', () => {
        playClickSoundEffect()
        confirmSlotLoad(slotNumber)
    })
    getPauseContainer().append(loadPopup)
    appendAll(buttons, cancel, confirm)
    appendAll(loadPopup, title, helper, buttons)
    loadPopupContainer.append(loadPopup)
    getPauseContainer().lastElementChild.append(loadPopupContainer)
}

const closeLoadPopup = () => getPauseContainer().lastElementChild.lastElementChild?.remove()

const confirmSlotLoad = slotNumber => {
    finishUp()
    if (getIsSurvival()) {
        loadSurvivalFromSlot(slotNumber)
        play(false, true)
        return
    }
    loadGameFromSlot(slotNumber)
    play()
}
