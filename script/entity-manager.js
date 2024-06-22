import { rooms } from "./rooms.js"
import { loaders } from "./loaders.js"
import { getEnemyState, notifyEnemy } from "./enemy-actions.js"
import { loadCurrentRoom } from "./room-loader.js"
import { CHASE, NO_OFFENCE, normalEnemyBehavior } from "./normal-enemy.js"
import { addAttribute, collide, containsClass, removeClass } from "./util.js"
import { 
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomInteractables,
    getCurrentRoomLoaders,
    getCurrentRoomSolid,
    getPlayer } from "./elements.js"
import {
    getCurrentRoomId,
    getIntObj,
    getNoOffenseCounter,
    getPrevRoomId,
    getRoomLeft,
    getRoomTop,
    setAllowMove,
    setCurrentRoomId,
    setIntObj,
    setNoOffenseCounter,
    setPrevRoomId,
    setRoomLeft,
    setRoomTop} from "./variables.js"
import { checkCollision } from "./enemy-collision.js"

export const manageEntities = () => {
    manageSolidObjects()
    manageLoaders()
    manageInteractables()
    manageEnemies()
}

const manageSolidObjects = () => {
    setAllowMove(true)
    const solid = getCurrentRoomSolid().find(solid => collide(getPlayer().firstElementChild.children[1], solid, 12))
    if ( solid ) setAllowMove(false)
    if ( solid && containsClass(solid.parentElement, 'enemy') ) notifyEnemy(100, solid.parentElement)    
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
}

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
        if ( collide(getPlayer().firstElementChild, int, 20) && !getIntObj() ) {
            popup.style.bottom = `calc(100% + 20px)`
            popup.style.opacity = `1`
            setIntObj(int)
            return
        }
        popup.style.bottom = `calc(100% - 20px)`
        popup.style.opacity = `0`
    })
}

const manageEnemies = () => {
    if ( getNoOffenseCounter() > 0 ) setNoOffenseCounter(getNoOffenseCounter() + 1)
    if ( getNoOffenseCounter() >= 180 ) {
        Array.from(getCurrentRoomEnemies())
            .filter(enemy => getEnemyState(enemy) === NO_OFFENCE)
            .forEach(enemy => {
                addAttribute(enemy, 'state', CHASE)
                removeClass(enemy.firstElementChild.firstElementChild.firstElementChild, 'attack')
            })
        setNoOffenseCounter(0)
    }
    getCurrentRoomEnemies().forEach((enemy) => {
        manageDamagedState(enemy)
        checkCollision(enemy)
        if ( containsClass(enemy, 'torturer') || 
             containsClass(enemy, 'soul-drinker') || 
             containsClass(enemy, 'rock-crusher') || 
             containsClass(enemy, 'iron-master') ) normalEnemyBehavior(enemy)
    })
}

const manageDamagedState = (enemy) => {
    let damagedCounter = Number(enemy.getAttribute('damaged-counter'))
    if ( damagedCounter === 0 ) {
        removeClass(enemy.firstElementChild.firstElementChild, 'damaged')
        return
    }
    damagedCounter--
    addAttribute(enemy, 'damaged-counter', damagedCounter)
}