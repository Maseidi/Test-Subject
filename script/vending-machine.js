import { Drop, interactables } from "./interactables.js"
import { renderQuit } from "./user-interface.js"
import { getPauseContainer } from "./elements.js"
import { renderStats } from "./weapon-examine.js"
import { getStat, getWeaponSpecs } from "./weapon-specs.js"
import { getCurrentRoomId, getProgressCounter, setIntObj } from "./variables.js"
import { getShopItems, getShopItemsWithId } from "./shop-item.js"
import { calculateTotalCoins, getInventory, inventoryHasSpace, pickupDrop, upgradeInventory, upgradeWeaponStat, useInventoryResource } from "./inventory.js"
import { 
    addAttribute,
    addClass,
    appendAll,
    createAndAddClass,
    elementToObject,
    objectToElement } from "./util.js"

let page = 1
export const renderStore = () => {
    renderBackground()
    renderCoins()
    renderPagination()
    renderPageContainer()
    renderBuy()
    renderUpgrade()
    renderSell()
    renderQuit()
}

const renderBackground = () => {
    const background = createAndAddClass('div', 'store-ui', 'ui-theme')
    getPauseContainer().append(background)
}

const renderCoins = () => {
    const coinContainer = createAndAddClass('div', 'coin-container')
    const coin = createAndAddClass('img', 'coin-img')
    coin.src = '../assets/images/coin.png'
    const amount = createAndAddClass('p', 'coin-amount')
    amount.textContent = calculateTotalCoins()
    appendAll(coinContainer, coin, amount)
    getPauseContainer().firstElementChild.append(coinContainer)
}

const renderPagination = () => {
    const paginationContainer = createAndAddClass('div', 'pagination-container')
    const buy = createAndAddClass('div', 'buy-page')
    if ( page === 1 ) addClass(buy, 'active-page')
    buy.textContent = `buy`
    addAttribute(buy, 'page', 1)
    buy.addEventListener('click', changePage)
    const upgrade = createAndAddClass('div', 'upgrade-page')
    if ( page === 2 ) addClass(upgrade, 'active-page')
    upgrade.textContent = `upgrade`
    addAttribute(upgrade, 'page', 2)
    upgrade.addEventListener('click', changePage)
    const sell = createAndAddClass('div', 'sell-page')
    if ( page === 3 ) addClass(sell, 'active-page')
    sell.textContent = `sell`
    addAttribute(sell, 'page', 3)
    sell.addEventListener('click', changePage)
    appendAll(paginationContainer, buy, upgrade, sell)
    getPauseContainer().firstElementChild.append(paginationContainer)
}

const changePage = (e) => {
    const pageNum = Number(e.target.getAttribute('page'))
    page = pageNum
    removeStore()
    renderStore()
}

const renderPageContainer = () => {
    const pageContainer = createAndAddClass('div', 'page-container')
    getPauseContainer().firstElementChild.append(pageContainer)
}

const renderBuy = () => {
    if ( page !== 1 ) return
    const buy = createAndAddClass('div', 'buy')
    const items = renderBuyItems()
    appendAll(buy, ...items)
    getPauseContainer().firstElementChild.children[2].append(buy)
}

const renderBuyItems = () => {
    return getShopItemsWithId()
    .filter(item => !item.sold)
    .filter(item => getProgressCounter() >= item.progress)
    .map((item) => {
        const buyItem = objectToElement(item)
        addClass(buyItem, 'buy-item')
        const wrapper = createAndAddClass('div', 'buy-wrapper')
        const img = createAndAddClass('img', 'buy-item-img')
        img.src = `../assets/images/${item.name}.png` 
        const name = createAndAddClass('p', 'buy-item-name')
        name.textContent = `${item.heading}`
        const amount = createAndAddClass('p', 'buy-item-amount')
        amount.textContent = `${item.amount}`
        const price = createAndAddClass('p', 'buy-item-price')
        price.textContent = `${item.price}`
        const buyItemCoin = createAndAddClass('img', 'buy-item-coin')
        buyItemCoin.src = `../assets/images/coin.png` 
        const info = createAndAddClass('div', 'info')
        const left = createAndAddClass('div', 'left')
        const right = createAndAddClass('div', 'right')
        buyItem.addEventListener('click', buyPopup)
        appendAll(left, name, amount)
        appendAll(right, price, buyItemCoin)
        appendAll(info, left, right)
        appendAll(wrapper, img, info)
        appendAll(buyItem, wrapper)
        return buyItem
    })
}

const buyPopup = (e) => {
    const itemObj = elementToObject(e.currentTarget)
    const popupContainer = createAndAddClass('div', 'popup-container', 'ui-theme')
    const popup = createAndAddClass('div', 'buy-popup')
    const title = createAndAddClass('h2', 'buy-popup-title')
    title.textContent = `purchase item?`
    const image = createAndAddClass('img', 'buy-popup-img')
    image.src = `../assets/images/${itemObj.name}.png`
    const heading = createAndAddClass('h2', 'buy-popup-heading')
    const imageHeading = createAndAddClass('div', 'buy-heading-container')
    appendAll(imageHeading, image, heading)
    if (getWeaponSpecs().get(itemObj.name) || itemObj.name === 'pouch') heading.textContent = `${itemObj.heading}`
    else heading.textContent = `${itemObj.amount} ${itemObj.heading}`
    const description = createAndAddClass('p', 'buy-popup-description')
    description.textContent = `${itemObj.description}`
    const btnContainer = createAndAddClass('div', 'buy-popup-btn-container')
    const cancel = createCancelBtn(itemObj)
    btnContainer.append(cancel)
    createExamineBtn(itemObj, btnContainer)
    const confirm = createConfirmBtn(itemObj)
    btnContainer.append(confirm)
    const message = createAndAddClass('p', 'buy-message')
    appendAll(popup, title, imageHeading, description, btnContainer, message)
    popupContainer.append(popup)
    getPauseContainer().firstElementChild.append(popupContainer)
}


const createCancelBtn = () => {
    const cancel = createAndAddClass('button', 'buy-popup-cancel')
    cancel.textContent = `cancel`
    cancel.addEventListener('click', (e) => e.target.parentElement.parentElement.parentElement.remove())
    return cancel
}

const createExamineBtn = (itemObj, btnContainer) => {
    if ( getWeaponSpecs().get(itemObj.name) ) {
        const examine = createAndAddClass('button', 'buy-popup-examine')
        examine.textContent = `examine`
        examine.addEventListener('click', () => renderStats({
            ...getWeaponSpecs().get(itemObj.name), 
            name: itemObj.name, damagelvl: 1, fireratelvl: 1, reloadspeedlvl: 1, magazinelvl:1, rangelvl: 1
        }))
        btnContainer.append(examine)
    }
}

const createConfirmBtn = (itemObj) => {
    const confirm = createAndAddClass('button', 'buy-popup-confirm')
    const img = document.createElement('img')
    img.src = `../assets/images/coin.png`
    const p = document.createElement('p')
    p.textContent = `${itemObj.price}` 
    appendAll(confirm, img, p)
    confirm.addEventListener('click', () => {
        if ( !checkEnoughCoins(itemObj) ) return
        if ( itemObj.name !== 'pouch' && !inventoryHasSpace(itemObj) ) {
            addMessage('no enough space')
            return
        }
        managePurchase(itemObj)
    })
    return confirm
}

const checkEnoughCoins = (itemObj) => {
    const result = calculateTotalCoins() >= itemObj.price
    if ( !result ) addMessage('no enough cash')
    return result
}

const addMessage = (input) => {
    const message = getPauseContainer().firstElementChild.children[4].firstElementChild.lastElementChild
    message.textContent = input
    addClass(message, 'buy-message-animation')
}

const managePurchase = (itemObj) => {
    useInventoryResource('coin', itemObj.price)
    if ( itemObj.name === 'pouch' ) {
        upgradeInventory()
        submitPurchase(itemObj.id)
        return
    }
    let chosenItem = getShopItems()[itemObj.id]
    chosenItem = handleNewWeapnPurchase(chosenItem, itemObj)
    setIntObj(objectToElement(chosenItem))
    pickupDrop()
    submitPurchase(itemObj.id)
}

const handleNewWeapnPurchase = (chosenItem, itemObj) => {
    if ( !getWeaponSpecs().has(itemObj.name) ) return chosenItem 
    interactables.get(getCurrentRoomId()).push(null)
    return {
        ...chosenItem,
        id: `${getCurrentRoomId()}-${interactables.get(getCurrentRoomId()).length}}`,
        currmag: 0, 
        damagelvl: 1, 
        rangelvl: 1, 
        reloadspeedlvl: 1, 
        magazinelvl: 1, 
        fireratelvl: 1, 
        ammotype: getWeaponSpecs().get(itemObj.name).ammoType
    }
}

const submitPurchase = (id) => {
    getShopItems()[id].sold = true
    removeStore()
    renderStore()
}

const renderUpgrade = () => {
    if ( page !== 2 ) return
    const upgrade = createAndAddClass('div', 'upgrade')
    const left = createAndAddClass('div', 'upgrade-left')
    const items = renderUpgradeItems()
    const right = createAndAddClass('div', 'upgrade-right')
    const stats = createAndAddClass('div', 'weapon-to-upgrade-stats')
    appendAll(left, ...items)
    appendAll(right, stats)
    appendAll(upgrade, left, right)
    getPauseContainer().firstElementChild.children[2].append(upgrade)
}

const renderUpgradeItems = () => {
    return getInventory()
    .flat()
    .filter((block => getWeaponSpecs().has(block?.name)))
    .map((weapon) => {
        const weaponToUpgrade = objectToElement(weapon)
        addClass(weaponToUpgrade, 'upgrade-item')
        const wrapper = createAndAddClass('div', 'upgrade-wrapper')
        const img = createAndAddClass('img', 'upgrade-item-img')
        img.src = `../assets/images/${weapon.name}.png` 
        const name = createAndAddClass('p', 'upgrade-item-name')
        name.textContent = `${weapon.heading}`
        appendAll(wrapper, img, name)
        appendAll(weaponToUpgrade, wrapper)
        weaponToUpgrade.addEventListener('click', renderWeaponStats)
        return weaponToUpgrade
    })
}

const renderWeaponStats = (e) => {
    const weaponObj = elementToObject(e.currentTarget)
    const upgradeRight = document.querySelector('.upgrade-right')
    upgradeRight.innerHTML = ``
    const damage = createStatComponent(weaponObj, 'damage')
    const range = createStatComponent(weaponObj, 'range')
    const reload = createStatComponent(weaponObj, 'reload speed')
    const magazine = createStatComponent(weaponObj, 'magazine')
    const firerate = createStatComponent(weaponObj, 'fire rate')
    appendAll(upgradeRight, damage, range, reload, magazine, firerate)
}

const createStatComponent = (weaponObj, name) => {
    const upgradeStatComponent = objectToElement(weaponObj)
    addClass(upgradeStatComponent, 'upgrade-stat-component')
    const title = createAndAddClass('p', 'upgrade-stat-title')
    title.textContent = `${name}`
    const lower = createAndAddClass('div', 'upgrade-stat-lower')
    const levels = createLevelComponent(weaponObj, name)
    const values = createValueComponent(weaponObj, name)
    const price = createPriceComponent(weaponObj, name)
    appendAll(lower, levels, values, price)
    appendAll(upgradeStatComponent, title, lower)
    if ( weaponObj[`${name.replace(' ', '')}lvl`] !== 5 ) upgradeStatComponent.addEventListener('click', upgradePopup)
    return upgradeStatComponent
}

const createLevelComponent = (weaponObj, name) => {
    const levels = createAndAddClass('div', 'upgrade-stat-level')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]
    if ( currLvl === 5 ) levels.textContent = `Max Lvl.`
    else {
        const current = document.createElement('p')
        current.textContent = `Lvl.${currLvl}`
        const img = document.createElement('img')
        img.src = `../assets/images/upgrade.png`
        const next = document.createElement('p')
        next.textContent = `Lvl.${currLvl + 1}`
        appendAll(levels, current, img, next)
    }
    return levels
}

const createValueComponent = (weaponObj, name) => {
    const values = createAndAddClass('div', 'upgrade-stat-value')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]
    if ( currLvl === 5 ) 
        values.textContent = `${getStat(weaponObj.name, name.replace(' ', ''), currLvl)}`
    else {
        const current = document.createElement('p')
        current.textContent = `${getStat(weaponObj.name, name.replace(' ', ''), currLvl)}`
        const img = document.createElement('img')
        img.src = `../assets/images/upgrade.png`
        const next = document.createElement('p')
        next.textContent = `${getStat(weaponObj.name, name.replace(' ', ''), currLvl + 1)}`
        appendAll(values, current, img, next)
    }
    return values
}

const createPriceComponent = (weaponObj, name) => {
    const price = createAndAddClass('div', 'upgrade-stat-price')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]        
    if ( currLvl !== 5 ) {
        const img = document.createElement('img')
        img.src = `../assets/images/coin.png`
        const value = createAndAddClass('p', 'upgrade-stat-price-value')
        value.textContent = `${Math.pow(currLvl, 2) + 2}`
        appendAll(price, img, value)  
    }
    return price
}

const upgradePopup = (e) => {
    const itemObj = elementToObject(e.currentTarget)
    const popupContainer = createAndAddClass('div', 'popup-container', 'ui-theme')
    const popup = createAndAddClass('div', 'upgrade-popup')
    const title = createAndAddClass('h2', 'buy-popup-title')
    title.textContent = `Purchase upgrade?`
    const btnContainer = createAndAddClass('div', 'upgrade-popup-btn-container')
    const cancel = createCancelBtn(itemObj)
    btnContainer.append(cancel)
    const confirm = createUpgradeConfirmBtn({
        ...itemObj, 
        cost: e.currentTarget.children[1].children[2].children[1].textContent,
        stat: e.currentTarget.children[0].textContent
    })
    btnContainer.append(confirm)
    const message = createAndAddClass('p', 'buy-message')
    appendAll(
        popup, 
        title, 
        e.currentTarget.children[0].cloneNode(true),
        e.currentTarget.children[1].children[0].cloneNode(true), 
        e.currentTarget.children[1].children[1].cloneNode(true), 
        btnContainer,
        message
    )
    popupContainer.append(popup)
    getPauseContainer().firstElementChild.append(popupContainer)
}

const createUpgradeConfirmBtn = (itemObj) => {
    const confirm = createAndAddClass('button', 'buy-popup-confirm')
    const img = document.createElement('img')
    img.src = `../assets/images/coin.png`
    const p = document.createElement('p')
    p.textContent = `${itemObj.cost}` 
    confirm.addEventListener('click', () => {
        if ( !checkEnoughCoins({price: itemObj.cost}) ) return
        manageUpgrade(itemObj)
    })
    appendAll(confirm, img, p)
    return confirm
}

const manageUpgrade = (itemObj) => {
    useInventoryResource('coin', itemObj.cost)
    const stat = itemObj.stat.replace(' ', '')
    upgradeWeaponStat(itemObj.name, stat)
    removeStore()
    renderStore()
    const newElem = objectToElement(itemObj)
    addAttribute(newElem, stat.concat('lvl'), itemObj[stat.concat('lvl')] + 1)
    const e = {currentTarget: newElem}
    renderWeaponStats(e)
}

const renderSell = () => {
    if ( page !== 3 ) return
    const sell = createAndAddClass('div', 'sell')
    getPauseContainer().firstElementChild.children[2].append(sell)
}

const removeStore = () => {
    getPauseContainer().firstElementChild.remove()
}