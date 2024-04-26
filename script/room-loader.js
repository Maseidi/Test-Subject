import { getCurrentRoomInteractables, getCurrentRoomLoaders,
     getCurrentRoomSolid,
     getRoomContainer,
     setCurrentRoom,
     setCurrentRoomInteractables,
     setCurrentRoomLoaders,
     setCurrentRoomSolid
     } from "./elements.js"
import { rooms } from "./rooms.js"
import { addAttribute, addClass, addToArray } from "./util.js"
import { getCurrentRoomId, getRoomLeft, getRoomTop } from "./variables.js"

export const loadCurrentRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    setCurrentRoomInteractables([])
    const roomToRender = document.createElement("div")
    addClass(roomToRender, `${getCurrentRoomId()}`)
    roomToRender.style.width = `${room.width}px`
    roomToRender.style.height = `${room.height}px`
    roomToRender.style.position = `absolute`
    roomToRender.style.left = `${getRoomLeft()}px`
    roomToRender.style.top = `${getRoomTop()}px`
    roomToRender.style.backgroundColor = `lightgray`
    renderWalls(room, roomToRender)
    renderLoaders(room, roomToRender)
    renderInteractables(room, roomToRender)
    setCurrentRoom(roomToRender)
    getRoomContainer().append(roomToRender)
}

const renderWalls = (room, roomToRender) => {
    Array.from(room.walls).forEach((elem, index) => {
        const wall = document.createElement("div")
        addClass(wall, `wall-${index+1}`)
        addClass(wall, 'solid')
        wall.style.backgroundColor = `darkgray`
        wall.style.width = `${elem.width}px`
        wall.style.height = `${elem.height}px`
        if ( elem.left !== undefined ) wall.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) wall.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) wall.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) wall.style.bottom = `${elem.bottom}px`
        roomToRender.append(wall)
        addToArray(getCurrentRoomSolid, setCurrentRoom, wall)
    })
}

const renderLoaders = (room, roomToRender) => {
    Array.from(room.loaders).forEach((elem) => {
        const loader = document.createElement("div")
        addClass(loader, elem.className)
        addClass(loader, 'loader')
        loader.style.width = `${elem.width}px`
        loader.style.height = `${elem.height}px`
        loader.style.backgroundColor = `blue`
        if ( elem.left !== undefined ) loader.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) loader.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) loader.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) loader.style.bottom = `${elem.bottom}px`
        roomToRender.append(loader)
        addToArray(getCurrentRoomLoaders, setCurrentRoomLoaders, loader)
    })
}

const renderInteractables = (room, roomToRender) => {
    if ( !room.interactables ) return
    Array.from(room.interactables).forEach((interactable) => {
        renderInteractable(roomToRender, interactable)
    })
}

const renderInteractable = (root, interactable) => {
    const int = document.createElement("div")
    addClass(int, 'interactable')
    addAttribute("name", interactable.name, int)
    if (interactable.amount) addAttribute("amount", interactable.amount, int)
    if (interactable.space) addAttribute("space", interactable.space, int)
    int.style.left = `${interactable.left}px`
    int.style.top = `${interactable.top}px`
    int.style.width = `${interactable.width}px`
    renderImage(int, interactable)
    renderPopUp(int, interactable)
    root.append(int)
    if ( interactable.solid ) addToArray(getCurrentRoomSolid, setCurrentRoomSolid, int)
    addToArray(getCurrentRoomInteractables, setCurrentRoomInteractables, int)
}

const renderImage = (int, interactable) => {
    const image = document.createElement("img")
    image.src = `../assets/images/${interactable.name}.png`
    int.append(image)
}

const renderPopUp = (int, interactable) => {
    const popup = document.createElement("div")
    popup.style.bottom = `calc(100% - 20px)`
    popup.style.opacity = `0`
    renderTitle(popup, interactable)
    renderLine(popup)
    renderDescription(popup, interactable)
    int.append(popup)
}

const renderTitle = (popup, interactable) => {
    const title = document.createElement("p")
    let content = interactable.amount ? `x${interactable.amount} ${interactable.title}` : `${interactable.title}`
    title.textContent = content
    popup.append(title)
}

const renderLine = (popup) => {
    const line = document.createElement("div")
    popup.append(line)
}

const renderDescription = (popup, interactable) => {
    const descContainer = document.createElement("div")
    const fButton = document.createElement("p")
    fButton.textContent = "F"
    const descText = document.createElement("p")
    descText.textContent = `${interactable.popup}`
    descContainer.append(fButton)
    descContainer.append(descText)
    popup.append(descContainer)

}