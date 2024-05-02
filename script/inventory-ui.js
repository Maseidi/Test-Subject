import { getCurrentRoom, getPauseContainer, getPlayer } from "./elements.js"
import { getInventory, inventoryHasId, setInventory } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { renderInteractable } from "./room-loader.js"
import { rooms } from "./rooms.js"
import { stashHasId } from "./stash.js"
import { addClass, containsClass, elementToObject, objectToElement, removeClass } from "./util.js"
import { getAimMode,
    getCurrentRoomId,
    getDraggedItem,
    getEquippedWeapon,
    getMouseX,
    getMouseY,
    getPlayerX,
    getPlayerY,
    getRoomLeft,
    getRoomTop,
    getWeaponWheel,
    setAimMode,
    setDraggedItem,
    setEquippedWeapon,
    setWeaponWheel } from "./variables.js"
import { removeWeapon, renderWeapon } from "./weapon-loader.js"
import { getWeaponSpecs } from "./weapon-specs.js"

export const renderInventory = () => {
    renderBackground()
    renderBlocks()
    renderHeadingAndDescription()
    inventoryEvents()
    renderWeaponWheel()
}

const renderBackground = () => {
    const background = document.createElement("div")
    addClass(background, 'inventory-ui')
    getPauseContainer().append(background)
}

const renderBlocks = () => {
    const background = getPauseContainer().firstElementChild
    const inventoryContainer = document.createElement("div")
    addClass(inventoryContainer, 'inventory-container')
    const inventory = document.createElement("div")
    addClass(inventory, 'inventory')
    getInventory().forEach((row) => {
        row.forEach((block) => {
            const theBlock = block === "taken" ? document.createElement('div') : objectToElement(block)
            addClass(theBlock, 'block')
            let skip = false
            if ( block === "taken" ) skip = true
            else if (block === null || block === undefined) theBlock.style.width = `25%`
            else {
                theBlock.style.width = `${block.space * 25}%`
                const amount = document.createElement("div")
                addClass(amount, 'amount')
                const amountText = document.createElement("p")
                if ( getWeaponSpecs().get(block.name) === undefined ) amountText.textContent = `${block.amount}`
                else amountText.textContent = `${getOwnedWeapons().get(block.id).getCurrMag()}`
                amount.append(amountText)
                theBlock.append(amount)
            }
            if ( !skip ) {                
                if ( block === undefined ) theBlock.style.backgroundColor = `rgba(255, 0, 0, 0.1)`
                if ( block === null || block === undefined ) skip = true   
                if ( !skip ) {
                    const image = document.createElement("img")
                    image.src = `../assets/images/${block.name}.png`
                    theBlock.append(image)
                }
    
                inventory.append(theBlock)
            }          
        })
    })
    inventoryContainer.append(inventory)
    background.append(inventoryContainer)
}

const renderHeadingAndDescription = () => {
    const background = getPauseContainer().firstElementChild
    const desc = document.createElement("div")
    addClass(desc, 'description')
    const heading = document.createElement("h2")
    desc.append(heading)
    const paragraph = document.createElement("p")
    desc.append(paragraph)
    background.firstElementChild.append(desc)
}

const inventoryEvents = () => {
    const background = getPauseContainer().firstElementChild
    Array.from(background.firstElementChild.firstElementChild.children)
        .filter((block) => block.getAttribute('heading') && block.getAttribute('description'))
        .forEach((item) => {
            descriptionEvent(item)
            removeDescriptionEvent(item)
            optionsEvent(item)
            closeOptionsEvent(item)
        })
}

const descriptionEvent = (item) => {
    const itemObj = elementToObject(item)
    item.addEventListener('mousemove', addDescEvent, true)
    item.h = `${itemObj.heading}`
    item.d = `${itemObj.description}`
}

const addDescEvent = (e) => {
    const desc = document.querySelector(".description")
    if (e.target.h) desc.children[0].textContent = `${e.target.h}`
    if (e.target.d) desc.children[1].textContent = `${e.target.d}`
}

const removeDescriptionEvent = (item) => {
    item.addEventListener('mouseleave', removeDescEvent, true)
}

const removeDescEvent = () => {
    const desc = document.querySelector(".description")
    desc.children[0].textContent = ``
    desc.children[1].textContent = ``
}

const optionsEvent = (item) => {
    item.addEventListener('click', addOptionsEvent, true)
}

const addOptionsEvent = (e) => {
    if ( !containsClass(e.target, 'block') ) return
    const options = document.createElement('div')
    addClass(options, 'options')
    renderOptions(e.target, options)
    e.target.append(options)
}

const renderOptions = (item, options) => {
    if ( item.getAttribute('name') === 'bandage' ) createOption(options, 'use')
    createOption(options, 'replace')
    if ( getWeaponSpecs().get(item.getAttribute('name')) ) {
        createOption(options, 'equip')
        createOption(options, 'shortcut')
    }
    createOption(options, 'drop')
}

const replace = (item) => {
    const itemObj = elementToObject(item)
    item.style.position = `fixed`
    item.style.height = `70px`
    item.style.width = `${itemObj.space * 100}px`
    item.style.left = `${getMouseX() + 10}px`
    item.style.top = `${getMouseY() - 35}px`
    item.style.zIndex = `10`
    replaceBlocks(item, itemObj.space)
    setDraggedItem(item)
    removeDescEvent()
    removeEvents(item)
    renderGrid()
}

const replaceBlocks = (item, space) => {
    let prevBlock = item
    for ( let i = 0; i < space; i++ ) {
        const newBlock = document.createElement("div")
        addClass(newBlock, 'block')
        newBlock.style.width = `25%`
        prevBlock.parentNode.insertBefore(newBlock, prevBlock)
        prevBlock = newBlock
    }
}

const removeEvents = (item) => {
    item.removeEventListener('mousemove', addDescEvent, true)
    item.removeEventListener('mouseleave', removeDescEvent, true)
    item.removeEventListener('click', addOptionsEvent, true)
}

const renderGrid = () => {
    const grid = document.createElement('div')
    addClass(grid, 'grid')
    for ( let i = 0; i < getInventory().length; i++ ) {
        for ( let j = 0; j < getInventory()[i].length; j++ ) {
            const block = document.createElement('div')
            block.setAttribute('row', i)
            block.setAttribute('column', j)
            block.addEventListener('click', checkReplace, true)
            grid.append(block)
        }
    }
    getPauseContainer().firstElementChild.firstElementChild.firstElementChild.append(grid)
}

const checkReplace = (e) => {
    const destObj = elementToObject(e.target)
    const item = getInventory()[destObj.row][destObj.column]  

    const drag = elementToObject(getDraggedItem())
    if ( item?.row === drag.row && item?.column === drag.column ) return
    
    let possible = true
    if ( item !== null && item !== 'taken' ) {
        for ( let k = destObj.column + 1; k < destObj.column + drag.space; k++ ) {
            if ( k >= 4 || (getInventory()[destObj.row][k] !== 'taken' && getInventory()[destObj.row][k] !== null)  ) {
                possible = false
                break
            }
        }
        if ( possible ) {
            removeInventory()
            renderInventory()
        }
    } else if ( item !== null && item === 'taken' ) {
        for ( let k = destObj.column + 1; k < destObj.column + drag.space; k++ ) {
            if ( k >= 4 || (getInventory()[destObj.row][k] !== 'taken' && getInventory()[destObj.row][k] !== null)  ) {
                possible = false
                break
            }
        }
        if ( possible ) {
            console.log(possible);
        }

    } else if ( item === null ) {
        let itemCount = 0
        for ( let k = destObj.column + 1; k < destObj.column + drag.space; k++ ) {
            if ( !possible ) break
            if ( k >= 4 ) possible = false
            if ( possible && getInventory()[destObj.row][k] !== 'taken' && getInventory()[destObj.row][k] !== null ) itemCount++
            if ( itemCount > 1 ) possible = false
        }
        if ( possible ) {
            console.log(possible);
        }

    }
}

const use = (item) => {
    getPauseContainer().firstElementChild.remove()
    const itemObj = elementToObject(item)
    let inventoryCopy = getInventory()
    const row = itemObj.row
    const column = itemObj.column
    inventoryCopy[row][column].amount -= 1
    item.firstElementChild.firstElementChild.textContent = inventoryCopy[row][column].amount
    if ( inventoryCopy[row][column].amount === 0 ) {
        inventoryCopy[row][column] = null
        replaceBlocks(item, itemObj.space)
        item.remove()
    }
    setInventory(inventoryCopy)
    renderInventory()
}

const equip = (item) => {
    getPauseContainer().firstElementChild.remove()
    const itemObj = elementToObject(item)
    const row = itemObj.row
    const column = itemObj.column
    setEquippedWeapon(getInventory()[row][column].id)
    if ( getAimMode() ) {
        removeWeapon()
        renderWeapon()
    }
    renderInventory()
}

const shortcut = (item) => {
    console.log('shortcut', item);
}

const drop = (item) => {
    const itemObj = elementToObject(item)
    const left = getPlayerX() - getRoomLeft()
    const top = getPlayerY() - getRoomTop()
    const interactable = {...itemObj, left: left, top: top}
    getPauseContainer().firstElementChild.remove()
    let index = findSuitableId(interactable)
    dropFromInventory(itemObj)
    renderInteractable(getCurrentRoom(), interactable, index)
    handleWeaponDrop(itemObj)
    renderInventory()
}

const dropFromInventory = (itemObj) => {
    const inventoryCopy = getInventory()
    const row = itemObj.row
    const column = itemObj.column
    inventoryCopy[row][column] = null
    if ( getInventory()[row][column] === null && column + itemObj.space <= 4 )
        for ( let k = 1; k < itemObj.space; k++ ) inventoryCopy[row][column+k] = null
    setInventory(inventoryCopy)
}

const handleWeaponDrop = (itemObj) => {
    if ( !getOwnedWeapons().get(itemObj.id) ) return
    getOwnedWeapons().delete(itemObj.id)  
    if ( getEquippedWeapon() === itemObj.id ) {
        setEquippedWeapon(null)
        removeClass(getPlayer(), 'aim')
        setAimMode(false)
        removeWeapon()
    }
    const weaponWheelCopy = getWeaponWheel()
    for ( const slot in getWeaponWheel() ) {
        if ( getWeaponWheel()[slot] === itemObj.id ) {
            weaponWheelCopy[slot] = null
        }
    }
    setWeaponWheel(weaponWheelCopy)
}

const findSuitableId = (interactable) => {
    const roomInts = rooms.get(getCurrentRoomId()).interactables
    for ( const idx in roomInts ) {
        const targetId = `${getCurrentRoomId()}-${idx}`
        if ( roomInts[idx] === null && !inventoryHasId(targetId) && !stashHasId(targetId) ) return idx
    }
    roomInts.push(interactable)
    return roomInts.length
}

const OPTIONS_MAP = new Map([
    ['replace', replace],
    ['use', use],
    ['equip', equip],
    ['shortcut', shortcut],
    ['drop', drop]
])

const createOption = (options, text) => {
    const elem = document.createElement("div")
    elem.textContent = `${text}`
    elem.addEventListener('click', () => {
        OPTIONS_MAP.get(text)(options.parentElement)
    })
    options.append(elem)
}

const closeOptionsEvent = (item) => {
    item.addEventListener('mouseleave', () => {
        const options = item.children[2]
        options?.remove()
    })
}

const renderWeaponWheel = () => {
    const background = getPauseContainer().firstElementChild
    const weaponWheelContainer = document.createElement("div")
    addClass(weaponWheelContainer, 'weapon-wheel-container')
    const weaponWheel = document.createElement("div")
    addClass(weaponWheel, 'weapon-wheel')
    let slots = 4
    while (slots) {
        const slot = document.createElement("div")
        const image = document.createElement("img")
        const name = getOwnedWeapons().get(getWeaponWheel()[4-slots])?.name
        if ( name ) {
            image.src = `../assets/images/${name}.png`
            slot.append(image)
        } else {
            slot.style.width = `70px`
        }
        weaponWheel.append(slot)
        slots--
    }
    weaponWheelContainer.append(weaponWheel)
    background.append(weaponWheelContainer)
}

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
}