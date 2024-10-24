import { getItemBeingModified } from '../variables.js'
import { renderAttributes, textField } from './shared.js'
import { getAttributesEl, getElemBeingModified } from '../elements.js'

export const renderWallAttributes = () => {
    const wall = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        textField('width', wall.width, (value) => {
            wall.width = Number(value)
            getElemBeingModified().style.width = `${value}px`
        })
    )

    getAttributesEl().append(
        textField('height', wall.height, (value) => {
            wall.height = Number(value)
            getElemBeingModified().style.height = `${value}px`
        })
    )

    getAttributesEl().append(
        textField('left', wall.left, (value) => {
            wall.left = Number(value)
            wall.right = null
            getElemBeingModified().style.left = `${value}px`
            getElemBeingModified().style.right = ''
            document.getElementById('right').value = ''
        })
    )

    getAttributesEl().append(
        textField('right', wall.right, (value) => {
            wall.right = Number(value)
            wall.left = null
            getElemBeingModified().style.right = `${value}px`
            getElemBeingModified().style.left = ''
            document.getElementById('left').value = ''
        })
    )

    getAttributesEl().append(
        textField('top', wall.top, (value) => {
            wall.top = Number(value)
            wall.bottom = null
            getElemBeingModified().style.top = `${value}px`
            getElemBeingModified().style.bottom = ''
            document.getElementById('bottom').value = ''
        })
    )

    getAttributesEl().append(
        textField('bottom', wall.bottom, (value) => {
            wall.bottom = Number(value)
            wall.top = null
            getElemBeingModified().style.bottom = `${value}px`
            getElemBeingModified().style.top = ''
            document.getElementById('top').value = ''
        })
    )

    getAttributesEl().append(
        textField('background', wall.background, (value) => {
            wall.background = value
            getElemBeingModified().style.background = value
        }, 'text')
    )
}