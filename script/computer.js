import { play } from './game.js'
import { finishUp } from './finishup.js'
import { managePause } from './actions.js'
import { getPauseContainer } from './elements.js'
import { appendAll, createAndAddClass } from './util.js'
import { countItem, useInventoryResource } from './inventory.js'
import { saveAtSlot as mapMakerSave } from './mapMaker/data-manager.js'
import { addMessage, itemNotification, renderQuit } from './user-interface.js'
import { loadGameFromSlot, saveAtSlot as gamePlaySave } from './data-manager.js'

export const turnOnComputer = () => {
    managePause()
    renderDesktop()
}

export const renderDesktop = (load = false, mapMaker = false) => {
    const desktop = createAndAddClass('div', 'desktop', 'ui-theme')
    const content2Render = []
    if ( !load && !mapMaker ) content2Render.push(itemNotification('hardDrive'))
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
    if ( mapMaker ) slots.style.height = 'max-content'
    for ( let i = 0; i < (mapMaker ? 5 : 10); i++ ) {
        const slotData = localStorage.getItem(mapMaker ? 'map-slot-' + (i + 1) : 'slot-' + ( i + 1 ))
        const isNotEmpty = slotData !== 'empty'
        const className = isNotEmpty ? 'desktop-slot' : 'desktop-empty-slot'
        const slot = createAndAddClass('div', className)
        appendAll(slot, ...(isNotEmpty ? savedSlotContent(slotData, mapMaker) : noSaveData()))
        if ( !load ) slot.addEventListener('click', () => renderSaveConfirmPopup(i + 1, isNotEmpty, mapMaker))
        if ( isNotEmpty && load ) slot.addEventListener('click', () => renderLoadConfirmPopup(i+1))    
        slots.append(slot)
    }
    return slots
}

export const savedSlotContent = (slotData, mapMaker) => {
    if ( mapMaker ) return mapMakerSlotContent(slotData)
    else return gamePlaySlotContent(slotData)
}

const mapMakerSlotContent = (slotData) => {
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

const gamePlaySlotContent = (slotData) => {
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
    confirm.addEventListener('click', () => confirmSave(slotNumber, mapMaker))
    if ( mapMaker ) {
        const confirmMessage = document.createElement('p')
        confirmMessage.textContent = 'confirm'
        appendAll(confirm, confirmMessage)
    } else {
        const hardDriveAmount = document.createElement('p')
        hardDriveAmount.textContent = 1
        const hardDriveImage = document.createElement('img')
        hardDriveImage.src = './assets/images/hardDrive.png'
        appendAll(confirm, hardDriveAmount, hardDriveImage)
    }
    appendAll(buttons, cancel, confirm)
    const message = createAndAddClass('p', 'message')
    appendAll(savePopup, titleEl, buttons, message)
    savePopupContainer.append(savePopup)
    getPauseContainer().lastElementChild.append(savePopupContainer)
}

const confirmSave = (slotNumber, mapMaker = false) => {
    if ( mapMaker )  {
        mapMakerSave(slotNumber)
        reRenderDesktop(mapMaker)
        return
    }
    if ( countItem('hardDrive') === 0 ) {
        addComputerMessage('Out of hard drive memory')
        return
    }
    useInventoryResource('hardDrive', 1)
    gamePlaySave(slotNumber)
    reRenderDesktop(mapMaker) 
}

const reRenderDesktop = (mapMaker) => {
    closeSavePopup()
    getPauseContainer().firstElementChild.remove()
    renderDesktop(false, mapMaker)
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