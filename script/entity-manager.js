import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { loadCurrentRoom } from './room-loader.js'
import { CHASE, NO_OFFENCE } from './enemy-state.js'
import { checkCollision } from './enemy-collision.js'
import { normalEnemyBehavior } from './normal-enemy.js'
import { addAttribute, collide, containsClass, removeClass } from './util.js'
import { getEnemyState, noOffenceAllEnemies, notifyEnemy, setEnemyState } from './enemy-actions.js'
import { 
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomInteractables,
    getCurrentRoomLoaders,
    getCurrentRoomRangerBullets,
    getCurrentRoomSolid,
    getPlayer, 
    setCurrentRoomRangerBullets} from './elements.js'
import {
    getCurrentRoomId,
    getIntObj,
    getNoOffenseCounter,
    getRoomLeft,
    getRoomTop,
    setAllowMove,
    setCurrentRoomId,
    setIntObj,
    setNoOffenseCounter,
    setRoomLeft,
    setRoomTop} from './variables.js'
import { rangerEnemyBehavior } from './ranger-enemy.js'
import { takeDamage } from './player-health.js'

export const manageEntities = () => {
    manageSolidObjects()
    manageLoaders()
    manageInteractables()
    manageEnemies()
    manageRangerBullets()
}

const manageSolidObjects = () => {
    setAllowMove(true)
    const solid = getCurrentRoomSolid().find(solid => collide(getPlayer().firstElementChild.children[1], solid, 12))
    if ( solid ) setAllowMove(false)
    if ( solid && containsClass(solid.parentElement, 'enemy') ) notifyEnemy(100, solid.parentElement)    
}

let prevRoomId
const manageLoaders = () => {
    const loader = getCurrentRoomLoaders().find(loader => collide(getPlayer().firstElementChild, loader, 0))
    if ( !loader ) return
    const cpu = window.getComputedStyle(loader)
    prevRoomId = getCurrentRoomId()
    setCurrentRoomId(Number(loader.classList[0]))
    calculateNewRoomLeftAndTop(cpu.left, cpu.top)
    getCurrentRoom().remove()
    loadCurrentRoom()
}

const calculateNewRoomLeftAndTop = (cpuLeft, cpuTop) => {
    const newRoom = rooms.get(getCurrentRoomId())
    const loader = loaders.get(getCurrentRoomId()).find(loader => loader.className === prevRoomId)
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
    handleNoOffenceMode()
    handleEnemies()
}

const handleNoOffenceMode = () => {
    if ( getNoOffenseCounter() > 0 ) setNoOffenseCounter(getNoOffenseCounter() + 1)
    if ( getNoOffenseCounter() < 180 ) return
    Array.from(getCurrentRoomEnemies())
        .filter(enemy => getEnemyState(enemy) === NO_OFFENCE)
        .forEach(enemy => {
            setEnemyState(enemy, CHASE)
            removeClass(enemy.firstElementChild.firstElementChild.firstElementChild, 'attack')
        })
    setNoOffenseCounter(0)
}

const BEHAVIOR_MAP = new Map([
    ['torturer', normalEnemyBehavior],
    ['soul-drinker', normalEnemyBehavior],
    ['rock-crusher', normalEnemyBehavior],
    ['iron-master', normalEnemyBehavior],
    ['ranger', rangerEnemyBehavior],
])

const handleEnemies = () => {
    getCurrentRoomEnemies().forEach((enemy) => {
        manageDamagedState(enemy)
        checkCollision(enemy)
        BEHAVIOR_MAP.get(enemy.getAttribute('type'))(enemy) 
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

const manageRangerBullets = () => {
    const bullets2Remove = []
    for ( const bullet of getCurrentRoomRangerBullets() ) {
        const x = +bullet.style.left.replace('px', '')
        const y = +bullet.style.top.replace('px', '')
        const speedX = +bullet.getAttribute('speed-x')
        const speedY = +bullet.getAttribute('speed-y')
        bullet.style.left = `${x + speedX}px`
        bullet.style.top = `${y + speedY}px`
        if ( collide(bullet, getPlayer().firstElementChild, 0) ) {
            takeDamage(+bullet.getAttribute('damage'))
            bullets2Remove.push(bullet)
            bullet.remove()
            noOffenceAllEnemies()
            continue
        }
        for ( const solid of getCurrentRoomSolid() )
            if ((!containsClass(solid, 'enemy-collider') && 
                 !containsClass(solid, 'iron-master-component') && 
                 collide(bullet, solid, 0)) || 
                 !collide(bullet, getCurrentRoom(), 0) ) {
                bullets2Remove.push(bullet)
                bullet.remove()
            }
    }
    setCurrentRoomRangerBullets(getCurrentRoomRangerBullets().filter(bullet => !bullets2Remove.includes(bullet)))
}