import { renderAttributes, input, deleteButton } from './shared.js'
import { getItemBeingModified, getRoomBeingMade, getWalls } from '../variables.js'
import { getAttributesEl, getElemBeingModified } from '../elements.js'

export const renderWallAttributes = () => {
    const wall = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        input('width', wall.width, (value) => {
            wall.width = value
            getElemBeingModified().style.width = `${value}px`
        })
    )

    getAttributesEl().append(
        input('height', wall.height, (value) => {
            wall.height = value
            getElemBeingModified().style.height = `${value}px`
        })
    )

    getAttributesEl().append(
        input('left', wall.left, (value) => {
            wall.left = value
            wall.right = null
            getElemBeingModified().style.left = `${value}px`
            getElemBeingModified().style.right = ''
            document.getElementById('right').value = ''
        })
    )

    getAttributesEl().append(
        input('right', wall.right, (value) => {
            wall.right = value
            wall.left = null
            getElemBeingModified().style.right = `${value}px`
            getElemBeingModified().style.left = ''
            document.getElementById('left').value = ''
        })
    )

    getAttributesEl().append(
        input('top', wall.top, (value) => {
            wall.top = value
            wall.bottom = null
            getElemBeingModified().style.top = `${value}px`
            getElemBeingModified().style.bottom = ''
            document.getElementById('bottom').value = ''
        })
    )

    getAttributesEl().append(
        input('bottom', wall.bottom, (value) => {
            wall.bottom = value
            wall.top = null
            getElemBeingModified().style.bottom = `${value}px`
            getElemBeingModified().style.top = ''
            document.getElementById('top').value = ''
        })
    )

    getAttributesEl().append(
        input('background', wall.background, (value) => {
            wall.background = value
            getElemBeingModified().style.background = value
        }, 'color')
    )

    getAttributesEl().append(
        deleteButton(() => {
            const currentRoomWalls = getWalls().get(getRoomBeingMade())
            const filteredWalls = 
                currentRoomWalls
                .filter((item, index) => index !== Number(getElemBeingModified().id.replace(`wall-`, '')))
    
            getWalls().set(getRoomBeingMade(), filteredWalls)
            getElemBeingModified().remove()
        })
    )

}