import { interactables } from "./interactables.js"
import { getWeaponSpecs } from "./weapon-specs.js"
import { renderInteractable } from "./room-loader.js"
import { removeUi, renderUi } from "./user-interface.js"
import { removeWeapon, renderWeapon } from "./weapon-loader.js"
import { getCurrentRoom, getPauseContainer, getPlayer } from "./elements.js"
import { OwnedWeapon, getOwnedWeapons, setOwnedWeapons } from "./owned-weapons.js"
import { addAttribute, addClass, containsClass, elementToObject, objectToElement, removeClass, putToMap, appendAll } from "./util.js"
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
    setWeaponWheel, 
    getIntObj, 
    getReloading,
    setShootCounter,
    getShooting,
    setPauseCause} from "./variables.js"
import { managePause } from "./controls.js"

export const MAX_PACKSIZE = {
    bandage: 3,
    coin: 5,
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

export const getInventory = () => {
    return inventory
}

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
    if ( Number(getIntObj().getAttribute("amount")) === 0 ) removeDrop()
    const currentWeapon = getOwnedWeapons().get(getEquippedWeapon())
    if ( getEquippedWeapon() && getIntObj().getAttribute('name') === currentWeapon.getAmmoType() ) {
        removeUi()
        renderUi()
    }
}

const inventoryFull = () => {
    for (const row of inventory) {
        for ( const item of row ) {
            if ( item === null ) {
                return false
            }
        }
    }  
    return true 
}

export const calculateTotalAmmo = () => {
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    let count = 0
    inventory.forEach((row) => {
        row.forEach((item) => {
            if ( item && item.name === equippedWeapon.getAmmoType() ) count += item.amount
        })
    })
    return count
}

export const useInventoryResource = (name, reduce) => {
    for ( let i = inventory.length - 1; i >= 0; i-- ) {
        for ( let j = inventory[i].length - 1; j >= 0; j-- ) {
            if ( reduce === 0 ) return
            if ( inventory[i][j] === null || inventory[i][j] === undefined || inventory[i][j] === 'taken' ) continue
            if ( inventory[i][j].name === name ) useItemAtPosition(i, j, reduce)
        }
    }
}

export const useItemAtPosition = (row, column, reduce) => {
    const itemAmount = inventory[row][column].amount
    const diff = itemAmount <= reduce ? itemAmount : reduce
    reduce -= diff
    inventory[row][column].amount -= diff
    const space = inventory[row][column].space
    if ( inventory[row][column].amount === 0 ) {
        inventory[row][column] = null
        for ( let i = 1; i < space; i++ ) 
            if ( inventory[row][column + i] === 'taken' )
                inventory[row][column + i] = null
    }
}

export const updateInventoryWeaponMag = () => {
    for ( let i = 0; i < inventory.length; i++ ) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            if ( inventory[i][j] === null || inventory[i][j] === undefined || inventory[i][j] === 'taken' ) continue
            if ( getOwnedWeapons().has(inventory[i][j].id) ) 
                inventory[i][j].currMag = getOwnedWeapons().get(inventory[i][j].id).currMag
        }
    }
}

const updateAmount = (newValue) => {
    getIntObj().setAttribute("amount", newValue)
    if ( getIntObj().children.length === 0 ) return
    getIntObj().children[1].children[0].textContent = `x${newValue} ${getIntObj().getAttribute("heading")}`
    interactables.set(getCurrentRoomId(), 
    Array.from(interactables.get(getCurrentRoomId())).map((int, index) => {
        return `${getCurrentRoomId()}-${index}` === getIntObj().getAttribute("id") ? 
        {
            ...int,
            amount: newValue
        } : int
    })) 
}

const removeDrop = () => {
    if ( getWeaponSpecs().get(getIntObj().getAttribute("name")) ) handleNewWeaponPickup()
    getIntObj().remove()
    interactables.set(getCurrentRoomId(), 
    Array.from(interactables.get(getCurrentRoomId())).map((elem, index) => {
        return `${getCurrentRoomId()}-${index}` === getIntObj().getAttribute("id") ? null : elem
    }))
}

const handleNewWeaponPickup = () => {
    const weapon = elementToObject(getIntObj())
    putToMap(getOwnedWeapons, setOwnedWeapons, weapon.id, new OwnedWeapon(
        weapon.name,
        weapon.currmag,
        weapon.damagelvl,
        weapon.rangelvl,
        weapon.reloadspeedlvl,
        weapon.magazinelvl,
        weapon.fireratelvl 
    ))
    updateWeaponWheel()
}

const updateWeaponWheel = () => {
    let weaponWheelCopy = getWeaponWheel()
    for (const key in getWeaponWheel()) {
        if ( getWeaponWheel()[key] === null ) {
            weaponWheelCopy[key] = getIntObj().getAttribute('id')
            break
        }
    }
    setWeaponWheel(weaponWheelCopy)
}

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

export const renderBlocks = () => {
    const background = getPauseContainer().firstElementChild
    const inventoryContainer = document.createElement("div")
    addClass(inventoryContainer, 'inventory-container')
    const inventoryEl = document.createElement("div")
    addClass(inventoryEl, 'inventory')
    inventory.forEach((row) => {
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
                inventoryEl.append(theBlock)
            }          
        })
    })
    inventoryContainer.append(inventoryEl)
    background.append(inventoryContainer)
}

export const renderHeadingAndDescription = () => {
    const background = getPauseContainer().firstElementChild
    const desc = document.createElement("div")
    addClass(desc, 'description')
    const heading = document.createElement("h2")
    const paragraph = document.createElement("p")
    appendAll(desc, [heading, paragraph])
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
    const options = document.createElement('div')
    addClass(options, 'options')
    renderOptions(e.target, options)
    e.target.append(options)
}

const renderOptions = (item, options) => {
    let renderDropOption = true
    const itemObj = elementToObject(item)
    if ( itemObj.name === 'bandage' ) createOption(options, 'use')
    if ( getWeaponSpecs().get(itemObj.name) ) {
        if ( getEquippedWeapon() && itemObj.name === getOwnedWeapons().get(getEquippedWeapon()).name ) {
             if ( getReloading() || getShooting() ) renderDropOption = false
        } else {
            if ( !getReloading() && !getShooting() ) createOption(options, 'equip') 
        }
        createOption(options, 'shortcut')
        createOption(options, 'examine')
    }
    if ( getReloading() ) 
        if ( itemObj.name === getOwnedWeapons().get(getEquippedWeapon()).getAmmoType() ) renderDropOption = false
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
    const grid = document.createElement('div')
    addClass(grid, 'grid')
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
    setEquippedWeapon(inventory[row][column].id)
    setShootCounter(getOwnedWeapons().get(getEquippedWeapon()).getFireRate() * 60)
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
    roomInts.push(interactable)
    return roomInts.length
}

export const handleWeaponDrop = (itemObj) => {
    if ( !getOwnedWeapons().get(itemObj.id) ) return
    getOwnedWeapons().delete(itemObj.id)
    if ( getEquippedWeapon() === itemObj.id ) {
        setEquippedWeapon(null)
        removeClass(getPlayer(), 'aim')
        setAimMode(false)
        removeWeapon()
    }
    setWeaponWheel(getWeaponWheel().map(weapon => weapon === itemObj.id ? null : weapon))
}

const examine = (item) => {
    setPauseCause('stats')
    const itemObj = elementToObject(item)
    const weaponStatsContainer = document.createElement('div')
    addClass(weaponStatsContainer, 'weapon-stats-container')
    const weaponStats = document.createElement('div')
    addClass(weaponStats, 'weapon-stats')
    const imgContainer = document.createElement('div')
    addClass(imgContainer, 'weapon-stats-img-container')
    const img = document.createElement('img')
    img.src = `../assets/images/${itemObj.name}.png`
    imgContainer.append(img)
    const weaponStatsName = document.createElement('div')
    addClass(weaponStatsName, 'weapon-stats-name')
    weaponStatsName.textContent = itemObj.heading
    const weaponStatsDesc = document.createElement('div')
    addClass(weaponStatsDesc, 'weapon-stats-desc')
    weaponStatsDesc.textContent = itemObj.description
    const damage = createStat(itemObj, 'damage', 'damage')
    const range = createStat(itemObj, 'range', 'range')
    const reload = createStat(itemObj, 'reload speed', 'reloadspeed')
    const magazine = createStat(itemObj, 'magazine', 'magazine')
    const firerate = createStat(itemObj, 'fire rate', 'firerate')
    appendAll(weaponStats, [imgContainer, weaponStatsName, weaponStatsDesc, damage, range, reload, magazine, firerate])
    weaponStatsContainer.append(weaponStats)
    removeInventory()
    getPauseContainer().append(weaponStatsContainer)
    renderQuit()
}

const renderQuit = () => {
    const quitContainer = document.createElement("div")
    addClass(quitContainer, 'quit')
    const quitBtn = document.createElement("p")
    quitBtn.textContent = 'esc'
    const quitText = document.createElement("p")
    quitText.textContent = 'quit'
    appendAll(quitContainer, [quitBtn, quitText])
    quitContainer.addEventListener('click', () => {
        getPauseContainer().firstElementChild.remove()
        renderInventory()
        setPauseCause('inventory')
    })
    getPauseContainer().firstElementChild.append(quitContainer)
}

const createStat = (itemObj, title, name) => {
    const statContainer = document.createElement('div')
    addClass(statContainer, 'stat-container')
    const upper = document.createElement('div')
    addClass(upper, 'upper')
    const upperRight = document.createElement('div')
    addClass(upperRight, 'upper-right')
    const statName = document.createElement('p') 
    addClass(statName, 'stat-name')
    statName.textContent = title
    const statLvl = document.createElement('p')
    addClass(statLvl, 'stat-lvl')
    statLvl.textContent = `Lvl. ${itemObj[name+'lvl']}`
    const value = document.createElement('div')
    addClass(value, 'value')
    value.textContent = `${getValue(itemObj, name)}`
    const lower = document.createElement('div')
    addClass(lower, 'lower')
    for ( let i = 1; i <= 5; i++ ) {
        const level = document.createElement('div')
        if ( i <= itemObj[name+'lvl'] ) addClass(level, 'active')
        else addClass(level, 'inactive')   
        lower.append(level) 
    }
    appendAll(upperRight, [statLvl, value])
    appendAll(upper, [statName, upperRight])
    appendAll(statContainer, [upper, lower])
    return statContainer
}

const getValue = (itemObj, name) => {
    const equippedWeapon = getOwnedWeapons().get(itemObj.id)
    let result
    if ( name === 'damage' ) result = equippedWeapon.getDamage()
    else if ( name === 'range' ) result = equippedWeapon.getRange()
    else if ( name === 'reloadspeed' ) result = equippedWeapon.getReloadSpeed()
    else if ( name === 'magazine' ) result = equippedWeapon.getMagazine()
    else if ( name === 'firerate' ) result = equippedWeapon.getFireRate()
    return result    
}

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