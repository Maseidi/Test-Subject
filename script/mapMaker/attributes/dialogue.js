import { sources } from '../../dialogue-manager.js'
import { containsClass } from '../../util.js'
import { getAttributesEl, getSelectedToolEl } from '../elements.js'
import { addDialogueContents } from '../map-maker.js'
import { getDialogues, getItemBeingModified, setDialogues } from '../variables.js'
import { autocomplete, deleteButton, input, renderAttributes } from './shared.js'

export const renderDialogueAttributes = () => {
    const dialogue = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        input(
            'message',
            dialogue.message,
            value => (dialogue.message = value),
            'textarea',
            null,
            null,
            null,
            'Insert the content of the dialogue',
        ),
    )

    getAttributesEl().append(
        autocomplete(
            'source',
            dialogue.source,
            value => (dialogue.source = value),
            [
                { label: sources.MAIN, value: sources.MAIN },
                { label: sources.SPEAKER, value: sources.SPEAKER },
            ],
            'Choose if the player is saying the current dialogue or the villain via the speaker',
        ),
    )

    getAttributesEl().append(
        input(
            'render progress',
            dialogue.renderProgress,
            value => (dialogue.renderProgress = String(value)),
            'number',
            undefined,
            undefined,
            undefined,
            'Indicates that which progress flag should be active so that this dialogue will be played',
        ),
    )

    getAttributesEl().append(
        input(
            'progresses to active',
            dialogue.progress2Active.join(','),
            value => (dialogue.progress2Active = value.split(',')),
            'text',
            null,
            null,
            null,
            'The progress flags that will be activated when the dialogue finishes. Example inputs: <b>1000</b>, <b>1000,2000,3000</b>',
        ),
    )

    getAttributesEl().append(
        input(
            'duration (ms)',
            dialogue.duration,
            value => (dialogue.duration = value),
            'number',
            30000,
            undefined,
            undefined,
            'Set how long should this dialogue be',
        ),
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
