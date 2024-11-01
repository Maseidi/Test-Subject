import { getAttributesEl, getSelectedToolEl } from '../elements.js'
import { sources } from '../../dialogue-manager.js'
import { getDialogues, getItemBeingModified, setDialogues } from '../variables.js'
import { autocomplete, renderAttributes, input, deleteButton } from './shared.js'

export const renderDialogueAttributes = () => {
    const dialogue = getItemBeingModified()
    renderAttributes()
    
    getAttributesEl().append(
        input('message', dialogue.message, (value) => dialogue.message = value, 'text')
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
        input('render progress', dialogue.renderProgress, (value) => dialogue.renderProgress = value, 'number')
    )

    getAttributesEl().append(
        input('progresses to active', 
            dialogue.progress2Active.join(','), (value) => dialogue.progress2Active = value.split(','), 'text')
    )

    getAttributesEl().append(
        input('duration (ms)', dialogue.duration, (value) => dialogue.duration = value, 'number', 30000)
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredDialogues = getDialogues().filter(item => item !== dialogue)
            setDialogues(filteredDialogues)
        })
    )

}