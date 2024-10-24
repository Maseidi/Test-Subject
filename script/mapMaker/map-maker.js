import { Room } from '../room.js'
import { renderRoomAttributes } from './attributes/room.js'
import { addClass, appendAll, containsClass, createAndAddClass, removeClass } from '../util.js'
import { getItemBeingModified, getRoomBeingMade, getRooms, getWalls, setItemBeingModified, setRoomBeingMade } from './variables.js'
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
import { Wall } from '../wall.js'
import { renderWallAttributes } from './attributes/wall.js'

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

const onToolClick = (e, header) => {
    activateTool(e.currentTarget, header)
}

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
    if ( header === 'rooms' ) return addRoomContents(contentsContainer)
    if ( header === 'walls' ) return addWallsContents(contentsContainer)
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
    if ( header === 'rooms' ) addNewRoom(e.currentTarget.parentElement)
    if ( header === 'walls' ) addNewWall(e.currentTarget.parentElement)    
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
    room.style.height = `${height}px`
    room.style.opacity = `${brightness/9}`
    room.style.backgroundColor = background
    room.style.position = `relative`
    appendAll(room, 
        createAndAddClass('div', 'top-wall'),   createAndAddClass('div', 'left-wall'), 
        createAndAddClass('div', 'right-wall'), createAndAddClass('div', 'bottom-wall')
    )
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
    renderRoomAttributes()
}

const renderWalls = () => 
    Array.from(getWalls().get(getRoomBeingMade()) || []).forEach((wall, index) => {
        const wallEl = renderWall(wall, index)
        getRoomOverviewEl().firstElementChild.append(wallEl)
    })

const addNewWall = (contentsBar) => {
    const content = add2Contents(contentsBar, 'wall', null, true)
    initWall(new Wall(50, 50, 0, 0), true)
    getWalls().set(getRoomBeingMade(), [...(getWalls().get(getRoomBeingMade()) || []), getItemBeingModified()])
    content.addEventListener('click', onWallClick(contentsBar, getWalls().get(getRoomBeingMade()).length - 1))
}

const initWall = (options, newWall) => {
    const { width, height, left, top, right, bottom } = options
    if ( newWall ) {
        const wall = renderWall(options, (getWalls().get(getRoomBeingMade()) || []).length)
        getRoomOverviewEl().firstElementChild.append(wall)
        setAsElemBeingModified(wall)
        setItemBeingModified(new Wall(width, height, left, right, top, bottom))
    } else setItemBeingModified(options)
    renderWallAttributes()
}

const renderWall = (options, index) => {
    const { width, height, left, top, right, bottom } = options
    const wall = createAndAddClass('div', 'wall')
    wall.style.width =                         `${width}px`
    wall.style.height =                        `${height}px`
    if ( left !== null ) wall.style.left =     `${left}px`
    if ( top !== null ) wall.style.top =       `${top}px`
    if ( right !== null ) wall.style.right =   `${right}px`
    if ( bottom !== null ) wall.style.bottom = `${bottom}px`
    wall.id = `wall-${index}`
    return wall
}

const setAsElemBeingModified = (elem) => {
    if ( getElemBeingModified() ) removeClass(getElemBeingModified(), 'in-modification')
    setElemBeingModified(elem)
    addClass(getElemBeingModified(), 'in-modification')    
}