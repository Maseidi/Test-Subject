import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { loadCurrentRoom } from './room-loader.js'
import { CHASE, NO_OFFENCE } from './enemy/util/enemy-constants.js'
import { damagePlayer, poisonPlayer, setPlayer2Fire } from './player-health.js'
import { addAttribute, collide, containsClass, getProperty, removeClass } from './util.js'
import { 
    getCurrentRoom,
    getCurrentRoomEnemies,
    getCurrentRoomFlames,
    getCurrentRoomInteractables,
    getCurrentRoomLoaders,
    getCurrentRoomBullets,
    getCurrentRoomSolid,
    getPlayer, 
    getCurrentRoomPoisons,
    setCurrentRoomBullets,
    setCurrentRoomFlames,
    setCurrentRoomPoisons,
    getCurrentRoomThrowables} from './elements.js'
import {
    getCurrentRoomId,
    getGrabbed,
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

export const manageEntities = () => {
    manageSolidObjects()
    manageLoaders()
    manageInteractables()
    manageEnemies()
    manageBullets()
    manageFlames()
    managePoisons()
    manageThrowables()
}

const manageSolidObjects = () => {
    setAllowMove(true)
    const solid = getCurrentRoomSolid().find(solid => collide(getPlayer().firstElementChild.children[1], solid, 12))
    if ( solid ) setAllowMove(false)
    if ( solid && solid.enemy ) solid.notifyEnemy(100)    
}

let prevRoomId
const manageLoaders = () => {
    const loader = getCurrentRoomLoaders().find(loader => collide(getPlayer().firstElementChild, loader, 0))
    if ( !loader ) return
    prevRoomId = getCurrentRoomId()
    setCurrentRoomId(Number(loader.classList[0]))
    calculateNewRoomLeftAndTop(loader)
    getCurrentRoom().remove()
    loadCurrentRoom()
}

const calculateNewRoomLeftAndTop = (prevLoader) => {
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
    setRoomLeft(getRoomLeft() - left + getProperty(prevLoader, 'left', 'px'))
    setRoomTop(getRoomTop() - top + getProperty(prevLoader, 'top', 'px'))
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
        .filter(elem => elem.state === NO_OFFENCE)
        .forEach(elem => {
            elem.state = CHASE
            removeClass(elem.htmlTag.firstElementChild.firstElementChild.firstElementChild, 'attack')
        })
    setNoOffenseCounter(0)
}

const handleEnemies = () => {
    Array.from(getCurrentRoomEnemies())
        .sort(() => Math.random() - 0.5)
        .forEach((elem) => {
            if ( elem.health > 0 ) {
                elem.visionService.getWallInTheWay()
                elem.visionService.vision2Player()
                elem.injuryService.manageDamagedState()
                elem.collisionService.manageCollision()
                elem.behave()
            }
        })
}

const manageBullets = () => {
    const bullets2Remove = new Map([])
    for ( const bullet of getCurrentRoomBullets() ) {
        const x = getProperty(bullet, 'left', 'px')
        const y = getProperty(bullet, 'top', 'px')
        const speedX = Number(bullet.getAttribute('speed-x'))
        const speedY = Number(bullet.getAttribute('speed-y'))
        bullet.style.left = `${x + speedX}px`
        bullet.style.top = `${y + speedY}px`
        if ( collide(bullet, getPlayer().firstElementChild, 0) ) {
            if ( !getGrabbed() ) {
                damagePlayer(Number(bullet.getAttribute('damage')))
                if ( containsClass(bullet, 'scorcher-bullet') ) setPlayer2Fire()
                if ( containsClass(bullet, 'stinger-bullet') ) poisonPlayer()    
            }
            bullet.remove()
            bullets2Remove.set(bullet, true)
            continue
        }
        for ( const solid of getCurrentRoomSolid() )
            if ((!containsClass(solid, 'enemy-collider') && 
                 !containsClass(solid, 'tracker-component') && 
                 collide(bullet, solid, 0)) || 
                 !collide(bullet, getCurrentRoom(), 0) ) {
                bullet.remove()
                bullets2Remove.set(bullet, true)
            }
    }
    setCurrentRoomBullets(getCurrentRoomBullets().filter(bullet => !bullets2Remove.get(bullet)))    
}

const manageFlames = () => manageItems(getCurrentRoomFlames, setCurrentRoomFlames, 900, setPlayer2Fire)

const managePoisons = () => manageItems(getCurrentRoomPoisons, setCurrentRoomPoisons, 600, poisonPlayer)

const manageItems = (getItems, setItems, time, harmPlayer) => {
    const items2Remove = new Map([])
    getItems().forEach(item => {
        const theTime = Number(item.getAttribute('time'))
        if ( theTime === time ) {
            item.remove()
            items2Remove.set(item, true)
        }
        addAttribute(item, 'time', theTime + 1)
        if ( collide(item, getPlayer(), 0) ) {
            harmPlayer()
            items2Remove.set(item, true)
        }    
    })
    setItems(getItems().filter(item => !items2Remove.get(item)))
}

const manageThrowables = () => {
    for ( const throwable of getCurrentRoomThrowables() ) {
        const x = getProperty(throwable, 'left', 'px')
        const y = getProperty(throwable, 'top', 'px')
        const speedX = Number(throwable.getAttribute('speed-x'))
        const speedY = Number(throwable.getAttribute('speed-y'))
        const diffX = Number(throwable.getAttribute('diff-x'))
        const diffY = Number(throwable.getAttribute('diff-y'))
        const distance = Number(throwable.getAttribute('distance'))
        const displacement = Math.sqrt(Math.pow(speedX * diffY / diffX, 2) + Math.pow(speedY * diffX / diffY, 2))
        const newDistance = distance + displacement
        if ( newDistance >= 300 ) continue
        addAttribute(throwable, 'distance', newDistance)
        throwable.style.left = `${x + speedX}px`
        throwable.style.top = `${y + speedY}px`
        wallIntersection(throwable, speedX, speedY)
    }
}

const wallIntersection = (throwable, speedX, speedY) => {
    const walls = Array.from(getCurrentRoomSolid())
        .filter(solid => !containsClass(solid, 'enemy-collider') && !containsClass(solid, 'tracker-component'))
    for ( const wall of walls ) {
        const stateX = speedX < 0 ? 10 : 20
        const stateY = speedY < 0 ? 1 : 2  
        switch( stateX + stateY ) {
            case 11: 
                updateSpeed(throwable, wall, throwable.children[2], throwable.children[1], speedX, speedY)
                break
            case 12:
                updateSpeed(throwable, wall, throwable.children[2], throwable.children[4], speedX, speedY)
                break
            case 21:
                updateSpeed(throwable, wall, throwable.children[3], throwable.children[1], speedX, speedY)
                break
            case 22:
                updateSpeed(throwable, wall, throwable.children[3], throwable.children[4], speedX, speedY)
                break
        }
    }    
}

const updateSpeed = (throwable, wall, colliderX, colliderY, speedX, speedY) => {
    if ( collide(colliderX, wall, 0) ) addAttribute(throwable, 'speed-x', -speedX)
    else if ( collide(colliderY, wall, 0) ) addAttribute(throwable, 'speed-y', -speedY)
}