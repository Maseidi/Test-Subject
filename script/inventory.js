import { equipTorch, unequipTorch } from './actions.js'
import {
    getCurrentRoomEnemies,
    getCurrentRoomInteractables,
    getHealButton,
    getPauseContainer,
    getPlayer,
    getReloadButton,
    getSlotsContainer,
    getThrowButton,
    getUiEl,
} from './elements.js'
import { getInteractables, getPopups } from './entities.js'
import { getGunDetails, isGun } from './gun-details.js'
import { renderStats } from './gun-examine.js'
import { renderGun } from './gun-loader.js'
import { NOTE } from './loot.js'
import { getPasswords } from './password-manager.js'
import { useAntidote, useBandage, useHealthPotion, useVaccine } from './player-health.js'
import { useAdrenaline } from './player-movement.js'
import { useEnergyDrink } from './player-sprint.js'
import { Popup } from './popup-manager.js'
import {
    activateAllProgresses,
    deactivateAllProgresses,
    getProgressValueByNumber,
    toggleDoor,
} from './progress-manager.js'
import { renderInteractable } from './room-loader.js'
import { IS_MOBILE } from './script.js'
import { playClickSoundEffect } from './sound-manager.js'
import { isThrowable } from './throwable-details.js'
import { renderThrowable } from './throwable-loader.js'
import { quitPage, renderQuit, renderReloadButton, renderSlots, renderThrowButton } from './user-interface.js'
import {
    addAllAttributes,
    addClass,
    appendAll,
    containsClass,
    createAndAddClass,
    element2Object,
    exitAimModeAnimation,
    getEquippedItemDetail,
    isStatUpgrader,
    isThrowing,
    nextId,
    object2Element,
    removeClass,
    removeEquipped,
} from './util.js'
import {
    getAimMode,
    getCriticalChance,
    getCurrentRoomId,
    getDraggedItem,
    getElementInteractedWith,
    getEquippedTorchId,
    getEquippedWeaponId,
    getHealth,
    getIsSurvival,
    getMaxHealth,
    getMaxStamina,
    getMouseX,
    getMouseY,
    getPause,
    getPlayerSpeed,
    getPlayerX,
    getPlayerY,
    getReloading,
    getRoomLeft,
    getRoomTop,
    getShooting,
    getWeaponWheel,
    setAimMode,
    setDraggedItem,
    setEquippedTorchId,
    setEquippedWeaponId,
    setShootCounter,
    setWeaponWheel,
} from './variables.js'
import { useLuckPills } from './weapon-manager.js'

export const MAX_PACKSIZE = {
    coin: 50,
    stick: 1,
    bandage: 3,
    grenade: 2,
    lighter: 1,
    smgAmmo: 90,
    antidote: 3,
    luckpills: 1,
    hardDrive: 2,
    flashbang: 3,
    rifleAmmo: 10,
    magnumAmmo: 5,
    adrenaline: 1,
    redvaccine: 3,
    pistolAmmo: 30,
    energydrink: 1,
    bluevaccine: 3,
    healthpotion: 1,
    greenvaccine: 3,
    yellowvaccine: 3,
    purplevaccine: 3,
    shotgunShells: 20,
}

let inventory = null
export const setInventory = val => {
    inventory = val
}
export const getInventory = () => inventory

export const initInventory = () => [
    [null, null, null, null],
    [null, null, null, null],
    ['locked', 'locked', 'locked', 'locked'],
    ['locked', 'locked', 'locked', 'locked'],
    ['locked', 'locked', 'locked', 'locked'],
    ['locked', 'locked', 'locked', 'locked'],
]

let dropElem
let dropObject
export const pickupDrop = drop => {
    if (drop.lastElementChild && containsClass(drop.lastElementChild, 'not-ideal')) return
    dropElem = drop
    dropObject = element2Object(dropElem)
    searchPack()
    searchEmpty()
    checkSpecialScenarios()
    handleVaccinePickup(dropObject)
    updateInteractablePopups()
    handleBandageFirstTimePickup()
    if (countItem('bandage') > 0 && getHealth() < getMaxHealth()) removeClass(getHealButton(), 'disabled')
}

const searchPack = () => {
    const pack = MAX_PACKSIZE[dropObject.name] || 1
    let found = false
    for (let i = 0; i < inventory.length; i++) {
        for (let j = 0; j < inventory[i].length; j++) {
            const item = inventory[i][j]
            if (item && item.name === dropObject.name && item.amount !== pack && !found) {
                let diff = Math.min(pack, item.amount + dropObject.amount) - item.amount
                handleThrowablePickup()
                item.amount += diff
                updateAmount(dropObject.amount - diff)
                found = true
            }
        }
    }
    if (found && dropObject.amount !== 0) searchPack()
}

const searchEmpty = () => {
    if (dropObject.amount === 0) return
    const pack = MAX_PACKSIZE[dropObject.name] || 1
    for (let i = 0; i < inventory.length; i++) {
        for (let j = 0; j < inventory[i].length; j++) {
            const item = inventory[i][j]
            if (item === null && j + dropObject.space <= 4) {
                let skip = false
                for (let k = 1; k < dropObject.space; k++) if (inventory[i][j + k] !== null) skip = true
                if (skip) continue
                let diff = Math.min(pack, dropObject.amount)
                handleThrowablePickup()
                inventory[i][j] = { ...dropObject, amount: diff, row: i, column: j }
                for (let k = 1; k < dropObject.space; k++) inventory[i][j + k] = 'taken'
                updateAmount(dropObject.amount - diff)
                if (dropObject.amount > 0 && inventoryFull()) return
                searchEmpty()
                return
            }
        }
    }
}

export const isEnoughSpace = (name, space) => Boolean(anyPackNotFilled(name) || anySpaceLeft(space))

const anyPackNotFilled = name =>
    inventory.flat().find(item => item?.name === name && item.amount < (MAX_PACKSIZE[item.name] || 1))

const anySpaceLeft = space => {
    const expected = new Array(space).fill('null').reduce((a, b) => a + b, '')
    const actual = inventory
        .flat()
        .map((elem, index) => (index % 4 === 0 ? '|' + String(elem) : String(elem)))
        .reduce((a, b) => a + b, '')
    return actual.includes(expected)
}

const handleThrowablePickup = () => {
    if (!isThrowable(dropObject.name)) return
    const throwable = inventory.flat().find(item => item?.name === dropObject.name)
    if (!throwable) return
    const interactable = getCurrentRoomInteractables().find(int => int.id === dropObject.id)
    dropObject.id = throwable.id
    dropElem.setAttribute('id', throwable.id)
    if (interactable) interactable.id = throwable.id
}

const checkSpecialScenarios = () => {
    const { amount, progress2active, progress2deactive, id, name } = dropObject

    if (amount === 0) {
        if (progress2active) activateAllProgresses(progress2active)
        if (progress2deactive) deactivateAllProgresses(progress2deactive)
        if ((name === 'stick' && countItem('lighter') > 0) || (name === 'lighter' && countItem('stick') > 0)) {
            if (!getProgressValueByNumber('1000000')) {
                getPopups().push(new Popup('<span>Q</span> Light up torch', { renderProgress: '1000000' }, 3000))
                activateAllProgresses('1000000')
            }
        }
    }
    if ((isThrowable(name) && !getWeaponWheel().includes(id)) || (isGun(name) && amount === 0)) updateWeaponWheel()
    if (getPause()) return
    if (amount === 0) removeDrop(dropElem)
    ammo4Equipped()
    handleWeaponPickup()
}

const handleVaccinePickup = itemObj =>
    handleVaccineTransportation(itemObj, countItem(dropObject.name) !== 0, removeClass)

export const updateInteractablePopups = () => getCurrentRoomInteractables()?.forEach(updateInteractablePopup)

export const updateInteractablePopup = interactable => {
    if (Array.from(interactable.classList).includes('enemy-backward-detector')) return
    if (interactable.getAttribute('name') === 'door') return
    const { space, name } = element2Object(interactable)
    const popup = interactable.lastElementChild
    if (isEnoughSpace(name, space)) removeClass(popup, 'not-ideal')
    else addClass(popup, 'not-ideal')
}

const handleBandageFirstTimePickup = () => {
    if (getIsSurvival()) return
    if (getProgressValueByNumber('1000001')) return
    if (countItem('bandage') === 0) return
    getPopups().push(new Popup('<span>H</span> Use bandage to heal', { renderProgress: '1000001' }, 3000))
    activateAllProgresses('1000001')
}

const ammo4Equipped = () => {
    if (!getEquippedWeaponId()) return
    const equipped = findEquippedWeaponById()
    ammo4EquippedWeapon(equipped)
    ammo4EquippedThrowable(equipped)
}

const ammo4EquippedWeapon = equipped => {
    if (!isGun(equipped.name)) return
    if (dropObject.name !== getGunDetails().get(equipped.name).ammotype) return
    const ammoCount = getUiEl().children[2].children[1]
    const totalAmmo = ammoCount.children[1]
    totalAmmo.textContent = calculateTotalAmmo()
    getReloadButton()?.remove()
    if (IS_MOBILE) renderReloadButton()
}

const ammo4EquippedThrowable = equipped => {
    if (!isThrowable(equipped.name)) return
    if (dropObject.name !== equipped.name) return
    const ammoCount = getUiEl().children[2].children[1]
    ammoCount.firstElementChild.textContent = calculateThrowableAmount(equipped)
}

const handleWeaponPickup = () => {
    if ((isGun(dropObject.name) || isThrowable(dropObject.name)) && IS_MOBILE) {
        getSlotsContainer()?.remove()
        renderSlots()
        getThrowButton()?.remove()
        renderThrowButton()
    }
}

const inventoryFull = () => inventory.flat().every(item => item !== null)

export const findEquippedWeaponById = () => inventory.flat().find(item => item?.id === getEquippedWeaponId())

export const findEquippedTorchById = () => inventory.flat().find(item => item?.id === getEquippedTorchId())

export const calculateTotalAmmo = () => countItem(findEquippedWeaponById().ammotype)

export const calculateThrowableAmount = itemObj =>
    itemObj ? countItem(itemObj.name) : countItem(findEquippedWeaponById().name)

export const countItem = name =>
    inventory
        .flat()
        .filter(item => item && item.name === name)
        .reduce((a, b) => a + b.amount, 0)

export const useInventoryResource = (name, reduce) => {
    for (let i = inventory.length - 1; i >= 0; i--)
        for (let j = inventory[i].length - 1; j >= 0; j--)
            if (reduce !== 0 && inventory[i][j] && inventory[i][j].name === name)
                reduce -= useItemAtPosition(i, j, reduce)
}

export const useItemAtPosition = (row, column, reduce) => {
    const itemAmount = inventory[row][column].amount
    const diff = itemAmount <= reduce ? itemAmount : reduce
    const name = inventory[row][column].name
    inventory[row][column].amount -= diff
    const space = inventory[row][column].space
    if (inventory[row][column].amount === 0) {
        inventory[row][column] = null
        for (let i = 1; i < space; i++) if (inventory[row][column + i] === 'taken') inventory[row][column + i] = null
    }
    handleVaccineDrop({ name })
    updateInteractablePopups()
    return diff
}

export const updateInventoryWeaponMag = newMag => (findEquippedWeaponById().currmag = newMag)

const updateAmount = newValue => {
    dropElem.setAttribute('amount', newValue)
    dropObject.amount = newValue
    if (dropElem.children.length === 0) return
    dropElem.children[1].firstElementChild.textContent = `${newValue} ${dropElem.getAttribute('heading')}`
    getInteractables().set(
        getCurrentRoomId(),
        getInteractables()
            .get(getCurrentRoomId())
            .map(int => {
                return int.id === Number(dropElem.getAttribute('id'))
                    ? {
                          ...int,
                          amount: newValue,
                      }
                    : int
            }),
    )
}

export const removeDrop = drop => {
    drop.remove()
    getInteractables().set(
        getCurrentRoomId(),
        getInteractables()
            .get(getCurrentRoomId())
            .filter(elem => elem.id !== Number(drop.id)),
    )
}

const updateWeaponWheel = () => {
    const index = getWeaponWheel().findIndex(item => item === null)
    getWeaponWheel()[index] = dropObject.id
}

export const upgradeInventory = () => {
    const index = inventory.flat().findIndex(block => block === 'locked')
    const row = Math.floor(index / 4)
    const column = index % 4
    inventory[row][column] = null
    inventory[row][column + 1] = null
}

export const upgradeWeaponStat = (name, stat) => {
    const weapon = inventory.flat().find(item => item && item.name === name)
    inventory[weapon.row][weapon.column][stat + 'lvl'] += 1
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

export const renderBlocks = replace => {
    const inventoryContainer = createAndAddClass('div', 'inventory-container')
    const inventoryEl = createAndAddClass('div', 'inventory')
    inventory.forEach(row => {
        row.forEach(block => {
            const theBlock = ['taken', 'locked'].includes(block) ? document.createElement('div') : object2Element(block)
            addClass(theBlock, 'block')
            let skip = false
            if (block === 'taken') skip = true
            else if (block === null || block === 'locked') theBlock.style.width = `25%`
            else {
                theBlock.style.width = `${block.space * 25}%`
                const amount = createAndAddClass('div', 'amount')
                const amountText = document.createElement('p')
                if (block.name === 'stick') amountText.textContent = `${block.health}`
                else if (!isGun(block.name)) amountText.textContent = `${block.amount}`
                else amountText.textContent = `${block.currmag}`
                amount.append(amountText)
                theBlock.append(amount)
            }
            if (!skip) {
                inventoryEl.append(theBlock)
                if (block === 'locked') theBlock.style.backgroundColor = `rgba(255, 0, 0, 0.1)`
                if (block === null || block === 'locked') return
                const image = document.createElement('img')
                image.src = `../assets/images/${block.name}.png`
                theBlock.append(image)
            }
        })
    })
    inventoryContainer.append(inventoryEl)
    if (replace) replace.replaceWith(inventoryContainer)
    else {
        const background = getPauseContainer().firstElementChild
        background.append(inventoryContainer)
    }
}

export const renderHeadingAndDescription = root => {
    const desc = createAndAddClass('div', 'description')
    const heading = document.createElement('h2')
    const paragraph = document.createElement('p')
    appendAll(desc, heading, paragraph)
    if (root) root.append(desc)
    else {
        const background = getPauseContainer().firstElementChild
        background.firstElementChild.append(desc)
    }
}

const inventoryEvents = () => {
    const background = getPauseContainer().firstElementChild
    Array.from(background.firstElementChild.firstElementChild.children)
        .filter(block => block.getAttribute('heading') && block.getAttribute('description'))
        .forEach(item => {
            renderDescriptionEvent(item)
            removeDescriptionEvent(item)
            optionsEvents(item)
        })
}

export const renderDescriptionEvent = item => {
    const itemObj = element2Object(item)
    item.addEventListener('mouseenter', renderDescriptionContent, true)
    item.heading = `${itemObj.heading}`
    item.description = `${itemObj.description}`
    item.isNote = itemObj.name === NOTE
    item.isExamined = itemObj.examined
}

const renderDescriptionContent = e => {
    if (e.target !== e.currentTarget) return
    const descContainer = getPauseContainer().firstElementChild.firstElementChild.children[1]
    const { heading, description, isNote, isExamined } = e.currentTarget
    if (heading) descContainer.firstElementChild.textContent = isNote && !isExamined ? 'Note' : heading
    if (description) {
        let desc = description
        if (isNote && !isExamined) desc = '????'
        if (heading === 'adrenaline')
            desc =
                description +
                `. Current Movement Speed: ${getPlayerSpeed().toFixed(1)}, Lvl ${Math.ceil(
                    (getPlayerSpeed() - 5) * 10,
                )}`
        if (heading === 'health potion')
            desc = description + `. Current Max Health: ${getMaxHealth()}, Lvl ${(getMaxHealth() - 100) / 10}`
        if (heading === 'luck pills')
            desc =
                description +
                `. Current Critical Chance: ${(getCriticalChance() * 100).toFixed(1)}%, Lvl ${(
                    (getCriticalChance() * 100 - 1) /
                    1.9
                ).toFixed()}`
        if (heading === 'energy drink')
            desc = description + `. Current Max Stamina: ${getMaxStamina()}, Lvl ${(getMaxStamina() - 600) / 60}`
        descContainer.children[1].textContent = desc
    }
}

export const removeDescriptionEvent = item => {
    item.addEventListener('mouseleave', removeDescriptionContent, true)
}

const removeDescriptionContent = e => {
    if (e.target !== e.currentTarget) return
    const descContainer = getPauseContainer().firstElementChild.firstElementChild.children[1]
    descContainer.firstElementChild.textContent = ``
    descContainer.children[1].textContent = ``
}

const optionsEvents = item => item.addEventListener('click', addOptionsEvent, true)

const addOptionsEvent = e => {
    playClickSoundEffect()
    const target = e.currentTarget
    const options = createAndAddClass('div', 'options')
    renderOptions(target, options)
    target.addEventListener('mouseleave', () => options.remove())
    target.append(options)
}

const renderOptions = (item, options) => {
    if (item.children[2]) return
    let renderDropOption = true

    const itemObj = element2Object(item)

    if (
        ['bandage', 'antidote'].includes(itemObj.name) ||
        isStatUpgrader(itemObj) ||
        itemObj.name.includes('vaccine') ||
        itemObj.name.includes('key')
    )
        createOption(options, 'use')

    const allowSitchGun = !getShooting() && !getReloading()

    if (itemObj.name === 'stick' && countItem('lighter') > 0) if (allowSitchGun) createOption(options, 'equip')

    if (isThrowable(itemObj.name)) {
        if (allowSitchGun) createOption(options, 'equip')
        if (isThrowing()) renderDropOption = false
        createOption(options, 'shortcut')
    }

    if (isGun(itemObj.name)) {
        if (getEquippedWeaponId() && itemObj.name === findEquippedWeaponById()?.name) {
            if (getReloading() || getShooting()) renderDropOption = false
        } else {
            if (allowSitchGun) createOption(options, 'equip')
        }
        createOption(options, 'shortcut')
        createOption(options, 'examine')
    }

    if (itemObj.name === 'note') createOption(options, 'examine')

    if (getReloading()) if (itemObj.name === findEquippedWeaponById().ammotype) renderDropOption = false

    createOption(options, 'replace')

    if (renderDropOption) createOption(options, 'drop')
}

const replace = item => {
    const itemObj = element2Object(item)
    if (itemObj.remove !== 1) for (let k = 0; k < itemObj.space; k++) inventory[itemObj.row][itemObj.column + k] = null
    setDraggedItem(item)
    removeInventory()
    renderInventory()
    if (IS_MOBILE) item.children[2]?.remove()
    item.removeEventListener('click', addOptionsEvent, true)
    if (itemObj.amount !== 0) {
        const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
        blocks.append(item)
        addClass(item, 'block')
        item.style.position = IS_MOBILE ? 'absolute' : `fixed`
        item.style.height = `70px`
        item.style.width = `${itemObj.space * 100}px`
        item.style.left = IS_MOBILE ? `-${itemObj.space * 100}px` : `${getMouseX() + 10}px`
        item.style.top = IS_MOBILE ? '0' : `${getMouseY() - 35}px`
        item.style.zIndex = `10`
        item.setAttribute('remove', 0)
        renderGrid()
        return
    }
    setDraggedItem(null)
}

const renderGrid = () => {
    const grid = createAndAddClass('div', 'grid')
    for (let i = 0; i < inventory.length; i++) {
        for (let j = 0; j < inventory[i].length; j++) {
            const item = inventory[i][j]
            const block = object2Element({ row: i, column: j })
            if (
                item &&
                item.name === getDraggedItem().getAttribute('name') &&
                MAX_PACKSIZE[item.name] >= item.amount + Number(getDraggedItem().getAttribute('amount'))
            )
                addClass(block, 'combine')
            block.addEventListener('click', checkReplace, true)
            grid.append(block)
        }
    }
    getPauseContainer().firstElementChild.firstElementChild.firstElementChild.append(grid)
}

const checkReplace = e => {
    playClickSoundEffect()
    const destObj = element2Object(e.target)
    const item = inventory[destObj.row][destObj.column]
    if (item === 'locked') return
    const srcObj = element2Object(getDraggedItem())
    let state = getReplacementState(item, destObj, srcObj)
    if (state !== -1) REPLACE_STATES.get(state)(destObj, srcObj)
}

const getReplacementState = (item, destObj, srcObj) => {
    if (item !== null && item !== 'taken') {
        let possible = true
        for (let k = destObj.column + 1; k < destObj.column + srcObj.space; k++)
            if (k >= 4 || (inventory[destObj.row][k] !== 'taken' && inventory[destObj.row][k] !== null)) {
                possible = false
                break
            }
        if (possible) return 1
    } else if (item !== null && item === 'taken') {
        let possible = true
        for (let k = destObj.column + 1; k < destObj.column + srcObj.space; k++)
            if (k >= 4 || (inventory[destObj.row][k] !== 'taken' && inventory[destObj.row][k] !== null)) {
                possible = false
                break
            }
        if (possible) return 2
    } else if (item === null) {
        let possible = true
        let itemCount = 0
        for (let k = destObj.column + 1; k < destObj.column + srcObj.space; k++) {
            if (!possible) break
            if (k >= 4) possible = false
            if (possible && inventory[destObj.row][k] !== 'taken' && inventory[destObj.row][k] !== null) itemCount++
            if (itemCount > 1) possible = false
        }
        if (possible) return 3
    }
    return -1
}

const destOnItem = (destObj, srcObj) => {
    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    const elem2Replace = Array.from(blocks.children).find(
        x => x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === destObj.column + '',
    )
    if (combine(elem2Replace, destObj, srcObj, inventory) === 1) return
    elem2Replace.setAttribute('remove', 0)
    replace(elem2Replace)
    inventory[destObj.row][destObj.column] = { ...srcObj, row: destObj.row, column: destObj.column }
    for (let k = 1; k < Math.max(srcObj.space, inventory[destObj.row][destObj.column].space); k++) {
        if (k < srcObj.space) inventory[destObj.row][destObj.column + k] = 'taken'
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
    if (object2Replace.name === srcObj.name && srcAmount + destAmount <= pack) {
        const newDestAmount = Math.min(srcAmount + destAmount, pack)
        const diff = newDestAmount - destAmount
        const newSrcAmount = srcAmount - diff
        inventory[destObj.row][destObj.column] = {
            ...srcObj,
            row: destObj.row,
            column: destObj.column,
            amount: newDestAmount,
        }
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
    for (let k = destObj.column; ; k--) {
        if (inventory[destObj.row][k] !== null && inventory[destObj.row][k] !== 'taken') break
        count++
    }
    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    const elem2Replace = Array.from(blocks.children).find(
        x => x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === destObj.column - count + '',
    )
    elem2Replace.setAttribute('remove', 0)
    replace(elem2Replace)
    inventory[destObj.row][destObj.column] = { ...srcObj, row: destObj.row, column: destObj.column }
    for (let k = 1; k < srcObj.space; k++) inventory[destObj.row][destObj.column + k] = 'taken'
    elem2Replace.setAttribute('remove', 1)
    replace(elem2Replace)
}

const destOnEmpty = (destObj, srcObj) => {
    let count = 0
    for (let k = destObj.column; ; k++) {
        if (inventory[destObj.row][k] !== null && inventory[destObj.row][k] !== 'taken') break
        if (k === destObj.column + srcObj.space) break
        count++
    }
    if (count === srcObj.space) destCompleteEmpty(destObj, srcObj)
    else destHalfEmpty(destObj, srcObj, count)
}

const destCompleteEmpty = (destObj, srcObj) => {
    inventory[destObj.row][destObj.column] = { ...srcObj, row: destObj.row, column: destObj.column }
    for (let k = 1; k < srcObj.space; k++) inventory[destObj.row][destObj.column + k] = 'taken'
    removeInventory()
    renderInventory()
    setDraggedItem(null)
}

const destHalfEmpty = (destObj, srcObj, count) => {
    const blocks = getPauseContainer().firstElementChild.firstElementChild.firstElementChild
    const elem2Replace = Array.from(blocks.children).find(
        x => x.getAttribute('row') === destObj.row + '' && x.getAttribute('column') === destObj.column + count + '',
    )
    elem2Replace.setAttribute('remove', 0)
    replace(elem2Replace)
    inventory[destObj.row][destObj.column] = { ...srcObj, row: destObj.row, column: destObj.column }
    for (let k = 1; k < srcObj.space; k++) inventory[destObj.row][destObj.column + k] = 'taken'
    elem2Replace.setAttribute('remove', 1)
    replace(elem2Replace)
}

const REPLACE_STATES = new Map([
    [1, destOnItem],
    [2, destOnTaken],
    [3, destOnEmpty],
])

const USE_MAP = new Map([
    ['bandage', useBandage],
    ['antidote', useAntidote],
    ['redvaccine', useVaccine],
    ['bluevaccine', useVaccine],
    ['luckpills', useLuckPills],
    ['greenvaccine', useVaccine],
    ['adrenaline', useAdrenaline],
    ['yellowvaccine', useVaccine],
    ['purplevaccine', useVaccine],
    ['energydrink', useEnergyDrink],
    ['healthpotion', useHealthPotion],
])

const use = item => {
    const itemObj = element2Object(item)
    let itemFromInventory = inventory[itemObj.row][itemObj.column]
    if (isUsableKey(itemFromInventory)) return
    getPauseContainer().firstElementChild.remove()
    USE_MAP.get(itemFromInventory.name)(itemFromInventory)
    if (itemFromInventory.amount === 0) {
        handleVaccineDrop(itemFromInventory)
        inventory[itemObj.row][itemObj.column] = null
    }
    renderInventory()
}

const isUsableKey = itemObj => {
    if (!itemObj.name.includes('key')) return false
    const neededKey = getElementInteractedWith()?.getAttribute('key')
    if (!neededKey || itemObj.unlocks !== neededKey) return true
    quitPage()
    toggleDoor(getElementInteractedWith())
    return true
}

const equip = item => {
    getPauseContainer().firstElementChild.remove()
    const itemObj = element2Object(item)
    if (itemObj.name === 'stick') equipTorchFromInventory(itemObj)
    else equipWeaponFromInventory(itemObj)
    renderInventory()
}

const equipTorchFromInventory = itemObj => {
    if (getEquippedTorchId() === itemObj.id) return
    unequipTorch()
    setEquippedTorchId(itemObj.id)
    equipTorch()
}

const equipWeaponFromInventory = itemObj => {
    const row = itemObj.row
    const column = itemObj.column
    setEquippedWeaponId(inventory[row][column].id)
    const equipped = findEquippedWeaponById()
    unequipTorch()
    setShootCounter(getEquippedItemDetail(equipped, 'firerate') * 60)
    equipWeaponFromInventoryOnAimMode(equipped.name)
}

const equipWeaponFromInventoryOnAimMode = name => {
    if (!getAimMode()) return
    exitAimModeAnimation()
    removeEquipped()
    if (isGun(name)) equipGunFromInventoryOnAimMode()
    else if (isThrowable(name)) equipThrowableFromInventoryOnAimMode()
}

const equipGunFromInventoryOnAimMode = () => {
    addClass(getPlayer(), 'aim')
    renderGun()
}

const equipThrowableFromInventoryOnAimMode = () => {
    addClass(getPlayer(), 'throwable-aim')
    renderThrowable()
}

const shortcut = item => {
    const weaponWheel = getPauseContainer().firstElementChild.children[1].firstElementChild
    Array.from(weaponWheel.children).forEach((slot, index) => {
        addClass(slot, 'selectable-slot')
        addAllAttributes(slot, 'selected-weapon', item.id, 'slot-num', index)
        slot.addEventListener('click', selectAsSlot)
    })
    item.children[2].remove()
}

const selectAsSlot = e => {
    playClickSoundEffect()
    const targetSlotNum = Number(e.target.getAttribute('slot-num'))
    const slotWeaponId = getWeaponWheel()[targetSlotNum]
    const selectedId = Number(e.target.getAttribute('selected-weapon'))
    const selectedSlotNum = getWeaponWheel().findIndex(x => x === selectedId)
    getWeaponWheel()[targetSlotNum] = selectedId
    getWeaponWheel()[selectedSlotNum] = slotWeaponId
    removeInventory()
    renderInventory()
}

const drop = item => {
    const itemObj = element2Object(item)
    const left = Math.floor(getPlayerX() - getRoomLeft())
    const top = Math.floor(getPlayerY() - getRoomTop())
    let interactable = { ...itemObj, renderProgress: String(Number.MAX_SAFE_INTEGER), left: left, top: top }
    if (
        getInteractables()
            .get(getCurrentRoomId())
            .find(elem => elem.id === interactable.id)
    )
        interactable = { ...interactable, id: nextId() }
    getPauseContainer().firstElementChild.remove()
    getInteractables().get(getCurrentRoomId()).push(interactable)
    dropFromInventory(itemObj)
    handleVaccineDrop(itemObj)
    renderInteractable(interactable)
    handleEquippableDrop(itemObj)
    handleTorchDrop(itemObj)
    renderInventory()
}

const dropFromInventory = itemObj => {
    const row = itemObj.row
    const column = itemObj.column
    inventory[row][column] = null
    if (inventory[row][column] === null && column + itemObj.space <= 4)
        for (let k = 1; k < itemObj.space; k++) inventory[row][column + k] = null
}

const handleVaccineDrop = itemObj => handleVaccineTransportation(itemObj, countItem(itemObj.name) === 0, addClass)

const handleVaccineTransportation = (itemObj, predicate, callbackFn) => {
    if (!itemObj.name.includes('vaccine')) return
    const virus = itemObj.name.replace('vaccine', '')
    getCurrentRoomEnemies().forEach(enemy => {
        const body = enemy.sprite.firstElementChild.firstElementChild
        if (body.style.backgroundColor !== virus) return
        const popup = enemy.sprite.firstElementChild.lastElementChild.firstElementChild
        if (popup && predicate) callbackFn(popup, 'not-ideal')
    })
}

export const handleEquippableDrop = itemObj => {
    handleGunDrop(itemObj)
    handleThrowableDrop(itemObj)
}

const handleGunDrop = itemObj => {
    if (!isGun(itemObj.name)) return
    dropFromWeaponWheel(itemObj)
}

const handleThrowableDrop = itemObj => {
    if (!isThrowable(itemObj.name)) return
    if (calculateThrowableAmount(itemObj) !== 0) return
    dropFromWeaponWheel(itemObj)
}

const handleTorchDrop = itemObj => {
    if (getEquippedTorchId() === itemObj.id) unequipTorch()
}

const dropFromWeaponWheel = itemObj => {
    if (getEquippedWeaponId() === itemObj.id) {
        setEquippedWeaponId(null)
        exitAimModeAnimation()
        removeEquipped()
        setAimMode(false)
    }
    setWeaponWheel(getWeaponWheel().map(weapon => (weapon === itemObj.id ? null : weapon)))
}

const examine = item => {
    const itemObj = element2Object(item)
    if (isGun(itemObj.name)) renderStats(itemObj)
    else if (itemObj.name === 'note') renderNote(item, itemObj)
    if (itemObj.onexamine) activateAllProgresses(itemObj.onexamine)
}

const renderNote = (item, itemObj) => {
    const noteContainer = createAndAddClass('div', 'note-container', 'ui-theme')
    const note = createAndAddClass('div', 'note')
    note.innerHTML = itemObj.data.replace('PLACE_CODE_HERE', getPasswords().get(itemObj.code))
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
    elem.addEventListener('click', e => {
        e.stopPropagation()
        playClickSoundEffect()
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
    if (weaponName) {
        const image = document.createElement('img')
        image.src = `../assets/images/${weaponName}.png`
        slot.append(image)
    } else slot.style.width = `70px`
}

const findWeaponName = slots =>
    inventory.flat().find(item => item && item.id === getWeaponWheel()[4 - slots])?.name ??
    (getDraggedItem()?.getAttribute('id') === getWeaponWheel()[4 - slots] + ''
        ? getDraggedItem()?.getAttribute('name')
        : null)

const addText2WeaponWheelOption = slots =>
    getEquippedWeaponId() && 4 - slots === getWeaponWheel().findIndex(x => x === getEquippedWeaponId())
        ? 'E'
        : `${5 - slots}`

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
    updateInteractablePopups()
}
