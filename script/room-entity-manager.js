import { getCurrentRoom, getPlayer } from "./elements.js"
import { loadCurrentRoom } from "./room-loader.js"
import { rooms } from "./rooms.js"
import { collide, containsClass } from "./util.js"
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
    setAllowMove(true)
    Array.from(getCurrentRoom().children).forEach((elem) => {
        hitSolid(elem)
        enterNewRoom(elem)
    })
}

const hitSolid = (elem) => {
    if ( containsClass(elem, 'solid') && collide(getPlayer().firstElementChild.children[1], elem, 12)) setAllowMove(false)
}

const enterNewRoom = (elem) => {
    if ( containsClass(elem, 'loader') && collide(getPlayer().firstElementChild, elem, 0) ) {
        const cpu = window.getComputedStyle(elem)
        setPrevRoomId(getCurrentRoomId())
        setCurrentRoomId(elem.classList[0])
        calculateNewRoomLeftAndTop(cpu.left, cpu.top)
        getCurrentRoom().remove()
        loadCurrentRoom()
    }
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