import { getCurrentRoom, getCurrentRoomInteractables, getCurrentRoomLoaders, getCurrentRoomSolid, getPlayer } from "./elements.js"
import { loadCurrentRoom } from "./room-loader.js"
import { rooms } from "./rooms.js"
import { collide } from "./util.js"
import { getCurrentRoomId,
    getPrevRoomId,
    getRoomLeft,
    getRoomTop,
    setAllowMove,
    setCurrentRoomId,
    setPrevRoomId,
    setRoomLeft,
    setRoomTop } from "./variables.js"

export const manageEntities = () => {
    hitSolid()
    enterNewRoom()
    hitInteractables()
}

const hitSolid = () => {
    setAllowMove(true)
    Array.from(getCurrentRoomSolid()).forEach((solid) => {
        if ( collide(getPlayer().firstElementChild.children[1], solid, 12) ) {
            setAllowMove(false)
            return
        }
    })
}

const enterNewRoom = () => {
    Array.from(getCurrentRoomLoaders()).forEach((loader) => {
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

const calculateNewRoomLeftAndTop = (cpuLeft, cpuTop) => {
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

const hitInteractables = () => {
    Array.from(getCurrentRoomInteractables()).forEach((int) => {
        const popup = int.children[1]
        if ( collide(getPlayer().firstElementChild, int, 20) ) {
            popup.style.bottom = `calc(100% + 20px)`
            popup.style.opacity = `1`
            return
        }
        popup.style.bottom = `calc(100% - 20px)`
        popup.style.opacity = `0`
    })
}