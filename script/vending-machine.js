import { managePause } from "./controls.js"
import { getShopItems } from "./shop-item.js"
import { renderQuit } from "./user-interface.js"
import { renderStats } from "./weapon-examine.js"
import { getPauseContainer } from "./elements.js"
import { getWeaponSpecs } from "./weapon-specs.js"
import { getProgressCounter } from "./variables.js"
import { calculateTotalCoins } from "./inventory.js"
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
    renderStoreQuit()
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
    return getShopItems()
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
    if (getWeaponSpecs().get(itemObj.name)) heading.textContent = heading.textContent = `${itemObj.heading}`
    else heading.textContent = `${itemObj.amount} ${itemObj.heading}`
    const description = createAndAddClass('p', 'buy-popup-description')
    description.textContent = `${itemObj.description}`
    const btnContainer = createAndAddClass('div', 'buy-popup-btn-container')
    const cancel = createAndAddClass('button', 'buy-popup-cancel')
    cancel.textContent = `cancel`
    cancel.addEventListener('click', (e) => e.target.parentElement.parentElement.parentElement.remove())
    btnContainer.append(cancel)
    if ( getWeaponSpecs().get(itemObj.name) ) {
        const examine = createAndAddClass('button', 'buy-popup-examine')
        examine.textContent = `examine`
        examine.addEventListener('click', () => renderStats({
            ...getWeaponSpecs().get(itemObj.name), 
            name: itemObj.name, damagelvl: 1, fireratelvl: 1, reloadspeedlvl: 1, magazinelvl:1, rangelvl: 1
        }))
        btnContainer.append(examine)
    }
    const confirm = createAndAddClass('button', 'buy-popup-confirm')
    confirm.textContent = `confirm`
    btnContainer.append(confirm)
    appendAll(popup, title, imageHeading, description, btnContainer)
    popupContainer.append(popup)
    getPauseContainer().firstElementChild.append(popupContainer)
}

const renderUpgrade = () => {
    if ( page !== 2 ) return
    const upgrade = createAndAddClass('div', 'upgrade')
    getPauseContainer().firstElementChild.children[2].append(upgrade)
}

const renderSell = () => {
    if ( page !== 3 ) return
    const sell = createAndAddClass('div', 'sell')
    getPauseContainer().firstElementChild.children[2].append(sell)
}

const renderStoreQuit = () => renderQuit(() => {
    managePause()
    removeStore()
})

const removeStore = () => {
    getPauseContainer().firstElementChild.remove()
}