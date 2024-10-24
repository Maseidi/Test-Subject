import { getItemBeingModified} from '../variables.js'
import { renderAttributes, textField } from './shared.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl } from '../elements.js'

export const renderRoomAttributes = () => {
    const room = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        textField('width', room.width, (value) => {
            room.width = Number(value)
            getElemBeingModified().style.width = `${value}px`
        })
    )

    getAttributesEl().append(
        textField('height', room.height, (value) => {
            room.height = Number(value)
            getElemBeingModified().style.height = `${value}px`
        })
    )

    getAttributesEl().append(
        textField('label', room.label, (value) => {
            if ( value === '' ) return
            room.label = value
            getSelectedToolEl().textContent = value
        }, 'text')
    )

    getAttributesEl().append(
        textField('brightness', room.brightness, (value) => {
            room.brightness = value
            getElemBeingModified().style.opacity = `${value/9}`
        }, 'number', 9, 1)
    )

    getAttributesEl().append(
        textField('progresses to active', progress2String(room.progress2Active), (value) => {
            room.progress2Active = extractCondition(value)
        }, 'text')
    )

    getAttributesEl().append(
        textField('progresses to deactive', progress2String(room.progress2Deactive), (value) => {
            room.progress2Deactive = extractCondition(value)
        }, 'text')
    )

    getAttributesEl().append(
        textField('background', room.background, (value) => {
            room.background = value
            getElemBeingModified().style.background = value
        }, 'text')
    )
}

const progress2String = (progress) => 
    progress.map(item => item.condition ? `${item.condition}-${item.value}` : item).join(',')

const extractCondition = (value) => value.split(',').map(elem => {
    const withCondition = elem.split('-')
    if ( withCondition.length === 2 ) return {condition: withCondition[0], value: withCondition[1]}
    else return elem 
})