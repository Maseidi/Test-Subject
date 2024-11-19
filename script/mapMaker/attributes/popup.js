import { containsClass } from '../../util.js'
import { addPopupContents } from '../map-maker.js'
import { getAttributesEl, getSelectedToolEl } from '../elements.js'
import { renderAttributes, input, deleteButton } from './shared.js'
import { getItemBeingModified, getPopups, setPopups } from '../variables.js'

export const renderPopupAttributes = () => {
    const popup = getItemBeingModified()
    renderAttributes()
    
    getAttributesEl().append(
        input('message', popup.message, (value) => popup.message = value, 'textarea')
    )

    getAttributesEl().append(
        input('render progress', popup.renderProgress, (value) => popup.renderProgress = String(value), 'number')
    )

    getAttributesEl().append(
        input('progresses to active', 
            popup.progress2Active.join(','), (value) => popup.progress2Active = value.split(','), 'text')
    )

    getAttributesEl().append(
        input('duration (ms)', popup.duration, (value) => popup.duration = value, 'number', 30000)
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredPopups = getPopups().filter(item => item !== popup)
            setPopups(filteredPopups)
            const parent = getSelectedToolEl().parentElement 
            Array.from(parent.children).filter(child => !containsClass(child, 'add-item')).forEach(child => child.remove())
            addPopupContents(parent)
            if ( parent.children.length === 1 ) parent.previousSibling.click()
            else parent.firstElementChild.click()
        })
    )

}