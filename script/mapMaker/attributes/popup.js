import { containsClass } from '../../util.js'
import { getAttributesEl, getSelectedToolEl } from '../elements.js'
import { addPopupContents } from '../map-maker.js'
import { getItemBeingModified, getPopups, setPopups } from '../variables.js'
import { deleteButton, input, renderAttributes } from './shared.js'

export const renderPopupAttributes = () => {
    const popup = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        input(
            'message',
            popup.message,
            value => (popup.message = value),
            'textarea',
            null,
            null,
            null,
            'Insert the content of the popup',
        ),
    )

    getAttributesEl().append(
        input(
            'render progress',
            popup.renderProgress,
            value => (popup.renderProgress = String(value)),
            'number',
            undefined,
            undefined,
            undefined,
            'Indicates that which progress flag should be active so that this popup will be visible to the player',
        ),
    )

    getAttributesEl().append(
        input(
            'progresses to active',
            popup.progress2Active.join(','),
            value => (popup.progress2Active = (value ?? '').split(',')),
            'text',
            null,
            null,
            null,
            'The progress flags that will be activated when the popup fades out. Example inputs: <b>1000</b>, <b>1000,2000,3000</b>',
        ),
    )

    getAttributesEl().append(
        input(
            'duration (ms)',
            popup.duration,
            value => (popup.duration = value),
            'number',
            30000,
            undefined,
            undefined,
            'Set how long should this dialogue be',
        ),
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredPopups = getPopups().filter(item => item !== popup)
            setPopups(filteredPopups)
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addPopupContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}
