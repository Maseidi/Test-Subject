import { Door } from '../../loader.js'
import { containsClass } from '../../util.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl } from '../elements.js'
import { addLoaderContents, renderLoaders } from '../map-maker.js'
import { getItemBeingModified, getLoaders, getRoomBeingMade } from '../variables.js'
import { autocomplete, checkbox, deleteButton, input, renderAttributes } from './shared.js'

export const renderLoaderAttributes = () => {
    const loader = getItemBeingModified()
    renderAttributes()
    const type = getType(loader)

    getAttributesEl().append(
        input(
            'room to load',
            loader.className,
            value => (loader.className = value),
            null,
            null,
            null,
            null,
            'The ID of the room that will be loaded through this loader',
        ),
    )

    getAttributesEl().append(
        autocomplete(
            'type',
            type,
            value => {
                if (value === 'top-loader') setLoaderSpacing(loader, 100, 5, 0, -26, null, null)
                else if (value === 'left-loader') setLoaderSpacing(loader, 5, 100, -26, 0, null, null)
                else if (value === 'right-loader') setLoaderSpacing(loader, 5, 100, null, 0, -26, null)
                else if (value === 'bottom-loader') setLoaderSpacing(loader, 100, 5, 0, null, null, -26)
                renderLoaderAttributes()
            },
            [
                { label: 'Top Loader', value: 'top-loader' },
                { label: 'Right Loader', value: 'right-loader' },
                { label: 'Left Loader', value: 'left-loader' },
                { label: 'Bottom Loader', value: 'bottom-loader' },
            ],
            'Set the direction of this loader',
        ),
    )

    if (type === 'top-loader' || type === 'bottom-loader') {
        getAttributesEl().append(
            input(
                'left',
                loader.left,
                value => setFieldAndStyle(loader, 'left', value),
                null,
                null,
                null,
                null,
                'Modify the left offset of the loader',
            ),
        )

        getAttributesEl().append(
            input(
                'width',
                loader.width,
                value => setFieldAndStyle(loader, 'width', value),
                null,
                null,
                null,
                null,
                'Set the width of the loader',
            ),
        )
    }

    if (type === 'left-loader' || type === 'right-loader') {
        getAttributesEl().append(
            input(
                'top',
                loader.top,
                value => setFieldAndStyle(loader, 'top', value),
                null,
                null,
                null,
                null,
                'Modify the top offset of the loader',
            ),
        )

        getAttributesEl().append(
            input(
                'height',
                loader.height,
                value => setFieldAndStyle(loader, 'height', value),
                null,
                null,
                null,
                null,
                'Set the height of the loader',
            ),
        )
    }

    getAttributesEl().append(
        checkbox(
            'has door',
            loader.door,
            value => {
                if (value) loader.door = new Door('heading', 'popup')
                else loader.door = null
                renderLoaderAttributes()
            },
            'Check if you wish this loader to have a door',
        ),
    )

    if (loader.door) {
        getAttributesEl().append(
            input(
                'door heading',
                loader.door.heading,
                value => (loader.door.heading = value ?? 'heading'),
                'text',
                null,
                null,
                null,
                'The heading of the door that will be visible when interacting with it',
            ),
        )

        getAttributesEl().append(
            input(
                'door popup',
                loader.door.popup,
                value => (loader.door.popup = value ?? 'popup'),
                'text',
                null,
                null,
                null,
                'A short description of the door that will be visible when interacting with it',
            ),
        )

        getAttributesEl().append(
            input(
                'door key',
                loader.door.key,
                value => (loader.door.key = value),
                'text',
                null,
                null,
                null,
                'The key needed for this door. <b>MUST</b> be equal the <b>unlocks</b> property of the desired key. A <b>render progress MUST</b> be provided for the door',
            ),
        )

        getAttributesEl().append(
            input(
                'door render progress',
                loader.door.renderProgress,
                value => (loader.door.renderProgress = value),
                'text',
                null,
                null,
                null,
                'Indicates that which flag of the progress should be active so that this door would open',
            ),
        )

        getAttributesEl().append(
            input(
                'door progresses to active',
                loader.door.progress2Active.join(','),
                value => (loader.door.progress2Active = value.split(',')),
                'text',
                null,
                null,
                null,
                'Indicates that which progress flags will get activated when this door opens. Accepts an splittable string like: <b>1000,2000,3000</b>',
            ),
        )

        getAttributesEl().append(
            input(
                'door kill all',
                loader.door.killAll,
                value => (loader.door.killAll = value),
                'text',
                null,
                null,
                null,
                'Indicates that which enemies of the room with the render progress property equal or lower than this property must die so that this door would open',
            ),
        )

        getAttributesEl().append(
            input(
                'door code',
                loader.door.code,
                value => (loader.door.code = value),
                'text',
                null,
                null,
                null,
                'The code needed for this door. <b>MUST</b> be equal the <b>code</b> property of the desired note. A <b>render progress MUST</b> be provided for the door',
            ),
        )
    }

    getAttributesEl().append(
        deleteButton(() => {
            const currentRoomLoaders = getLoaders().get(getRoomBeingMade())
            const filteredLoaders = currentRoomLoaders.filter(
                (item, index) => index !== Number(getElemBeingModified().id.replace(`loader-`, '')),
            )

            getLoaders().set(getRoomBeingMade(), filteredLoaders)
            getElemBeingModified().remove()
            Array.from(document.querySelectorAll('.map-maker-loader')).forEach(item => item.remove())
            renderLoaders()
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addLoaderContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}

const getType = loader => {
    if (loader.height === 5) {
        if (loader.top === -26) return 'top-loader'
        else return 'bottom-loader'
    }
    if (loader.width === 5) {
        if (loader.left === -26) return 'left-loader'
        else return 'right-loader'
    }
}

const setLoaderSpacing = (loader, width, height, left, top, right, bottom) => {
    setFieldAndStyle(loader, 'top', top)
    setFieldAndStyle(loader, 'left', left)
    setFieldAndStyle(loader, 'width', width)
    setFieldAndStyle(loader, 'right', right)
    setFieldAndStyle(loader, 'height', height)
    setFieldAndStyle(loader, 'bottom', bottom)
}

const setFieldAndStyle = (loader, prop, value) => {
    loader[prop] = value
    getElemBeingModified().style[prop] = value ? `${value}px` : ''
}
