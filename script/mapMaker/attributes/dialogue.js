import { sources } from '../../dialogue-manager.js'
import { containsClass } from '../../util.js'
import { getAttributesEl, getSelectedToolEl } from '../elements.js'
import { addDialogueContents } from '../map-maker.js'
import { getDialogues, getItemBeingModified, setDialogues } from '../variables.js'
import { autocomplete, deleteButton, input, renderAttributes } from './shared.js'

export const renderDialogueAttributes = () => {
    const dialogue = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(input('message', dialogue.message, value => (dialogue.message = value), 'textarea'))

    getAttributesEl().append(
        autocomplete('source', dialogue.source, value => (dialogue.source = value), [
            { label: sources.MAIN, value: sources.MAIN },
            { label: sources.SPEAKER, value: sources.SPEAKER },
        ]),
    )

    getAttributesEl().append(
        input('render progress', dialogue.renderProgress, value => (dialogue.renderProgress = String(value)), 'number'),
    )

    getAttributesEl().append(
        input(
            'progresses to active',
            dialogue.progress2Active.join(','),
            value => (dialogue.progress2Active = value.split(',')),
            'text',
        ),
    )

    getAttributesEl().append(
        input('duration (ms)', dialogue.duration, value => (dialogue.duration = value), 'number', 30000),
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredDialogues = getDialogues().filter(item => item !== dialogue)
            setDialogues(filteredDialogues)
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addDialogueContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}
