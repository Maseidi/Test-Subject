import { managePause } from "./controls.js"
import { getPauseContainer } from "./elements.js"
import { calculateTotalCoins } from "./inventory.js"
import { renderQuit } from "./user-interface.js"
import { addAttribute, addClass, appendAll } from "./util.js"

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
    const background = document.createElement("div")
    addClass(background, 'store-ui')
    addClass(background, 'ui-theme')
    getPauseContainer().append(background)
}

const renderCoins = () => {
    const coinContainer = document.createElement('div')
    addClass(coinContainer, 'coin-container')
    const coin = document.createElement('img')
    addClass(coin, 'coin-img')
    coin.src = '../assets/images/coin.png'
    const amount = document.createElement('p')
    addClass(amount, 'coin-amount')
    amount.textContent = calculateTotalCoins()
    appendAll(coinContainer, [coin, amount])
    getPauseContainer().firstElementChild.append(coinContainer)
}

const renderPagination = () => {
    const paginationContainer = document.createElement('div')
    addClass(paginationContainer, 'pagination-container')
    const buy = document.createElement('div')
    addClass(buy, 'buy-page')
    if ( page === 1 ) addClass(buy, 'active-page')
    buy.textContent = `buy`
    addAttribute(buy, 'page', 1)
    buy.addEventListener('click', changePage)
    const upgrade = document.createElement('div')
    addClass(upgrade, 'upgrade-page')
    if ( page === 2 ) addClass(upgrade, 'active-page')
    upgrade.textContent = `upgrade`
    addAttribute(upgrade, 'page', 2)
    upgrade.addEventListener('click', changePage)
    const sell = document.createElement('div')
    addClass(sell, 'sell-page')
    if ( page === 3 ) addClass(sell, 'active-page')
    sell.textContent = `sell`
    addAttribute(sell, 'page', 3)
    sell.addEventListener('click', changePage)
    appendAll(paginationContainer, [buy, upgrade, sell])
    getPauseContainer().firstElementChild.append(paginationContainer)
}

const changePage = (e) => {
    const pageNum = Number(e.target.getAttribute('page'))
    page = pageNum
    removeStore()
    renderStore()
}

const renderPageContainer = () => {
    const pageContainer = document.createElement('div')
    addClass(pageContainer, 'page-container')
    getPauseContainer().firstElementChild.append(pageContainer)
}

const renderBuy = () => {
    if ( page !== 1 ) return
    const buy = document.createElement('div')
    addClass(buy, 'buy')
    getPauseContainer().firstElementChild.children[2].append(buy)
}

const renderUpgrade = () => {
    if ( page !== 2 ) return
    const upgrade = document.createElement('div')
    addClass(upgrade, 'upgrade')
    getPauseContainer().firstElementChild.children[2].append(upgrade)
}

const renderSell = () => {
    if ( page !== 3 ) return
    const sell = document.createElement('div')
    addClass(sell, 'sell')
    getPauseContainer().firstElementChild.children[2].append(sell)
}

const renderStoreQuit = () => renderQuit(() => {
    managePause()
    removeStore()
})

const removeStore = () => {
    getPauseContainer().firstElementChild.remove()
}