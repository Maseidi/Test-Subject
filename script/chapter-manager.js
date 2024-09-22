import { getChapterContainer } from './elements.js'
import { chapters } from './entities.js'
import { addAllAttributes, addClass, createAndAddClass } from './util.js'

export class Chapter {
    constructor(number, progress, duration) {
        this.number =          number                    ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration =        duration                  ?? 10000
    }
}

export const renderChapter = (progress) => {
    const chapterObj = chapters.find(elem => elem.renderProgress === progress)
    if ( !chapterObj ) return
    if ( getChapterContainer().firstElementChild ) getChapterContainer().firstElementChild.remove()
    const chapterPopup = createAndAddClass('div', 'chapter-popup', 'animation')
    const { number, progress2Active, duration } = chapterObj
    const chars = ('chapter ' + number).split('')
    for ( let i = 0; i < chars.length; i++ ) {
        const char = chars[i]
        const charEl = document.createElement('span')
        addClass(charEl, 'animation')
        charEl.textContent = char
        charEl.style.animationDelay = `${Math.floor(Math.random() * 750) + 250}ms`
        chapterPopup.append(charEl)
    }
    addAllAttributes(
        chapterPopup, 
        'timer', 0, 
        'duration', Math.floor((duration / 1000)) * 60, 
        'progress2active', progress2Active, 
        'fade-out', 500
    )
    getChapterContainer().append(chapterPopup)
}