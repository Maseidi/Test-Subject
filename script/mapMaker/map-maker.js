import { Room } from '../room.js'
import { Wall } from '../wall.js'
import { TopLoader } from '../loader.js'
import { PistolAmmo } from '../interactables.js'
import { Torturer } from '../enemy/type/normal-enemy.js'
import { defineEnemyComponents } from '../room-loader.js'
import { renderWallAttributes } from './attributes/wall.js'
import { renderRoomAttributes } from './attributes/room.js'
import { renderEnemyAttributes } from './attributes/enemy.js'
import { renderLoaderAttributes } from './attributes/loader.js'
import { renderInteractableAttributes } from './attributes/interactable.js'
import { addClass, appendAll, containsClass, createAndAddClass, removeClass } from '../util.js'
import { 
    getEnemies,
    getInteractables,
    getItemBeingModified,
    getLoaders,
    getRoomBeingMade,
    getRooms,
    getWalls,
    setItemBeingModified,
    setRoomBeingMade } from './variables.js'
import { 
    getElemBeingModified,
    getRoomOverviewEl,
    getSelectedToolEl,
    getToolsEl,
    setElemBeingModified,
    setMapMakerEl,
    setRoomOverviewEl,
    setSelectedToolEl,
    setToolsEl } from './elements.js'

export const renderMapMaker = () => {
    const root = document.getElementById('root')
    const mapMakerContainer = createAndAddClass('div', 'map-maker-container')
    const mapMakerContents = createAndAddClass('div', 'map-maker-contents')
    appendAll(mapMakerContents, roomOverview(), toolsSidebar())
    mapMakerContainer.append(mapMakerContents)
    setMapMakerEl(mapMakerContainer)
    root.append(mapMakerContainer)
}

export const createHeader = (textContent) => {
    const header = createAndAddClass('div', 'sidebar-header')
    const text = document.createElement('p')
    text.textContent = textContent
    header.append(text)
    return header
}

const roomOverview = () => {
    const roomOverview = createAndAddClass('div', 'room-overview')
    setRoomOverviewEl(roomOverview)
    return roomOverview
}

const toolsSidebar = () => {
    const toolsSidebar = createAndAddClass('div', 'tools-sidebar')
    const toolsContainer = createAndAddClass('div', 'tools-container')
    createTools(toolsContainer)
    appendAll(toolsSidebar, createHeader('tools'), toolsContainer)
    setToolsEl(toolsSidebar)
    return toolsSidebar
}

const createTools = (tools) => {
    Array.from([
        createTool('rooms'),
        createTool('walls'),
        createTool('loaders'),
        createTool('enemies'),
        createTool('interactables'),
        createTool('popups'),
        createTool('dialogues'),
    ]).forEach(item => tools.append(item))
}

const createTool = (header) => {
    const tool = createAndAddClass('div', 'tool-group')
    const headerEl = document.createElement('p')
    headerEl.textContent = header
    const chevRight = new Image()
    chevRight.src = '../assets/images/chev-right.png'
    appendAll(tool, headerEl, chevRight)
    tool.addEventListener('click', (e) => onToolClick(e, header))
    return tool
}

const onToolClick = (e, header) => activateTool(e.currentTarget, header)

const activateTool = (tool, header) => {
    if ( getRooms().length === 0 && header !== 'rooms' ) return
    if ( !containsClass(tool, 'active-tool') ) {
        addClass(tool, 'active-tool')
        const contents = getContents(header)
        tool.after(contents)
    }
    else {
        removeClass(tool, 'active-tool')
        tool.nextSibling.remove()
    }
    refreshTools(tool)
}

const refreshTools = (activeTool) => {
    Array.from(getToolsEl().children[1].children)
        .forEach(tool => {
            if ( tool !== activeTool ) {
                removeClass(tool, 'active-tool')
                if ( tool.nextSibling && containsClass(tool.nextSibling, 'tool-contents-container') ) 
                    tool.nextSibling.remove()
            }
        })
}


const getContents = (header) => {
    const contentsContainer = createAndAddClass('div', 'tool-contents-container')
    const addItem = createAndAddClass('div', 'add-item')
    const add = document.createElement('p')
    add.textContent = 'add item'
    addItem.append(add)
    addItem.addEventListener('click', (e) => onAddItemClick(e, header))
    appendAll(contentsContainer, addItem)
    createContents(contentsContainer, header)
    return contentsContainer
}

const createContents = (contentsBar, header) => {
    if ( header === 'rooms' )         return addRoomContents(contentsBar)
    if ( header === 'walls' )         return addWallsContents(contentsBar)
    if ( header === 'enemies' )       return addEnemyContents(contentsBar)
    if ( header === 'loaders' )       return addLoaderContents(contentsBar)
    if ( header === 'interactables' ) return addInteractableContents(contentsBar)
}

const addRoomContents = (contentsBar) => 
    getRooms().forEach(room => {
        const content = add2Contents(contentsBar, null, room.label)
        if ( room.label === getRooms().find(room => room.id === getRoomBeingMade())?.label ) {
            selectContent(contentsBar, content)
        }
        content.addEventListener('click', onRoomClick(contentsBar))
    })    

const onRoomClick = (contentsBar) => (e) => {
    selectContent(contentsBar, e.currentTarget)
    initRoom(getRooms().find(room => room.label === getSelectedToolEl().textContent))
}

const addWallsContents = (contentsBar) => 
    addToolContents(contentsBar, getWalls(), 'wall', onWallClick)

const onWallClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getWalls(), initWall, document.getElementById(`wall-${index}`), index)

const addLoaderContents = (contentsBar) => 
    addToolContents(contentsBar, getLoaders(), 'loader', onLoaderClick)

const onLoaderClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getLoaders(), initLoader, document.getElementById(`loader-${index}`), index)

const addInteractableContents = (contentsBar) => 
    addToolContents(contentsBar, getInteractables(), 'interactable', onInteractableClick)

const onInteractableClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getInteractables(), initInteractable, document.getElementById(`interactable-${index}`), index)

const addEnemyContents = (contentsBar) => 
    addToolContents(contentsBar, getEnemies(), 'enemy', onEnemyClick)

const onEnemyClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getEnemies(), initEnemy, document.getElementById(`enemy-${index}`), index)

const addToolContents = (contentsBar, contentsMap, prefix, onCmpClick) =>     
    Array.from((contentsMap.get(getRoomBeingMade()) || []))
        .forEach((item, index) => {
            const content = add2Contents(contentsBar, null, `${prefix}-${index}`)
            content.addEventListener('click', onCmpClick(contentsBar, index))
        })

const onComponentClick = (contentsBar, contentsMap, initCallback, elem2Init, index) => (e) => {
    selectContent(contentsBar, e.currentTarget)
    initCallback(contentsMap.get(getRoomBeingMade())[index])
    setAsElemBeingModified(elem2Init)
}     

const add2Contents = (contentsBar, prefix, label, creatingNew = false) => {
    const newContent = createAndAddClass('div', 'tool-content')
    const itemNumber = contentsBar.children.length
    newContent.textContent = label ?? `${prefix}-${itemNumber}`
    contentsBar.insertBefore(newContent, contentsBar.lastElementChild)
    if ( creatingNew ) selectContent(contentsBar, newContent)
    return newContent
}

const selectContent = (contentsBar, selectedContent) => {
    Array.from(contentsBar.children).forEach(content => removeClass(content, 'selected'))
    addClass(selectedContent, 'selected')
    setSelectedToolEl(selectedContent)
}

const onAddItemClick = (e, header) => {
    if ( header === 'rooms' )         addNewRoom(e.currentTarget.parentElement)
    if ( header === 'walls' )         addNewWall(e.currentTarget.parentElement)
    if ( header === 'enemies' )       addNewEnemy(e.currentTarget.parentElement)
    if ( header === 'loaders' )       addNewLoader(e.currentTarget.parentElement)
    if ( header === 'interactables' ) addNewInteractable(e.currentTarget.parentElement)
}

const addNewRoom = (contentsBar) => {
    const content = add2Contents(contentsBar, 'room', null, true)
    content.addEventListener('click', onRoomClick(contentsBar))
    const room = initRoom(
        new Room(getRooms().length + 1, 500, 500, `room-${getRooms().length + 1}`)
    , true)
    getRooms().push(getItemBeingModified())
}

const initRoom = (options, newRoom = false) => {
    const { width, height, label, brightness, progress, background } = options
    const room = createAndAddClass('div', 'room-view')
    room.style.width = `${width}px`
    room.style.position = `relative`
    room.style.height = `${height}px`
    room.style.backgroundColor = background
    setAsElemBeingModified(room)
    getRoomOverviewEl().firstElementChild?.remove()
    getRoomOverviewEl().append(room)
    if ( newRoom ) {
        setItemBeingModified(new Room(getRooms().length + 1, width, height, label, brightness, progress))
        setRoomBeingMade(getRooms().length + 1)
    }
    else {
        setItemBeingModified(options)
        setRoomBeingMade(options.id)
    }
    renderWalls()
    renderLoaders()
    renderInteractables()
    renderEnemies()
    renderEnemyPaths()
    renderRoomAttributes()
    return room
}

const renderWalls = () => renderComponents(getWalls(), renderWall)

const renderLoaders = () => renderComponents(getLoaders(), renderLoader)

const renderInteractables = () => renderComponents(getInteractables(), renderInteractable)

const renderEnemies = () => renderComponents(getEnemies(), renderEnemy)

const renderEnemyPaths = () => 
    Array.from(getEnemies().get(getRoomBeingMade()) || [])
        .forEach((enemy, enemyIndex) => renderEnemyPath(enemy, enemyIndex))

const renderEnemyPath = (enemy, enemyIndex) => 
    Array.from(enemy.waypoint.points).forEach((path, pathIndex) => {
        const pointEl = createAndAddClass('div', `enemy-${enemyIndex}-path`, `enemy-path-${pathIndex}`, 'enemy-path')
        getRoomOverviewEl().firstElementChild.append(pointEl)
    })

const renderComponents = (components, renderCallback) =>
    Array.from(components.get(getRoomBeingMade()) || []).forEach((component, index) => {
        const componentEl = renderCallback(component, index)
        getRoomOverviewEl().firstElementChild.append(componentEl)
    })

const addNewWall = (contentsBar) => {
    const content = add2Contents(contentsBar, 'wall', null, true)
    initWall(new Wall(50, 50, 0, 0, null, null, 'lightslategrey'), true)
    getWalls().set(getRoomBeingMade(), [...(getWalls().get(getRoomBeingMade()) || []), getItemBeingModified()])
    content.addEventListener('click', onWallClick(contentsBar, getWalls().get(getRoomBeingMade()).length - 1))
}

const initWall = (wall, newWall) => {
    setItemBeingModified(wall)
    if ( newWall ) {
        const renderedWall = renderWall(wall, (getWalls().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(renderedWall)
        setAsElemBeingModified(renderedWall)
    }
    renderWallAttributes()
}

const renderWall = (options, index) => {
    const { width, height, left, top, right, bottom, background } = options
    const wall = createAndAddClass('div', 'wall')
    wall.style.width =                         `${width}px`
    wall.style.height =                        `${height}px`
    wall.style.background =                     background
    if ( left !== null ) wall.style.left =     `${left}px`
    if ( top !== null ) wall.style.top =       `${top}px`
    if ( right !== null ) wall.style.right =   `${right}px`
    if ( bottom !== null ) wall.style.bottom = `${bottom}px`
    wall.id = `wall-${index}`
    return wall
}

const addNewLoader = (contentsBar) => {
    const content = add2Contents(contentsBar, 'loader', null, true)
    initLoader(new TopLoader(1, 100, 0), true)
    getLoaders().set(getRoomBeingMade(), [...(getLoaders().get(getRoomBeingMade()) || []), getItemBeingModified()])
    content.addEventListener('click', onLoaderClick(contentsBar, getLoaders().get(getRoomBeingMade()).length - 1))
}

const initLoader = (loader, newLoader) => {
    setItemBeingModified(loader)
    if ( newLoader ) {
        const renderedLoader = renderLoader(loader, (getLoaders().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(renderedLoader)
        setAsElemBeingModified(renderedLoader)
    }
    renderLoaderAttributes()
}

const renderLoader = (options, index) => {
    const { width, height, left, top, right, bottom } = options
    const loader = createAndAddClass('div', 'map-maker-loader')
    loader.style.width =                              `${width}px`
    loader.style.height =                             `${height}px`
    if ( left !== null )        loader.style.left =   `${left}px`
    else if ( right !== null )  loader.style.right =  `${right}px`
    if ( top !== null )         loader.style.top =    `${top}px`
    else if ( bottom !== null ) loader.style.bottom = `${bottom}px`
    loader.id = `loader-${index}`
    return loader
}

const addNewInteractable = (contentsBar) => {
    const content = add2Contents(contentsBar, 'interactable', null, true)
    initInteractable(new PistolAmmo(0, 0, 10), true)
    getInteractables().set(getRoomBeingMade(), [...(getInteractables().get(getRoomBeingMade()) || []), getItemBeingModified()])
    content.addEventListener('click', onInteractableClick(contentsBar, getInteractables().get(getRoomBeingMade()).length - 1))
}

const initInteractable = (interactable, newInteractable) => {
    setItemBeingModified(interactable)
    if ( newInteractable ) {
        const renderedInteractable = renderInteractable(interactable, (getInteractables().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(renderedInteractable)
        setAsElemBeingModified(renderedInteractable)
    }
    renderInteractableAttributes()
}

const renderInteractable = (options, index) => {
    const { width, left, top, name } = options
    const interactable = createAndAddClass('div', 'map-maker-interactable')
    interactable.style.width = `${width}px`
    interactable.style.left =  `${left}px`
    interactable.style.top =   `${top}px`
    interactable.id = `interactable-${index}`
    const image = new Image()
    image.src = `./assets/images/${name}.png`
    interactable.append(image)
    return interactable
}

const addNewEnemy = (contentsBar) => {
    const content = add2Contents(contentsBar, 'enemy', null, true)
    initEnemy(new Torturer(1), true)
    getEnemies().set(getRoomBeingMade(), [...(getEnemies().get(getRoomBeingMade()) || []), getItemBeingModified()])
    content.addEventListener('click', onEnemyClick(contentsBar, getEnemies().get(getRoomBeingMade()).length - 1))
}

const initEnemy = (enemy, newEnemy) => {
    setItemBeingModified(enemy)
    if ( newEnemy ) {
        const renderedEnemy = renderEnemy(enemy, (getEnemies().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(renderedEnemy)
        setAsElemBeingModified(renderedEnemy)
    }
    renderEnemyAttributes()
}

export const renderEnemy = (options, index) => {
    const enemy = createAndAddClass('div', 'enemy')
    const enemyCollider = createAndAddClass('div', 'enemy-collider', `${options.type}-collider`)
    const enemyBody = createAndAddClass('div', 'enemy-body', `${options.type}-body`)
    enemyBody.style.backgroundColor = `${options.virus}`
    defineEnemyComponents(options, enemyBody)
    appendAll(enemyCollider, enemyBody)
    enemy.append(enemyCollider)
    enemy.id = `enemy-${index}`
    renderEnemyPath(options, index)
    return enemy
}

const setAsElemBeingModified = (elem) => {
    if ( getElemBeingModified() ) removeClass(getElemBeingModified(), 'in-modification')
    setElemBeingModified(elem)
    addClass(getElemBeingModified(), 'in-modification')
}