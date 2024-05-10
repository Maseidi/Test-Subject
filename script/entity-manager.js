import { collide } from "./util.js"
import { getRoom } from "./rooms.js"
import { loadCurrentRoom } from "./room-loader.js"
import { getCurrentRoom, getCurrentRoomInteractables, getCurrentRoomLoaders, getCurrentRoomSolid, getPlayer } from "./elements.js"
import { 
    getCurrentRoomId,
    getPrevRoomId,
    getRoomLeft,
    getRoomTop,
    setAllowMove,
    setCurrentRoomId,
    setIntObj,
    setPrevRoomId,
    setRoomLeft,
    setRoomTop} from "./variables.js"

export const manageEntities = () => {
    manageSolidObjects()
    manageLoaders()
    manageInteractables()
}

const manageSolidObjects = () => {
    setAllowMove(true)
    Array.from(getCurrentRoomSolid()).forEach((solid) => {
        if ( collide(getPlayer().firstElementChild.children[1], solid, 12) ) {
            setAllowMove(false)
            return
        }
    })
}

const manageLoaders = () => {
    Array.from(getCurrentRoomLoaders()).forEach((loader) => {
        if ( collide(getPlayer().firstElementChild, loader, 0) ) {
            const cpu = window.getComputedStyle(loader)
            setPrevRoomId(getCurrentRoomId())
            setCurrentRoomId(Number(loader.classList[0]))
            calculateNewRoomLeftAndTop(cpu.left, cpu.top)
            getCurrentRoom().remove()
            loadCurrentRoom() 
            return   
        }
    })
}

const calculateNewRoomLeftAndTop = (cpuLeft, cpuTop) => {
    const newRoom = getRoom(getCurrentRoomId())
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

const manageInteractables = () => {
    setIntObj(undefined)
    Array.from(getCurrentRoomInteractables()).forEach((int) => {
        const popup = int.children[1]
        if ( collide(getPlayer().firstElementChild, int, 20) ) {
            popup.style.bottom = `calc(100% + 20px)`
            popup.style.opacity = `1`
            setIntObj(int)
            return
        }
        popup.style.bottom = `calc(100% - 20px)`
        popup.style.opacity = `0`
    })
}