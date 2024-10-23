import { Room } from '../room.js'
import { renderRoomAttributes } from './attributes/room.js'
import { addClass, appendAll, containsClass, createAndAddClass, removeClass } from '../util.js'
import { getItemBeingModified, getRooms, setItemBeingModified, setRoomBeingMade } from './variables.js'
import { 
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

const onToolClick = (e, header) => {
    activateTool(e.currentTarget, header)
}

const activateTool = (tool, header) => {
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
    // else if ( header === 'walls' ) return addWallsContents(contentsContainer)
}

const addRoomContents = (contentsContainer) => {
    getRooms().forEach(room => {
        add2Contents(contentsContainer, null, room.label)
    })
}

const add2Contents = (contentsBar, prefix, label) => {
    const newContent = createAndAddClass('div', 'tool-content')
    const itemNumber = contentsBar.children.length
    newContent.textContent = label ?? `${prefix}-${itemNumber}`
    contentsBar.insertBefore(newContent, contentsBar.lastElementChild)
    if ( !label ) selectContent(contentsBar, newContent)
    newContent.addEventListener('click', (e) => {
        selectContent(contentsBar, e.currentTarget)
        initRoom(getRooms().find(room => room.label === getSelectedToolEl().textContent))
    })
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
    add2Contents(contentsBar, 'room')
    initRoom(
        {width: 500, height: 500, label: `room-${getRooms().length + 1}`, 
            darkness: 9, progress: {progress2Active: [], progress2Deactive: []}}
    , true)
    getRooms().push(getItemBeingModified())
}

const initRoom = (options, newRoom = false) => {
    const { width, height, label, darkness, progress } = options
    const room = createAndAddClass('div', 'room-view')
    room.style.width = `${width}px`
    room.style.height = `${height}px`
    room.style.backgroundColor = `rgba(255, 255, 255, ${darkness/10})`
    appendAll(room, 
        createAndAddClass('div', 'top-wall'),   createAndAddClass('div', 'left-wall'), 
        createAndAddClass('div', 'right-wall'), createAndAddClass('div', 'bottom-wall')
    )
    setElemBeingModified(room)
    getRoomOverviewEl().firstElementChild?.remove()
    getRoomOverviewEl().append(room)
    if ( newRoom ) {
        setItemBeingModified(new Room(getRooms().length + 1, width, height, label, darkness, progress))
        setRoomBeingMade(getRooms().length + 1)
    }
    else {
        setItemBeingModified(options)
        setRoomBeingMade(options.id)
    }
    renderRoomAttributes()
}

const addNewWall = (contentsBar) => {
    add2Contents(contentsBar, 'wall')
}