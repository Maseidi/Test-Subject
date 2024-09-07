import { renderStats } from './weapon-examine.js'
import { renderWeapon } from './weapon-loader.js'
import { interactables } from './interactables.js'
import { useLuckPills } from './weapon-manager.js'
import { useEnergyDrink } from './player-sprint.js'
import { getPasswords } from './password-manager.js'
import { isThrowable } from './throwable-details.js'
import { useAdrenaline } from './player-movement.js'
import { renderInteractable } from './room-loader.js'
import { renderThrowable } from './throwable-loader.js'
import { quitPage, renderQuit } from './user-interface.js'
import { getWeaponDetails, isWeapon } from './weapon-details.js'
import { activateProgress, openDoor } from './progress-manager.js'
import { useAntidote, useBandage, useHealthPotion } from './player-health.js'
import { getCurrentRoom, getCurrentRoomInteractables, getPauseContainer, getPlayer, getUiEl } from './elements.js'
import { 
    addClass,
    containsClass,
    element2Object,
    object2Element,
    appendAll, 
    createAndAddClass,
    nextId, 
    getEquippedItemDetail,
    addAllAttributes,
    isThrowing,
    exitAimModeAnimation, 
    removeEquipped} from './util.js'
import { 
    getAimMode,
    getCurrentRoomId,
    getDraggedItem,
    getEquippedWeaponId,
    getMouseX,
    getMouseY,
    getPlayerX,
    getPlayerY,
    getRoomLeft,
    getRoomTop,
    getWeaponWheel,
    setAimMode,
    setDraggedItem,
    setEquippedWeaponId,
    setWeaponWheel, 
    getIntObj, 
    getReloading,
    setShootCounter,
    getShooting, 
    getPause, 
    getEquippedWeaponObject, 
    setEquippedWeaponObject } from './variables.js'

export const MAX_PACKSIZE = {
    bandage: 3,
    antidote: 3,
    coin: 50,
    hardDrive: 2,
    smgAmmo: 90,
    pistolAmmo: 30,
    shotgunShells: 20,
    rifleAmmo: 10,
    magnumAmmo: 5,
    grenade: 2,
    flashbang: 3,
    adrenaline: 1,
    healthpotion: 1,
    luckpills: 1,
    energydrink: 1
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
    const drop = element2Object(getIntObj())
    const pack = MAX_PACKSIZE[drop.name] || 1
    let found = false
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item && item.name === drop.name && item.amount !== pack && !found ) {
                let diff = Math.min(pack, item.amount + drop.amount) - item.amount
                handleThrowablePickup(drop)
                item.amount += diff
                updateAmount(drop.amount - diff)
                found = true
            }
        }
    }
    if ( found && drop.amount !== 0 ) searchPack()
}

const searchEmpty = () => {
    const drop = element2Object(getIntObj())
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
                handleThrowablePickup(drop)
                inventory[i][j] = {...drop, amount: diff, row: i, column: j}
                for ( let k = 1; k < drop.space; k++ ) inventory[i][j+k] = 'taken'
                updateAmount(drop.amount - diff)
                if ( drop.amount > 0 && inventoryFull() ) return
                searchEmpty()
                return
            }
        }
    }
}

const handleThrowablePickup = (drop) => {
    if ( !isThrowable(drop.name) ) return
    const throwable = inventory.flat().find(item => item?.name === drop.name)
    if ( !throwable ) return
    const interactable = getCurrentRoomInteractables().find(int => int.id === drop.id)
    drop.id = throwable.id
    getIntObj().setAttribute('id', throwable.id)
    if ( interactable ) interactable.id = throwable.id
}

const checkSpecialScenarios = () => {
    const obj = element2Object(getIntObj())
    if ( obj.amount === 0 ) activateProgress(obj.progress2active + '')
    if ( ( isThrowable(obj.name) && !getWeaponWheel().includes(obj.id) ) ||
         ( isWeapon(obj.name) && obj.amount === 0 ) ) updateWeaponWheel()        
    if ( getPause() ) return
    if ( obj.amount === 0 ) removeDrop(getIntObj())
    ammo4Equipped(obj)
}

const ammo4Equipped = (obj) => {
    if ( !getEquippedWeaponId() ) return
    const equipped = getEquippedWeaponObject()
    ammo4EquippedWeapon(equipped, obj)
    ammo4EquippedThrowable(equipped, obj)
}

const ammo4EquippedWeapon = (equipped, obj) => {
    if ( !isWeapon(equipped.name) ) return
    if ( obj.name !== getWeaponDetails().get(equipped.name).ammotype ) return
    const ammoCount = getUiEl().children[2].children[1]
    const totalAmmo = ammoCount.children[1]
    totalAmmo.textContent = calculateTotalAmmo(equipped)
}

const ammo4EquippedThrowable = (equipped, obj) => {
    if ( !isThrowable(equipped.name) ) return
    if ( obj.name !== equipped.name ) return
    const ammoCount = getUiEl().children[2].children[1]
    ammoCount.firstElementChild.textContent = calculateThrowableAmount(equipped)
}

const inventoryFull = () => inventory.flat().every(item => item !== null)

export const findEquippedWeaponById = () => inventory.flat().find(item => item && item.id === getEquippedWeaponId())

export const calculateTotalAmmo = (equippedWeapon) => countItem(equippedWeapon.ammotype)

export const calculateThrowableAmount = (equippedThrowable) => countItem(equippedThrowable.name)

export const calculateTotalCoins = () => countItem('coin')

const countItem = (name) => 
    inventory.flat().filter(item => item && item.name === name).reduce((a, b) => a + b.amount, 0)

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

export const updateInventoryWeaponMag = (weapon, newMag) => inventory[weapon.row][weapon.column].currmag = newMag

const updateAmount = (newValue) => {
    getIntObj().setAttribute('amount', newValue)
    if ( getIntObj().children.length === 0 ) return
    getIntObj().children[1].children[0].textContent = `${newValue} ${getIntObj().getAttribute('heading')}`
    interactables.set(getCurrentRoomId(), 
    interactables.get(getCurrentRoomId()).map(int => {
        return int.id === +getIntObj().getAttribute('id') ? 
        {
            ...int,
            amount: newValue
        } : int
    }))
}

export const removeDrop = (element) => {
    element.remove()
    interactables.set(getCurrentRoomId(), interactables.get(getCurrentRoomId()).filter(elem => elem.id !== Number(element.id)))
}

const updateWeaponWheel = () => {
    const index = getWeaponWheel().findIndex(item => item === null)
    getWeaponWheel()[index] = Number(getIntObj().getAttribute('id'))
}

export const upgradeInventory = () => {
    const index = inventory.flat().findIndex(block => block === undefined)
    const row = Math.floor(index / 4)
    const column = index % 4
    inventory[row][column] = null
    inventory[row][column + 1] = null
}

export const upgradeWeaponStat = (name, stat) => {
    const weapon = inventory.flat().find(item => item && item.name === name)
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
            const theBlock = block === 'taken' ? document.createElement('div') : object2Element(block)
            addClass(theBlock, 'block')
            let skip = false
            if ( block === 'taken' ) skip = true
            else if (block === null || block === undefined) theBlock.style.width = `25%`
            else {
                theBlock.style.width = `${block.space * 25}%`
                const amount = createAndAddClass('div', 'amount')
                const amountText = document.createElement('p')
                if ( !isWeapon(block.name) ) amountText.textContent = `${block.amount}`
                else amountText.textContent = `${block.currmag}`
                amount.append(amountText)
                theBlock.append(amount)
            }
            if ( !skip ) {                
                if ( block === undefined ) theBlock.style.backgroundColor = `rgba(255, 0, 0, 0.1)`
                if ( block === null || block === undefined ) skip = true   
                if ( !skip ) {
                    const image = document.createElement('img')
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
    const heading = document.createElement('h2')
    const paragraph = document.createElement('p')
    appendAll(desc, heading, paragraph)
    background.firstElementChild.append(desc)
}

const inventoryEvents = () => {
    const background = getPauseContainer().firstElementChild
    Array.from(background.firstElementChild.firstElementChild.children)
        .filter((block) => block.getAttribute('heading') && block.getAttribute('description'))
        .forEach((item) => {
            renderDescriptionEvent(item)
            removeDescriptionEvent(item)
            optionsEvents(item)
        })
}

export const renderDescriptionEvent = (item) => {
    const itemObj = element2Object(item)
    item.addEventListener('mousemove', renderDescriptionContent, true)
    item.heading = `${itemObj.heading}`
    item.description = `${itemObj.description}`
    item.isNote = itemObj.name === 'note'
    item.isExamined = itemObj.examined
}

const renderDescriptionContent = (e) => {
    const desc = getPauseContainer().firstElementChild.firstElementChild.children[1]
    const heading = e.target.heading
    const description = e.target.description
    const isNote = e.target.isNote
    const isExamined = e.target.isExamined
    if (e.target.heading) desc.children[0].textContent = isNote && !isExamined ? 'Note' : heading
    if (e.target.description) desc.children[1].textContent = isNote && !isExamined ? '????' : description
}

export const removeDescriptionEvent = (item) => {
    item.addEventListener('mouseleave', removeDescriptionContent, true)
}

const removeDescriptionContent = () => {
    const desc = getPauseContainer().firstElementChild.firstElementChild.children[1]
    desc.children[0].textContent = ``
    desc.children[1].textContent = ``
}

const optionsEvents = (item) => item.addEventListener('click', addOptionsEvent, true)

const addOptionsEvent = (e) => {    
    const target = !containsClass(e.target, 'block') ? !containsClass(e.target.parentElement, 'block') ? 
                   e.target.parentElement.parentElement : e.target.parentElement : e.target

    const options = createAndAddClass('div', 'options')
    renderOptions(target, options)
    target.addEventListener('mouseleave', () => options.remove())
    target.append(options)
}

const renderOptions = (item, options) => {
    if ( item.children[2] ) return
    let renderDropOption = true

    const itemObj = element2Object(item)

    if ( ['bandage', 'antidote', 'adrenaline', 'healthpotion', 'luckpills', 'energydrink'].includes(itemObj.name) || 
         itemObj.name.includes('key') ) createOption(options, 'use')

    if ( isThrowable(itemObj.name) ) {
        if ( !getReloading() ) createOption(options, 'equip')
        if ( isThrowing() ) renderDropOption = false    
        createOption(options, 'shortcut')
    }

    if ( isWeapon(itemObj.name) ) {
        if ( getEquippedWeaponId() && itemObj.name === getEquippedWeaponObject()?.name ) {
             if ( getReloading() || getShooting() ) renderDropOption = false
        } else {
            if ( !getReloading() && !getShooting() ) createOption(options, 'equip')
        }
        createOption(options, 'shortcut')
        createOption(options, 'examine')
    }

    if ( itemObj.name === 'note' ) createOption(options, 'examine')

    if ( getReloading() ) 
        if ( itemObj.name === getEquippedWeaponObject().ammotype ) renderDropOption = false

    createOption(options, 'replace')

    if (renderDropOption) createOption(options, 'drop')
}

const replace = (item) => {
    const itemObj = element2Object(item)
    setDraggedItem(item)
    if ( itemObj.remove !== 1 ) 
        for ( let k = 0; k < itemObj.space; k++ ) inventory[itemObj.row][itemObj.column + k] = null
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
            const block = object2Element({row: i, column: j})
            if ( item && item.name === getDraggedItem().getAttribute('name') &&
                MAX_PACKSIZE[item.name] >= item.amount + Number(getDraggedItem().getAttribute('amount'))) 
                addClass(block, 'combine')
            block.addEventListener('click', checkReplace, true)
            grid.append(block)
        }
    }
    getPauseContainer().firstElementChild.firstElementChild.firstElementChild.append(grid)
}

const checkReplace = (e) => {
    const destObj = element2Object(e.target)
    const item = inventory[destObj.row][destObj.column]  
    if ( item === undefined ) return
    const srcObj = element2Object(getDraggedItem())
    let state = getReplacementState(item, destObj, srcObj)
    if (state !== -1) REPLACE_STATES.get(state)(destObj, srcObj)
}

const getReplacementState = (item, destObj, srcObj) => {
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
    const elem2Replace = Array.from(blocks.children).find(x => 
        x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === destObj.column + '')
    if ( combine(elem2Replace, destObj, srcObj, inventory) === 1 ) return
    elem2Replace.setAttribute('remove', 0)
    replace(elem2Replace)
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < Math.max(srcObj.space, inventory[destObj.row][destObj.column]  .space); k++ ) {
        if ( k < srcObj.space ) inventory[destObj.row][destObj.column + k] = 'taken'
        else inventory[destObj.row][destObj.column + k] = null
    }
    elem2Replace.setAttribute('remove', 1)
    replace(elem2Replace)
}

const combine = (elem2Replace, destObj, srcObj, inventory) => {
    let result = -1
    const pack = MAX_PACKSIZE[element2Object(elem2Replace).name]
    const object2Replace = element2Object(elem2Replace)   
    let srcAmount = srcObj.amount
    let destAmount = object2Replace.amount
    if ( object2Replace.name === srcObj.name && srcAmount + destAmount <= pack ) {
        const newDestAmount = Math.min(srcAmount + destAmount, pack)
        const diff = newDestAmount - destAmount
        const newSrcAmount = srcAmount - diff
        inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column, amount: newDestAmount}
        elem2Replace.setAttribute('amount', newSrcAmount)
        elem2Replace.firstElementChild.textContent = `${newSrcAmount}`
        elem2Replace.setAttribute('remove', 1)
        replace(elem2Replace)
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
    const elem2Replace = Array.from(blocks.children).find(x => 
        x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === (destObj.column - count) + '')
    elem2Replace.setAttribute('remove', 0)
    replace(elem2Replace)
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < srcObj.space; k++ ) inventory[destObj.row][destObj.column + k] = 'taken'
    elem2Replace.setAttribute('remove', 1)
    replace(elem2Replace)
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
    const elem2Replace = Array.from(blocks.children).find(x => 
        x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === (destObj.column + count) + '')
    elem2Replace.setAttribute('remove', 0)
    replace(elem2Replace)
    inventory[destObj.row][destObj.column] = {...srcObj, row: destObj.row, column: destObj.column}
    for ( let k = 1; k < srcObj.space; k++ ) inventory[destObj.row][destObj.column + k] = 'taken'
    elem2Replace.setAttribute('remove', 1)
    replace(elem2Replace)
}

const REPLACE_STATES = new Map([
    [1, destOnItem],
    [2, destOnTaken],
    [3, destOnEmpty]
])

const use = (item) => {
    const itemObj = element2Object(item)
    let theItem = inventory[itemObj.row][itemObj.column]
    if ( useKey(theItem) ) return
    getPauseContainer().firstElementChild.remove()
    if ( theItem.name === 'bandage' )           useBandage(theItem)
    else if ( theItem.name === 'antidote' )     useAntidote(theItem)
    else if ( theItem.name === 'luckpills' )    useLuckPills(theItem)
    else if ( theItem.name === 'adrenaline' )   useAdrenaline(theItem)
    else if ( theItem.name === 'energydrink' )  useEnergyDrink(theItem)
    else if ( theItem.name === 'healthpotion' ) useHealthPotion(theItem)
    if ( theItem.amount === 0 ) inventory[itemObj.row][itemObj.column] = null
    renderInventory()
}

const useKey = (itemObj) => {
    if ( !itemObj.name.includes('key') ) return false
    const neededKey = getIntObj()?.getAttribute('key')
    if ( !neededKey || itemObj.unlocks !== neededKey ) return false
    quitPage()
    openDoor(getIntObj())
    return true
}

const equip = (item) => {
    getPauseContainer().firstElementChild.remove()
    const itemObj = element2Object(item)
    const row = itemObj.row
    const column = itemObj.column
    setEquippedWeaponId(inventory[row][column].id)
    setEquippedWeaponObject(findEquippedWeaponById())
    const equipped = getEquippedWeaponObject()
    setShootCounter(getEquippedItemDetail(equipped, 'firerate') * 60)
    if ( getAimMode() ) {
        exitAimModeAnimation()
        removeEquipped()
        if ( isWeapon(equipped.name) ) {
            addClass(getPlayer(), 'aim')
            renderWeapon()
        } else if ( isThrowable(equipped.name) ) {
            addClass(getPlayer(), 'throwable-aim')
            renderThrowable()
        }
    }
    renderInventory()
}

const shortcut = (item) => {
    const weaponWheel = getPauseContainer().firstElementChild.children[1].firstElementChild
    Array.from(weaponWheel.children).forEach((slot, index) => {
        addClass(slot, 'selectable-slot')
        addAllAttributes(
            slot, 
            'selected-weapon', item.id, 
            'slot-num', index
        )
        slot.addEventListener('click', selectAsSlot)
    })
    item.children[2].remove()
}

const selectAsSlot = (e) => {
    const targetSlotNum = Number(e.target.getAttribute('slot-num'))
    const slotWeaponId = getWeaponWheel()[targetSlotNum]
    const selectedId = Number(e.target.getAttribute('selected-weapon'))
    const selectedSlotNum = getWeaponWheel().findIndex(x => x === selectedId)
    getWeaponWheel()[targetSlotNum] = selectedId
    getWeaponWheel()[selectedSlotNum] = slotWeaponId
    removeInventory()
    renderInventory()
}

const drop = (item) => {
    const itemObj = element2Object(item)
    const left = Math.floor(getPlayerX() - getRoomLeft())
    const top = Math.floor(getPlayerY() - getRoomTop())
    let interactable = {...itemObj, renderProgress: '0', left: left, top: top}
    if ( interactables.get(getCurrentRoomId()).find(elem => elem.id === interactable.id) ) 
        interactable = {...interactable, id: nextId()}
    getPauseContainer().firstElementChild.remove()
    interactables.get(getCurrentRoomId()).push(interactable)
    dropFromInventory(itemObj)
    renderInteractable(getCurrentRoom(), interactable)
    handleEquippableDrop(itemObj)
    renderInventory()
}

const dropFromInventory = (itemObj) => {
    const row = itemObj.row
    const column = itemObj.column
    inventory[row][column] = null
    if ( inventory[row][column] === null && column + itemObj.space <= 4 )
        for ( let k = 1; k < itemObj.space; k++ ) inventory[row][column+k] = null
}

export const handleEquippableDrop = (itemObj) => {
    handleWeaponDrop(itemObj)
    handleThrowableDrop(itemObj)
}

const handleWeaponDrop = (itemObj) => {
    if ( !isWeapon(itemObj.name) ) return
    dropFromWeaponWheel(itemObj)
}

const handleThrowableDrop = (itemObj) => {
    if ( !isThrowable(itemObj.name) ) return
    if ( calculateThrowableAmount(itemObj) !== 0 ) return
    dropFromWeaponWheel(itemObj)
}

const dropFromWeaponWheel = (itemObj) => {
    if ( getEquippedWeaponId() === itemObj.id ) {
        setEquippedWeaponId(null)
        setEquippedWeaponObject(null)
        exitAimModeAnimation()
        removeEquipped()
        setAimMode(false)
    }
    setWeaponWheel(getWeaponWheel().map(weapon => weapon === itemObj.id ? null : weapon))
}

const examine = (item) => {  
    const itemObj = element2Object(item)  
    if ( isWeapon(itemObj.name) ) renderStats(itemObj)
    else if ( itemObj.name === 'note' ) renderNote(item, itemObj)
}

const renderNote = (item, itemObj) => {
    const noteContainer = createAndAddClass('div', 'note-container', 'ui-theme')
    const note = createAndAddClass('div', 'note')
    const data = createAndAddClass('p', 'note-data')
    data.textContent = itemObj.data.replace('PLACE_CODE_HERE', getPasswords().get(itemObj.code))
    note.append(data)
    noteContainer.append(note)
    getPauseContainer().append(noteContainer)
    renderQuit()
    inventory[itemObj.row][itemObj.column].examined = true
    item.setAttribute('examined', 'true')
    inventoryEvents()
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
    const elem = document.createElement('div')
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
        const slot = document.createElement('div')
        const slotNum = document.createElement('p')
        slotNum.textContent = addText2WeaponWheelOption(slots)
        renderWeaponWheelImage(slot, slots)
        slot.append(slotNum)
        weaponWheel.append(slot)
        slots--
    }
    weaponWheelContainer.append(weaponWheel)
    background.append(weaponWheelContainer)
}

const renderWeaponWheelImage = (slot, slots) => {
    const weaponName = findWeaponName(slots)
    if ( weaponName ) {
        const image = document.createElement('img')
        image.src = `../assets/images/${weaponName}.png`
        slot.append(image)
    } else slot.style.width = `70px`
}

const findWeaponName = (slots) => 
    inventory.flat().find(item => item && item.id === getWeaponWheel()[4-slots])?.name ?? 
    ( getDraggedItem()?.getAttribute('id') === getWeaponWheel()[4 - slots] + '' 
    ? getDraggedItem()?.getAttribute('name') : null )

const addText2WeaponWheelOption = (slots) =>
    getEquippedWeaponId() && 
    4 - slots === getWeaponWheel().findIndex(x => x === getEquippedWeaponId()) ? 
    'E' : `${5 - slots}`

export const removeInventory = () => getPauseContainer().firstElementChild.remove()