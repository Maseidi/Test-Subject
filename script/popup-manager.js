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
    new Popup('You can always leave the infection state by using an appropriate vaccine', 
        Progress.builder().setRenderProgress('10000000'), 10000
    ),
    new Popup('<span>H</span> Use bandage to heal', 
        Progress.builder().setRenderProgress('10000001'), 10000
    ),
    new Popup('<span>Q</span> Light up torch', 
        Progress.builder().setRenderProgress('10000002'), 10000
    ),

    new Popup('<span>W</span> <span>A</span> <span>S</span> <span>D</span> Move', 
        Progress.builder().setRenderProgress('1002').setProgress2Active('1003'), 3000
    ),
    new Popup('<span>F</span> Interact',
        Progress.builder().setRenderProgress('1003')
    ),
    new Popup('<span>Tab</span> Open inventory', 
        Progress.builder().setRenderProgress('1004')
    ),
    new Popup('Use the key from inventory to open the door.', 
        Progress.builder().setRenderProgress('1007')
    ),
    new Popup('<span>Shift</span> Sprint', Progress.builder().setRenderProgress('2001')),
    new Popup('Sneak past enemies with vaccine to perform stealth kills. Do not let them notice you.', 
        Progress.builder().setRenderProgress('3002')
    ),
]

export const renderPopup = (progress) => {
    const popupObj = popups.find(popup => popup.renderProgress === progress)
    if ( !popupObj ) return
    if ( getPopupContainer().firstElementChild ) getPopupContainer().firstElementChild.remove()
    const popup = createAndAddClass('div', 'ui-theme', 'hint-popup', 'animation')
    const content = document.createElement('p')
    content.innerHTML = popupObj.message
    appendAll(popup, content)
    addAllAttributes(popup, 'timer', 0, 'duration', 5 * 60, 'progress2active', popupObj.progress2Active, 'fade-out', 500)
    getPopupContainer().append(popup)
}