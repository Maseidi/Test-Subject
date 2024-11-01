import { renderAttributes, input, deleteButton } from './shared.js'
import { getAttributesEl, getElemBeingModified, getRoomOverviewEl, getSelectedToolEl } from '../elements.js'
import { getEnemies, getInteractables, getItemBeingModified, getLoaders, getRooms, getWalls, setRooms} from '../variables.js'

export const renderRoomAttributes = () => {
    const room = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        input('width', room.width, (value) => {
            room.width = value
            getElemBeingModified().style.width = `${value}px`
        })
    )

    getAttributesEl().append(
        input('height', room.height, (value) => {
            room.height = value
            getElemBeingModified().style.height = `${value}px`
        })
    )

    getAttributesEl().append(
        input('label', room.label, (value) => {
            if ( value === '' ) return
            room.label = value
            getSelectedToolEl().textContent = value
        }, 'text')
    )

    getAttributesEl().append(
        input('brightness', room.brightness, (value) => {
            room.brightness = value
        }, 'number', 9, 1)
    )

    getAttributesEl().append(
        input('progresses to active', progress2String(room.progress2Active), (value) => {
            room.progress2Active = extractCondition(value)
        }, 'text')
    )

    getAttributesEl().append(
        input('progresses to deactive', progress2String(room.progress2Deactive), (value) => {
            room.progress2Deactive = extractCondition(value)
        }, 'text')
    )

    getAttributesEl().append(
        input('background', room.background, (value) => {
            room.background = value
            getElemBeingModified().style.background = value
        }, 'color')
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredRooms = getRooms().filter(item => item.id !== room.id)
            setRooms(filteredRooms.map((item, index) => ({...item, id: index + 1})))
            getInteractables().delete(room.id)
            getWalls().delete(room.id)
            getEnemies().delete(room.id)
            getLoaders().delete(room.id)
            getRoomOverviewEl().children[1].remove()
            getElemBeingModified().remove()
        })
    )
}

const progress2String = (progress) => 
    progress.map(item => item.condition ? `${item.condition}-${item.value}` : item).join(',')

const extractCondition = (value) => value.split(',').map(elem => {
    const withCondition = elem.split('-')
    if ( withCondition.length === 2 ) return {condition: withCondition[0], value: withCondition[1]}
    else return elem 
})