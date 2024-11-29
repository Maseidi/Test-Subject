import { getPlayer } from '../../elements.js'
import { containsClass } from '../../util.js'
import {addRoomContents, clearRoomOverview, renderSpawn} from '../map-maker.js'
import { renderAttributes, input, deleteButton, checkbox } from './shared.js'
import { getAttributesEl, getElemBeingModified, getRoomOverviewEl, getSelectedToolEl, getSpawnEl } from '../elements.js'
import { getEnemies,
    getInteractables,
    getItemBeingModified,
    getLoaders,
    getRoomBeingMade,
    getRooms,
    getSpawnRoom,
    getSpawnX,
    getSpawnY,
    getWalls,
    setRooms,
    setSpawnRoom,
    setSpawnX,
    setSpawnY } from '../variables.js'

export const renderRoomAttributes = () => {
    const room = getItemBeingModified()
    renderAttributes()

    const isThisSpawnRoom = getSpawnRoom() === getRoomBeingMade()

    getAttributesEl().append(
        checkbox('set as spawn room', isThisSpawnRoom, (value) => {
            if ( value ) {
                setSpawnRoom(getRoomBeingMade())
                renderSpawn()
            }
            else {
                setSpawnRoom(null)
                getSpawnEl().remove()
            }
            renderRoomAttributes()
        })
    )

    if ( isThisSpawnRoom ) {
        getAttributesEl().append(
            input('spawn x',
                getSpawnX(), (value) => {
                setSpawnX(value)
                getSpawnEl().style.left = `${value}px`
            }, 'number', () => room.width - 50, 20)
        )
    
        getAttributesEl().append(
            input('spawn y', getSpawnY(), (value) => {
                setSpawnY(value)
                getSpawnEl().style.top = `${value}px`
            }, 'number', () => room.height - 50, 20)
        )
    }

    getAttributesEl().append(
        input('width', room.width, (value) => {
            room.width = value
            getElemBeingModified().style.width = `${value}px`
        }, 'number', 3000, 400)
    )

    getAttributesEl().append(
        input('height', room.height, (value) => {
            room.height = value
            getElemBeingModified().style.height = `${value}px`
        }, 'number', 3000, 400)
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
        }, 'number', 10, 1)
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
            if ( getRooms().length === 0 ) clearRoomOverview()
            else getRoomOverviewEl().children[1].remove() // room-view
            getElemBeingModified().remove()
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children).filter(child => !containsClass(child, 'add-item')).forEach(child => child.remove())
            addRoomContents(parent)
            if ( parent.children.length === 1 ) parent.previousSibling.click()
            else parent.firstElementChild.click()
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