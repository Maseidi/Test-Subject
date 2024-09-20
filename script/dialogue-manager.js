import { Progress } from './progress.js'
import { getPlayer, getSpeaker } from './elements.js'
import { activateProgress } from './progress-manager.js'
import { addClass, createAndAddClass, removeClass } from './util.js'

const sources = {
    MIAN: 'main',
    SPEAKER: 'speaker' 
}

class Dialogue {
    constructor(message, source, progress, duration) {
        this.message =         message                   ?? null
        this.source =          source                    ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? null
        this.duration =        duration                  ?? 10000
    }
}

export const dialogues = []

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
        if ( i === chars.length - 1 ) 
            charEl.addEventListener('animationend', () => dialogueLifetime(dialogueContent, progress2Active, duration))
    }
    dialogueContainer.append(dialogueContent)
}

const dialogueLifetime = (dialogueContent, progress2Active, duration) => {
    removeClass(dialogueContent, 'dialogue-animation')
    addClass(dialogueContent, 'timer')
    dialogueContent.style.animationDuration = `${duration}ms`
    const closeDialogueRunner = closeDialogue(dialogueContent, progress2Active)
    dialogueContent.addEventListener('animationend', () => closeDialogueRunner())
}

const closeDialogue = (dialogueContent, progress2Active) => {
    let timerAnimation = false
    return () => {
        if ( !timerAnimation ) {
            timerAnimation = true
            return
        }
        dialogueContent.remove()
        if ( progress2Active ) activateProgress(progress2Active)
    }    
}