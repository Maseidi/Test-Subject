import { rooms } from "./rooms.js"
import { collide } from "./util.js"
import { loaders } from "./loaders.js"
import { loadCurrentRoom } from "./room-loader.js"
import { interactables } from "./interactables.js"
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
    const solid = getCurrentRoomSolid().find(solid => collide(getPlayer().firstElementChild.children[1], solid, 12))
    if ( solid ) setAllowMove(false)
}

const manageLoaders = () => {
    const loader = getCurrentRoomLoaders().find(loader => collide(getPlayer().firstElementChild, loader, 0))
    if ( !loader ) return
    const cpu = window.getComputedStyle(loader)
    setPrevRoomId(getCurrentRoomId())
    setCurrentRoomId(Number(loader.classList[0]))
    calculateNewRoomLeftAndTop(cpu.left, cpu.top)
    getCurrentRoom().remove()
    loadCurrentRoom()
    refactorInteractables(getPrevRoomId())
}

const refactorInteractables = (id) => interactables.set(id, interactables.get(id).filter(int => int !== null))

const calculateNewRoomLeftAndTop = (cpuLeft, cpuTop) => {
    const newRoom = rooms.get(getCurrentRoomId())
    const loader = loaders.get(getCurrentRoomId()).find(loader => loader.className === getPrevRoomId())
    let left, top
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