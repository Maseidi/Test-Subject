import { getItemBeingModified } from '../variables.js'
import { renderAttributes, textField } from './shared.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl } from '../elements.js'

export const renderRoomAttributes = () => {    
    renderAttributes()
    getAttributesEl().append(textField('width', getItemBeingModified().width, (value) => {
        getItemBeingModified().width = Number(value)
        getElemBeingModified().style.width = `${value}px`
    }))
    getAttributesEl().append(textField('height', getItemBeingModified().height, (value) => {
        getItemBeingModified().height = Number(value)
        getElemBeingModified().style.height = `${value}px`
    }))
    getAttributesEl().append(textField('label', getItemBeingModified().label, (value) => {
        if ( value === '' ) return
        getItemBeingModified().label = value
        getSelectedToolEl().textContent = value
    }, 'text'))
    getAttributesEl().append(textField('darkness', getItemBeingModified().darkness, (value) => {
        getItemBeingModified().darkness = value
        getElemBeingModified().style.backgroundColor = `rgba(255, 255, 255, ${value/10})`
    }, 'number', 9))
}