import { play } from './game.js'
import { finishUp } from './finishup.js'
import { managePause } from './actions.js'
import { getPauseContainer } from './elements.js'
import { appendAll, createAndAddClass } from './util.js'
import { countItem, useInventoryResource } from './inventory.js'
import { loadGameFromSlot, saveAtSlot } from './data-manager.js'
import { addMessage, itemNotification, renderQuit } from './user-interface.js'

export const turnOnComputer = () => {
    managePause()
    renderDesktop()
}

export const renderDesktop = (load = false) => {
    const desktop = createAndAddClass('div', 'desktop', 'ui-theme')
    const content2Render = []
    if ( !load ) content2Render.push(itemNotification('hardDrive'))
    content2Render.push(contents(load))    
    appendAll(desktop, ...content2Render)
    getPauseContainer().append(desktop)
    renderQuit()
}

const contents = (load) => {
    const content = createAndAddClass('div', 'desktop-content')
    appendAll(content, title(), slots(load))
    return content
}

const title = () => {
    const title = createAndAddClass('p', 'desktop-title')
    title.textContent = 'slots'
    return title
}

const slots = (load) => {
    const slots = createAndAddClass('div', 'desktop-slots')
    for ( let i = 0; i < 10; i++ ) {
        const slotData = localStorage.getItem('slot-' + ( i + 1 ))
        const isNotEmpty = slotData !== 'empty'
        const className = isNotEmpty ? 'desktop-slot' : 'desktop-empty-slot'
        const slot = createAndAddClass('div', className)
        appendAll(slot, ...(isNotEmpty ? savedSlotContent(slotData) : noSaveData()))
        if ( !load ) slot.addEventListener('click', () => renderSaveConfirmPopup(i + 1, isNotEmpty))
        if ( isNotEmpty && load ) slot.addEventListener('click', () => renderLoadConfirmPopup(i+1))    
        slots.append(slot)
    }
    return slots
}

export const savedSlotContent = (slotData) => {
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

const renderSaveConfirmPopup = (slotNumber, isNotEmpty) => {    
    const title = 
        isNotEmpty ? 'This might overwrite previous saved data. Do you wish to continue?' : 'Use this slot to save data?'

    const savePopupContainer = createAndAddClass('div', 'common-popup-container', 'ui-theme', 'popup-container')
    const savePopup = createAndAddClass('div', 'common-popup')
    const titleEl = createAndAddClass('p', 'save-title')
    titleEl.textContent = title
    const buttons = createAndAddClass('div', 'common-buttons')
    const cancel = createAndAddClass('button', 'popup-cancel')
    cancel.addEventListener('click', closeSavePopup)
    cancel.textContent = 'cancel'
    const confirm = createAndAddClass('button', 'popup-confirm')
    confirm.addEventListener('click', () => confirmSave(slotNumber))
    const hardDriveAmount = document.createElement('p')
    hardDriveAmount.textContent = 1
    const hardDriveImage = document.createElement('img')
    hardDriveImage.src = './assets/images/hardDrive.png'
    const message = createAndAddClass('p', 'message')
    appendAll(confirm, hardDriveAmount, hardDriveImage)
    appendAll(buttons, cancel, confirm)
    appendAll(savePopup, titleEl, buttons, message)
    savePopupContainer.append(savePopup)
    getPauseContainer().lastElementChild.append(savePopupContainer)
}

const confirmSave = (slotNumber) => {
    if ( countItem('hardDrive') === 0 ) {
        addComputerMessage('Out of hard drive memory')
        return
    }
    useInventoryResource('hardDrive', 1)
    saveAtSlot(slotNumber)
    closeSavePopup()
    getPauseContainer().firstElementChild.remove()
    renderDesktop()
}

const addComputerMessage = (input) => 
    addMessage(input, getPauseContainer().lastElementChild.lastElementChild.firstElementChild)

const closeSavePopup = () => getPauseContainer().lastElementChild.lastElementChild.remove()

const renderLoadConfirmPopup = (slotNumber) => {
    const loadPopupContainer = createAndAddClass('div', 'common-popup-container', 'ui-theme', 'popup-container')
    const loadPopup = createAndAddClass('div', 'common-popup')
    const title = createAndAddClass('p', 'load-title')
    title.textContent = 'Are you sure you wish to load?'
    const helper = createAndAddClass('p', 'load-helper')
    helper.textContent = 'All unsaved progress will be lost'
    const buttons = createAndAddClass('div', 'common-buttons')
    const cancel = createAndAddClass('button', 'popup-cancel')
    cancel.addEventListener('click', closeLoadPopup)
    cancel.textContent = 'cancel'
    const confirm = createAndAddClass('button', 'popup-confirm')
    confirm.textContent = 'yes'
    confirm.addEventListener('click', () => confirmSlotLoad(slotNumber))
    getPauseContainer().append(loadPopup)
    appendAll(buttons, cancel, confirm)
    appendAll(loadPopup, title, helper, buttons)
    loadPopupContainer.append(loadPopup)
    getPauseContainer().lastElementChild.append(loadPopupContainer)
}

const closeLoadPopup = () => getPauseContainer().lastElementChild.lastElementChild?.remove()

const confirmSlotLoad = (slotNumber) => {
    finishUp()
    loadGameFromSlot(slotNumber)
    play()
}