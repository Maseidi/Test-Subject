import { Progress } from './progress.js'
import { getPopupContainer } from './elements.js'
import { addAllAttributes, appendAll, createAndAddClass } from './util.js'

class Popup {
    constructor(message, progress, duration) {
        this.message =         message                   ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.duration =        duration                  ?? 30000
    }
}

const popups = [
    new Popup('Use <span>W</span> <span>A</span> <span>S</span> <span>D</span> to move around', 
        Progress.builder().setRenderProgress('3').setProgress2Active([4]), 3000
    ),
    new Popup('Use <span>F</span> to pick up items', 
        Progress.builder().setRenderProgress('4')
    ),
    new Popup('Use <span>Tab</span> to open inventory. You can do some actions with items in your inventory, such as examining stuff.', 
        Progress.builder().setRenderProgress('5')
    ),
    new Popup('Open inventory when interacting with the door and use the key to open the door', 
        Progress.builder().setRenderProgress('7')
    )
]

export const renderPopup = (progress) => {
    const popupObj = popups.find(popup => popup.renderProgress === progress)
    if ( !popupObj ) return
    if ( getPopupContainer().firstElementChild ) getPopupContainer().firstElementChild.remove()
    const popup = createAndAddClass('div', 'ui-theme', 'popup-animation', 'animation')
    const content = document.createElement('p')
    content.innerHTML = popupObj.message
    appendAll(popup, content)
    addAllAttributes(popup, 'timer', 0, 'duration', 5 * 60, 'progress2active', popupObj.progress2Active, 'fade-out', 500)
    getPopupContainer().append(popup)
}