import { appendAll, createAndAddClass } from './util.js'
import { itemNotification, renderQuit } from './user-interface.js'
import { getPauseContainer } from './elements.js'
import { managePause } from './actions.js'

export const turnOnComputer = () => {
    managePause()
    renderDesktop()
    renderQuit()
}

const renderDesktop = () => {
    const desktop = createAndAddClass('div', 'desktop', 'ui-theme')
    appendAll(desktop, itemNotification('harddrive'), contents())
    getPauseContainer().append(desktop)
}

const contents = () => {
    const content = createAndAddClass('div', 'desktop-content')
    appendAll(content, title(), slots())
    return content
}

const title = () => {
    const title = createAndAddClass('p', 'desktop-title')
    title.textContent = 'slots'
    return title
}

const slots = () => {
    const slots = createAndAddClass('div', 'desktop-slots')
    for ( let i = 0; i < 10; i++ ) {
        const className = localStorage.getItem('slot-' + ( i + 1 )) ? 'desktop-slot' : 'desktop-empty-slot'
        const slot = createAndAddClass('div', className)
        
        slots.append(slot)
    }
    return slots
}