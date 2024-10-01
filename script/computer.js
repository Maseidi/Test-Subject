import { managePause } from './actions.js'
import { saveAtSlot } from './data-manager.js'
import { getPauseContainer } from './elements.js'
import { appendAll, createAndAddClass } from './util.js'
import { addMessage, itemNotification, renderQuit } from './user-interface.js'
import { countItem, useInventoryResource } from './inventory.js'

export const turnOnComputer = () => {
    managePause()
    renderDesktop()
}

const renderDesktop = () => {
    const desktop = createAndAddClass('div', 'desktop', 'ui-theme')
    appendAll(desktop, itemNotification('hardDrive'), contents())
    getPauseContainer().append(desktop)
    renderQuit()
}

const contents = () => {
    const content = createAndAddClass('div', 'desktop-content')
    appendAll(content, title(), slots())
    return content
}

const title = () => {
    const title = createAndAddClass('p', 'desktop-title')
    title.textContent = 'slots'
    return title
}

const slots = () => {
    const slots = createAndAddClass('div', 'desktop-slots')
    for ( let i = 0; i < 10; i++ ) {
        const slotData = localStorage.getItem('slot-' + ( i + 1 ))
        const isNotEmpty = slotData !== 'empty'
        const className = isNotEmpty ? 'desktop-slot' : 'desktop-empty-slot'
        const slot = createAndAddClass('div', className)
        appendAll(slot, ...(isNotEmpty ? savedSlotContent(slotData) : noSaveData()))
        slot.addEventListener('click', () => renderSaveConfirmPopup(i + 1, isNotEmpty))
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

    const savePopupContainer = createAndAddClass('div', 'save-popup-container', 'ui-theme', 'popup-container')
    const savePopup = createAndAddClass('div', 'save-popup')
    const titleEl = createAndAddClass('p', 'save-title')
    titleEl.textContent = title
    const buttons = createAndAddClass('div', 'save-buttons')
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
    getPauseContainer().firstElementChild.append(savePopupContainer)
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
    addMessage(input, getPauseContainer().firstElementChild.lastElementChild.firstElementChild)

const closeSavePopup = () => getPauseContainer().firstElementChild.lastElementChild.remove()