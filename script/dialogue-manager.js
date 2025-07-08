import { getDialogueContainer } from './elements.js'
import { getDialogues } from './entities.js'
import { IS_MOBILE } from './script.js'
import { getSettings } from './settings.js'
import { addAllAttributes, addClass, createAndAddClass } from './util.js'
import { setPlayingDialogue } from './variables.js'

export const sources = {
    MAIN: 'main',
    SPEAKER: 'speaker',
}

export class Dialogue {
    constructor(message, source, progress, duration) {
        this.message = message ?? null
        this.source = source ?? null
        this.renderProgress = progress?.renderProgress ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration = duration ?? 3000
    }
}

export const renderDialogue = progress => {
    const dialogueObj = getDialogues()?.find(dialogue => Number(dialogue.renderProgress) === Number(progress))
    if (!dialogueObj) return
    displayDialogue(dialogueObj)
}

const displayDialogue = dialogueObj => {
    const { message, duration, progress2Active } = dialogueObj
    if (getDialogueContainer().firstElementChild) getDialogueContainer().firstElementChild.remove()
    const dialogueContent = createAndAddClass('p', 'dialogue', 'dialogue-animation', 'animation', IS_MOBILE ? 'mobile-dialogue' : '')
    const chars = message.split('')
    if (chars.length > 30) dialogueContent.style.width = '300px'
    else dialogueContent.style.width = 'max-content'
    for (let i = 0; i < chars.length; i++) {
        const charEl = document.createElement('span')
        charEl.textContent = chars[i]
        addClass(charEl, 'animation')
        charEl.style.animationDelay = `${i * 50}ms`
        dialogueContent.append(charEl)
    }
    addAllAttributes(
        dialogueContent,
        'timer',
        0,
        'duration',
        (duration / 1000) * getSettings().display.fps,
        'progress2active',
        progress2Active,
        'fade-out',
        200,
    )
    setPlayingDialogue(dialogueObj)
    getDialogueContainer().append(dialogueContent)
}
