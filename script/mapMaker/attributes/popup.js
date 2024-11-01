import { getAttributesEl } from '../elements.js'
import { renderAttributes, input, deleteButton } from './shared.js'
import { getItemBeingModified, getPopups, setPopups } from '../variables.js'

export const renderPopupAttributes = () => {
    const popup = getItemBeingModified()
    renderAttributes()
    
    getAttributesEl().append(
        input('message', popup.message, (value) => popup.message = value, 'text')
    )

    getAttributesEl().append(
        input('render progress', popup.renderProgress, (value) => popup.renderProgress = value, 'number')
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
        })
    )

}