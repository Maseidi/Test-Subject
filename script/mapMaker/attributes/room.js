import { containsClass } from '../../util.js'
import { getAttributesEl, getElemBeingModified, getRoomOverviewEl, getSelectedToolEl, getSpawnEl } from '../elements.js'
import { addRoomContents, clearRoomOverview, renderSpawn } from '../map-maker.js'
import {
    getEnemies,
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
    setSpawnY,
} from '../variables.js'
import { checkbox, deleteButton, input, renderAttributes } from './shared.js'

export const renderRoomAttributes = () => {
    const room = getItemBeingModified()
    renderAttributes()

    const isThisSpawnRoom = getSpawnRoom() === getRoomBeingMade()

    getAttributesEl().append(
        checkbox(
            'set as spawn room',
            isThisSpawnRoom,
            value => {
                if (value) {
                    setSpawnRoom(getRoomBeingMade())
                    renderSpawn()
                } else {
                    setSpawnRoom(null)
                    getSpawnEl().remove()
                }
                renderRoomAttributes()
            },
            'Set this room as the starting point of the game',
        ),
    )

    if (isThisSpawnRoom) {
        getAttributesEl().append(
            input(
                'spawn x',
                getSpawnX(),
                value => {
                    setSpawnX(value)
                    getSpawnEl().style.left = `${value}px`
                },
                'number',
                () => room.width - 50,
                20,
                undefined,
                'Set the x coordinate of where the player spawns in the room',
            ),
        )

        getAttributesEl().append(
            input(
                'spawn y',
                getSpawnY(),
                value => {
                    setSpawnY(value)
                    getSpawnEl().style.top = `${value}px`
                },
                'number',
                () => room.height - 50,
                20,
                undefined,
                'Set the y coordinate of where the player spawns in the room',
            ),
        )
    }

    getAttributesEl().append(
        input(
            'width',
            room.width,
            value => {
                room.width = value
                getElemBeingModified().style.width = `${value}px`
            },
            'number',
            3000,
            undefined,
            undefined,
            'Set the width of the room',
        ),
    )

    getAttributesEl().append(
        input(
            'height',
            room.height,
            value => {
                room.height = value
                getElemBeingModified().style.height = `${value}px`
            },
            'number',
            3000,
            undefined,
            undefined,
            'Set the height of the room',
        ),
    )

    getAttributesEl().append(
        input(
            'label',
            room.label,
            value => {
                if (value === '') return
                room.label = value
                getSelectedToolEl().textContent = value
            },
            'text',
            null,
            null,
            null,
            'Modify the label for the room',
        ),
    )

    getAttributesEl().append(
        input(
            'brightness',
            room.brightness,
            value => {
                room.brightness = value
            },
            'number',
            10,
            1,
            undefined,
            'Used to change brightness of the room, higher is brighter.',
        ),
    )

    getAttributesEl().append(
        input(
            'progresses to active',
            progress2String(room.progress2Active),
            value => {
                room.progress2Active = extractCondition(value)
            },
            'text',
            null,
            null,
            null,
            'Splitable string that indicates which flags of the game activate when entering the room. Example formats: <b>1000</b> (just activates 1000) or <b>1000,2000</b> (activates flags 1000 and 2000) or <b>1000-1001,2000-2001</b> (if flag 1000 is active, activate flag 1001 and ...)',
        ),
    )

    getAttributesEl().append(
        input(
            'progresses to deactive',
            progress2String(room.progress2Deactive),
            value => {
                room.progress2Deactive = extractCondition(value)
            },
            'text',
            null,
            null,
            null,
            'Splitable string that indicates which flags of the game deactivate when entering the room. Example formats: <b>1000</b> (just deactivates 1000) or <b>1000,2000</b> (deactivates flags 1000 and 2000) or <b>1000-1001,2000-2001</b> (if flag 1000 is active, deactivate flag 1001 and ...)',
        ),
    )

    getAttributesEl().append(
        input(
            'background',
            room.background,
            value => {
                room.background = value
                getElemBeingModified().style.background = value
            },
            'color',
            null,
            null,
            null,
            'Changes the room background',
        ),
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredRooms = getRooms().filter(item => item.id !== room.id)
            setRooms(filteredRooms.map((item, index) => ({ ...item, id: index + 1 })))
            getInteractables().delete(room.id)
            getWalls().delete(room.id)
            getEnemies().delete(room.id)
            getLoaders().delete(room.id)
            if (getRooms().length === 0) clearRoomOverview()
            else getRoomOverviewEl().children[1].remove() // room-view
            getElemBeingModified().remove()
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addRoomContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}

const progress2String = progress =>
    progress.map(item => (item.condition ? `${item.condition}-${item.value}` : item)).join(',')

const extractCondition = value =>
    value.split(',').map(elem => {
        const withCondition = elem.split('-')
        if (withCondition.length === 2) return { condition: withCondition[0], value: withCondition[1] }
        else return elem
    })
