import { getPauseContainer } from './elements.js'
import { getGunDetails, getGunUpgradableDetail, isGun } from './gun-details.js'
import { renderStats } from './gun-examine.js'
import { Coin, Drop } from './interactables.js'
import {
    countItem,
    getInventory,
    handleEquippableDrop,
    MAX_PACKSIZE,
    pickupDrop,
    upgradeInventory,
    upgradeWeaponStat,
    useInventoryResource,
} from './inventory.js'
import { ADRENALINE, ENERGY_DRINK, HEALTH_POTION, LUCK_PILLS } from './loot.js'
import { getProgressValueByNumber } from './progress-manager.js'
import { Progress } from './progress.js'
import { getShopItems, getShopItemsWithId, GunShopItem } from './shop-item.js'
import { addHoverSoundEffect, playClickSoundEffect, playTrade, playUpgrade } from './sound-manager.js'
import { add2Stash, countItemStash, getStash, setStash } from './stash.js'
import { getChaos } from './survival/variables.js'
import { isThrowable } from './throwable-details.js'
import { addMessage, itemNotification, renderQuit } from './user-interface.js'
import {
    addClass,
    appendAll,
    createAndAddClass,
    element2Object,
    isStatUpgrader,
    nextId,
    object2Element,
} from './util.js'
import {
    getAdrenalinesDropped,
    getEnergyDrinksDropped,
    getHealthPotionsDropped,
    getIsSurvival,
    getLuckPillsDropped,
    setAdrenalinesDropped,
    setEnergyDrinksDropped,
    setHealthPotionsDropped,
    setLuckPillsDropped,
} from './variables.js'

let page = 1
let lastItemClickedOn = null
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
    if (page === 1) addClass(buy, 'active-page')
    buy.textContent = `buy`
    buy.setAttribute('page', 1)
    addHoverSoundEffect(buy)
    buy.addEventListener('click', changePage)
    const upgrade = createAndAddClass('div', 'upgrade-page')
    if (page === 2) addClass(upgrade, 'active-page')
    upgrade.textContent = `upgrade`
    upgrade.setAttribute('page', 2)
    addHoverSoundEffect(upgrade)
    upgrade.addEventListener('click', changePage)
    const sell = createAndAddClass('div', 'sell-page')
    if (page === 3) addClass(sell, 'active-page')
    sell.textContent = `sell`
    sell.setAttribute('page', 3)
    addHoverSoundEffect(sell)
    sell.addEventListener('click', changePage)
    appendAll(paginationContainer, buy, upgrade, sell)
    getPauseContainer().firstElementChild.append(paginationContainer)
}

const changePage = e => {
    playClickSoundEffect()
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
    if (page !== 1) return
    const buy = createAndAddClass('div', 'buy')
    const items = renderBuyItems()
    appendAll(buy, ...items)
    getPauseContainer().firstElementChild.children[2].append(buy)
}

const renderBuyItems = () => {
    const statUpgraderLimitRunner = isStatUpgraderOffLimit()
    return getShopItemsWithId()
        .filter(item => !item.sold && getProgressValueByNumber(item.renderProgress) && statUpgraderLimitRunner(item))
        .map(item => {
            const buyItem = object2Element(item)
            addClass(buyItem, 'buy-item')
            const wrapper = createAndAddClass('div', 'buy-wrapper')
            const img = createAndAddClass('img', 'buy-item-img')
            img.src = `./assets/images/${item.name}.png`
            const name = createAndAddClass('p', 'buy-item-name')
            name.textContent = `${item.heading}`
            const amount = createAndAddClass('p', 'buy-item-amount')
            amount.textContent = `${item.amount}`
            const price = createAndAddClass('p', 'buy-item-price')
            price.textContent = `${reEvaluatePrice(item.price)}`
            const buyItemCoin = createAndAddClass('img', 'buy-item-coin')
            buyItemCoin.src = `./assets/images/coin.png`
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

const reEvaluatePrice = originalPrice => (getIsSurvival() ? getChaos() + originalPrice - 1 : originalPrice)

const getBasePrice = price => (getIsSurvival() ? price - getChaos() + 1 : price)

const isStatUpgraderOffLimit = () => {
    let adrenalineCounter = 0
    let healthCounter = 0
    let energyCounter = 0
    let luckCounter = 0
    return item => {
        if (!isStatUpgrader(item)) {
            return true
        } else if (item.name === ADRENALINE && adrenalineCounter < 10 - getAdrenalinesDropped()) {
            adrenalineCounter++
            return true
        } else if (item.name === HEALTH_POTION && (getIsSurvival() || healthCounter < 10 - getHealthPotionsDropped())) {
            healthCounter++
            return true
        } else if (item.name === ENERGY_DRINK && energyCounter < 10 - getEnergyDrinksDropped()) {
            energyCounter++
            return true
        } else if (item.name === LUCK_PILLS && luckCounter < 10 - getLuckPillsDropped()) {
            luckCounter++
            return true
        }
        return false
    }
}

const buyPopup = e => {
    lastItemClickedOn = e.currentTarget
    const itemObj = element2Object(e.currentTarget)
    renderDealPopup(itemObj, 'Purchase item?', isGun(itemObj.name) || itemObj.name === 'pouch', renderConfirmBuyBtn)
}

const renderDealPopup = (itemObj, title, headingPredicate, confirmCb) => {
    const popupContainer = createAndAddClass('div', 'deal-popup-container', 'popup-container', 'ui-theme')
    const popup = createAndAddClass('div', 'deal-popup')
    const titleEl = createAndAddClass('h2', 'deal-popup-title')
    titleEl.textContent = title
    const image = createAndAddClass('img', 'deal-popup-img')
    image.src = `./assets/images/${itemObj.name}.png`
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
    addHoverSoundEffect(cancel)
    cancel.addEventListener('click', e => {
        playClickSoundEffect()
        e.target.parentElement.parentElement.parentElement.remove()
    })
    return cancel
}

const renderExamineBtn = (itemObj, btnContainer) => {
    if (!isGun(itemObj.name)) return
    const examine = createAndAddClass('button', 'popup-examine')
    examine.textContent = `examine`
    const weapon = getInventory()
        .flat()
        .find(item => item && item.name === itemObj.name)
    addHoverSoundEffect(examine)
    examine.addEventListener('click', () => {
        playClickSoundEffect()
        renderStats(
            weapon || {
                ...getGunDetails().get(itemObj.name),
                name: itemObj.name,
                damagelvl: 1,
                fireratelvl: 1,
                reloadspeedlvl: 1,
                magazinelvl: 1,
                rangelvl: 1,
            },
        )
    })
    btnContainer.append(examine)
}

const renderConfirmBuyBtn = itemObj => {
    const price = reEvaluatePrice(itemObj.price)
    return renderConfirmBtn(price, () => {
        if (!checkEnoughCoins(price) && !getIsSurvival()) return
        manageBuy({ ...itemObj, price })
    })
}

const renderConfirmBtn = (price, cb, priceUnit = 'coin') => {
    const confirm = createAndAddClass('button', 'popup-confirm')
    const img = document.createElement('img')
    img.src = `./assets/images/${priceUnit}.png`
    const p = document.createElement('p')
    p.textContent = `${price}`
    appendAll(confirm, img, p)
    addHoverSoundEffect(confirm)
    confirm.addEventListener('click', () => {
        playClickSoundEffect()
        cb()
    })
    return confirm
}

const checkEnoughCoins = price => {
    const result = countItem('coin') >= price
    if (!result) addVendingMachineMessage('no enough cash')
    return result
}

const addVendingMachineMessage = input =>
    addMessage(input, getPauseContainer().firstElementChild.children[4].firstElementChild)

const isEnoughSpace4Purchase = itemObj => {
    const needSpace2string = new Array(itemObj.space).fill('empty').join('')
    const inventory2string = getInventory()
        .flat()
        .map((item, index) => (item === null ? (index % 4 === 3 ? 'emptyend' : 'empty') : item))
        .join('')
    return inventory2string.includes(needSpace2string)
}

const manageBuy = itemObj => {
    if (getIsSurvival()) {
        manageSurvivalBuy(itemObj)
        return
    }
    const loss = itemObj.price
    useInventoryResource('coin', loss)
    if (itemObj.name === 'pouch') {
        upgradeInventory()
        submitPurchase(itemObj)
        return
    }

    if (isEnoughSpace4Purchase(itemObj)) {
        let chosenItem = getShopItems()[itemObj.id]
        if (isStatUpgrader(itemObj)) chosenItem.price = 30
        if (itemObj.name === 'armor') chosenItem.price = 50
        const { width, left, top, name, heading, amount, space, description, price } = chosenItem

        let purchasedItem = new Drop(
            width,
            left,
            top,
            name,
            heading,
            amount,
            space,
            description,
            price / amount,
            Progress.builder().setRenderProgress(String(Number.MAX_SAFE_INTEGER)),
        )

        purchasedItem = handleNewWeapnPurchase(purchasedItem, itemObj.name)
        purchasedItem = handleNewThrowablePurchase(purchasedItem, itemObj.name)
        pickupDrop(object2Element(purchasedItem))
        submitPurchase(itemObj)
        return
    }
    pickupDrop(object2Element(new Coin(null, null, loss)))
    addVendingMachineMessage('No enough space')
}

const manageSurvivalBuy = itemObj => {
    const { name, price, amount } = itemObj
    const basePrice = getBasePrice(price)
    const stashCoins = countItemStash('coin') ?? 0
    const inventoryCoins = countItem('coin') ?? 0
    if (stashCoins + inventoryCoins < price) {
        addVendingMachineMessage('No enough cash')
        return
    }
    if (inventoryCoins <= price) {
        useInventoryResource('coin', inventoryCoins)
        if (price - inventoryCoins === 0) setStash(getStash().filter(item => item.name !== 'coin'))
        else getStash().find(item => item.name === 'coin').amount -= price - inventoryCoins
    } else useInventoryResource('coin', price)
    if (name === 'pouch') upgradeInventory()
    else {
        const purchasedItem = { ...itemObj }
        let final = handleNewWeapnPurchase(purchasedItem, name)
        final = handleNewThrowablePurchase(final, name)
        if (isEnoughSpace4Purchase(itemObj)) pickupDrop(object2Element({ ...final, price: basePrice / amount }))
        else add2Stash({ ...final, price: basePrice / amount }, amount)
    }
    submitPurchase(itemObj)
}

const handleNewWeapnPurchase = (purchasedItem, name) => {
    if (!isGun(name)) return purchasedItem
    return {
        ...purchasedItem,
        id: nextId(),
        currmag: 0,
        damagelvl: 1,
        rangelvl: 1,
        reloadspeedlvl: 1,
        magazinelvl: 1,
        fireratelvl: 1,
        ammotype: getGunDetails().get(name).ammotype,
    }
}

const handleNewThrowablePurchase = (purchasedItem, name) => {
    if (!isThrowable(name)) return purchasedItem
    return { ...purchasedItem, id: nextId() }
}

const submitPurchase = itemObj => {
    getShopItems()[itemObj.id].sold = true
    handleStatUpgrader(itemObj)
    playTrade()
    removePopup(-itemObj.price)
}

const handleStatUpgrader = itemObj => {
    if (itemObj.name === ADRENALINE) setAdrenalinesDropped(getAdrenalinesDropped() + 1)
    else if (itemObj.name === HEALTH_POTION) setHealthPotionsDropped(getHealthPotionsDropped() + 1)
    else if (itemObj.name === ENERGY_DRINK) setEnergyDrinksDropped(getEnergyDrinksDropped() + 1)
    else if (itemObj.name === LUCK_PILLS) setLuckPillsDropped(getLuckPillsDropped() + 1)
}

const renderUpgrade = () => {
    if (page !== 2) return
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
        .filter(block => isGun(block?.name))
        .map(weapon => {
            const weapon2Upgrade = object2Element(weapon)
            addClass(weapon2Upgrade, 'upgrade-item')
            const wrapper = createAndAddClass('div', 'upgrade-wrapper')
            const img = createAndAddClass('img', 'upgrade-item-img')
            img.src = `./assets/images/${weapon.name}.png`
            const name = createAndAddClass('p', 'upgrade-item-name')
            name.textContent = `${weapon.heading}`
            appendAll(wrapper, img, name)
            appendAll(weapon2Upgrade, wrapper)
            weapon2Upgrade.addEventListener('click', renderGunDetails)
            return weapon2Upgrade
        })
}

const renderGunDetails = e => {
    playClickSoundEffect()
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
    if ((name === 'damage' && getIsSurvival()) || weaponObj[`${name.replace(' ', '')}lvl`] !== 5) {
        upgradeDetailComponent.addEventListener('click', upgradePopup)
    }
    return upgradeDetailComponent
}

const renderLevel = (weaponObj, name) => {
    const levels = createAndAddClass('div', 'upgrade-detail-level')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]
    if (currLvl === 5 && name !== 'damage') levels.textContent = `Max Lvl.`
    else if (currLvl === 5 && !getIsSurvival()) levels.textContent = `Max Lvl.`
    else {
        const current = document.createElement('p')
        current.textContent = `Lvl.${currLvl}`
        const img = document.createElement('img')
        img.src = `./assets/images/upgrade.png`
        const next = document.createElement('p')
        next.textContent = `Lvl.${currLvl + 1}`
        appendAll(levels, current, img, next)
    }
    return levels
}

const renderValue = (weaponObj, name) => {
    const values = createAndAddClass('div', 'upgrade-detail-value')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]
    if (currLvl === 5 && name !== 'damage') values.textContent = `Max Lvl.`
    else if (currLvl === 5 && !getIsSurvival())
        values.textContent = `${getGunUpgradableDetail(weaponObj.name, name.replace(' ', ''), currLvl)}`
    else {
        const current = document.createElement('p')
        current.textContent = `${getGunUpgradableDetail(weaponObj.name, name.replace(' ', ''), currLvl)}`
        const img = document.createElement('img')
        img.src = `./assets/images/upgrade.png`
        const next = document.createElement('p')
        next.textContent = `${getGunUpgradableDetail(weaponObj.name, name.replace(' ', ''), currLvl + 1)}`
        appendAll(values, current, img, next)
    }
    return values
}

const renderPrice = (weaponObj, name) => {
    const price = createAndAddClass('div', 'upgrade-detail-price')
    const currLvl = weaponObj[`${name.replace(' ', '')}lvl`]
    if (currLvl === 5 && name !== 'damage') return price
    if (currLvl !== 5 || getIsSurvival()) {
        const img = document.createElement('img')
        img.src = `./assets/images/coin.png`
        const value = createAndAddClass('p', 'upgrade-stat-price-value')
        value.textContent = `${5 * currLvl}`
        appendAll(price, img, value)
    }
    return price
}

const upgradePopup = e => {
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
        stat: e.currentTarget.firstElementChild.textContent,
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
        message,
    )
    popupContainer.append(popup)
    getPauseContainer().firstElementChild.append(popupContainer)
}

const renderUpgradeConfirmBtn = itemObj =>
    renderConfirmBtn(itemObj.cost, () => {
        if (!checkEnoughCoins(itemObj.cost) && !getIsSurvival()) return
        manageUpgrade(itemObj)
    })

const manageUpgrade = itemObj => {
    if (getIsSurvival()) {
        manageSurvivalUpgrade(itemObj)
        return
    }
    playUpgrade()
    useInventoryResource('coin', itemObj.cost)
    const stat = itemObj.stat.replace(' ', '')
    upgradeWeaponStat(itemObj.name, stat)
    removeStore()
    renderStore()
    const newElem = object2Element(itemObj)
    newElem.setAttribute(stat.concat('lvl'), itemObj[stat.concat('lvl')] + 1)
    const e = { currentTarget: newElem }
    renderGunDetails(e)
}

const manageSurvivalUpgrade = itemObj => {
    const { cost } = itemObj
    const stashCoins = countItemStash('coin') ?? 0
    const inventoryCoins = countItem('coin') ?? 0
    if (stashCoins + inventoryCoins < cost) {
        addVendingMachineMessage('No enough cash')
        return
    }
    if (inventoryCoins <= cost) {
        useInventoryResource('coin', inventoryCoins)
        getStash().find(item => item.name === 'coin').amount -= cost - inventoryCoins
    } else useInventoryResource('coin', cost)
    playUpgrade()
    const stat = itemObj.stat.replace(' ', '')
    upgradeWeaponStat(itemObj.name, stat)
    removeStore()
    renderStore()
    const newElem = object2Element(itemObj)
    newElem.setAttribute(stat.concat('lvl'), itemObj[stat.concat('lvl')] + 1)
    const e = { currentTarget: newElem }
    renderGunDetails(e)
}

const renderSell = () => {
    if (page !== 3) return
    const sell = createAndAddClass('div', 'sell')
    const items = getIsSurvival() ? getSurvivalItems() : getInventory().flat()
    items
        .filter(
            item =>
                item &&
                !['coin', 'note', 'lighter'].includes(item.name) &&
                !item.name?.includes('key') &&
                item.amount === (MAX_PACKSIZE[item.name] ?? 1),
        )
        .forEach(item => {
            const sellItem = object2Element(item)
            addClass(sellItem, 'sell-item')
            const wrapper = createAndAddClass('div', 'sell-wrapper')
            const img = createAndAddClass('img', 'sell-item-img')
            img.src = `./assets/images/${item.name}.png`
            const name = createAndAddClass('p', 'sell-item-name')
            name.textContent = `${item.heading}`
            const amount = createAndAddClass('p', 'sell-item-amount')
            amount.textContent = `${item.amount}`
            const price = createAndAddClass('p', 'sell-item-price')
            price.textContent = `${reEvaluatePrice(item.price * item.amount)}`
            const sellItemCoin = createAndAddClass('img', 'sell-item-coin')
            sellItemCoin.src = `./assets/images/coin.png`
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

const getSurvivalItems = () => {
    const result = []
    getInventory()
        .flat()
        .filter(item => item && item !== 'empty' && item !== 'locked')
        .forEach(item => {
            let amount = item.amount
            getStash().forEach(stashItem => {
                if (item.name === stashItem.name) amount += stashItem.amount
            })
            const packsize = MAX_PACKSIZE[item.name]
            while (amount >= packsize) {
                amount -= packsize
                result.push({ ...item, amount: packsize })
            }
            if (isGun(item.name)) result.push(item)
        })

    getStash().forEach(item => {
        if (result.find(resultItem => resultItem.name === item.name)) return
        if (isGun(item.name)) result.push(item)
        else {
            let amount = item.amount
            const packsize = MAX_PACKSIZE[item.name]
            while (amount >= packsize) {
                amount -= packsize
                result.push({ ...item, amount: packsize })
            }
        }
    })
    return result
}

const sellPopup = e => {
    playClickSoundEffect()
    lastItemClickedOn = e.currentTarget
    const itemObj = element2Object(e.currentTarget)
    renderDealPopup(itemObj, 'Sell item?', isGun(itemObj.name), renderConfirmSellBtn)
}

const renderConfirmSellBtn = itemObj =>
    renderConfirmBtn(reEvaluatePrice(itemObj.price * itemObj.amount), () => manageSell(itemObj))

const manageSell = itemObj => {
    if (getIsSurvival()) {
        manageSurvivalSell(itemObj)
        return
    }
    const gain = itemObj.price * itemObj.amount
    const gainSpace = itemObj.space
    pickupDrop(object2Element(new Coin(null, null, gain)))
    useInventoryResource('coin', gain)
    if (gainSpace > 0) {
        useInventoryResource(itemObj.name, itemObj.amount)
        pickupDrop(object2Element(new Coin(null, null, gain)))
        handleEquippableDrop(itemObj)
        removePopup(gain)
        if (isGun(itemObj.name) && !getShopItems().find(item => !item.sold && item.name === itemObj.name))
            getShopItems().push(new GunShopItem(itemObj.name))

        playTrade()
        return
    }
    addVendingMachineMessage('No enough space')
}

const manageSurvivalSell = itemObj => {
    const { amount, price, name } = itemObj
    const totalPrice = reEvaluatePrice(price * amount)
    add2Stash(new Coin(), totalPrice)
    removePopup(totalPrice)
    if (isGun(name) && !getShopItems().find(item => !item.sold && item.name === name))
        getShopItems().push(new GunShopItem(name))

    playTrade()
    const inventoryAmount = countItem(name) ?? 0
    const stashAmount = countItemStash(name) ?? 0
    let currentAmount = amount
    if (inventoryAmount) {
        if (isGun(name)) {
            useInventoryResource(itemObj.name, itemObj.amount)
            handleEquippableDrop(itemObj)
        } else {
            const amount2Use = Math.min(inventoryAmount, currentAmount)
            useInventoryResource(name, amount2Use)
            currentAmount -= amount2Use
        }
        return
    }
    const index = getStash().findIndex(item => item.name === name)
    if (stashAmount === currentAmount) setStash(getStash().filter((item, idx) => index !== idx))
    else getStash()[index].amount = stashAmount - currentAmount
}

const removeStore = () => {
    getPauseContainer().firstElementChild.remove()
}

const removePopup = difference => {
    lastItemClickedOn?.remove()
    lastItemClickedOn = null
    getPauseContainer().firstElementChild.lastElementChild.remove()
    const coins = getPauseContainer().firstElementChild.firstElementChild.children[1]
    coins.textContent = Number(coins.textContent) + difference
}
