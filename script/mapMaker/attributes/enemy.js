import { renderEnemy } from '../map-maker.js'
import { manageLootAttribute } from './loot.js'
import { buildEnemy } from '../../enemy/enemy-factory.js'
import { getEnemies, getItemBeingModified, setItemBeingModified } from '../variables.js'
import { getAttributesEl, getElemBeingModified, setElemBeingModified } from '../elements.js'
import { autocomplete, difficultyAutoComplete, renderAttributes, textField, updateMap } from './shared.js'
import { 
    GRABBER,
    RANGER,
    ROCK_CRUSHER,
    SCORCHER,
    SOUL_DRINKER,
    SPIKER,
    STINGER,
    TORTURER,
    TRACKER } from '../../enemy/enemy-constants.js'
import { addClass } from '../../util.js'

export const renderEnemyAttributes = () => {
    const enemy = getItemBeingModified()
    renderAttributes()

    getAttributesEl().append(
        autocomplete('type', enemy.type, (value) => {
            setItemBeingModified(buildEnemy({...enemy, type: value}))
            updateMap(getEnemies(), getItemBeingModified(), 'enemy')
            const index = Number(getElemBeingModified().id.replace('enemy-', ''))
            const newEnemy = renderEnemy(getItemBeingModified(), index)
            addClass(newEnemy, 'in-modification')
            getElemBeingModified().parentElement.replaceChild(newEnemy, getElemBeingModified())
            setElemBeingModified(newEnemy)
        }, 
        [TORTURER, SOUL_DRINKER, ROCK_CRUSHER, GRABBER, RANGER, SCORCHER, SPIKER, STINGER, TRACKER]
            .map(item => ({label: item, value: item}))
        )
    )

    getAttributesEl().append(
        textField('level', enemy.level, (value) => enemy.level = value, 'number', 5, 1)
    )

    getAttributesEl().append(
        textField('render progress', enemy.renderProgress, 
            (value) => enemy.renderProgress = value, 'number')
    )

    getAttributesEl().append(
        textField('progresses to active', enemy.progress2Active.join(','), 
            (value) => enemy.progress2Active = value.split(','), 'text')
    )

    getAttributesEl().append(
        textField('progresses to deactive', enemy.progress2Deactive.join(','), 
            (value) => enemy.progress2Deactive = value.split(','), 'text')
    )

    getAttributesEl().append(
        textField('kill all', enemy.killAll, 
            (value) => enemy.killAll = value, 'number')
    )

    getAttributesEl().append(difficultyAutoComplete(enemy))

    getAttributesEl().append(
        autocomplete('virus', enemy.virus, (value) => {
            enemy.virus = value
            const enemyBody = getElemBeingModified().firstElementChild.firstElementChild 
            enemyBody.style.backgroundColor = value
            Array.from(enemyBody.children).forEach(component => component.style.backgroundColor = value)
        }, ['red', 'green', 'yellow', 'blue', 'purple'].map(color => ({label: color, value: color})))
    )

    manageLootAttribute(enemy, renderEnemyAttributes, true)

}