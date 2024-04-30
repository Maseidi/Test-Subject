import { getCurrentRoom, getPauseContainer, getPlayer } from "./elements.js"
import { getInventory, inventoryHasId, setInventory } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { renderInteractable } from "./room-loader.js"
import { rooms } from "./rooms.js"
import { getStash, stashHasId } from "./stash.js"
import { addClass, containsClass, elementToObject, objectToElement, removeClass } from "./util.js"
import { getCurrentRoomId, getEquippedWeapon, getPlayerX, getPlayerY, getRoomLeft, getRoomTop, getWeaponWheel, setAimMode, setEquippedWeapon, setWeaponWheel } from "./variables.js"
import { removeWeapon } from "./weapon-loader.js"
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
    background.append(inventory)
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
    Array.from(background.firstElementChild.children)
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
    item.addEventListener('mousemove', () => {
        const desc = document.querySelector(".description")
        if (itemObj.heading) desc.children[0].textContent = `${itemObj.heading}`
        if (itemObj.description) desc.children[1].textContent = `${itemObj.description}`
    })
}

const removeDescriptionEvent = (item) => {
    item.addEventListener('mouseleave', () => {
        const desc = document.querySelector(".description")
        desc.children[0].textContent = ``
        desc.children[1].textContent = ``
    })
}

const optionsEvent = (item) => {
    item.addEventListener('click', () => {
        if ( item.lastElementChild && containsClass(item.lastElementChild, 'options') ) return
        const options = document.createElement('div')
        addClass(options, 'options')
        renderOptions(item, options)
        item.append(options)
    })
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
    console.log('replace', item);
}

const use = (item) => {
    console.log('use', item);
}

const equip = (item) => {
    console.log('equip', item);
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
    updateInventory(itemObj)
    let index = findSuitableId(interactable)
    renderInteractable(getCurrentRoom(), interactable, index)
    handleDroppingWeapon(itemObj)
    renderInventory()
}

const updateInventory = (itemObj) => {
    let inventoryCopy = getInventory()
    for ( let i = 0; i < getInventory().length; i++ ) {
        for ( let j = 0; j < getInventory()[i].length; j++ ) {
            if ( getInventory()[i][j]?.layout === itemObj.layout ) {
                inventoryCopy[i][j] = null
                if ( getInventory()[i][j] === null && j + itemObj.space <= 4 )
                    for ( let k = 1; k < itemObj.space; k++ ) inventoryCopy[i][j+k] = null
            }
        }
    }
    setInventory(inventoryCopy)
}

const handleDroppingWeapon = (itemObj) => {
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
        const targetId = `${getCurrentRoomId().replace('room-', '')}-${idx}`
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
    background.append(weaponWheel)
}

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
}