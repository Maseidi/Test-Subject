import { getCurrentRoom, getPauseContainer, getPlayer } from "./elements.js"
import { MAX_PACKSIZE, getInventory, setInventory } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { renderInteractable } from "./room-loader.js"
import { rooms } from "./rooms.js"
import { addAttribute, addClass, containsClass, elementToObject, objectToElement, removeClass } from "./util.js"
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
    if ( getWeaponSpecs().get(item.getAttribute('name')) ) {
        createOption(options, 'equip')
        createOption(options, 'shortcut')
    }
    createOption(options, 'replace')
    createOption(options, 'drop')
}

const replace = (item) => {
    const itemObj = elementToObject(item)
    setDraggedItem(item)
    if ( itemObj.remove !== 1 ) for ( let k = 0; k < itemObj.space; k++ ) getInventory()[itemObj.row][itemObj.column + k] = null
    removeInventory() 
    renderInventory()
    if ( itemObj.amount !== 0 ) {
        const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
        blocks.append(item)
        addClass(item, 'block')
        item.style.position = `fixed`
        item.style.height = `70px`
        item.style.width = `${itemObj.space * 100}px`
        item.style.left = `${getMouseX() + 10}px`
        item.style.top = `${getMouseY() - 35}px`
        item.style.zIndex = `10`
        item.setAttribute('remove', 0)
        renderGrid()
        return
    }
    setDraggedItem(null)
}

const renderGrid = () => {
    const grid = document.createElement('div')
    addClass(grid, 'grid')
    for ( let i = 0; i < getInventory().length; i++ ) {
        for ( let j = 0; j < getInventory()[i].length; j++ ) {
            const item = getInventory()[i][j]
            const block = objectToElement({row: i, column: j})
            if ( item && item !== 'taken' && 
                MAX_PACKSIZE[item.name] !== item.amount && 
                item.name === getDraggedItem().getAttribute('name') ) 
                addClass(block, 'item')
            block.addEventListener('click', checkReplace, true)
            grid.append(block)
        }
    }
    getPauseContainer().firstElementChild.firstElementChild.firstElementChild.append(grid)
}

const checkReplace = (e) => {
    const destObj = elementToObject(e.target)
    const item = getInventory()[destObj.row][destObj.column]  
    if ( item === undefined ) return

    const drag = elementToObject(getDraggedItem())

    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    
    let possible = true
    if ( item !== null && item !== 'taken' ) {
        for ( let k = destObj.column + 1; k < destObj.column + drag.space; k++ ) {
            if ( k >= 4 || (getInventory()[destObj.row][k] !== 'taken' && getInventory()[destObj.row][k] !== null)  ) {
                possible = false
                break   
            }
        }
        if ( possible ) {
            const inventoryCopy = getInventory()
            const elemToReplace = Array.from(blocks.children).find(x => 
                x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === destObj.column + '')
            const objectToReplace = elementToObject(elemToReplace)    
            const pack = MAX_PACKSIZE[objectToReplace.name]
            if ( objectToReplace.name === drag.name && objectToReplace.amount !== pack ) {
                let srcAmount = drag.amount
                let destAmount = objectToReplace.amount
                const newDestAmount = Math.min(srcAmount + destAmount, pack)
                const taken = newDestAmount - destAmount
                const newSrcAmount = srcAmount - taken
                inventoryCopy[destObj.row][destObj.column] = {...drag, row: destObj.row, column: destObj.column, amount: newDestAmount}
                elemToReplace.setAttribute('amount', newSrcAmount)
                elemToReplace.firstElementChild.textContent = `${newSrcAmount}`
                elemToReplace.setAttribute('remove', 1)
                replace(elemToReplace)
                return
            }
            elemToReplace.setAttribute('remove', 0)
            replace(elemToReplace)
            inventoryCopy[destObj.row][destObj.column] = {...drag, row: destObj.row, column: destObj.column}
            for ( let k = 1; k < Math.max(drag.space, item.space); k++ ) {
                if ( k < drag.space ) inventoryCopy[destObj.row][destObj.column + k] = 'taken'
                else inventoryCopy[destObj.row][destObj.column + k] = null
            }
            elemToReplace.setAttribute('remove', 1)
            replace(elemToReplace)
        }
    } else if ( item !== null && item === 'taken' ) {
        for ( let k = destObj.column + 1; k < destObj.column + drag.space; k++ ) {
            if ( k >= 4 || (getInventory()[destObj.row][k] !== 'taken' && getInventory()[destObj.row][k] !== null)  ) {
                possible = false
                break
            }
        }
        if ( possible ) {
            let count = 0
            for ( let k = destObj.column; ; k-- ) {
                if ( getInventory()[destObj.row][k] !== null && getInventory()[destObj.row][k] !== 'taken' ) break
                count++
            }
            const elemToReplace = Array.from(blocks.children).find(x => 
                x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === (destObj.column - count) + '')
            elemToReplace.setAttribute('remove', 0)
            replace(elemToReplace)
            const inventoryCopy = getInventory()
            inventoryCopy[destObj.row][destObj.column] = {...drag, row: destObj.row, column: destObj.column}
            for ( let k = 1; k < drag.space; k++ ) inventoryCopy[destObj.row][destObj.column + k] = 'taken'
            elemToReplace.setAttribute('remove', 1)
            replace(elemToReplace)
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
            let count = 0
            for ( let k = destObj.column; ; k++ ) {
                if ( getInventory()[destObj.row][k] !== null && getInventory()[destObj.row][k] !== 'taken' ) break
                if ( k === destObj.column + drag.space ) break
                count++
            }
            if ( count === drag.space ) {
                const inventoryCopy = getInventory()
                inventoryCopy[destObj.row][destObj.column] = {...drag, row: destObj.row, column: destObj.column}
                for ( let k = 1; k < drag.space; k++ ) inventoryCopy[destObj.row][destObj.column + k] = 'taken'
                removeInventory()
                renderInventory()
                setDraggedItem(null)
            } else {
                const elemToReplace = Array.from(blocks.children).find(x => 
                    x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === (destObj.column + count) + '')
                elemToReplace.setAttribute('remove', 0)
                replace(elemToReplace)
                const inventoryCopy = getInventory()
                inventoryCopy[destObj.row][destObj.column] = {...drag, row: destObj.row, column: destObj.column}
                for ( let k = 1; k < drag.space; k++ ) inventoryCopy[destObj.row][destObj.column + k] = 'taken'
                elemToReplace.setAttribute('remove', 1)
                replace(elemToReplace)
            }
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
    const weaponWheel = getPauseContainer().firstElementChild.children[1].firstElementChild
    Array.from(weaponWheel.children).forEach((slot, index) => {
        addClass(slot, 'selectable-slot')
        addAttribute(slot, 'selected-weapon', item.id)
        addAttribute(slot, 'slot-num', index)
        slot.addEventListener('click', selectAsSlot)
    })
}

const selectAsSlot = (e) => {
    const targetSlotNum = Number(e.target.getAttribute('slot-num'))
    const slotWeaponId = getWeaponWheel()[targetSlotNum]
    const selectedId = e.target.getAttribute('selected-weapon')
    const selectedSlotNum = getWeaponWheel().findIndex(x => x === selectedId)
    const weaponWheelCopy = getWeaponWheel()
    weaponWheelCopy[targetSlotNum] = selectedId
    weaponWheelCopy[selectedSlotNum] = slotWeaponId
    setWeaponWheel(weaponWheelCopy)
    removeInventory()
    renderInventory()
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
        const slotNum = document.createElement("p")
        const name = getOwnedWeapons().get(getWeaponWheel()[4-slots])?.name
        slotNum.textContent = 
            getEquippedWeapon() && 4 - slots === getWeaponWheel().findIndex(x => x === getEquippedWeapon()) ? 'E' : `${5 - slots}`
        if ( name ) {
            image.src = `../assets/images/${name}.png`
            slot.append(image)
        } else {
            slot.style.width = `70px`
        }
        slot.append(slotNum)
        weaponWheel.append(slot)
        slots--
    }
    weaponWheelContainer.append(weaponWheel)
    background.append(weaponWheelContainer)
}

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
}