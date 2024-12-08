import { Progress } from './progress.js'
import { Coin, Drop } from './interactables.js'
import { addMessage, itemNotification, renderQuit } from './user-interface.js'
import { getPauseContainer } from './elements.js'
import { renderStats } from './gun-examine.js'
import { isThrowable } from './throwable-details.js'
import { getProgressValueByNumber } from './progress-manager.js'
import { getShopItems, getShopItemsWithId } from './shop-item.js'
import { ADRENALINE, ENERGY_DRINK, HEALTH_POTION, LUCK_PILLS } from './loot.js'
import { getGunUpgradableDetail, getGunDetails, isGun } from './gun-details.js'
import { 
    getAdrenalinesDropped,
    getEnergyDrinksDropped,
    getHealthPotionsDropped,
    getElementInteractedWith,
    getLuckPillsDropped,
    setAdrenalinesDropped,
    setEnergyDrinksDropped,
    setHealthPotionsDropped,
    setLuckPillsDropped } from './variables.js'
import { 
    MAX_PACKSIZE,
    countItem,
    getInventory,
    handleEquippableDrop,
    pickupDrop,
    upgradeInventory,
    upgradeWeaponStat,
    useInventoryResource } from './inventory.js'
import { 
    addClass,
    appendAll,
    createAndAddClass,
    element2Object,
    isStatUpgrader,
    nextId,
    object2Element, 
    removeClass} from './util.js'

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

const renderCoins = () => getPauseContainer().firstElementChild.append(itemNotification('coin'))

const renderPagination = () => {
    const paginationContainer = createAndAddClass('div', 'pagination-container')
    const buy = createAndAddClass('div', 'buy-page')
    if ( page === 1 ) addClass(buy, 'active-page')
    buy.textContent = `buy`
    buy.setAttribute('page', 1)
    buy.addEventListener('click', changePage)
    const upgrade = createAndAddClass('div', 'upgrade-page')
    if ( page === 2 ) addClass(upgrade, 'active-page')
    upgrade.textContent = `upgrade`
    upgrade.setAttribute('page', 2)
    upgrade.addEventListener('click', changePage)
    const sell = createAndAddClass('div', 'sell-page')
    if ( page === 3 ) addClass(sell, 'active-page')
    sell.textContent = `sell`
    sell.setAttribute('page', 3)
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
    const statUpgraderLimitRunner = statUpgraderOffLimit()
    return getShopItemsWithId()
        .filter(item => !item.sold && getProgressValueByNumber(item.renderProgress) && statUpgraderLimitRunner(item))
        .map((item) => {
            const buyItem = object2Element(item)
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

const statUpgraderOffLimit = () => {
    let adrenalineCounter = 0
    let healthCounter = 0
    let energyCounter = 0
    let luckCounter = 0
    return (item) => {
        if ( !isStatUpgrader(item) ) {
            return true
        } else if ( item.name === ADRENALINE && adrenalineCounter < 10 - getAdrenalinesDropped() ) {
            adrenalineCounter++
            return true
        } else if ( item.name === HEALTH_POTION && healthCounter < 10 - getHealthPotionsDropped() ) {
            healthCounter++
            return true
        } else if ( item.name === ENERGY_DRINK && energyCounter < 10 - getEnergyDrinksDropped() ) {
            energyCounter++
            return true
        } else if ( item.name === LUCK_PILLS && luckCounter < 10 - getLuckPillsDropped() ) {
            luckCounter++
            return true
        }
        return false
    }
}

const buyPopup = (e) => {
    const itemObj = element2Object(e.currentTarget)
    renderDealPopup(itemObj, 'Purchase item?', isGun(itemObj.name) || itemObj.name === 'pouch', renderConfirmBuyBtn)
}

export const renderDealPopup = (itemObj, title, headingPredicate, confirmCb) => {
    const popupContainer = createAndAddClass('div', 'deal-popup-container', 'popup-container', 'ui-theme')
    const popup = createAndAddClass('div', 'deal-popup')
    const titleEl = createAndAddClass('h2', 'deal-popup-title')
    titleEl.textContent = title
    const image = createAndAddClass('img', 'deal-popup-img')
    image.src = `../assets/images/${itemObj.name}.png`
    const heading = createAndAddClass('h2', 'deal-popup-heading')
    const imageHeading = createAndAddClass('div', 'deal-heading-container')
    appendAll(imageHeading, image, heading)
    if (headingPredicate) heading.textContent = `${itemObj.heading}`
    else heading.textContent = `${itemObj.amount} ${itemObj.heading}`
    const description = createAndAddClass('p', 'deal-popup-description')
    description.textContent = `${itemObj.description}`
    const btnContainer = createAndAddClass('div', 'deal-popup-btn-container')
    const cancel = renderCancelBtn(itemObj)
    btnContainer.append(cancel)
    renderExamineBtn(itemObj, btnContainer)
    const confirm = confirmCb(itemObj)
    btnContainer.append(confirm)
    const message = createAndAddClass('p', 'message')
    appendAll(popup, titleEl, imageHeading, description, btnContainer, message)
    popupContainer.append(popup)
    getPauseContainer().firstElementChild.append(popupContainer)
}

const renderCancelBtn = () => {
    const cancel = createAndAddClass('button', 'popup-cancel')
    cancel.textContent = `cancel`
    cancel.addEventListener('click', (e) => e.target.parentElement.parentElement.parentElement.remove())
    return cancel
}

const renderExamineBtn = (itemObj, btnContainer) => {
    if ( !isGun(itemObj.name) ) return
    const examine = createAndAddClass('button', 'popup-examine')
    examine.textContent = `examine`
    const weapon = getInventory().flat().find(item => item && item.name === itemObj.name)
    examine.addEventListener('click', () => renderStats( weapon || {
        ...getGunDetails().get(itemObj.name), 
        name: itemObj.name, damagelvl: 1, fireratelvl: 1, reloadspeedlvl: 1, magazinelvl:1, rangelvl: 1
    }))
    btnContainer.append(examine)
}

const renderConfirmBuyBtn = (itemObj) => 
    renderConfirmBtn(
        itemObj.price, 
        () => {
            if ( !checkEnoughCoins(itemObj) ) return
            manageBuy(itemObj)
        }
    )

const renderConfirmBtn = (price, cb, priceUnit = 'coin') => {
    const confirm = createAndAddClass('button', 'popup-confirm')
    const img = document.createElement('img')
    img.src = `../assets/images/${priceUnit}.png`
    const p = document.createElement('p')
    p.textContent = `${price}` 
    appendAll(confirm, img, p)
    confirm.addEventListener('click', cb)
    return confirm
}

const checkEnoughCoins = (itemObj) => {
    const result = countItem('coin') >= itemObj.price
    if ( !result ) addVendingMachineMessage('no enough cash')
    return result
}

const addVendingMachineMessage = (input) => addMessage(input, getPauseContainer().firstElementChild.children[4].firstElementChild)

const manageBuy = (itemObj) => {
    const loss = itemObj.price
    const needSpace2string = new Array(itemObj.space).fill('empty').join('')
    useInventoryResource('coin', loss)
    if ( itemObj.name === 'pouch' ) {
        upgradeInventory()
        submitPurchase(itemObj)
        return
    }
    const inventory2string = getInventory().flat().map(item => item === null ? 'empty' : item).join('')
    pickupDrop(object2Element(new Coin(null, null, loss)))
    if ( inventory2string.includes(needSpace2string) ) {
        useInventoryResource('coin', loss)
        let chosenItem = getShopItems()[itemObj.id]
        if ( isStatUpgrader(itemObj) ) chosenItem.price = 30
        if ( itemObj.name === 'armor' ) chosenItem.price = 50
        const { width, left, top, name, heading, amount, space, description, price } = chosenItem

        let purchasedItem = new Drop(width, left, top, name, heading, amount, 
                                     space, description, price / amount, Progress.builder().setRenderProgress(String(Number.MAX_SAFE_INTEGER)))
                                     
        purchasedItem = handleNewWeapnPurchase(purchasedItem, itemObj.name)
        purchasedItem = handleNewThrowablePurchase(purchasedItem, itemObj.name)
        pickupDrop(object2Element(purchasedItem))
        submitPurchase(itemObj)
        return
    }
    addVendingMachineMessage('No enough space')
}

const handleNewWeapnPurchase = (purchasedItem, name) => {
    if ( !isGun(name) ) return purchasedItem 
    return {
        ...purchasedItem,
        id: nextId(),
        currmag: 0, 
        damagelvl: 1, 
        rangelvl: 1, 
        reloadspeedlvl: 1, 
        magazinelvl: 1, 
        fireratelvl: 1, 
        ammotype: getGunDetails().get(name).ammotype
    }
}

const handleNewThrowablePurchase = (purchasedItem, name) => {
    if ( !isThrowable(name) ) return purchasedItem
    return { ...purchasedItem, id: nextId() }
}

const submitPurchase = (itemObj) => {
    getShopItems()[itemObj.id].sold = true
    handleStatUpgrader(itemObj)
    removeStore()
    renderStore()
}

const handleStatUpgrader = (itemObj) => {
    if ( itemObj.name === ADRENALINE )         setAdrenalinesDropped(getAdrenalinesDropped()     + 1)    
    else if ( itemObj.name === HEALTH_POTION ) setHealthPotionsDropped(getHealthPotionsDropped() + 1)    
    else if ( itemObj.name === ENERGY_DRINK )  setEnergyDrinksDropped(getEnergyDrinksDropped()   + 1)    
    else if ( itemObj.name === LUCK_PILLS )    setLuckPillsDropped(getLuckPillsDropped()         + 1)
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
    .filter((block => isGun(block?.name)))
    .map((weapon) => {
        const weapon2Upgrade = object2Element(weapon)
        addClass(weapon2Upgrade, 'upgrade-item')
        const wrapper = createAndAddClass('div', 'upgrade-wrapper')
        const img = createAndAddClass('img', 'upgrade-item-img')
        img.src = `../assets/images/${weapon.name}.png` 
        const name = createAndAddClass('p', 'upgrade-item-name')
        name.textContent = `${weapon.heading}`
        appendAll(wrapper, img, name)
        appendAll(weapon2Upgrade, wrapper)
        weapon2Upgrade.addEventListener('click', renderGunDetails)
        return weapon2Upgrade
    })
}

const renderGunDetails = (e) => {
    const weaponObj = element2Object(e.currentTarget)
    const upgradeRight = document.querySelector('.upgrade-right')
    upgradeRight.innerHTML = ``
    const damage = renderDetail(weaponObj, 'damage')
    const range = renderDetail(weaponObj, 'range')
    const reload = renderDetail(weaponObj, 'reload speed')
    const magazine = renderDetail(weaponObj, 'magazine')
    const firerate = renderDetail(weaponObj, 'fire rate')
    appendAll(upgradeRight, damage, range, reload, magazine, firerate)
}

const renderDetail = (weaponObj, name) => {
    const upgradeDetailComponent = object2Element(weaponObj)
    addClass(upgradeDetailComponent, 'upgrade-detail-component')
    const title = createAndAddClass('p', 'upgrade-detail-title')
    title.textContent = `${name}`
    const lower = createAndAddClass('div', 'upgrade-detail-lower')
    const levels = renderLevel(weaponObj, name)
    const values = renderValue(weaponObj, name)
    const price = renderPrice(weaponObj, name)
    appendAll(lower, levels, values, price)
    appendAll(upgradeDetailComponent, title, lower)
    if ( weaponObj[`${name.replace(' ', '')}lvl`] !== 5 ) upgradeDetailComponent.addEventListener('click', upgradePopup)
    return upgradeDetailComponent
}

const renderLevel = (weaponObj, name) => {
    const levels = createAndAddClass('div', 'upgrade-detail-level')
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

const renderValue = (weaponObj, name) => {
    const values = createAndAddClass('div', 'upgrade-detail-value')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]
    if ( currLvl === 5 ) 
        values.textContent = `${getGunUpgradableDetail(weaponObj.name, name.replace(' ', ''), currLvl)}`
    else {
        const current = document.createElement('p')
        current.textContent = `${getGunUpgradableDetail(weaponObj.name, name.replace(' ', ''), currLvl)}`
        const img = document.createElement('img')
        img.src = `../assets/images/upgrade.png`
        const next = document.createElement('p')
        next.textContent = `${getGunUpgradableDetail(weaponObj.name, name.replace(' ', ''), currLvl + 1)}`
        appendAll(values, current, img, next)
    }
    return values
}

const renderPrice = (weaponObj, name) => {
    const price = createAndAddClass('div', 'upgrade-detail-price')
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
    const itemObj = element2Object(e.currentTarget)
    const popupContainer = createAndAddClass('div', 'deal-popup-container', 'popup-container', 'ui-theme')
    const popup = createAndAddClass('div', 'upgrade-popup')
    const title = createAndAddClass('h2', 'deal-popup-title')
    title.textContent = `Purchase upgrade?`
    const btnContainer = createAndAddClass('div', 'upgrade-popup-btn-container')
    const cancel = renderCancelBtn(itemObj)
    btnContainer.append(cancel)
    const confirm = renderUpgradeConfirmBtn({
        ...itemObj, 
        cost: e.currentTarget.children[1].children[2].children[1].textContent,
        stat: e.currentTarget.firstElementChild.textContent
    })
    btnContainer.append(confirm)
    const message = createAndAddClass('p', 'message')
    appendAll(
        popup, 
        title, 
        e.currentTarget.firstElementChild.cloneNode(true),
        e.currentTarget.children[1].firstElementChild.cloneNode(true), 
        e.currentTarget.children[1].children[1].cloneNode(true), 
        btnContainer,
        message
    )
    popupContainer.append(popup)
    getPauseContainer().firstElementChild.append(popupContainer)
}

const renderUpgradeConfirmBtn = (itemObj) => 
    renderConfirmBtn(
        itemObj.cost, 
        () => {
            if ( !checkEnoughCoins({price: itemObj.cost}) ) return
            manageUpgrade(itemObj)
        }
    )

const manageUpgrade = (itemObj) => {
    useInventoryResource('coin', itemObj.cost)
    const stat = itemObj.stat.replace(' ', '')
    upgradeWeaponStat(itemObj.name, stat)
    removeStore()
    renderStore()
    const newElem = object2Element(itemObj)
    newElem.setAttribute(stat.concat('lvl'), itemObj[stat.concat('lvl')] + 1)
    const e = {currentTarget: newElem}
    renderGunDetails(e)
}

const renderSell = () => {
    if ( page !== 3 ) return
    const sell = createAndAddClass('div', 'sell')
    getInventory()
        .flat()
        .filter(item => item && !['coin', 'note', 'lighter'].includes(item.name) && 
                        !item.name?.includes('key') && item.amount === (MAX_PACKSIZE[item.name] ?? 1) )
        .forEach(item => {
            const sellItem = object2Element(item)
            addClass(sellItem, 'sell-item')
            const wrapper = createAndAddClass('div', 'sell-wrapper')
            const img = createAndAddClass('img', 'sell-item-img')
            img.src = `../assets/images/${item.name}.png` 
            const name = createAndAddClass('p', 'sell-item-name')
            name.textContent = `${item.heading}`
            const amount = createAndAddClass('p', 'sell-item-amount')
            amount.textContent = `${item.amount}`
            const price = createAndAddClass('p', 'sell-item-price')
            price.textContent = `${item.price * item.amount}`
            const sellItemCoin = createAndAddClass('img', 'sell-item-coin')
            sellItemCoin.src = `../assets/images/coin.png` 
            const info = createAndAddClass('div', 'info')
            const left = createAndAddClass('div', 'left')
            const right = createAndAddClass('div', 'right')
            sellItem.addEventListener('click', sellPopup)
            appendAll(left, name, amount)
            appendAll(right, price, sellItemCoin)
            appendAll(info, left, right)
            appendAll(wrapper, img, info)
            appendAll(sellItem, wrapper)
            sell.append(sellItem)
        })
    getPauseContainer().firstElementChild.children[2].append(sell)
}

const sellPopup = (e) => {
    const itemObj = element2Object(e.currentTarget)
    renderDealPopup(itemObj, 'Sell item?', isGun(itemObj.name), renderConfirmSellBtn)
}

const renderConfirmSellBtn = (itemObj) => 
    renderConfirmBtn(
        itemObj.price * itemObj.amount,
        () => manageSell(itemObj) 
    )

const manageSell = (itemObj) => {
    const gain = itemObj.price * itemObj.amount
    const gainSpace = itemObj.space
    pickupDrop(object2Element(new Coin(null, null, gain)))
    let left = getElementInteractedWith().getAttribute('amount')
    useInventoryResource('coin', gain-left)
    left -= gainSpace * 50
    if ( left <= 0 ) {
        useInventoryResource(itemObj.name, itemObj.amount)
        pickupDrop(object2Element(new Coin(null, null, gain)))
        handleEquippableDrop(itemObj)
        removeStore()
        renderStore()
        return
    }
    addVendingMachineMessage('No enough space') 
}

const removeStore = () => {
    getPauseContainer().firstElementChild.remove()
}