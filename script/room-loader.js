import { getCurrentRoomInteractables, getCurrentRoomLoaders,
     getCurrentRoomSolid,
     getRoomContainer,
     setCurrentRoom,
     setCurrentRoomInteractables,
     setCurrentRoomLoaders,
     setCurrentRoomSolid
     } from "./elements.js"
import { rooms } from "./rooms.js"
import { addAttribute, addClass } from "./util.js"
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
        wall.style.position = `absolute`
        wall.style.backgroundColor = `#2b2b2b`
        wall.style.width = `${elem.width}px`
        wall.style.height = `${elem.height}px`
        wall.style.backgroundColor = `darkgray`
        if ( elem.left !== undefined ) wall.style.left = `${elem.left}px`
        if ( elem.right !== undefined ) wall.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) wall.style.top = `${elem.top}px`
        if ( elem.bottom !== undefined ) wall.style.bottom = `${elem.bottom}px`
        roomToRender.append(wall)
        getCurrentRoomSolid().push(wall)
    })
}

const renderLoaders = (room, roomToRender) => {
    Array.from(room.loaders).forEach((elem) => {
        const loader = document.createElement("div")
        addClass(loader, elem.className)
        addClass(loader, 'loader')
        loader.style.position = `absolute`
        loader.style.width = `${elem.width}px`
        loader.style.height = `${elem.height}px`
        loader.style.backgroundColor = `blue`
        if ( elem.left !== undefined ) loader.style.left = `${elem.left}px`
        if ( elem.right !== undefined ) loader.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) loader.style.top = `${elem.top}px`
        if ( elem.bottom !== undefined ) loader.style.bottom = `${elem.bottom}px`
        roomToRender.append(loader)
        getCurrentRoomLoaders().push(loader)
    })
}

const renderInteractables = (room, roomToRender) => {
    Array.from(room.interactables).forEach((interactable) => {
        const int = document.createElement("div")
        addAttribute("name", interactable.name.replace("-", ""), int)
        if (interactable.amount) addAttribute("amount", interactable.amount, int)
        int.style.position = `absolute`
        int.style.left = `${interactable.left}px`
        int.style.top = `${interactable.top}px`
        int.style.height = `fit-content`
        int.style.width = `${interactable.width}px`
        int.style.objectFit = `cover`
        int.style.userSelect = `none`

        renderImage(int, interactable)
        renderPopUp(int, interactable)

        roomToRender.append(int)
        if ( interactable.solid ) getCurrentRoomSolid().push(int)
        getCurrentRoomInteractables().push(int)
    })
}

const renderImage = (int, interactable) => {
    const image = document.createElement("img")
    image.style.width = `100%`
    image.src = `../assets/images/${interactable.name}.png`
    int.append(image)
}

const renderPopUp = (int, interactable) => {
    const popup = document.createElement("div")
    addClass(popup, 'bg-theme')
    popup.style.position = `absolute`
    popup.style.padding = `10px`
    popup.style.width = `max-content`
    popup.style.textAlign = `center`
    popup.style.left = `50%`
    popup.style.transform = `translateX(-50%)`
    popup.style.bottom = `calc(100% - 20px)`
    popup.style.opacity = `0`
    popup.style.transition = `300ms`

    renderTitle(popup, interactable)
    renderLine(popup)
    renderDescription(popup, interactable)

    int.append(popup)
}

const renderTitle = (popup, interactable) => {
    const title = document.createElement("p")
    title.style.textTransform = `capitalize`
    let content = interactable.amount ? `x${interactable.amount} ${interactable.name}` : `${interactable.name}`
    content = content.replace("-", " ")
    title.textContent = content
    popup.append(title)
}

const renderLine = (popup) => {
    const line = document.createElement("div")
    line.style.width = `100%`
    line.style.height = `1px`
    line.style.backgroundColor = `wheat`
    line.style.margin = `10px auto`
    popup.append(line)
}

const renderDescription = (popup, interactable) => {
    const descContainer = document.createElement("div")
    descContainer.style.width = `100%`
    descContainer.style.display = `flex`
    descContainer.style.flexDirection = `row`
    descContainer.style.justifyContent = `left`
    descContainer.style.alignItems = `center`
    descContainer.style.gap = `10px`

    const fButton = document.createElement("p")
    fButton.textContent = "F"
    fButton.style.border = `1px solid wheat`
    fButton.style.padding = `2px 7px`

    const descText = document.createElement("p")
    descText.textContent = `${interactable.popup}`

    descContainer.append(fButton)
    descContainer.append(descText)
    popup.append(descContainer)

}