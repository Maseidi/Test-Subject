import { managePause } from "./controls.js"
import { getPauseContainer } from "./elements.js"
import { getIntObj, setIntObj } from "./variables.js"
import { addAttribute, addClass, appendAll, containsClass, elementToObject, objectToElement } from "./util.js"
import { 
    descriptionEvent,
    handleWeaponDrop,
    pickupDrop,
    removeDescriptionEvent,
    renderBlocks,
    renderHeadingAndDescription,
    useItemAtPosition } from "./inventory.js"
import { renderQuit } from "./user-interface.js"

let stash = []
export const setStash = (val) => {
    stash = val
}
export const getStash = () => {
    return stash
}

export const renderStash = () => {
    renderBackground()
    renderBlocks()
    renderHeadingAndDescription()
    inventoryEvents()
    renderStashItems()
    renderStashQuit()
}

const renderBackground = () => {
    const background = document.createElement("div")
    addClass(background, 'stash-ui')
    addClass(background, 'ui-theme')
    getPauseContainer().append(background)
}

const inventoryEvents = () => {
    const background = getPauseContainer().firstElementChild
    Array.from(background.firstElementChild.firstElementChild.children)
        .filter((block) => block.getAttribute('heading') && block.getAttribute('description'))
        .forEach((item) => {
            descriptionEvent(item)
            removeDescriptionEvent(item)
            moveEvent(item, 'to-stash')
        })
}

const moveEvent = (item, type) => {
    addAttribute(item, 'type', type)
    item.addEventListener('click', addMoveEvent)
}

const addMoveEvent = (e) => {
    if ( !containsClass(e.target, 'block') && !containsClass(e.target, 'stash-item-selector') ) return
    document.querySelector('.move-to-stash')?.remove()
    document.querySelector('.move-to-inventory')?.remove()
    const elem = containsClass(e.target, 'stash-item-selector') ? e.target.parentElement : e.target
    if ( containsClass(e.target, 'stash-item-selector') ) addAttribute(e.target.parentElement, 'type', 'to-inventory')
    const itemObj = elementToObject(elem)
    const move = createMoveComponent(itemObj)
    const number = document.createElement('div')
    addClass(number, 'number')
    const chevLeft = createChevLeft()
    const amount = document.createElement('p')
    amount.textContent = `${Math.ceil(itemObj.amount / 2)}`
    const chevRight = createChevRight()
    appendAll(number, [chevLeft, amount, chevRight])
    const concan = document.createElement('div')
    addClass(concan, 'confirm-bigger')
    const confirm = createConfirm()
    const cancel = biggerSteps()
    appendAll(concan, [confirm, cancel])
    appendAll(move, [number, concan])
    elem.append(move)
}

const createMoveComponent = (itemObj) => {
    const move = document.createElement('div')
    addClass(move, `move-${itemObj.type}`)
    addAttribute(move, 'row', itemObj.row)
    addAttribute(move, 'column', itemObj.column)
    addAttribute(move, 'amount', itemObj.amount)
    return move
}

const createChevLeft = () => {
    const chevLeft = document.createElement('img')
    chevLeft.src = '../assets/images/chev-left.png'
    chevLeft.addEventListener('click', reduceNumber)
    return chevLeft
}

const addNumber = (e) => {
    setParams(e.target, 1)
}

const reduceNumber = (e) => {
    setParams(e.target, -1)
}

const setParams = (elem, multiply) => {
    let numberElem = elem.parentElement.children[1]
    let value = 1 * multiply
    let max = Number(elem.parentElement.parentElement.getAttribute('amount'))
    if ( containsClass(elem.parentElement, 'bigger') ) {
        numberElem = elem.parentElement.parentElement.parentElement.firstElementChild.children[1]
        value = 5 * multiply
        max = Number(elem.parentElement.parentElement.parentElement.parentElement.getAttribute('amount'))
    }
    applyNewValue(numberElem, value, max)
}

const applyNewValue = (elem, diff, max) => {
    const newValue = Number(elem.textContent) + diff
    if ( newValue <= 1 ) elem.textContent = 1
    else if ( newValue >= max ) elem.textContent = max
    else elem.textContent = newValue
}

const createChevRight = () => {
    const chevRight = document.createElement('img')
    chevRight.src = '../assets/images/chev-right.png'
    chevRight.addEventListener('click', addNumber)
    return chevRight
}

const createConfirm = () => {
    const confirm = document.createElement('p')
    addClass(confirm, 'confirm')
    confirm.textContent = 'confirm'
    confirm.addEventListener('click', moveItem)
    return confirm
}

const moveItem = (e) => {
    const elemToMove = e.target.parentElement.parentElement.parentElement
    const objectToMove = elementToObject(elemToMove)
    const reduce = Number(e.target.parentElement.parentElement.firstElementChild.children[1].textContent)
    if ( objectToMove.type === 'to-stash' ) moveToStash(objectToMove, reduce)
    else moveToInventory(objectToMove, reduce)
}

const moveToStash = (objectToMove, reduce) => {
    searchPack(objectToMove, reduce)
    useItemAtPosition(objectToMove.row, objectToMove.column, reduce)
    handleWeaponDrop(objectToMove)
    removeStash()
    renderStash()
}

const moveToInventory = (objectToMove, reduce) => {
    const index = stash.findIndex(x => x.id === objectToMove.id)
    const amount = stash[index].amount
    setIntObj(objectToElement({...objectToMove, amount: reduce}))
    pickupDrop()
    const left = Number(getIntObj().getAttribute('amount'))
    if ( amount - reduce + left === 0 ) stash = stash.filter((item, idx) => idx !== index)
    else stash[index] = {...objectToMove, amount: amount - reduce + left}   
    removeStash()
    renderStash()
}

const searchPack = (objectToMove, reduce) => {
    let index = stash.findIndex(x => x.id === objectToMove.id)
    if ( index === -1 ) stash.push({...objectToMove, amount: reduce})
    else stash[index] = {...objectToMove, amount: stash[index].amount + reduce}    
}

const biggerSteps = () => {
    const bigger = document.createElement('div')
    addClass(bigger, 'bigger')
    const reduce = document.createElement('div')
    reduce.addEventListener('click', reduceNumber)
    reduce.textContent = '-5'
    const add = document.createElement('div')
    add.addEventListener('click', addNumber)
    add.textContent = '+5'
    appendAll(bigger, [reduce, add])
    return bigger
}

const renderStashItems = () => {
    const stashItemsContainer = document.createElement('div')
    addClass(stashItemsContainer, 'stash-items-container')
    const stashItems = document.createElement('div')
    addClass(stashItems, 'stash-items')
    stash.forEach((item) => {
        const stashItem = objectToElement(item)
        addClass(stashItem, 'stash-item')
        const selector = document.createElement('div')
        addClass(selector, 'stash-item-selector')
        stashItem.append(selector)
        const img = document.createElement('img')
        img.src = `../assets/images/${item.name}.png`
        const specs = document.createElement('div')
        addClass(specs, 'specs')
        const title = document.createElement('p')
        title.textContent = `${item.heading}`
        const amount = document.createElement('p')
        if ( !isNaN(item.currmag) ) amount.textContent = `${item.currmag}`
        else amount.textContent = `${item.amount}`
        appendAll(specs, [title, amount])
        appendAll(stashItem, [img, specs])
        moveEvent(selector, 'to-inventory')
        stashItems.append(stashItem)
    })
    stashItemsContainer.append(stashItems)
    getPauseContainer().firstElementChild.append(stashItemsContainer)
}

const renderStashQuit = () => renderQuit(() => {
    managePause()
    removeStash()
})

export const removeStash = () => {
    getPauseContainer().firstElementChild.remove()
}