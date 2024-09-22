import { dialogues } from './entities.js'
import { getPlayer, getSpeaker } from './elements.js'
import { addAllAttributes, addClass, createAndAddClass } from './util.js'

export const sources = {
    MIAN: 'main',
    SPEAKER: 'speaker' 
}

export class Dialogue {
    constructor(message, source, progress, duration) {
        this.message =         message                   ?? null
        this.source =          source                    ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration =        duration                  ?? 3000
    }
}

export const renderDialogue = (progress) => {
    const dialogueObj = dialogues.find(dialogue => dialogue.renderProgress === progress)
    if ( !dialogueObj ) return
    const { message, progress2Active, duration } = dialogueObj
    if ( dialogueObj.source === sources.MIAN ) displayPlayerDialougue(message, progress2Active, duration)
    else if ( dialogueObj.source === sources.SPEAKER ) displaySpeakerDialogue(message, progress2Active, duration)
}

const displayPlayerDialougue = (message, progress2Active, duration) =>
    displayDialogue(message, progress2Active, duration, getPlayer().firstElementChild.children[2])

const displaySpeakerDialogue = (message, progress2Active, duration) => 
    displayDialogue(message, progress2Active, duration, getSpeaker().lastElementChild)

const displayDialogue = (message, progress2Active, duration, dialogueContainer) => {
    if ( dialogueContainer.firstElementChild ) dialogueContainer.firstElementChild.remove()
    const dialogueContent = createAndAddClass('p', 'dialogue', 'dialogue-animation', 'animation')
    const chars = message.split('')
    if ( chars.length > 20 ) dialogueContent.style.width = '300px'
    else dialogueContent.style.width = 'max-content'
    for ( let i = 0; i < chars.length; i++ ) {
        const charEl = document.createElement('span')
        charEl.textContent = chars[i]
        addClass(charEl, 'animation')
        charEl.style.animationDelay = `${i * 50}ms`
        dialogueContent.append(charEl)
    }
    addAllAttributes(dialogueContent, 
        'timer', 0, 'duration', Math.floor((duration / 1000) * 60), 'progress2active', progress2Active, 'fade-out', 200
    )
    dialogueContainer.append(dialogueContent)
}