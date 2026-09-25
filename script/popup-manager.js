import { managePause } from './actions.js'
import { getPopupContainer } from './elements.js'
import { getPopups } from './entities.js'
import { activateAllProgresses } from './progress-manager.js'
import { playClickSoundEffect } from './sound-manager.js'
import { appendAll, createAndAddClass } from './util.js'
import { setPauseCause } from './variables.js'
import { getSettings } from './settings.js'
import { getCampaignStatistics } from './campaign-stats.js'
import { return2MainMenu } from './pause-menu.js'

export class Popup {
    constructor(message, progress) {
        this.message = message ?? null
        this.renderProgress = progress?.renderProgress ?? null
        this.progress2Active = progress?.progress2Active ?? []
    }
}

export const renderPopup = progress => {
    const popupObj = getPopups()?.find(popup => Number(popup.renderProgress) === Number(progress))
    if (!popupObj) return
    const { message, progress2Active } = popupObj
    if (getPopupContainer().firstElementChild) getPopupContainer().firstElementChild.remove()
    if (message?.kind === 'finish') {
        renderCampaignCompletion()
        return
    }
    const popup = createAndAddClass('div', 'ui-theme', 'hint-popup', 'animation')
    const contentContainer = document.createElement('div')
    const content = document.createElement('p')
    content.innerHTML = resolveMessage(message)
    const continueBtn = document.createElement('span')
    continueBtn.addEventListener('click', () => {
        playClickSoundEffect()
        popup.remove()
        managePause()
        activateAllProgresses(progress2Active)
    })
    continueBtn.textContent = 'continue'
    appendAll(contentContainer, content, continueBtn)
    popup.append(contentContainer)
    getPopupContainer().append(popup)
    setPauseCause('popup')
    managePause()
}

const renderCampaignCompletion = () => {
    const screen = createAndAddClass('div', 'ui-theme', 'main-menu', 'campaign-complete')
    const title = createAndAddClass('h1', 'game-title', 'campaign-complete-title')
    title.textContent = 'Campaign finished'
    const statistics = createAndAddClass('div', 'campaign-complete-stats')
    const { time, saves, deaths, damaged } = getCampaignStatistics()
    for (const [label, value] of [['Time', time], ['Saves', saves], ['Deaths', deaths], ['Times damaged', damaged]]) {
        const row = createAndAddClass('div', 'campaign-complete-stat')
        const name = document.createElement('span')
        const amount = document.createElement('strong')
        name.textContent = label
        amount.textContent = value
        appendAll(row, name, amount)
        statistics.append(row)
    }
    const continueBtn = createAndAddClass('button', 'campaign-complete-continue')
    continueBtn.textContent = 'Continue'
    continueBtn.addEventListener('click', () => {
        playClickSoundEffect()
        return2MainMenu()
    })
    appendAll(screen, title, statistics, continueBtn)
    getPopupContainer().append(screen)
    setPauseCause('popup')
    managePause()
}

const key = code => String(code || '').replace(/^(Key|Digit)/, '').replace(/[^a-zA-Z0-9]/g, '')
const keycap = code => `<span>${key(code)}</span>`
const resolveMessage = message => {
    if (typeof message === 'function') return message()
    if (!message || typeof message !== 'object') return message
    const c = getSettings().controls
    if (message.kind === 'movement') return `Move with ${[c.up, c.left, c.down, c.right].map(keycap).join(', ')}.`
    if (message.kind === 'shooting') return `Press ${keycap(c.slot1)} to equip your gun. Hold <span>right mouse button</span> to aim, use <span>left mouse button</span> to shoot, and press ${keycap(c.reload)} to reload.`
    if (message.kind === 'healing') return `Press ${keycap(c.heal)} to use a bandage when you are hurt.`
    if (message.kind === 'switching') return `Press ${[c.slot1, c.slot2, c.slot3, c.slot4].map(keycap).join(', ')} or use the mouse wheel to switch weapons.`
    if (message.kind === 'antidote') return 'Use an antidote from your inventory to cure the poison and restore normal movement.'
    return ''
}
