import { Point } from '../../../path.js'
import { input } from '../shared.js'
import { getElemBeingModified } from '../../elements.js'
import { getItemBeingModified } from '../../variables.js'
import { addClass, appendAll, createAndAddClass } from '../../../util.js'
import { addItemButton, renderEnemyPath, renderPoint } from '../../map-maker.js'
import { TRACKER } from '../../../enemy/enemy-constants.js'

let currentEnemyIndex
let waypointsContainer
export const waypoints = (innerValue) => {
    currentEnemyIndex = getElemBeingModified().id.replace('enemy-', '')
    waypointsContainer = createAndAddClass('div', 'waypoints-container')
    renderWaypointsContents(innerValue)
    return waypointsContainer
}

const renderWaypointsContents = (innerValue) => {
    waypointsContainer.innerHTML = ''
    innerValue.forEach((point, index) => {
        const pointContainer = renderPointContainer(innerValue, point, index)
        waypointsContainer.append(pointContainer)
    })
    if ( getItemBeingModified().type === TRACKER ) return
    const addItem = addItemButton('add point')
    addItem.addEventListener('click', (e) => {
        const newPoint = new Point(0, 0)
        innerValue.push(newPoint)
        e.currentTarget.before(renderPointContainer(innerValue, newPoint, innerValue.length - 1))
        renderPoint(currentEnemyIndex, innerValue.length - 1, newPoint.x, newPoint.y)
    })
    waypointsContainer.append(addItem)
}

const renderPointContainer = (innerValue, point, index) => {
    const pointContainer = createAndAddClass('div', 'point-container')
    const xContainer = createAndAddClass('div', 'coordinate-container')
    xContainer.append(input('x' + index, point.x, (value) => {
        innerValue[index].x = value
        document.querySelector(`.enemy-${currentEnemyIndex}-path.enemy-path-${index}`).style.left = `${value}px`
        if ( index === 0 ) getElemBeingModified().style.left = `${value}px`
    }, 'number'))
    const yContainer = createAndAddClass('div', 'coordinate-container')
    yContainer.append(input('y' + index, point.y, (value) => {
        innerValue[index].y = value
        document.querySelector(`.enemy-${currentEnemyIndex}-path.enemy-path-${index}`).style.top = `${value}px`
        if ( index === 0 ) getElemBeingModified().style.top = `${value}px`
    }, 'number'))
    const removeContainer = createAndAddClass('div', 'remove-container')
    const removeBtn = createAndAddClass('button', 'popup-cancel')
    if ( index === 0 ) {
        removeBtn.style.backgroundColor = 'grey'
        addClass(removeBtn, 'disabled-cancel')
    }
    else {
        removeBtn.addEventListener('click', (e) => {
            innerValue.splice(index, 1)
            renderWaypointsContents(innerValue)
            Array.from(document.querySelectorAll(`.enemy-${currentEnemyIndex}-path.enemy-path`)).forEach(elem => elem.remove())
            renderEnemyPath(getItemBeingModified(), currentEnemyIndex)
        })
    }
    const removeImg = new Image()
    removeImg.src = './assets/images/cancel.png'
    removeBtn.append(removeImg)
    removeContainer.append(removeBtn)
    appendAll(pointContainer, xContainer, yContainer, removeContainer)
    return pointContainer
}