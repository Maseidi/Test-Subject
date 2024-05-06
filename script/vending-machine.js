import { managePause } from "./controls.js"
import { getPauseContainer } from "./elements.js"
import { renderQuit } from "./user-interface.js"
import { addClass } from "./util.js"

let page = 1
export const renderStore = () => {
    renderBackground()
    renderPages()
    renderStoreQuit()
}

const renderBackground = () => {
    const background = document.createElement("div")
    addClass(background, 'store-ui')
    addClass(background, 'ui-theme')
    getPauseContainer().append(background)
}

const renderPages = () => {
    const pageContainer = document.createElement('div')
    addClass(pageContainer, 'page-container')
    const buy = document.createElement('div')
    addClass(buy, 'buy-page')
    buy.textContent = `buy`
    const upgrade = document.createElement('div')
    addClass(upgrade, 'upgrade-page')
    upgrade.textContent = `upgrade`
    
}

const renderStoreQuit = () => renderQuit(() => {
    managePause()
    removeStore()
})

const removeStore = () => {
    getPauseContainer().firstElementChild.remove()
}