import { Room } from '../room.js'
import { Wall } from '../wall.js'
import { TopLoader } from '../loader.js'
import { PistolAmmo } from '../interactables.js'
import { renderWallAttributes } from './attributes/wall.js'
import { renderRoomAttributes } from './attributes/room.js'
import { renderLoaderAttributes } from './attributes/loader.js'
import { renderInteractableAttributes } from './attributes/interactable.js'
import { addClass, appendAll, containsClass, createAndAddClass, removeClass } from '../util.js'
import { 
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
    setRoomElBeingModified,
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

const createContents = (contentsContainer, header) => {
    if ( header === 'rooms' )         return addRoomContents(contentsContainer)
    if ( header === 'walls' )         return addWallsContents(contentsContainer)
    if ( header === 'loaders' )       return addLoaderContents(contentsContainer)
    if ( header === 'interactables' ) return addInteractableContents(contentsContainer)    
}

const addRoomContents = (contentsContainer) => 
    getRooms().forEach(room => {
        const content = add2Contents(contentsContainer, null, room.label)
        if ( room.label === getRooms().find(room => room.id === getRoomBeingMade())?.label ) {
            selectContent(contentsContainer, content)
        }
        content.addEventListener('click', onRoomClick(contentsContainer))
    })

const onRoomClick = (contentsContainer) => (e) => {
    selectContent(contentsContainer, e.currentTarget)
    initRoom(getRooms().find(room => room.label === getSelectedToolEl().textContent))
}

const addWallsContents = (contentsContainer) => 
    Array.from((getWalls().get(getRoomBeingMade()) || []))
        .forEach((wall, index) => {
            const content = add2Contents(contentsContainer, null, `wall-${index}`)
            content.addEventListener('click', onWallClick(contentsContainer, index))
        })

const onWallClick = (contentsContainer, index) => (e) => {
    selectContent(contentsContainer, e.currentTarget)
    initWall(getWalls().get(getRoomBeingMade())[index])
    setAsElemBeingModified(document.getElementById(`wall-${index}`))
}

const addLoaderContents = (contentsContainer) =>
    Array.from((getLoaders().get(getRoomBeingMade()) || []))
        .forEach((loader, index) => {
            const content = add2Contents(contentsContainer, null, `loader-${index}`)
            content.addEventListener('click', onLoaderClick(contentsContainer, index))
        })

const onLoaderClick = (contentsContainer, index) => (e) => {
    selectContent(contentsContainer, e.currentTarget)
    initLoader(getLoaders().get(getRoomBeingMade())[index])
    setAsElemBeingModified(document.getElementById(`loader-${index}`))
}

const addInteractableContents = (contentsContainer) => 
    Array.from((getInteractables().get(getRoomBeingMade()) || []))
        .forEach((interactable, index) => {
            const content = add2Contents(contentsContainer, null, `interactable-${index}`)
            content.addEventListener('click', onInteractableClick(contentsContainer, index))
        })

const onInteractableClick = (contentsContainer, index) => (e) => {
    selectContent(contentsContainer, e.currentTarget)
    initInteractable(getInteractables().get(getRoomBeingMade())[index])
    setAsElemBeingModified(document.getElementById(`interactable-${index}`))
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
    if ( header === 'loaders' )       addNewLoader(e.currentTarget.parentElement)
    if ( header === 'interactables' ) addNewInteractable(e.currentTarget.parentElement)
}

const addNewRoom = (contentsBar) => {
    const content = add2Contents(contentsBar, 'room', null, true)
    content.addEventListener('click', onRoomClick(contentsBar))
    initRoom(
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
    room.style.opacity = `${brightness/9}`
    room.style.backgroundColor = background
    setAsElemBeingModified(room)
    setRoomElBeingModified(room)
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
    renderRoomAttributes()
}

const renderWalls = () => 
    Array.from(getWalls().get(getRoomBeingMade()) || []).forEach((wall, index) => {
        const wallEl = renderWall(wall, index)
        getRoomOverviewEl().firstElementChild.append(wallEl)
    })

const renderLoaders = () =>     
    Array.from(getLoaders().get(getRoomBeingMade()) || []).forEach((loader, index) => {
        const loaderEl = renderLoader(loader, index)
        getRoomOverviewEl().firstElementChild.append(loaderEl)
    })

const renderInteractables = () => 
    Array.from(getInteractables().get(getRoomBeingMade()) || []).forEach((interactable, index) => {
        const interactableEl = renderInteractable(interactable, index)
        getRoomOverviewEl().firstElementChild.append(interactableEl)
    }) 

const addNewWall = (contentsBar) => {
    const content = add2Contents(contentsBar, 'wall', null, true)
    initWall(new Wall(50, 50, 0, 0, null, null, 'lightslategrey'), true)
    getWalls().set(getRoomBeingMade(), [...(getWalls().get(getRoomBeingMade()) || []), getItemBeingModified()])
    content.addEventListener('click', onWallClick(contentsBar, getWalls().get(getRoomBeingMade()).length - 1))
}

const initWall = (options, newWall) => {
    const { width, height, left, top, right, bottom, background } = options
    if ( newWall ) {
        const wall = renderWall(options, (getWalls().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(wall)
        setAsElemBeingModified(wall)
        setItemBeingModified(new Wall(width, height, left, right, top, bottom, background))
    } else setItemBeingModified(options)
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

const initLoader = (options, newLoader) => {
    const { className, width, left, door } = options
    if ( newLoader ) {
        const loader = renderLoader(options, (getLoaders().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(loader)
        setAsElemBeingModified(loader)
        setItemBeingModified(new TopLoader(className, width, left, door))
    } else setItemBeingModified(options)
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

const initInteractable = (options, newInteractable) => {
    if ( newInteractable ) {
        const interactable = renderInteractable(options, (getInteractables().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(interactable)
        setAsElemBeingModified(interactable)
        setItemBeingModified(new PistolAmmo(0, 0, 10))
    } else setItemBeingModified(options)
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

const setAsElemBeingModified = (elem) => {
    if ( getElemBeingModified() ) removeClass(getElemBeingModified(), 'in-modification')
    setElemBeingModified(elem)
    addClass(getElemBeingModified(), 'in-modification')
}