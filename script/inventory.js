import { renderStats } from "./weapon-examine.js"
import { interactables } from "./interactables.js"
import { renderInteractable } from "./room-loader.js"
import { getStat, getWeaponSpecs } from "./weapon-specs.js"
import { removeWeapon, renderWeapon } from "./weapon-loader.js"
import { removeUi, renderQuit, renderUi } from "./user-interface.js"
import { getCurrentRoom, getPauseContainer, getPlayer } from "./elements.js"
import { 
    addAttribute,
    addClass,
    containsClass,
    elementToObject,
    objectToElement,
    removeClass,
    appendAll, 
    createAndAddClass} from "./util.js"
import { 
    getAimMode,
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
    setWeaponWheel, 
    getIntObj, 
    getReloading,
    setShootCounter,
    getShooting, 
    getPause} from "./variables.js"

export const MAX_PACKSIZE = {
    bandage: 3,
    coin: 10,
    hardDrive: 2,
    smgAmmo: 90,
    pistolAmmo: 30,
    shotgunShells: 20,
    rifleAmmo: 10,
    magnumAmmo: 5
}

let inventory = [
    [null, null, null, null],
    [null, null, null, null],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
]

export const getInventory = () => inventory

export const pickupDrop = () => {
    searchPack()
    searchEmpty()
    checkSpecialScenarios()       
}

const searchPack = () => {
    const drop = elementToObject(getIntObj())
    const pack = MAX_PACKSIZE[drop.name] || 1
    let found = false
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item && item.name === drop.name && item.amount !== pack && !found ) {
                let diff = Math.min(pack, item.amount + drop.amount) - item.amount
                item.amount += diff
                updateAmount(drop.amount - diff)
                found = true
            }
        }
    }
    if ( found && drop.amount !== 0 ) searchPack()
}

const searchEmpty = () => {
    const drop = elementToObject(getIntObj())
    if ( drop.amount === 0 ) return
    const pack = MAX_PACKSIZE[drop.name] || 1
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item === null && j + drop.space <= 4 ) {
                let skip = false
                for ( let k = 1; k < drop.space; k++ )
                    if ( inventory[i][j+k] !== null ) skip = true
                if ( skip ) continue   
                let diff = Math.min(pack, drop.amount)
                inventory[i][j] = {...drop, amount: diff, row: i, column: j}
                for ( let k = 1; k < drop.space; k++ ) inventory[i][j+k] = "taken"
                updateAmount(drop.amount - diff)
                if ( drop.amount > 0 && inventoryFull() ) return
                searchEmpty()
                return
            }
        }
    }
}

const checkSpecialScenarios = () => {
    if ( getWeaponSpecs().get(getIntObj().getAttribute("name")) ) updateWeaponWheel()
    if ( getPause() ) return
    if ( Number(getIntObj().getAttribute("amount")) === 0 ) removeDrop()
    const equippedWeapon = equippedWeaponFromInventory()
    if ( getEquippedWeapon() && getIntObj().getAttribute('name') === getWeaponSpecs().get(equippedWeapon.name).ammotype ) {
        removeUi()
        renderUi()
    }
}

const inventoryFull = () => inventory.flat().every(item => item !== null)

export const equippedWeaponFromInventory = () => inventory.flat().find(item => item && item.id === getEquippedWeapon())

export const calculateTotalAmmo = () => countItem(equippedWeaponFromInventory().ammotype)

export const calculateTotalCoins = () => countItem('coin')

const countItem = (name) => inventory.flat().filter(item => item && item.name === name).reduce((a, b) => a + b.amount, 0)

export const useInventoryResource = (name, reduce) => {
    for ( let i = inventory.length - 1; i >= 0; i-- )
        for ( let j = inventory[i].length - 1; j >= 0; j-- )
            if ( reduce !== 0 && inventory[i][j] && inventory[i][j].name === name ) reduce -= useItemAtPosition(i, j, reduce)
}

export const useItemAtPosition = (row, column, reduce) => {
    const itemAmount = inventory[row][column].amount
    const diff = itemAmount <= reduce ? itemAmount : reduce
    inventory[row][column].amount -= diff
    const space = inventory[row][column].space
    if ( inventory[row][column].amount === 0 ) {
        inventory[row][column] = null
        for ( let i = 1; i < space; i++ ) 
            if ( inventory[row][column + i] === 'taken' ) inventory[row][column + i] = null
    }
    return diff
}

export const updateInventoryWeaponMag = (newMag) => {
    const weapon = equippedWeaponFromInventory()
    inventory[weapon.row][weapon.column].currmag = newMag
}

const updateAmount = (newValue) => {
    getIntObj().setAttribute("amount", newValue)
    if ( getIntObj().children.length === 0 ) return
    getIntObj().children[1].children[0].textContent = `${newValue} ${getIntObj().getAttribute("heading")}`
    interactables.set(getCurrentRoomId(), 
    interactables.get(getCurrentRoomId()).map((int, index) => {
        return `${getCurrentRoomId()}-${index}` === getIntObj().getAttribute("id") ? 
        {
            ...int,
            amount: newValue
        } : int
    })) 
}

const removeDrop = () => {
    getIntObj().remove()
    interactables.set(getCurrentRoomId(), 
    interactables.get(getCurrentRoomId()).map((elem, index) =>
        `${getCurrentRoomId()}-${index}` === getIntObj().getAttribute("id") ? null : elem
    ))
}

const updateWeaponWheel = () => {
    const index = getWeaponWheel().findIndex(item => item === null)
    setWeaponWheel(getWeaponWheel().map((weapon, idx) => idx === index ? getIntObj().getAttribute('id') : weapon ))
}

export const upgradeInventory = () => {
    const index = inventory.flat().findIndex(block => block === undefined)
    const row = Math.floor(index / 4)
    const column = index % 4
    inventory[row][column] = null
    inventory[row][column + 1] = null
}

export const upgradeWeaponStat = (name, stat) => {
    const weapon = inventory.flat().filter(item => item && item.name === name)[0]
    inventory[weapon.row][weapon.column][stat+'lvl'] += 1
}

export const renderInventory = () => {
    renderBackground()
    renderBlocks()
    renderHeadingAndDescription()
    inventoryEvents()
    renderWeaponWheel()
    renderQuit()
}

const renderBackground = () => {
    const background = createAndAddClass('div', 'inventory-ui', 'ui-theme')
    getPauseContainer().append(background)
}

export const renderBlocks = () => {
    const background = getPauseContainer().firstElementChild
    const inventoryContainer = createAndAddClass('div', 'inventory-container')
    const inventoryEl = createAndAddClass('div', 'inventory')
    inventory.forEach((row) => {
        row.forEach((block) => {
            const theBlock = block === "taken" ? document.createElement('div') : objectToElement(block)
            addClass(theBlock, 'block')
            let skip = false
            if ( block === "taken" ) skip = true
            else if (block === null || block === undefined) theBlock.style.width = `25%`
            else {
                theBlock.style.width = `${block.space * 25}%`
                const amount = createAndAddClass('div', 'amount')
                const amountText = document.createElement("p")
                if ( getWeaponSpecs().get(block.name) === undefined ) amountText.textContent = `${block.amount}`
                else amountText.textContent = `${block.currmag}`
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
                inventoryEl.append(theBlock)
            }          
        })
    })
    inventoryContainer.append(inventoryEl)
    background.append(inventoryContainer)
}

export const renderHeadingAndDescription = () => {
    const background = getPauseContainer().firstElementChild
    const desc = createAndAddClass('div', 'description')
    const heading = document.createElement("h2")
    const paragraph = document.createElement("p")
    appendAll(desc, heading, paragraph)
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
        })
}

export const descriptionEvent = (item) => {
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

export const removeDescriptionEvent = (item) => {
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
    document.querySelectorAll('.options').forEach((elem) => elem.remove())
    const options = createAndAddClass('div', 'options')
    renderOptions(e.target, options)
    options.addEventListener('mouseleave', () => options.remove())
    e.target.append(options)
}

const renderOptions = (item, options) => {
    let renderDropOption = true
    const itemObj = elementToObject(item)
    if ( itemObj.name === 'bandage' ) createOption(options, 'use')
    if ( getWeaponSpecs().get(itemObj.name) ) {
        if ( getEquippedWeapon() && itemObj.name === equippedWeaponFromInventory().name ) {
             if ( getReloading() || getShooting() ) renderDropOption = false
        } else {
            if ( !getReloading() && !getShooting() ) createOption(options, 'equip') 
        }
        createOption(options, 'shortcut')
        createOption(options, 'examine')
    }
    if ( getReloading() ) 
        if ( itemObj.name === equippedWeaponFromInventory().ammotype ) renderDropOption = false
    createOption(options, 'replace')
    if (renderDropOption) createOption(options, 'drop')
}

const replace = (item) => {
    const itemObj = elementToObject(item)
    setDraggedItem(item)
    if ( itemObj.remove !== 1 ) for ( let k = 0; k < itemObj.space; k++ ) inventory[itemObj.row][itemObj.column + k] = null
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
    const grid = createAndAddClass('div', 'grid')
    for ( let i = 0; i < inventory.length; i++ ) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            const block = objectToElement({row: i, column: j})
            if ( item && item !== 'taken' && item.name == getDraggedItem().getAttribute('name') &&
                MAX_PACKSIZE[item.name] >= item.amount + Number(getDraggedItem().getAttribute('amount'))) 
                addClass(block, 'combine')
            block.addEventListener('click', checkReplace, true)
            grid.append(block)
        }
    }
    getPauseContainer().firstElementChild.firstElementChild.firstElementChild.append(grid)
}

const checkReplace = (e) => {
    const destObj = elementToObject(e.target)
    const item = inventory[destObj.row][destObj.column]  
    if ( item === undefined ) return
    const srcObj = elementToObject(getDraggedItem())
    let state = checkPossiblity(item, destObj, srcObj)
    if (state !== -1) REPLACE_STATES.get(state)(destObj, srcObj)
}

const checkPossiblity = (item, destObj, srcObj) => {
    if ( item !== null && item !== 'taken' ) {
        let possible = true
        for ( let k = destObj.column + 1; k < destObj.column + srcObj.space; k++ )
            if ( k >= 4 || (inventory[destObj.row][k] !== 'taken' && inventory[destObj.row][k] !== null)  ) {
                possible = false
                break
            }
        if ( possible ) return 1    
    } else if ( item !== null && item === 'taken' ) {
        let possible = true
        for ( let k = destObj.column + 1; k < destObj.column + srcObj.space; k++ )
            if ( k >= 4 || (inventory[destObj.row][k] !== 'taken' && inventory[destObj.row][k] !== null)  ) {
                possible = false 
                break
            }
        if ( possible ) return 2    
    } else if ( item === null ) {
        let possible = true
        let itemCount = 0
        for ( let k = destObj.column + 1; k < destObj.column + srcObj.space; k++ ) {
            if ( !possible ) break
            if ( k >= 4 ) possible = false
            if ( possible && inventory[destObj.row][k] !== 'taken' && inventory[destObj.row][k] !== null ) itemCount++
            if ( itemCount > 1 ) possible = false
        }
        if ( possible ) return 3
    }
    return -1        
}

const destOnItem = (destObj, srcObj) => {
    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    const elemToReplace = Array.from(blocks.children).find(x => 
        x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === destObj.column + '')
    if ( combine(elemToReplace, destObj, srcObj, inventory) === 1 ) return
    elemToReplace.setAttribute('remove', 0)
    replace(elemToReplace)
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < Math.max(srcObj.space, inventory[destObj.row][destObj.column]  .space); k++ ) {
        if ( k < srcObj.space ) inventory[destObj.row][destObj.column + k] = 'taken'
        else inventory[destObj.row][destObj.column + k] = null
    }
    elemToReplace.setAttribute('remove', 1)
    replace(elemToReplace)
}

const combine = (elemToReplace, destObj, srcObj, inventory) => {
    let result = -1
    const pack = MAX_PACKSIZE[elementToObject(elemToReplace).name]
    const objectToReplace = elementToObject(elemToReplace)   
    let srcAmount = srcObj.amount
    let destAmount = objectToReplace.amount
    if ( objectToReplace.name === srcObj.name && srcAmount + destAmount <= pack ) {
        const newDestAmount = Math.min(srcAmount + destAmount, pack)
        const diff = newDestAmount - destAmount
        const newSrcAmount = srcAmount - diff
        inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column, amount: newDestAmount}
        elemToReplace.setAttribute('amount', newSrcAmount)
        elemToReplace.firstElementChild.textContent = `${newSrcAmount}`
        elemToReplace.setAttribute('remove', 1)
        replace(elemToReplace)
        result = 1
    }
    return result
}

const destOnTaken = (destObj, srcObj) => {
    let count = 0
    for ( let k = destObj.column; ; k-- ) {
        if ( inventory[destObj.row][k] !== null && inventory[destObj.row][k] !== 'taken' ) break
        count++
    }
    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    const elemToReplace = Array.from(blocks.children).find(x => 
        x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === (destObj.column - count) + '')
    elemToReplace.setAttribute('remove', 0)
    replace(elemToReplace)
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < srcObj.space; k++ ) inventory[destObj.row][destObj.column + k] = 'taken'
    elemToReplace.setAttribute('remove', 1)
    replace(elemToReplace)
}

const destOnEmpty = (destObj, srcObj) => {
    let count = 0
    for ( let k = destObj.column; ; k++ ) {
        if ( inventory[destObj.row][k] !== null && inventory[destObj.row][k] !== 'taken' ) break
        if ( k === destObj.column + srcObj.space ) break
        count++
    }
    if ( count === srcObj.space ) destCompleteEmpty(destObj, srcObj)
    else destHalfEmpty(destObj, srcObj, count)
}

const destCompleteEmpty = (destObj, srcObj) => {
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < srcObj.space; k++ ) inventory[destObj.row][destObj.column + k] = 'taken'
    removeInventory()
    renderInventory()
    setDraggedItem(null)
}

const destHalfEmpty = (destObj, srcObj, count) => {
    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    const elemToReplace = Array.from(blocks.children).find(x => 
        x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === (destObj.column + count) + '')
    elemToReplace.setAttribute('remove', 0)
    replace(elemToReplace)
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < srcObj.space; k++ ) inventory[destObj.row][destObj.column + k] = 'taken'
    elemToReplace.setAttribute('remove', 1)
    replace(elemToReplace)
}

const REPLACE_STATES = new Map([
    [1, destOnItem],
    [2, destOnTaken],
    [3, destOnEmpty]
])

const use = (item) => {
    getPauseContainer().firstElementChild.remove()
    const itemObj = elementToObject(item)
    const row = itemObj.row
    const column = itemObj.column
    inventory[row][column].amount -= 1
    item.firstElementChild.firstElementChild.textContent = inventory[row][column].amount
    if ( inventory[row][column].amount === 0 ) {
        inventory[row][column] = null
        replaceBlocks(item, itemObj.space)
        item.remove()
    }
    renderInventory()
}

const replaceBlocks = (item, space) => {
    let prevBlock = item
    for ( let i = 0; i < space; i++ ) {
        const newBlock = createAndAddClass('div', 'block')
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
    setEquippedWeapon(inventory[row][column].id)
    const equippedWeapon = equippedWeaponFromInventory()
    setShootCounter(getStat(equippedWeapon.name, 'firerate', equippedWeapon.fireratelvl) * 60)
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
    const left = Math.floor(getPlayerX() - getRoomLeft())
    const top = Math.floor(getPlayerY() - getRoomTop())
    const interactable = {...itemObj, left: left, top: top}
    getPauseContainer().firstElementChild.remove()
    let index = findSuitableId(interactable)
    dropFromInventory(itemObj)
    renderInteractable(getCurrentRoom(), interactable, index)
    handleWeaponDrop(itemObj)
    renderInventory()
}

const dropFromInventory = (itemObj) => {
    const row = itemObj.row
    const column = itemObj.column
    inventory[row][column] = null
    if ( inventory[row][column] === null && column + itemObj.space <= 4 )
        for ( let k = 1; k < itemObj.space; k++ ) inventory[row][column+k] = null
}

const findSuitableId = (interactable) => {
    const roomInts = interactables.get(getCurrentRoomId())
    return roomInts.push(interactable) - 1
}

export const handleWeaponDrop = (itemObj) => {
    if ( !getWeaponSpecs().has(itemObj.name) ) return
    if ( getEquippedWeapon() === itemObj.id ) {
        setEquippedWeapon(null)
        removeClass(getPlayer(), 'aim')
        setAimMode(false)
        removeWeapon()
    }
    setWeaponWheel(getWeaponWheel().map(weapon => weapon === itemObj.id ? null : weapon))
}

const examine = (item) => renderStats(elementToObject(item))

const OPTIONS = new Map([
    ['replace', replace],
    ['use', use],
    ['equip', equip],
    ['shortcut', shortcut],
    ['drop', drop],
    ['examine', examine],
])

const createOption = (options, text) => {
    const elem = document.createElement("div")
    elem.textContent = `${text}`
    elem.addEventListener('click', () => {
        OPTIONS.get(text)(options.parentElement)
    })
    options.append(elem)
}

const renderWeaponWheel = () => {
    const background = getPauseContainer().firstElementChild
    const weaponWheelContainer = createAndAddClass('div', 'weapon-wheel-container')
    const weaponWheel = createAndAddClass('div', 'weapon-wheel')
    let slots = 4
    while (slots) {
        const slot = document.createElement("div")
        const image = document.createElement("img")
        const slotNum = document.createElement("p")
        let name = inventory.flat().filter(item => item && item !== 'taken' && item.id === getWeaponWheel()[4-slots])[0]?.name
        if ( !name )
            name = getDraggedItem()?.getAttribute('id') === getWeaponWheel()[4 - slots] + '' 
        ? getDraggedItem()?.getAttribute('name') : null
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