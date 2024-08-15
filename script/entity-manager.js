import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { loadCurrentRoom } from './room-loader.js'
import { CHASE, GO_FOR_RANGED, GRAB, LOST, NO_OFFENCE, RANGER, STUNNED } from './enemy/util/enemy-constants.js'
import { damagePlayer, poisonPlayer, setPlayer2Fire } from './player-health.js'
import { 
    addAllAttributes,
    addAttribute,
    calculateBulletSpeed,
    collide,
    containsClass,
    createAndAddClass,
    element2Object,
    getProperty,
    removeClass } from './util.js'
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
    getCurrentRoomThrowables,
    setCurrentRoomThrowables,
    getMapEl } from './elements.js'
import {
    getCurrentRoomId,
    getGrabbed,
    getIntObj,
    getNoOffenseCounter,
    getRoomLeft,
    getRoomTop,
    getStunnedCounter,
    setAllowMove,
    setCurrentRoomId,
    setIntObj,
    setNoOffenseCounter,
    setRoomLeft,
    setRoomTop, 
    setStunnedCounter} from './variables.js'

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
    handleStunnedMode()
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

const handleStunnedMode = () => {
    if ( getStunnedCounter() > 0 ) setStunnedCounter(getStunnedCounter() + 1)
    if ( getStunnedCounter() < 600 ) return
    Array.from(getCurrentRoomEnemies())
        .forEach(elem => {
            elem.state = LOST
            elem.lostCounter = 1
        })
    setStunnedCounter(0)
}

const handleEnemies = () => {
    Array.from(getCurrentRoomEnemies())
        .sort(() => Math.random() - 0.5)
        .forEach(elem => elem.behave())
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

const manageFlames = () => handleObstacles(getCurrentRoomFlames, setCurrentRoomFlames, 900, setPlayer2Fire)

const managePoisons = () => handleObstacles(getCurrentRoomPoisons, setCurrentRoomPoisons, 600, poisonPlayer)

const handleObstacles = (getItems, setItems, time, harmPlayer) => {
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
    const throwables2Remove = new Map([])
    for ( const throwable of getCurrentRoomThrowables() ) {
        const throwableObj = element2Object(throwable)
        let { 
            deg,
            time,
            name,
            'base-speed': baseSpeed,
            'speed-x': speedX,
            'speed-y': speedY,
            'diff-x': diffX,
            'diff-y': diffY,
            'acc-counter': accCounter } = throwableObj
        rotateThrowable(throwable, baseSpeed)
        handleInteractablility(throwable, time, name, throwables2Remove)
        addAttribute(throwable, 'acc-counter', accCounter + 1)
        if ( accCounter === 15 && baseSpeed - 2 >= 0 ) {
            const newSpeed = calculateBulletSpeed(deg, diffY / diffX, diffX, diffY, baseSpeed - 2)
            speedX = Math.sign(speedX) * Math.abs(newSpeed.speedX)
            speedY = Math.sign(speedY) * Math.abs(newSpeed.speedY)
            addAllAttributes(
                throwable,
                'acc-counter', 0, 
                'speed-x', speedX, 
                'speed-y', speedY, 
                'base-speed', baseSpeed - 2
            )
        }
        throwable.style.left = `${getProperty(throwable, 'left', 'px') + speedX}px`
        throwable.style.top = `${getProperty(throwable, 'top', 'px') + speedY}px`
        wallIntersection(throwable, speedX, speedY)
    }
    setCurrentRoomThrowables(getCurrentRoomThrowables().filter(throwable => !throwables2Remove.get(throwable)))
}

const rotateThrowable = (throwable, baseSpeed) => {
    const angle = getProperty(throwable.firstElementChild, 'transform', 'rotateZ(', 'deg)') || 0
    let newAngle = Number(angle) + ( Math.floor(Math.random() * baseSpeed * 10) )
    if ( newAngle > 360 ) newAngle = 0
    throwable.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
}

const explodeGrenade = () => {
    console.log('explode grenade');
}

const blindEnemies = () => {
    getCurrentRoomEnemies().forEach(enemy => {
        if ( enemy.state === GRAB ) enemy.grabService.releasePlayer()
        setStunnedCounter(1)
        if ( enemy.state !== GO_FOR_RANGED ) enemy.state = STUNNED
    })
    const flashbang = createAndAddClass('div', 'flashbang')
    getMapEl().append(flashbang)
    setTimeout(() => flashbang.remove(), 1000)
}

const THROWABLE_FUNCTIONALITY = new Map([
    ['grenade', explodeGrenade],
    ['flashbang', blindEnemies]
])

const handleInteractablility = (throwable, time, name, throwables2Remove) => {
    if ( time === 180 ) {
        throwable.remove()
        throwables2Remove.set(throwable, true)
        THROWABLE_FUNCTIONALITY.get(name)()
    }
    addAttribute(throwable, 'time', time + 1)
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
    if ( collide(colliderX, wall, 0) ) {
        addAttribute(throwable, 'speed-x', -speedX)
        throwable.firstElementChild.style.transform = `scale(-1, 1)`
    }
    else if ( collide(colliderY, wall, 0) ) {
        addAttribute(throwable, 'speed-y', -speedY)
        throwable.firstElementChild.style.transform = `scale(1, -1)`
    }
}