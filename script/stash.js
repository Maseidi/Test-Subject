import { getPauseContainer } from './elements.js'
import {
    countItem,
    handleEquippableDrop,
    isItemUsable,
    pickupDrop,
    removeDescriptionEvent,
    renderBlocks,
    renderDescriptionEvent,
    renderHeadingAndDescription,
    useItemAtPosition,
} from './inventory.js'
import { playClickSoundEffect } from './sound-manager.js'
import { renderQuit } from './user-interface.js'
import {
    addAllAttributes,
    addClass,
    appendAll,
    containsClass,
    createAndAddClass,
    element2Object,
    object2Element,
} from './util.js'

let stash = []
export const setStash = val => {
    stash = val
}
export const getStash = () => stash

export const renderStash = () => {
    renderBackground()
    renderBlocks()
    renderHeadingAndDescription()
    inventoryEvents()
    renderStashItems()
    renderQuit()
}

const renderBackground = () => {
    const background = createAndAddClass('div', 'stash-ui', 'ui-theme')
    getPauseContainer().append(background)
}

const inventoryEvents = () => {
    const background = getPauseContainer().firstElementChild
    Array.from(background.firstElementChild.firstElementChild.children)
        .filter(block => block.firstElementChild)
        .forEach(item => {
            renderDescriptionEvent(item)
            removeDescriptionEvent(item)
            addMoveItemEvent(item)
            removeMove2StashPopupEvent(item)
        })
}

const addMoveItemEvent = item => {
    if (containsClass(item, 'stash-item-selector')) item.parentElement.setAttribute('type', 'to-inventory')
    else item.setAttribute('type', 'to-stash')
    item.addEventListener('click', applyItemMovement)
}

const applyItemMovement = e => {
    playClickSoundEffect()
    const isItemFromStash = containsClass(e.currentTarget, 'stash-item-selector')
    const target = isItemFromStash ? e.currentTarget.parentElement : e.currentTarget
    if (doesPopupAlreadyExists(target)) return
    const itemObj = element2Object(target)
    const move = renderMoveComponent(itemObj)
    const number = createAndAddClass('div', 'number')
    const chevLeft = renderChevLeft()
    const amount = document.createElement('p')
    amount.textContent = `${Math.ceil(itemObj.amount / 2)}`
    const chevRight = renderChevRight()
    appendAll(number, chevLeft, amount, chevRight)
    const concan = createAndAddClass('div', 'confirm-bigger')
    const confirm = renderConfirm()
    const bigger = renderBiggerSteps()
    appendAll(concan, confirm, bigger)
    appendAll(move, number, concan)
    target.append(move)
}

const doesPopupAlreadyExists = parent =>
    Array.from(parent.children).find(
        child => containsClass(child, 'move-to-inventory') || containsClass(child, 'move-to-stash'),
    )

const removeMove2StashPopupEvent = item => item.addEventListener('mouseleave', e => e.target.children[2]?.remove())

const renderMoveComponent = itemObj => {
    const move = createAndAddClass('div', `move-${itemObj.type}`)
    addAllAttributes(move, 'row', itemObj.row, 'column', itemObj.column, 'amount', itemObj.amount)
    return move
}

const renderChevLeft = () => {
    const chevLeft = document.createElement('img')
    chevLeft.src = './assets/images/chev-left.png'
    chevLeft.addEventListener('click', reduceNumber)
    return chevLeft
}

const addNumber = e => {
    e.stopPropagation()
    playClickSoundEffect()
    setParams(e.target, 1)
}

const reduceNumber = e => {
    e.stopPropagation()
    playClickSoundEffect()
    setParams(e.target, -1)
}

const setParams = (elem, multiply) => {
    let numberElem = elem.parentElement.children[1]
    let value = 1 * multiply
    let max = Number(elem.parentElement.parentElement.getAttribute('amount'))
    if (containsClass(elem.parentElement, 'bigger')) {
        numberElem = elem.parentElement.parentElement.parentElement.firstElementChild.children[1]
        value = 5 * multiply
        max = Number(elem.parentElement.parentElement.parentElement.parentElement.getAttribute('amount'))
    }
    applyNewValue(numberElem, value, max)
}

const applyNewValue = (elem, diff, max) => {
    const newValue = Number(elem.textContent) + diff
    if (newValue <= 1) elem.textContent = 1
    else if (newValue >= max) elem.textContent = max
    else elem.textContent = newValue
}

const renderChevRight = () => {
    const chevRight = document.createElement('img')
    chevRight.src = './assets/images/chev-right.png'
    chevRight.addEventListener('click', addNumber)
    return chevRight
}

const renderConfirm = () => {
    const confirm = createAndAddClass('p', 'confirm')
    confirm.textContent = 'confirm'
    confirm.addEventListener('click', moveItem)
    return confirm
}

const moveItem = e => {
    e.stopPropagation()
    playClickSoundEffect()
    const elem2Move = e.target.parentElement.parentElement.parentElement
    const object2Move = element2Object(elem2Move)
    const reduce = Number(e.target.parentElement.parentElement.firstElementChild.children[1].textContent)
    if (object2Move.type === 'to-stash') move2Stash(object2Move, reduce)
    else move2Inventory(object2Move, reduce)
}

export const move2Stash = (object2Move, reduce) => {
    add2Stash(object2Move, reduce)
    useItemAtPosition(object2Move.row, object2Move.column, reduce)
    handleEquippableDrop(object2Move)
    removeStash()
    renderStash()
}

const move2Inventory = (object2Move, reduce) => {
    const index = stash.findIndex(x => x.name === object2Move.name)
    const prePickupAmount = countItem(object2Move.name)
    pickupDrop(object2Element({ ...object2Move, amount: reduce }))
    const postPickupAmount = countItem(object2Move.name)
    const totalPickedUp = postPickupAmount - prePickupAmount
    const amount = stash[index].amount
    if (totalPickedUp === amount) stash = stash.filter((item, idx) => idx !== index)
    else stash[index] = { ...object2Move, amount: amount - totalPickedUp }
    removeStash()
    renderStash()
}

export const add2Stash = (object2Move, reduce) => {
    let index = stash.findIndex(x => x.name === object2Move.name)
    if (index === -1) stash.push({ ...object2Move, amount: reduce })
    else stash[index] = { ...object2Move, amount: stash[index].amount + reduce }
}

const renderBiggerSteps = () => {
    const bigger = createAndAddClass('div', 'bigger')
    const reduce = document.createElement('div')
    reduce.addEventListener('click', reduceNumber)
    reduce.textContent = '-5'
    const add = document.createElement('div')
    add.addEventListener('click', addNumber)
    add.textContent = '+5'
    appendAll(bigger, reduce, add)
    return bigger
}

const renderStashItems = () => {
    const stashItemsContainer = createAndAddClass('div', 'stash-items-container')
    const stashItems = createAndAddClass('div', 'stash-items')
    stash.forEach(item => {
        const stashItem = object2Element(item)
        addClass(stashItem, 'stash-item')
        const selector = createAndAddClass('div', 'stash-item-selector')
        stashItem.append(selector)
        const img = document.createElement('img')
        img.src = `./assets/images/${item.name}.png`
        const specs = createAndAddClass('div', 'specs')
        const title = document.createElement('p')
        title.textContent = `${item.heading}`
        const amount = document.createElement('p')
        if (!isNaN(item.currmag)) amount.textContent = `${item.currmag}`
        else amount.textContent = `${item.amount}`
        appendAll(specs, title, amount)
        appendAll(stashItem, img, specs)
        addMoveItemEvent(selector)
        removeMove2InventoryPopupEvent(stashItem)
        stashItems.append(stashItem)
    })
    stashItemsContainer.append(stashItems)
    getPauseContainer().firstElementChild.append(stashItemsContainer)
}

const removeMove2InventoryPopupEvent = item => {
    item.addEventListener('mouseleave', e => e.target.children[3]?.remove())
}

export const removeStash = () => getPauseContainer().firstElementChild.remove()

export const countItemStash = name => stash.find(item => item.name === name)?.amount
