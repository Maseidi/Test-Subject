import { rooms } from './rooms.js'
import { loaders } from './loaders.js'
import { dropLoot } from './loot-manager.js'
import { enemies } from './enemy/util/enemies.js'
import { loadCurrentRoom } from './room-loader.js'
import { getThrowableDetail } from './throwable-details.js'
import { damagePlayer, poisonPlayer, setPlayer2Fire } from './player-health.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GRAB,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    STUNNED } from './enemy/util/enemy-constants.js'
import { 
    addAllAttributes,
    addExplosion,
    calculateBulletSpeed,
    collide,
    containsClass,
    createAndAddClass,
    element2Object,
    getProperty } from './util.js'
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
    getMapEl, 
    getCurrentRoomExplosions,
    setCurrentRoomExplosions } from './elements.js'
import {
    getCurrentRoomId,
    getExplosionDamageCounter,
    getGrabbed,
    getElementInteractedWith,
    getMaxHealth,
    getNoOffenseCounter,
    getRoomLeft,
    getRoomTop,
    getStunnedCounter,
    setAllowMove,
    setCurrentRoomId,
    setExplosionDamageCounter,
    setElementInteractedWith,
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
    manageExplosions()
}

const manageSolidObjects = () => {
    setAllowMove(true)
    if ( getCurrentRoomSolid().find(solid => collide(getPlayer().firstElementChild.children[1], solid, 12)) ) 
        setAllowMove(false)
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
    if ( loader.bottom !== null )
        top = loader.bottom === -26 ? newRoom.height - loader.height - loader.bottom - 52 : 
        newRoom.height - loader.height - loader.bottom
    if ( loader.right !== null )
        left = loader.right === -26 ? newRoom.width - loader.width - loader.right - 52 : 
        newRoom.width - loader.width - loader.right
    if ( loader.top !== null )
        top = loader.top === -26 ? loader.top + 52 : loader.top
    if ( loader.left !== null )
        left = loader.left === -26 ? loader.left + 52 : loader.left
    setRoomLeft(getRoomLeft() - left + getProperty(prevLoader, 'left', 'px'))
    setRoomTop(getRoomTop() - top + getProperty(prevLoader, 'top', 'px'))
}

const manageInteractables = () => {
    setElementInteractedWith(null)
    getCurrentRoomInteractables().forEach((int) => {
        const popup = int.children[1] ?? int.children[0]
        const isStealthKill = popup.lastElementChild.lastElementChild.src       
        const range = isStealthKill ? 5 : 20
        if ( !getElementInteractedWith() && collide(getPlayer().firstElementChild, int, range) ) {
            if ( isEnemyNotified(isStealthKill, popup) ) return
            popup.style.bottom = `calc(100% + 20px)`
            popup.style.opacity = `1`
            setElementInteractedWith(int)
            return
        }
        popup.style.bottom = `calc(100% - 20px)`
        popup.style.opacity = `0`
    })
}

const isEnemyNotified = (isStealthKill, popup) => {
    if ( !isStealthKill ) return false
    const enemyElem = popup.parentElement.parentElement.parentElement
    const enemyPath = enemyElem.previousSibling.id
    const index = Number(enemyPath.replace('path-', ''))
    const validStates = [LOST, INVESTIGATE, MOVE_TO_POSITION, STUNNED] 
    const enemyState = enemies.get(getCurrentRoomId())[index].state
    if ( !validStates.includes(enemyState) ) return true
}

const manageEnemies = () => {
    handleNoOffenceMode()
    handleStunnedMode()
    handleEnemies()
}

const handleNoOffenceMode = () => {
    if ( getNoOffenseCounter() > 0 ) setNoOffenseCounter(getNoOffenseCounter() + 1)
    if ( getNoOffenseCounter() < 180 ) return
    getCurrentRoomEnemies()
        .filter(elem => elem.state === NO_OFFENCE)
        .forEach(elem => elem.state = CHASE)
    setNoOffenseCounter(0)
}

const handleStunnedMode = () => {
    if ( getStunnedCounter() > 0 ) setStunnedCounter(getStunnedCounter() + 1)
    if ( getStunnedCounter() < 600 ) return
    getCurrentRoomEnemies()
        .forEach(elem => {
            elem.state = LOST
            elem.lostCounter = 1
        })
    setStunnedCounter(0)
}

const handleEnemies = () => 
    getCurrentRoomEnemies().sort(() => Math.random() - 0.5).forEach(elem => elem.behave())

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
        item.setAttribute('time', theTime + 1)
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
        handleInteractability(throwable, time, name, throwables2Remove)
        throwable.setAttribute('acc-counter', accCounter + 1)
        
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

const explodeGrenade = (throwable) => {
    const left = getProperty(throwable, 'left', 'px')
    const top = getProperty(throwable, 'top', 'px')
    addExplosion(left, top)
}

const blindEnemies = (throwable) => {    
    if ( !collide(getCurrentRoom(), throwable, 0) ) return
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

const handleInteractability = (throwable, time, name, throwables2Remove) => {
    if ( time === 180 ) {
        THROWABLE_FUNCTIONALITY.get(name)(throwable)
        throwables2Remove.set(throwable, true)
        throwable.remove()
    }
    throwable.setAttribute('time', time + 1)
}

const wallIntersection = (throwable, speedX, speedY) => {
    const walls = getCurrentRoomSolid()
        .filter(solid => !containsClass(solid, 'enemy-collider') )
    for ( const wall of walls ) {
        const stateX = speedX < 0 ? 10 : 20
        const stateY = speedY < 0 ? 1 : 2  
        switch( stateX + stateY ) {
            case 11: 
                updateThrowableSpeed(throwable, wall, throwable.children[2], throwable.children[1], speedX, speedY)
                break
            case 12:
                updateThrowableSpeed(throwable, wall, throwable.children[2], throwable.children[4], speedX, speedY)
                break
            case 21:
                updateThrowableSpeed(throwable, wall, throwable.children[3], throwable.children[1], speedX, speedY)
                break
            case 22:
                updateThrowableSpeed(throwable, wall, throwable.children[3], throwable.children[4], speedX, speedY)
                break
        }
    }    
}

const updateThrowableSpeed = (throwable, wall, colliderX, colliderY, speedX, speedY) => {
    if ( collide(colliderX, wall, 0) ) {
        throwable.setAttribute('speed-x', -speedX)
        throwable.firstElementChild.style.transform = `scale(-1, 1)`
    }
    else if ( collide(colliderY, wall, 0) ) {
        throwable.setAttribute('speed-y', -speedY)
        throwable.firstElementChild.style.transform = `scale(1, -1)`
    }
}

const manageExplosions = () => {
    const explosions2Remove = new Map([])
    getCurrentRoomExplosions().forEach(explosion => {
        explodePlayer(explosion)
        explodeEnemies(explosion)
        explodeCrates(explosion)
        const time = Number(explosion.getAttribute('time'))
        const scale = getProperty(explosion, 'transform', 'scale(', ')')
        if ( time < 10 ) explosion.style.transform = `scale(${scale + 2})`
        else if ( time < 20 ) explosion.style.transform = `scale(${scale - 2})`
        if ( time === 30 ) {
            explosion.remove()
            explosions2Remove.set(explosion, true)
        }
        explosion.setAttribute('time', time + 1)
    })
    setCurrentRoomExplosions(getCurrentRoomExplosions().filter(explosion => !explosions2Remove.get(explosion)))
}

const explodePlayer = (explosion) => {
    if ( getExplosionDamageCounter() !== 0 ) return
    if ( !collide(getPlayer(), explosion, 0) ) return
    damagePlayer(80 * getMaxHealth() / 100)
    setExplosionDamageCounter(1)
    setNoOffenseCounter(1)
}

const explodeEnemies = (explosion) => {
    for ( const enemy of getCurrentRoomEnemies() ) {
        if ( enemy.explosionCounter !== 0 ) continue
        if ( !collide(enemy.sprite, explosion, 0) ) continue
        enemy.injuryService.damageEnemy('grenade', Math.min(getThrowableDetail('grenade', 'damage'), enemy.health))
        enemy.explosionCounter = 1
        enemy.state = LOST
        enemy.lostCounter = 1
    }
}

const explodeCrates = (explosion) => {
    for ( const int of getCurrentRoomInteractables() ) {
        if ( int.getAttribute('name') !== 'crate' ) continue
        if ( !collide(explosion, int, 0) ) continue
        dropLoot(int)
    }
}