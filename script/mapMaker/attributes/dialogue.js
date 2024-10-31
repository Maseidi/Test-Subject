import { sources } from '../../dialogue-manager.js'
import { getAttributesEl } from '../elements.js'
import { getItemBeingModified } from '../variables.js'
import { autocomplete, renderAttributes, textField } from './shared.js'

export const renderDialogueAttributes = () => {
    const dialogue = getItemBeingModified()
    renderAttributes()
    
    getAttributesEl().append(
        textField('message', dialogue.message, (value) => dialogue.message = value, 'text')
    )

    getAttributesEl().append(
        autocomplete('source', dialogue.source, (value) => dialogue.source = value, 
            [
                {label: sources.MAIN, value: sources.MAIN}, 
                {label: sources.SPEAKER, value: sources.SPEAKER}
            ]
        )
    )

    getAttributesEl().append(
        textField('render progress', dialogue.renderProgress, (value) => dialogue.renderProgress = value, 'number')
    )

    getAttributesEl().append(
        textField('progresses to active', 
            dialogue.progress2Active.join(','), (value) => dialogue.progress2Active = value.split(','), 'text')
    )

    getAttributesEl().append(
        textField('duration (ms)', dialogue.duration, (value) => dialogue.duration = value, 'number', 30000)
    )

}