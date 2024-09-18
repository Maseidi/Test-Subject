import { NOTE } from './loot.js'
import { walls } from './walls.js'
import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { isWeapon } from './weapon-details.js'
import { enemies } from './enemy/util/enemies.js'
import { interactables } from './interactables.js'
import { renderRoomName } from './popup-manager.js'
import { countItem, updateInteractablePopup } from './inventory.js'
import { getCurrentRoomId, getRoomLeft, getRoomTop, setStunnedCounter } from './variables.js'
import { activateProgress, deactivateProgress, findProgressByName } from './progress-manager.js'
import { 
    LOST,
    MOVE_TO_POSITION,
    SCORCHER,
    SPIKER,
    TRACKER } from './enemy/util/enemy-constants.js'
import { 
    addAllAttributes,
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
    setCurrentRoomExplosions,
    setCurrentRoomDoors,
    getCurrentRoomDoors } from './elements.js'

export const loadCurrentRoom = () => {
    setStunnedCounter(0)
    initElements()
    const room2Render = renderRoom()
    renderWalls(room2Render)
    renderLoaders(room2Render)
    renderInteractables(room2Render)
    renderEnemies(room2Render)
    setCurrentRoom(room2Render)
    manageRoomProgress()
    getRoomContainer().append(room2Render)
}

const initElements = () => {
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    setCurrentRoomInteractables([])
    setCurrentRoomEnemies([])
    setCurrentRoomBullets([])
    setCurrentRoomFlames([])
    setCurrentRoomPoisons([])
    setCurrentRoomThrowables([])
    setCurrentRoomExplosions([])
    setCurrentRoomDoors([])
}

const renderRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    const room2Render = createAndAddClass('div', `${getCurrentRoomId()}`)
    room2Render.style.width =  `${room.width}px`
    room2Render.style.height = `${room.height}px`
    room2Render.style.left =   `${getRoomLeft()}px`
    room2Render.style.top =    `${getRoomTop()}px`
    room2Render.style.backgroundColor = `lightgray`
    return room2Render
}

const manageRoomProgress = () => {
    const room = rooms.get(getCurrentRoomId())
    activateProgress(room.progress2Active)
    deactivateProgress(room.progress2Deactive)
    renderRoomName(room.label)
}

const renderWalls = (room2Render) => {
    walls.get(getCurrentRoomId()).forEach((elem, index) => {
        const wall = createAndAddClass('div', 'solid')
        wall.id = `wall-${index+1}`
        wall.style.backgroundColor = `darkgray`
        wall.style.width = `${elem.width}px`
        wall.style.height = `${elem.height}px`
        if ( elem.left !== null )        wall.style.left = `${elem.left}px`
        else if ( elem.right !== null )  wall.style.right = `${elem.right}px`
        if ( elem.top !== null )         wall.style.top = `${elem.top}px`
        else if ( elem.bottom !== null ) wall.style.bottom = `${elem.bottom}px`
        if ( !elem.side ) {
            createTrackers(wall, elem)
            wall.setAttribute('side', false)  
        } else wall.setAttribute('side', true)    
        room2Render.append(wall)
        getCurrentRoomSolid().push(wall)
    })
}

const createTrackers = (solid, elem) => {
    let left = true
    let top = true
    let right = true
    let bottom = true
    if ( elem.left === 0 )   left = false
    if ( elem.top === 0 )    top = false
    if ( elem.right === 0 )  right = false
    if ( elem.bottom === 0 ) bottom = false
    const topLeft =     createAndAddClass('div', 'tl')
    const topRight =    createAndAddClass('div', 'tr')
    const bottomLeft =  createAndAddClass('div', 'bl')
    const bottomRight = createAndAddClass('div', 'br')
    if ( left && top )     solid.append(topLeft)
    if ( left && bottom )  solid.append(bottomLeft)
    if ( right && top )    solid.append(topRight)
    if ( right && bottom ) solid.append(bottomRight)
}

const renderLoaders = (room2Render) => {
    loaders.get(getCurrentRoomId()).forEach((elem) => {
        const loader = createAndAddClass('div', elem.className, 'loader')
        loader.style.width = `${elem.width}px`
        loader.style.height = `${elem.height}px`
        if ( elem.left !== null )        loader.style.left = `${elem.left}px`
        else if ( elem.right !== null )  loader.style.right = `${elem.right}px`
        if ( elem.top !== null )         loader.style.top = `${elem.top}px`
        else if ( elem.bottom !== null ) loader.style.bottom = `${elem.bottom}px`  
        const door = elem.door
        if ( door ) {
            if ( (door.renderProgress && !findProgressByName(door.renderProgress)) || enemiesLeft(door) ) var open = false
            else var open = true
            renderDoor(elem, room2Render, open)
            }
        room2Render.append(loader)
        getCurrentRoomLoaders().push(loader)
    })
}

const enemiesLeft = (object) => {
    const killAll = object.killAll
    if ( !killAll ) return false
    return enemies.get(getCurrentRoomId()).find(enemy => enemy.health !== 0 && enemy.renderProgress <= killAll)
}

export const renderDoor = (loader, room2Render, open) => {    
    const { door: doorObj, width, height, left, top, right, bottom } = loader
    const doorElem = object2Element(doorObj)
    addClass(doorElem, 'door')
    addClass(doorElem, 'interactable')
    if ( open ) addClass(doorElem, 'open')
    doorElem.style.backgroundColor = doorObj.color
    doorElem.style.width = `${width}px`
    doorElem.style.height = `${height}px`
    addPosition(doorElem, left, 'left', 'hor', doorObj.type)
    addPosition(doorElem, right, 'right', 'hor', doorObj.type)
    addPosition(doorElem, top, 'top', 'ver', doorObj.type)
    addPosition(doorElem, bottom, 'bottom', 'ver', doorObj.type)
    doorObj.isDoor = true
    renderPopUp(doorElem, doorObj)
    getCurrentRoomSolid().push(doorElem)
    getCurrentRoomInteractables().push(doorElem)
    getCurrentRoomDoors().push(doorElem)
    room2Render.append(doorElem)
}

const addPosition = (doorElem, input, direction, className, type) => {
    const output = (() => {
        if ( input === 26 || input === -26 ) return 0
        else if ( input !== null ) return input
    })()
    if ( output ) addClass(doorElem, `${className}-${type}`)
    doorElem.style[direction] = `${output}px`
}

const renderInteractables = (room2Render) => 
    interactables.get(getCurrentRoomId())
        .forEach((interactable, index) => renderInteractable(room2Render, interactable, index))

export const renderInteractable = (root, interactable, index) => {
    if ( !findProgressByName(interactable.renderProgress) ) return
    if ( enemiesLeft(interactable) ) return
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
    updateInteractablePopup(int)
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
    handleLeverImage(interactable, image)
    int.append(image)
}

const handleLeverImage = (interactable, image) => {
    if ( interactable.name !== 'lever' ) return
    const toggle1 = interactable.progress2Active
    if ( findProgressByName(toggle1) ) image.style.transform = `scale(-1, 1)` 
}

const renderPopUp = (int, interactable) => {
    const popup = createAndAddClass('div', 'ui-theme', 'popup')
    handleVaccinePopup(popup, interactable)
    popup.style.bottom = `calc(100% - 20px)`
    popup.style.opacity = `0`
    renderHeading(popup, interactable)
    renderLine(popup)
    renderDescription(popup, interactable)
    int.append(popup)
}

const handleVaccinePopup = (popup, interactable) => {
    if ( !interactable.popup.includes('vaccine') ) return
    if ( countItem(interactable.popup) === 0 ) addClass(popup, 'not-ideal')
}

const renderHeading = (popup, interactable) => {
    const heading = document.createElement('p')
    heading.textContent = getHeadingContent(interactable)
    popup.append(heading)
}

const getHeadingContent = (interactable) => {
    const {name, amount, examined, heading} = interactable
    if ( name === 'note' && !examined ) return 'Note'
    return amount && !isWeapon(name) && !name.includes('key') && name !== 'note'  ? `${amount} ${heading}` : `${heading}`
}

const renderLine = (popup) => {
    const line = document.createElement('div')
    popup.append(line)
}

const renderDescription = (popup, interactable) => {
    const descContainer = document.createElement('div')
    const appendList = []
    const fButton = createAndAddClass('p', 'interactable-btn')
    fButton.textContent = 'F'
    const needCodeDoor = interactable.isDoor && interactable.code
    if ( !interactable.isDoor || needCodeDoor ) appendList.push(fButton)
    appendList.push(getDescriptionContent(interactable, needCodeDoor))
    appendAll(descContainer, ...appendList)
    popup.append(descContainer)
}

const getDescriptionContent = (interactable, needCode) => {
    let descContent = document.createElement('p')
    if ( needCode ) descContent.textContent = 'Enter code'
    else if ( interactable.popup.includes('vaccine') ) {
        descContent = document.createElement('img')
        descContent.src = `/assets/images/${interactable.popup}.png`
    }
    else descContent.textContent = interactable.popup
    return descContent
}

const renderEnemies = (room2Render) => {
    const currentRoomEnemies = enemies.get(getCurrentRoomId())
    if ( !currentRoomEnemies ) return
    indexEnemies(currentRoomEnemies)
    const filteredEnemies = filterEnemies(currentRoomEnemies)
    spawnEnemies(filteredEnemies, room2Render)
}

const indexEnemies = (enemies) => enemies.forEach((enemy, index) => enemy.index = index)

const filterEnemies = (enemies) => enemies.filter(enemy => 
    enemy.health !== 0 && findProgressByName(enemy?.renderProgress) && !enemiesLeft(enemy)
)

const spawnEnemies = (enemies, room2Render) => enemies.forEach(elem => spawnEnemy(elem, room2Render))

export const spawnEnemy = (elem, room2Render) => {
    const enemy = defineEnemy(elem)
    createPath(elem, elem.index, room2Render)
    const enemyCollider = createAndAddClass('div', 'enemy-collider', `${elem.type}-collider`)
    const enemyBody = createAndAddClass('div', 'enemy-body', `${elem.type}-body`, 'body-transition')
    enemyBody.style.transform = `rotateZ(${elem.angle}deg)`
    if ( elem.type === SPIKER ) removeClass(enemyBody, 'body-transition')
    enemyBody.style.backgroundColor = `${elem.virus}`
    defineComponents(elem, enemyBody)
    const vision = defineVision(elem)
    appendAll(
        enemyCollider, enemyBody, vision, 
        createAndAddClass('div', `enemy-forward-detector`)
    )
    const backwardDetector = defineBackwardDetector(elem)
    if ( backwardDetector ) enemyCollider.append(backwardDetector)
    enemy.append(enemyCollider)
    room2Render.append(enemy)
    elem.sprite = enemy
    getCurrentRoomEnemies().push(elem)
    getCurrentRoomSolid().push(enemyCollider)
}

const defineEnemy = (elem) => {
    initEnemyStats(elem)
    const enemy = createAndAddClass('div', `${elem.type}`, 'enemy')
    enemy.style.left = `${elem.x}px`
    enemy.style.top = `${elem.y}px`
    handleEnemyLoot(elem, enemy)
    return enemy
}

const initEnemyStats = (element) => {
    element.angle = Math.ceil(Math.random() * 8) * 45 - 180
    element.angleState = ANGLE_STATE_MAP.get(element.angle)
    element.state = element.type === TRACKER ? LOST : MOVE_TO_POSITION
    element.investigationCounter = 0
    element.pathPoint = 0
    element.pathFindingX = null
    element.pathFindingY = null
    element.currentSpeed = element.acceleration
    element.accelerationCounter = 0
}

const handleEnemyLoot = (element, enemy) => {
    if ( !element.loot ) return    
    const { name, amount, progress2Active, progress2Deactive } = element.loot
    addAllAttributes(
        enemy,
        'loot-name',        name,
        'loot-amount',      amount,
        'loot-active',      progress2Active,
        'loot-deactive',    progress2Deactive,
    )
    handleNoteLoot(element, enemy, name)
    handleKeyLoot(element, enemy, name)
}

const handleNoteLoot = (element, enemy, name) => {
    if ( name !== NOTE ) return
    const { data, code, heading, description } = element.loot
    addAllAttributes(
        enemy,
        'note-data',        data,
        'note-code',        code,
        'note-heading',     heading,
        'note-description', description
    )
}

const handleKeyLoot = (element, enemy, name) => {
    if ( !name.includes('key') ) return
    const { code, heading, description, unlocks } = element.loot
    addAllAttributes(
        enemy,
        'key-code',        code,
        'key-heading',     heading,
        'key-description', description,
        'key-unlocks',     unlocks
    )
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
        enemyBody.append(component)
    }
}

const defineVision = (element) => {
    if ( element.type === TRACKER ) return createAndAddClass('div', 'vision')
    const vision = createAndAddClass('div', 'vision')
    vision.style.height = `${element.vision}px`
    for ( let i = 0; i < 20; i++ ) {
        const visionComponent = document.createElement('div')
        vision.append(visionComponent)
    }
    return vision
}

const defineBackwardDetector = (enemyObject) => {
    if ( [SPIKER, TRACKER].includes(enemyObject.type) ) return
    const backwardDetector = createAndAddClass('div', `enemy-backward-detector`)
    addAllAttributes(
        backwardDetector,
        'name', 'vaccine',
        'heading', 'Stealth kill',
        'popup', `${enemyObject.virus}vaccine`
    )
    addClass(backwardDetector, 'interactable')
    renderPopUp(backwardDetector, {heading: 'Stealth kill', popup: `${enemyObject.virus}vaccine`})
    getCurrentRoomInteractables().push(backwardDetector)
    return backwardDetector
}