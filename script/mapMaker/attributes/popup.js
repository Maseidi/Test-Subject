import { getAttributesEl } from '../elements.js'
import { getItemBeingModified } from '../variables.js'
import { renderAttributes, textField } from './shared.js'

export const renderPopupAttributes = () => {
    const popup = getItemBeingModified()
    renderAttributes()
    
    getAttributesEl().append(
        textField('message', popup.message, (value) => popup.message = value, 'text')
    )

    getAttributesEl().append(
        textField('render progress', popup.renderProgress, (value) => popup.renderProgress = value, 'number')
    )

    getAttributesEl().append(
        textField('progresses to active', 
            popup.progress2Active.join(','), (value) => popup.progress2Active = value.split(','), 'text')
    )

    getAttributesEl().append(
        textField('duration (ms)', popup.duration, (value) => popup.duration = value, 'number', 30000)
    )

}