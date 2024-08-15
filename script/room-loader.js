import { walls } from './walls.js'
import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { getProgress } from './progress.js'
import { isWeapon } from './weapon-details.js'
import { enemies } from './enemy/util/enemies.js'
import { interactables } from './interactables.js'
import { getCurrentRoomId, getRoomLeft, getRoomTop, setStunnedCounter } from './variables.js'
import { 
    GO_FOR_RANGED,
    LOST,
    MOVE_TO_POSITION,
    RANGER,
    SCORCHER,
    SPIKER,
    TRACKER } from './enemy/util/enemy-constants.js'
import { 
    addAttribute,
    addClass,
    addFireEffect,
    ANGLE_STATE_MAP,
    appendAll,
    createAndAddClass,
    nextId,
    object2Element,
    removeClass } from './util.js'
import { 
    getCurrentRoomEnemies,
    getCurrentRoomInteractables, 
    getCurrentRoomLoaders,
    getCurrentRoomSolid,
    getRoomContainer,
    setCurrentRoom,
    setCurrentRoomEnemies,
    setCurrentRoomFlames,
    setCurrentRoomInteractables,
    setCurrentRoomLoaders,
    setCurrentRoomBullets,
    setCurrentRoomSolid,
    setCurrentRoomPoisons,
    setCurrentRoomThrowables,
    } from './elements.js'

export const loadCurrentRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    setStunnedCounter(0)
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    setCurrentRoomInteractables([])
    setCurrentRoomEnemies([])
    setCurrentRoomBullets([])
    setCurrentRoomFlames([])
    setCurrentRoomPoisons([])
    setCurrentRoomThrowables([])
    const room2Render = createAndAddClass('div', `${getCurrentRoomId()}`)
    room2Render.style.width = `${room.width}px`
    room2Render.style.height = `${room.height}px`
    room2Render.style.left = `${getRoomLeft()}px`
    room2Render.style.top = `${getRoomTop()}px`
    room2Render.style.backgroundColor = `lightgray`
    renderWalls(room2Render)
    renderLoaders(room2Render)
    renderInteractables(room2Render)
    renderEnemies(room2Render)
    setCurrentRoom(room2Render)
    getRoomContainer().append(room2Render)
}

const renderWalls = (room2Render) => {
    walls.get(getCurrentRoomId()).forEach((elem, index) => {
        const wall = createAndAddClass('div', 'solid')
        wall.id = `wall-${index+1}`
        wall.style.backgroundColor = `darkgray`
        wall.style.width = `${elem.width}px`
        wall.style.height = `${elem.height}px`
        if ( elem.left !== undefined ) wall.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) wall.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) wall.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) wall.style.bottom = `${elem.bottom}px`
        if ( !elem.side ) {
            createTrackers(wall, elem)
            addAttribute(wall, 'side', false)  
        } else addAttribute(wall, 'side', true)    
        room2Render.append(wall)
        getCurrentRoomSolid().push(wall)
    })
}

const renderLoaders = (room2Render) => {
    loaders.get(getCurrentRoomId()).forEach((elem) => {
        const loader = createAndAddClass('div', elem.className, 'loader')
        loader.style.width = `${elem.width}px`
        loader.style.height = `${elem.height}px`
        loader.style.backgroundColor = `blue`
        if ( elem.left !== undefined ) loader.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) loader.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) loader.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) loader.style.bottom = `${elem.bottom}px`
        room2Render.append(loader)
        getCurrentRoomLoaders().push(loader)
    })
}

const createTrackers = (solid, elem) => {
    let left = true
    let top = true
    let right = true
    let bottom = true
    if ( elem.left === 0 ) left = false
    if ( elem.top === 0 ) top = false
    if ( elem.right === 0 ) right = false
    if ( elem.bottom === 0 ) bottom = false
    const topLeft = createAndAddClass('div', 'tl')
    const topRight = createAndAddClass('div', 'tr')
    const bottomLeft = createAndAddClass('div', 'bl')
    const bottomRight = createAndAddClass('div', 'br')
    if ( left && top ) solid.append(topLeft)
    if ( left && bottom ) solid.append(bottomLeft)
    if ( right && top ) solid.append(topRight)
    if ( right && bottom ) solid.append(bottomRight)
}

const renderInteractables = (room2Render) => 
    interactables.get(getCurrentRoomId())
        .forEach((interactable, index) => renderInteractable(room2Render, interactable, index))

export const renderInteractable = (root, interactable, index) => {
    const int = object2Element(interactable)
    addClass(int, 'interactable')
    setInteractableId(interactable, int, index)
    int.style.left = `${interactable.left}px`
    int.style.top = `${interactable.top}px`
    int.style.width = `${interactable.width}px`
    renderImage(int, interactable)
    renderPopUp(int, interactable)
    root.append(int)
    if ( interactable.solid ) {
        getCurrentRoomSolid().push(int)
        createTrackers(int, interactable)
    }    
    getCurrentRoomInteractables().push(int)
}

const setInteractableId = (interactable, int, index) => {
    if ( interactable.id != null ) return
    int.id = nextId()
    const newInteractables = interactables.get(getCurrentRoomId())
    newInteractables[index] = { ...interactable, id: +int.id }
    interactables.set(getCurrentRoomId(), newInteractables)
}

const renderImage = (int, interactable) => {
    const image = document.createElement('img')
    image.src = `../assets/images/${interactable.name}.png`
    int.append(image)
}

const renderPopUp = (int, interactable) => {
    const popup = createAndAddClass('div', 'ui-theme', 'popup')
    popup.style.bottom = `calc(100% - 20px)`
    popup.style.opacity = `0`
    renderHeading(popup, interactable)
    renderLine(popup)
    renderDescription(popup, interactable)
    int.append(popup)
}

const renderHeading = (popup, interactable) => {
    const heading = document.createElement('p')
    let content = interactable.amount && !isWeapon(interactable.name) ? 
    `${interactable.amount} ${interactable.heading}` : `${interactable.heading}`
    heading.textContent = content
    popup.append(heading)
}

const renderLine = (popup) => {
    const line = document.createElement('div')
    popup.append(line)
}

const renderDescription = (popup, interactable) => {
    const descContainer = document.createElement('div')
    const fButton = document.createElement('p')
    fButton.textContent = 'F'
    const descText = document.createElement('p')
    descText.textContent = `${interactable.popup}`
    appendAll(descContainer, fButton, descText)
    popup.append(descContainer)
}

const renderEnemies = (room2Render) => {
    const currentRoomEnemies = enemies.get(getCurrentRoomId())
    if ( !currentRoomEnemies ) return
    indexEnemies(currentRoomEnemies)
    const filteredEnemies = filterEnemies(currentRoomEnemies)
    spawnEnemies(filteredEnemies, room2Render)
}

const indexEnemies = (enemies) => enemies.forEach((enemy, index) => enemy.index = index)

const filterEnemies = (enemies) => enemies.filter(enemy => enemy.health !== 0 && getProgress(enemy.progress))

const spawnEnemies = (enemies, room2Render) => {
    enemies.forEach(elem => {
        const enemy = defineEnemy(elem)
        createPath(elem, elem.index, room2Render)
        const enemyCollider = createAndAddClass('div', 'enemy-collider', `${elem.type}-collider`)
        const enemyBody = createAndAddClass('div', 'enemy-body', `${elem.type}-body`, 'body-transition')
        enemyBody.style.transform = `rotateZ(${elem.angle}deg)`
        if ( elem.type === SPIKER ) removeClass(enemyBody, 'body-transition')
        enemyBody.style.backgroundColor = `${elem.virus}`
        defineComponents(elem, enemyBody)
        const vision = elem.type === TRACKER ? createAndAddClass('div', 'vision') : defineVision(elem)
        const fwDetector = defineForwardDetector(elem)
        appendAll(enemyCollider, enemyBody, vision, fwDetector)
        enemy.append(enemyCollider)
        room2Render.append(enemy)
        elem.sprite = enemy
        getCurrentRoomEnemies().push(elem)
        getCurrentRoomSolid().push(enemyCollider)
    })
}

const defineEnemy = (elem) => {
    const enemy = createAndAddClass('div', `${elem.type}`, 'enemy')
    elem.angle = elem.type === RANGER && elem.state === GO_FOR_RANGED ? Math.ceil(Math.random() * 7) : elem.angle
    elem.angleState = elem.type === RANGER && elem.state === GO_FOR_RANGED ? ANGLE_STATE_MAP.get(elem.angle) : elem.angleState
    elem.state = elem.type === TRACKER ? LOST : MOVE_TO_POSITION
    elem.investigationCounter = 0
    elem.path = `path-${elem.index}`
    elem.pathPoint = 0
    elem.pathFindingX = null
    elem.pathFindingY = null
    elem.currentSpeed = elem.acceleration
    elem.accelerationCounter = 0
    enemy.style.left = `${elem.x}px`
    enemy.style.top = `${elem.y}px`
    return enemy
}

const createPath = (elem, index, room2Render) => {
    const path = document.createElement('div')
    path.id = `path-${index}`
    for ( let p of elem.waypoint.points ) {
        const point = createAndAddClass('div', 'path-point')
        point.style.left = `${p.x}px`
        point.style.top = `${p.y}px`
        path.append(point)
    }
    room2Render.append(path)
}

const defineComponents = (element, enemyBody) => {
    for ( let componentNum = 1; componentNum < element.components; componentNum++ ) {
        const predicate = componentNum === element.components - 1 && element.type === SCORCHER
        const component = predicate ? addFireEffect() : document.createElement('div')
        if (!predicate) component.style.backgroundColor = `${element.virus}`
        addClass(component, `${element.type}-component`)
        manageEnemyCriticalPoints(element, component, componentNum)
        enemyBody.append(component)
    }
}

const manageEnemyCriticalPoints = (element, component, componentNum) => {
    if ( element.type === TRACKER ) addEnemyCriticalPoints(component, componentNum, 4, [7])
}

const addEnemyCriticalPoints = (component, componentNum, offset, weakpoints) => {
    if ( componentNum >= offset ) {
        getCurrentRoomSolid().push(component)
        if ( weakpoints.includes(componentNum) ) addClass(component, 'weak-point')
    }
}

const defineVision = (element) => {
    const vision = createAndAddClass('div', 'vision')
    vision.style.height = `${element.vision}px`
    for ( let i = 0; i < 100; i++ ) {
        const visionComponent = document.createElement('div')
        vision.append(visionComponent)
    }
    return vision
}

const defineForwardDetector = () => {
    const forwardDetector = createAndAddClass('div', 'enemy-forward-detector')
    forwardDetector.style.top = '50%'
    return forwardDetector
}