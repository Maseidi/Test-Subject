import { getCurrentRoom, getPlayer, getRoomContainer, setCurrentRoom } from "./elements.js";
import { rooms } from "./rooms.js";
import { addClass, collide } from "./util.js";
import { 
    getCurrentRoomId,
    getPrevRoomId,
    getRoomLeft,
    getRoomTop,
    setCurrentRoomId,
    setPrevRoomId,
    setRoomLeft,
    setRoomTop } from "./variables.js";

export const enterNewRoom = () => {
    Array.from(getCurrentRoom().children).filter((elem) => {
        return elem.classList.contains('loader')
    }).forEach((loader) => {
        if ( collide(getPlayer().firstElementChild, loader, 0) ) {
            const cpu = window.getComputedStyle(loader)
            setPrevRoomId(getCurrentRoomId())
            setCurrentRoomId(loader.classList[0])
            calculateNewRoomLeftAndTop(cpu.left, cpu.top)
            getCurrentRoom().remove()
            loadCurrentRoom()
            return
        }
    })
}

export const calculateNewRoomLeftAndTop = (cpuLeft, cpuTop) => {
    const newRoom = rooms.get(getCurrentRoomId())
    Array.from(newRoom.loaders).filter((elem) => {
        return elem.className === getPrevRoomId()
    }).forEach((loader) => {
        let left
        let top
        if ( loader.bottom !== undefined )
            top = loader.bottom === -26 ? newRoom.height - loader.height - loader.bottom - 52 : 
            newRoom.height - loader.height - loader.bottom
        if ( loader.right !== undefined )
            left = loader.right === -26 ? newRoom.width - loader.width - loader.right - 52 : 
            newRoom.width - loader.width - loader.right
        if ( loader.top !== undefined )
            top = loader.top === -26 ? loader.top + 52 : loader.top
        if ( loader.left !== undefined )
            left = loader.left === -26 ? loader.left + 52 : loader.left
        setRoomLeft(getRoomLeft() - left + Number(cpuLeft.replace('px', '')))
        setRoomTop(getRoomTop() - top + Number(cpuTop.replace('px', '')))
    })
}

export const loadCurrentRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    
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
    })

    setCurrentRoom(roomToRender)
    getRoomContainer().append(roomToRender)
}