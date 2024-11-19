import { waypoints } from './waypoints.js'
import { manageLootAttribute } from '../loot.js'
import { addClass, containsClass } from '../../../util.js'
import { buildEnemy } from '../../../enemy/enemy-factory.js'
import { addEnemyContents, renderEnemies, renderEnemy, renderEnemyPaths } from '../../map-maker.js'
import { getEnemies, getItemBeingModified, getRoomBeingMade, setItemBeingModified } from '../../variables.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl, setElemBeingModified } from '../../elements.js'
import { autocomplete, difficultyAutoComplete, renderAttributes, input, updateMap, deleteButton } from '../shared.js'
import { 
    GRABBER,
    RANGER,
    ROCK_CRUSHER,
    SCORCHER,
    SOUL_DRINKER,
    SPIKER,
    STINGER,
    TORTURER,
    TRACKER } from '../../../enemy/enemy-constants.js'

export const renderEnemyAttributes = () => {
    const enemy = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        autocomplete('type', enemy.type, (value) => {
            setItemBeingModified(buildEnemy({...enemy, type: value}))
            updateMap(getEnemies(), getItemBeingModified(), 'enemy')
            const index = Number(getElemBeingModified().id.replace('enemy-', ''))
            const newEnemy = renderEnemy(getItemBeingModified(), index, false)
            addClass(newEnemy, 'in-modification')
            getElemBeingModified().parentElement.replaceChild(newEnemy, getElemBeingModified())
            setElemBeingModified(newEnemy)
            renderEnemyAttributes()
        }, 
        [TORTURER, SOUL_DRINKER, ROCK_CRUSHER, GRABBER, RANGER, SCORCHER, SPIKER, STINGER, TRACKER]
            .map(item => ({label: item, value: item}))
        )
    )

    getAttributesEl().append(waypoints(enemy.waypoint.points))

    getAttributesEl().append(
        input('level', enemy.level, (value) => {
            enemy.health = null
            enemy.damage = null
            setItemBeingModified(buildEnemy({...enemy, level: value}))
            updateMap(getEnemies(), getItemBeingModified(), 'enemy')
        }, 'number', 5, 1)
    )

    getAttributesEl().append(
        input('render progress', enemy.renderProgress, 
            (value) => enemy.renderProgress = String(value), 'number')
    )

    getAttributesEl().append(
        input('progresses to active', enemy.progress2Active.join(','), 
            (value) => enemy.progress2Active = value.split(','), 'text')
    )

    getAttributesEl().append(
        input('progresses to deactive', enemy.progress2Deactive.join(','), 
            (value) => enemy.progress2Deactive = value.split(','), 'text')
    )

    getAttributesEl().append(
        input('kill all', enemy.killAll, 
            (value) => enemy.killAll = String(value), 'number')
    )

    getAttributesEl().append(difficultyAutoComplete(enemy))

    getAttributesEl().append(
        autocomplete('virus', enemy.virus, (value) => {
            enemy.virus = value
            const enemyBody = getElemBeingModified().firstElementChild.firstElementChild 
            enemyBody.style.backgroundColor = value
            Array.from(enemyBody.children)
                .forEach(component => {
                    if ( !containsClass(component, 'fire') ) component.style.backgroundColor = value
                })         
        }, ['red', 'green', 'yellow', 'blue', 'purple'].map(color => ({label: color, value: color})))
    )

    manageLootAttribute(enemy, renderEnemyAttributes, true)

    getAttributesEl().append(
        deleteButton(() => {
            const enemyIndex = getElemBeingModified().id.replace(`enemy-`, '')
            const currentRoomEnemies = getEnemies().get(getRoomBeingMade())
            const filteredEnemies = 
                currentRoomEnemies
                .filter((item, index) => index !== Number(enemyIndex))

            getEnemies().set(getRoomBeingMade(), filteredEnemies)
            Array.from(document.querySelectorAll(`.enemy-${enemyIndex}-path`)).forEach(point => point.remove())
            getElemBeingModified().remove()
            Array.from(document.querySelectorAll('.enemy')).forEach(item => item.remove())
            renderEnemies()
            Array.from(document.querySelectorAll('.enemy-path')).forEach(item => item.remove())
            renderEnemyPaths()
            const parent = getSelectedToolEl().parentElement 
            Array.from(parent.children).filter(child => !containsClass(child, 'add-item')).forEach(child => child.remove())
            addEnemyContents(parent)
            if ( parent.children.length === 1 ) parent.previousSibling.click()
            else parent.firstElementChild.click()
        })
    )

}