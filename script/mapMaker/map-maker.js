import { Room } from '../room.js'
import { Wall } from '../wall.js'
import { TopLoader } from '../loader.js'
import { Popup } from '../popup-manager.js'
import { PistolAmmo } from '../interactables.js'
import { BandageShopItem } from '../shop-item.js'
import { Dialogue } from '../dialogue-manager.js'
import { Torturer } from '../enemy/type/normal-enemy.js'
import { defineEnemyComponents } from '../room-loader.js'
import { renderWallAttributes } from './attributes/wall.js'
import { renderRoomAttributes } from './attributes/room.js'
import { renderPopupAttributes } from './attributes/popup.js'
import { renderShopItemAttributes } from './attributes/shop.js'
import { renderLoaderAttributes } from './attributes/loader.js'
import { renderEnemyAttributes } from './attributes/enemy/enemy.js'
import { renderDialogueAttributes } from './attributes/dialogue.js'
import { renderInteractableAttributes } from './attributes/interactable.js'
import { addClass, appendAll, containsClass, createAndAddClass, getMapWithArrayValuesByKey, removeClass } from '../util.js'
import { 
    getDialogues,
    getEnemies,
    getInteractables,
    getItemBeingModified,
    getLoaders,
    getPopups,
    getRoomBeingMade,
    getRooms,
    getShop,
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
        createTool('interactables'),
        createTool('enemies'),
        createTool('popups'),
        createTool('dialogues'),
        createTool('shop'),
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
    if ( getRooms().length === 0 && !['rooms', 'dialogues', 'popups', 'shop'].includes(header) ) return
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
    const addItem = addItemButton();
    addItem.addEventListener('click', (e) => onAddItemClick(e, header))
    appendAll(contentsContainer, addItem)
    createContents(contentsContainer, header)
    return contentsContainer
}

export const addItemButton = (textContent = 'add item') => {
    const addItem = createAndAddClass('div', 'add-item')
    const add = document.createElement('p')
    add.textContent = textContent
    addItem.append(add)
    return addItem
}

const createContents = (contentsBar, header) => TOOL_MAP.get(header).contents(contentsBar)

const addRoomContents = (contentsBar) => 
    getRooms().forEach(room => {
        const content = add2Contents(contentsBar, null, room.label)
        if ( room.label === getRooms().find(room => room.id === getRoomBeingMade())?.label ) {
            selectContent(contentsBar, content)
        }
        content.addEventListener('click', onRoomClick(contentsBar))
    })

const addPopupContents = (contentsBar) => 
    getPopups().forEach((popup, index) => {
        const content = add2Contents(contentsBar, null, `popup-${index + 1}`)
        content.addEventListener('click', onPopupClick(contentsBar))
    })

const addDialogueContents = (contentsBar) => 
    getDialogues().forEach((dialogue, index) => {
        const content = add2Contents(contentsBar, null, `dialogue-${index + 1}`)
        content.addEventListener('click', onDialogueClick(contentsBar))
    })

const addShopContents = (contentsBar) => 
    getShop().forEach((shopItem, index) => {
        const content = add2Contents(contentsBar, null, `shop-item-${index + 1}`)
        content.addEventListener('click', onShopItemClick(contentsBar))
    })

const onRoomClick = (contentsBar) => (e) => {
    selectContent(contentsBar, e.currentTarget)
    initRoom(getRooms().find(room => room.label === getSelectedToolEl().textContent))
}

const addWallsContents = (contentsBar) => 
    addToolContents(contentsBar, getWalls(), 'wall', onWallClick)

const onWallClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getWalls(), initWall, 'wall', index)

const addLoaderContents = (contentsBar) => 
    addToolContents(contentsBar, getLoaders(), 'loader', onLoaderClick)

const onLoaderClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getLoaders(), initLoader, 'loader', index)

const addInteractableContents = (contentsBar) => 
    addToolContents(contentsBar, getInteractables(), 'interactable', onInteractableClick)

const onInteractableClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getInteractables(), initInteractable, 'interactable', index)

const addEnemyContents = (contentsBar) => 
    addToolContents(contentsBar, getEnemies(), 'enemy', onEnemyClick)

const onEnemyClick = (contentsBar, index) => 
    onComponentClick(contentsBar, getEnemies(), initEnemy, 'enemy', index)

const addToolContents = (contentsBar, contentsMap, prefix, onCmpClick) =>     
    Array.from(getMapWithArrayValuesByKey(contentsMap, getRoomBeingMade()))
        .forEach((item, index) => {
            const content = add2Contents(contentsBar, null, `${prefix}-${index + 1}`)
            content.addEventListener('click', onCmpClick(contentsBar, index))
        })

const onComponentClick = (contentsBar, contentsMap, initCallback, prefix, index) => (e) => {
    hidePaths()
    selectContent(contentsBar, e.currentTarget)
    setAsElemBeingModified(document.getElementById(prefix + '-' + index))
    initCallback(contentsMap.get(getRoomBeingMade())[index])
}

const onPopupClick = (contentsBar) => (e) => {
    selectContent(contentsBar, e.currentTarget)
    const popupIndex = Array.from(contentsBar.children).findIndex(child => child === e.currentTarget)
    initPopup(getPopups().find((popup, index) => index === popupIndex))
}

const onDialogueClick = (contentsBar) => (e) => {
    selectContent(contentsBar, e.currentTarget)
    const dialogueIndex = Array.from(contentsBar.children).findIndex(child => child === e.currentTarget)
    initDialogue(getDialogues().find((dialogue, index) => index === dialogueIndex))
}

const onShopItemClick = (contentsBar) => (e) => {
    selectContent(contentsBar, e.currentTarget)
    const shopItemIndex = Array.from(contentsBar.children).findIndex(child => child === e.currentTarget)
    initShop(getShop().find((shopItem, index) => index === shopItemIndex))
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
    hidePaths()
    return TOOL_MAP.get(header).new(e.currentTarget.parentElement)
}

const addNewRoom = (contentsBar) => {
    const content = add2Contents(contentsBar, 'room', null, true)
    content.addEventListener('click', onRoomClick(contentsBar))
    initRoom(new Room(getRooms().length + 1, 500, 500, `room-${getRooms().length + 1}`), true)
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
    hidePaths()
    renderRoomAttributes()
}

const renderWalls = () => renderComponents(getWalls(), renderWall)

const renderLoaders = () => renderComponents(getLoaders(), renderLoader)

const renderInteractables = () => renderComponents(getInteractables(), renderInteractable)

const renderEnemies = () => renderComponents(getEnemies(), renderEnemy)

const renderEnemyPaths = () => 
    Array.from(getMapWithArrayValuesByKey(getEnemies(), getRoomBeingMade()))
        .forEach((enemy, enemyIndex) => renderEnemyPath(enemy, enemyIndex))

export const renderEnemyPath = (enemy, enemyIndex) => 
    Array.from(enemy.waypoint.points).forEach((point, pathIndex) => renderPoint(enemyIndex, pathIndex, point.x, point.y))

export const renderPoint = (enemyIndex, pathIndex, x, y) => {
    const pointEl = createAndAddClass('div', `enemy-${enemyIndex}-path`, `enemy-path-${pathIndex}`, 'enemy-path')
    pointEl.style.left = `${x}px`
    pointEl.style.top =  `${y}px`
    getRoomOverviewEl().firstElementChild.append(pointEl)
}

const hidePaths = () => 
    Array.from(document.querySelectorAll('.enemy-path')).forEach(point => point.style.display = 'none')

const renderComponents = (components, renderCallback) =>
    Array.from(getMapWithArrayValuesByKey(components, getRoomBeingMade())).forEach((component, index) => {
        const componentEl = renderCallback(component, index)
        getRoomOverviewEl().firstElementChild.append(componentEl)
    })

const addNewWall = (contentsBar) => {
    const content = add2Contents(contentsBar, 'wall', null, true)
    initWall(new Wall(50, 50, 0, 0, null, null, 'lightslategrey'), true)
    getWalls().set(getRoomBeingMade(), [...(getMapWithArrayValuesByKey(getWalls(), getRoomBeingMade())), getItemBeingModified()])
    content.addEventListener('click', onWallClick(contentsBar, getWalls().get(getRoomBeingMade()).length - 1))
}

const initWall = (wall, newWall) => {
    setItemBeingModified(wall)
    if ( newWall ) {
        const renderedWall = renderWall(wall, (getMapWithArrayValuesByKey(getWalls(), getRoomBeingMade())).length)
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
    getLoaders().set(getRoomBeingMade(), [...(getMapWithArrayValuesByKey(getLoaders(), getRoomBeingMade())), getItemBeingModified()])
    content.addEventListener('click', onLoaderClick(contentsBar, getLoaders().get(getRoomBeingMade()).length - 1))
}

const initLoader = (loader, newLoader) => {
    setItemBeingModified(loader)
    if ( newLoader ) {
        const renderedLoader = renderLoader(loader, (getMapWithArrayValuesByKey(getLoaders(), getRoomBeingMade())).length)
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
    getInteractables().set(getRoomBeingMade(), 
        [...(getMapWithArrayValuesByKey(getInteractables(), getRoomBeingMade())), getItemBeingModified()])

    content.addEventListener('click', onInteractableClick(contentsBar, getInteractables().get(getRoomBeingMade()).length - 1))
}

const initInteractable = (interactable, newInteractable) => {
    setItemBeingModified(interactable)
    if ( newInteractable ) {
        const renderedInteractable = renderInteractable(interactable, 
            (getMapWithArrayValuesByKey(getInteractables(), getRoomBeingMade())).length)

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
    getEnemies().set(getRoomBeingMade(), [...(getMapWithArrayValuesByKey(getEnemies(), getRoomBeingMade())), getItemBeingModified()])
    content.addEventListener('click', onEnemyClick(contentsBar, getEnemies().get(getRoomBeingMade()).length - 1))
}

const initEnemy = (enemy, newEnemy) => {
    setItemBeingModified(enemy)
    let enemyIndex = (getMapWithArrayValuesByKey(getEnemies(), getRoomBeingMade())).findIndex(item => item === enemy)
    if ( newEnemy ) {
        const renderedEnemy = renderEnemy(enemy, (getMapWithArrayValuesByKey(getEnemies(), getRoomBeingMade())).length, newEnemy)
        getRoomOverviewEl().firstElementChild.append(renderedEnemy)
        setAsElemBeingModified(renderedEnemy)
        enemyIndex = (getMapWithArrayValuesByKey(getEnemies(), getRoomBeingMade())).length
    }
    Array.from(document.querySelectorAll(`.enemy-${enemyIndex}-path`)).forEach(point => point.style.display = 'block')
    renderEnemyAttributes()
}

export const renderEnemy = (options, index, renderPath) => {
    const enemy = createAndAddClass('div', 'enemy')
    const enemyCollider = createAndAddClass('div', 'enemy-collider', `${options.type}-collider`)
    const enemyBody = createAndAddClass('div', 'enemy-body', `${options.type}-body`)
    enemyBody.style.backgroundColor = `${options.virus}`
    defineEnemyComponents(options, enemyBody)
    appendAll(enemyCollider, enemyBody)
    enemy.append(enemyCollider)
    enemy.id = `enemy-${index}`
    enemy.style.left = `${options.waypoint.points[0].x}px`
    enemy.style.top =  `${options.waypoint.points[0].y}px`
    if ( renderPath ) renderEnemyPath(options, index)
    return enemy
}

const addNewPopup = (contentsBar) => {
    const content = add2Contents(contentsBar, 'popup', null, true)
    content.addEventListener('click', onPopupClick(contentsBar))
    initPopup(new Popup('This is a test popup'))
    getPopups().push(getItemBeingModified())
}

const initPopup = (options) => {
    setAsElemBeingModified(null)
    setItemBeingModified(options)
    renderPopupAttributes()
}

const addNewDialogue = (contentsBar) => {
    const content = add2Contents(contentsBar, 'dialogue', null, true)
    content.addEventListener('click', onDialogueClick(contentsBar))
    initDialogue(new Dialogue('This is a test dialogue'))
    getDialogues().push(getItemBeingModified())
}

const initDialogue = (options) => {
    setAsElemBeingModified(null)
    setItemBeingModified(options)
    renderDialogueAttributes()
}

const addNewShopItem = (contentsBar) => {
    const content = add2Contents(contentsBar, 'shop-item', null, true)
    content.addEventListener('click', onShopItemClick(contentsBar))
    initShop(new BandageShopItem(1000))
    getShop().push(getItemBeingModified())
}

const initShop = (options) => {
    setAsElemBeingModified(null)
    setItemBeingModified(options)
    renderShopItemAttributes()
}

const TOOL_MAP = new Map([
    ['rooms', {
        new: addNewRoom,
        contents: addRoomContents
    }],
    ['walls', {
        new: addNewWall,
        contents: addWallsContents
    }],
    ['enemies', {
        new: addNewEnemy,
        contents: addEnemyContents
    }],
    ['loaders', {
        new: addNewLoader,
        contents: addLoaderContents
    }],
    ['interactables', {
        new: addNewInteractable,
        contents: addInteractableContents
    }],
    ['popups', {
        new: addNewPopup,
        contents: addPopupContents
    }],
    ['dialogues', {
        new: addNewDialogue,
        contents: addDialogueContents
    }],
    ['shop', {
        new: addNewShopItem,
        contents: addShopContents
    }],
])

const setAsElemBeingModified = (elem) => {
    if ( getElemBeingModified() ) removeClass(getElemBeingModified(), 'in-modification')
    setElemBeingModified(elem)
    if ( getElemBeingModified() ) addClass(getElemBeingModified(), 'in-modification')
}