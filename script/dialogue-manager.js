import { Progress } from './progress.js'
import { getPlayer, getSpeaker } from './elements.js'
import { addAllAttributes, addClass, createAndAddClass } from './util.js'

const sources = {
    MIAN: 'main',
    SPEAKER: 'speaker' 
}

class Dialogue {
    constructor(message, source, progress, duration) {
        this.message =         message                   ?? null
        this.source =          source                    ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration =        duration                  ?? 3000
    }
}

export const dialogues = [
    new Dialogue('Where the hell am I?', sources.MIAN, 
        Progress.builder().setRenderProgress('1001').setProgress2Active('1002')),
    new Dialogue('What the ..., I gotta find that key.', sources.MIAN, Progress.builder().setRenderProgress('1005')),
    new Dialogue('There it is.', sources.MIAN, Progress.builder().setRenderProgress('1006').setProgress2Active('1007')),
    new Dialogue("It's so dark", sources.MIAN, Progress.builder().setRenderProgress('2000').setProgress2Active('2001')),
    new Dialogue("What the hell was that?!", sources.MIAN, Progress.builder().setRenderProgress('3000')),
    new Dialogue("Alright, good to know.", sources.MIAN, Progress.builder().setRenderProgress('3001').setProgress2Active('3002')),
    new Dialogue("I might be able to find a weapon. It's a bunker after all.", sources.MIAN, 
        Progress.builder().setRenderProgress('4000'), 6000
    ),
    new Dialogue("It's so dark. I barely can see anything...", sources.MIAN, Progress.builder().setRenderProgress('7000')),
    new Dialogue("Nice! I might be able to light something up with this!", sources.MIAN, 
        Progress.builder().setRenderProgress('7001'), 6000
    ),
]

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