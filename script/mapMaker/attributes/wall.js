import { containsClass } from '../../util.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl } from '../elements.js'
import { addWallContents, renderWalls } from '../map-maker.js'
import { getItemBeingModified, getRoomBeingMade, getWalls } from '../variables.js'
import { deleteButton, input, renderAttributes } from './shared.js'

export const renderWallAttributes = () => {
    const wall = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        input(
            'width',
            wall.width,
            value => {
                wall.width = value
                getElemBeingModified().style.width = `${value}px`
            },
            'number',
            undefined,
            undefined,
            undefined,
            'Set the width of the wall',
        ),
    )

    getAttributesEl().append(
        input(
            'height',
            wall.height,
            value => {
                wall.height = value
                getElemBeingModified().style.height = `${value}px`
            },
            'number',
            undefined,
            undefined,
            undefined,
            'Set the height of the wall',
        ),
    )

    getAttributesEl().append(
        input(
            'left',
            wall.left,
            value => {
                wall.left = value
                wall.right = null
                getElemBeingModified().style.left = `${value}px`
                getElemBeingModified().style.right = ''
                document.getElementById('right').value = ''
            },
            'number',
            undefined,
            undefined,
            undefined,
            'Modify the left offset of the wall, changing this setting might overwrite the right attribute',
        ),
    )

    getAttributesEl().append(
        input(
            'right',
            wall.right,
            value => {
                wall.right = value
                wall.left = null
                getElemBeingModified().style.right = `${value}px`
                getElemBeingModified().style.left = ''
                document.getElementById('left').value = ''
            },
            'number',
            undefined,
            undefined,
            undefined,
            'Modify the right offset of the wall, changing this setting might overwrite the left attribute',
        ),
    )

    getAttributesEl().append(
        input(
            'top',
            wall.top,
            value => {
                wall.top = value
                wall.bottom = null
                getElemBeingModified().style.top = `${value}px`
                getElemBeingModified().style.bottom = ''
                document.getElementById('bottom').value = ''
            },
            'number',
            undefined,
            undefined,
            undefined,
            'Modify the top offset of the wall, changing this setting might overwrite the bottom attribute',
        ),
    )

    getAttributesEl().append(
        input(
            'bottom',
            wall.bottom,
            value => {
                wall.bottom = value
                wall.top = null
                getElemBeingModified().style.bottom = `${value}px`
                getElemBeingModified().style.top = ''
                document.getElementById('top').value = ''
            },
            'number',
            undefined,
            undefined,
            undefined,
            'Modify the bottom offset of the wall, changing this setting might overwrite the top attribute',
        ),
    )

    getAttributesEl().append(
        input(
            'background',
            wall.background,
            value => {
                wall.background = value
                getElemBeingModified().style.background = value
            },
            'color',
            null,
            null,
            null,
            'Changes the wall background',
        ),
    )

    getAttributesEl().append(
        deleteButton(() => {
            const currentRoomWalls = getWalls().get(getRoomBeingMade())
            const filteredWalls = currentRoomWalls.filter(
                (item, index) => index !== Number(getElemBeingModified().id.replace(`wall-`, '')),
            )

            getWalls().set(getRoomBeingMade(), filteredWalls)
            getElemBeingModified().remove()
            Array.from(document.querySelectorAll('.wall')).forEach(item => item.remove())
            renderWalls()
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addWallContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}
