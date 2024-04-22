import { getCurrentRoomLoaders,
     getCurrentRoomSolid,
     getRoomContainer,
     setCurrentRoom,
     setCurrentRoomLoaders,
     setCurrentRoomSolid
     } from "./elements.js"
import { rooms } from "./rooms.js"
import { addClass } from "./util.js"
import { getCurrentRoomId, getRoomLeft, getRoomTop } from "./variables.js"

export const loadCurrentRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    
    const roomToRender = document.createElement("div")
    addClass(roomToRender, `${getCurrentRoomId()}`)
    roomToRender.style.width = `${room.width}px`
    roomToRender.style.height = `${room.height}px`
    roomToRender.style.position = `absolute`
    roomToRender.style.left = `${getRoomLeft()}px`
    roomToRender.style.top = `${getRoomTop()}px`
    roomToRender.style.backgroundColor = `lightgray`

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

    setCurrentRoom(roomToRender)
    getRoomContainer().append(roomToRender)
}