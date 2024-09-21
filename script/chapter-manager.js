import { Progress } from './progress.js'
import { getChapterContainer } from './elements.js'
import { addAllAttributes, addClass, createAndAddClass } from './util.js'

class Chapter {
    constructor(number, progress, duration) {
        this.number =          number                    ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration =        duration                  ?? 10000
    }
}

const chapters = [
    new Chapter(1, Progress.builder().setRenderProgress('1').setProgress2Active([2]), 3000)
]

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