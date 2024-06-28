import { walls } from './walls.js'
import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { enemies } from './enemies.js'
import { getProgress } from './progress.js'
import { interactables } from './interactables.js'
import { getWeaponSpecs } from './weapon-specs.js'
import { getCurrentRoomId, getRoomLeft, getRoomTop } from './variables.js'
import { addAttribute, addClass, appendAll, createAndAddClass, objectToElement } from './util.js'
import { 
    getCurrentRoomEnemies,
    getCurrentRoomInteractables, 
    getCurrentRoomLoaders,
    getCurrentRoomSolid,
    getRoomContainer,
    setCurrentRoom,
    setCurrentRoomEnemies,
    setCurrentRoomInteractables,
    setCurrentRoomLoaders,
    setCurrentRoomSolid,
    } from './elements.js'
import { INVESTIGATE } from './normal-enemy.js'

export const loadCurrentRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    setCurrentRoomInteractables([])
    setCurrentRoomEnemies([])
    const roomToRender = createAndAddClass('div', `${getCurrentRoomId()}`)
    roomToRender.style.width = `${room.width}px`
    roomToRender.style.height = `${room.height}px`
    roomToRender.style.left = `${getRoomLeft()}px`
    roomToRender.style.top = `${getRoomTop()}px`
    roomToRender.style.backgroundColor = `lightgray`
    renderWalls(roomToRender)
    renderLoaders(roomToRender)
    renderInteractables(roomToRender)
    renderEnemies(roomToRender)
    setCurrentRoom(roomToRender)
    getRoomContainer().append(roomToRender)
}

const renderWalls = (roomToRender) => {
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
        roomToRender.append(wall)
        getCurrentRoomSolid().push(wall)
    })
}

const renderLoaders = (roomToRender) => {
    loaders.get(getCurrentRoomId()).forEach((elem) => {
        const loader = createAndAddClass('div', elem.className, 'loader')
        loader.style.width = `${elem.width}px`
        loader.style.height = `${elem.height}px`
        loader.style.backgroundColor = `blue`
        if ( elem.left !== undefined ) loader.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) loader.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) loader.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) loader.style.bottom = `${elem.bottom}px`
        roomToRender.append(loader)
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
    const topLeft = createAndAddClass('div', 'top-left')
    const topRight = createAndAddClass('div', 'top-right')
    const bottomLeft = createAndAddClass('div', 'bottom-left')
    const bottomRight = createAndAddClass('div', 'bottom-right')
    if ( left && top ) solid.append(topLeft)
    if ( left && bottom ) solid.append(bottomLeft)
    if ( right && top ) solid.append(topRight)
    if ( right && bottom ) solid.append(bottomRight)
}

const renderInteractables = (roomToRender) => 
    interactables.get(getCurrentRoomId())
        .forEach((interactable, index) => interactable && renderInteractable(roomToRender, interactable, index))

export const renderInteractable = (root, interactable, index) => {
    const int = objectToElement(interactable)
    addClass(int, 'interactable')
    int.id = `${getCurrentRoomId()}-${index}`
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
    let content = interactable.amount && !getWeaponSpecs().get(interactable.name) ? 
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

const renderEnemies = (roomToRender) => {
    const currentRoomEnemies = enemies.get(getCurrentRoomId())
    if ( !currentRoomEnemies ) return
    const indexedEnemies = indexEnemies(currentRoomEnemies)
    const filteredEnemies = filterEnemies(indexedEnemies)
    spawnEnemies(filteredEnemies, roomToRender)
}

const indexEnemies = (enemies) => enemies.map((enemy, index) => { return {...enemy, index} })

const filterEnemies = (enemies) => enemies.filter(enemy => enemy.health !== 0 && getProgress(enemy.progress))

const spawnEnemies = (enemies, roomToRender) => {
    enemies.forEach(elem => {
        const enemy = defineEnemy(elem)
        createPath(elem, elem.index, roomToRender)
        const enemyCollider = createAndAddClass('div', 'enemy-collider', `${elem.type}-collider`)
        const enemyBody = createAndAddClass('div', `${elem.type}-body`, 'body-transition')
        enemyBody.style.backgroundColor = `${elem.virus}`
        defineComponents(elem, enemyBody)
        const vision = defineVision(elem)
        const fwDetector = defineForwardDetector(elem)
        appendAll(enemyCollider, enemyBody, vision, fwDetector)
        enemy.append(enemyCollider)
        roomToRender.append(enemy)
        getCurrentRoomEnemies().push(enemy)
        getCurrentRoomSolid().push(enemyCollider)
    })
}

const defineEnemy = (element) => {
    const enemy = objectToElement(element)
    addClass(enemy, `${element.type}`)
    addClass(enemy, 'enemy')
    addAttribute(enemy, 'state', INVESTIGATE)
    addAttribute(enemy, 'investigation-counter', 0)
    addAttribute(enemy, 'path', `path-${element.index}`)
    addAttribute(enemy, 'path-point', '0')
    addAttribute(enemy, 'path-finding-x', 'null')
    addAttribute(enemy, 'path-finding-y', 'null')
    addAttribute(enemy, 'curr-speed', element.acceleration)
    addAttribute(enemy, 'acc-counter', 0)
    enemy.style.left = `${element.path.points[0].x}px`
    enemy.style.top = `${element.path.points[0].y}px`
    return enemy
}

const createPath = (elem, index, roomToRender) => {
    const path = document.createElement('div')
    path.id = `path-${index}`
    for ( let p of elem.path.points ) {
        const point = createAndAddClass('div', 'path-point')
        point.style.left = `${p.x}px`
        point.style.top = `${p.y}px`
        path.append(point)
    }
    roomToRender.append(path)
}

const defineComponents = (element, enemyBody) => {
    for ( let componentNum = 1; componentNum < element.components; componentNum++ ) {
        const component = createAndAddClass('div', `${element.type}-component`)
        component.style.backgroundColor = `${element.virus}`
        manageEnemyCriticalPoints(element, component, componentNum)
        enemyBody.append(component)
    }
}

const manageEnemyCriticalPoints = (element, component, componentNum) => {
    if ( element.type === 'iron-master' ) addEnemyCriticalPoints(component, componentNum, 4, [7])
}

const addEnemyCriticalPoints = (component, componentNum, offset, weakpoints) => {
    if ( componentNum >= offset ) {
        getCurrentRoomSolid().push(component)
        if ( weakpoints.includes(componentNum) ) addClass(component, 'weak-point')
    }
}

const defineVision = (element) => {
    const vision = createAndAddClass('div', 'vision')
    vision.style.top = '50%'
    vision.style.width = `${element.vision}px`
    vision.style.height = `${element.vision}px`
    return vision
}

const defineForwardDetector = () => {
    const forwardDetector = createAndAddClass('div', 'enemy-forward-detector')
    forwardDetector.style.top = '50%'
    return forwardDetector
}