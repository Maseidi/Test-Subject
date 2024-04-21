import { getCurrentRoom, getCurrentRoomLoaders, getCurrentRoomSolid, getPlayer } from "./elements.js"
import { loadCurrentRoom } from "./room-loader.js"
import { rooms } from "./rooms.js"
import { collide, removeClass } from "./util.js"
import { getAllowMove, getCurrentRoomId,
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
}

const hitSolid = () => {
    setAllowMove(true)
    Array.from(getCurrentRoomSolid()).forEach((solid) => {
        if ( collide(getPlayer().firstElementChild.children[1], solid, 12) ) {
            setAllowMove(false)
            removeClass(getPlayer(), 'walk')
            removeClass(getPlayer(), 'run')
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