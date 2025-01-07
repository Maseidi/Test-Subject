import { Popup } from './popup-manager.js'
import { unequipTorch } from './actions.js'
import { dropLoot } from './loot-manager.js'
import { removeTorch } from './torch-loader.js'
import { sources } from './dialogue-manager.js'
import { loadCurrentRoom } from './room-loader.js'
import { getThrowableDetail } from './throwable-details.js'
import { findEquippedTorchById, getInventory } from './inventory.js'
import { getEnemies, getLoaders, getPopups, getRooms } from './entities.js'
import { activateAllProgresses, getProgressValueByNumber } from './progress-manager.js'
import { damagePlayer, infectPlayer2SpecificVirus, poisonPlayer, setPlayer2Fire } from './player-health.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GRAB,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    STUNNED } from './enemy/enemy-constants.js'
import { 
    addAllAttributes,
    addClass,
    addExplosion,
    calculateBulletSpeed,
    collide,
    containsClass,
    createAndAddClass,
    element2Object,
    getProperty, 
    isAble2Interact, 
    removeClass, 
    renderShadow} from './util.js'
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
    getCurrentRoomThrowables,
    getCurrentRoomExplosions,
    getSpeaker,
    getRoomNameContainer,
    getPopupContainer,
    getDialogueContainer, 
    getShadowContainer } from './elements.js'
import {
    getCurrentRoomId,
    getExplosionDamageCounter,
    getGrabbed,
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
    setStunnedCounter, 
    getElementInteractedWith,
    getEquippedTorchId,
    getPlayingDialogue,
    setPlayingDialogue } from './variables.js'

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
    manageTorch()
    managePopovers()
    manageDialogues()
}

const manageSolidObjects = () => {
    setAllowMove(true)
    const collision = getCurrentRoomSolid().find(solid => collide(getPlayer().firstElementChild.children[1], solid, 12)) 
    if ( collision ) setAllowMove(false)
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
    const newRoom = getRooms().get(getCurrentRoomId())
    const loader = getLoaders().get(getCurrentRoomId()).find(loader => loader.className === prevRoomId)
       
    if ( loader.bottom !== null )
        var top = loader.bottom === -26 ? newRoom.height - loader.height - loader.bottom - 52 : 
            newRoom.height - loader.height - loader.bottom

    if ( loader.right !== null )
        var left = loader.right === -26 ? newRoom.width - loader.width - loader.right - 52 : 
            newRoom.width - loader.width - loader.right

    if ( loader.top !== null )
        var top = loader.top === -26 ? loader.top + 52 : loader.top

    if ( loader.left !== null )
        var left = loader.left === -26 ? loader.left + 52 : loader.left

    setRoomLeft(getRoomLeft() - left + getProperty(prevLoader, 'left', 'px'))
    setRoomTop(getRoomTop() - top + getProperty(prevLoader, 'top', 'px'))
}

const manageInteractables = () => {
    setElementInteractedWith(null)
    getCurrentRoomInteractables().forEach((int) => {
        switch ( int.getAttribute('name') ) {
            case 'speaker':
                return
            case 'door': 
                handleDoorInteractables(int)
                break
            case 'enemy-back':
                handleEnemyInteractables(int)
                break
            default:
                hanldeRestOfInteractables(int)
        }
    })
}

const handleDoorInteractables = (int) => {
    const popup = int.firstElementChild
    handleDoorWithCodeIdealInteraction(int, popup)
    if ( containsClass(int, 'open') )      removePopup(popup)
    else if ( !interactionPredicate(int) ) removePopup(popup)
    else                                   setAsInteractingObject(popup, int)
}

const showPopup = (popup) => popup.style.display = 'block'

const removePopup = (popup) => popup.style.display = 'none'

const interactionPredicate = (int) => collide(getPlayer().firstElementChild, int, 20) && !getElementInteractedWith()

const setAsInteractingObject = (popup, int) => {
    showPopup(popup)
    setElementInteractedWith(int)
    if ( !getProgressValueByNumber('8013') ) return
    if ( int.getAttribute('name') === 'stash' && !getProgressValueByNumber('1000003') ) {
        getPopups().push(new Popup('Use stash to manage your items in a much more organized environment', {renderProgress: '1000003'}, 3000))
        activateAllProgresses('1000003')
    } else if ( int.getAttribute('name') === 'vendingMachine' && !getProgressValueByNumber('1000004') ) {
        getPopups().push(new Popup('Use vending machine to buy/sell items or upgrade your gear', {renderProgress: '1000004'}, 3000))
        activateAllProgresses('1000004')
    }
}

const handleEnemyInteractables = (int) => {
    const popup = int.firstElementChild
    const enemyElem = int.parentElement.parentElement
    const enemyObject = getEnemyObject(enemyElem)
    if ( !getProgressValueByNumber('3002') ) removePopup(popup)
    if ( enemyObject.health === 0 )          removePopup(popup)
    else if ( isEnemyNotified(enemyObject) ) removePopup(popup)
    else if ( !interactionPredicate(int) )   removePopup(popup)
    else                                     setAsInteractingObject(popup, int)
}

const getEnemyObject = (enemyElem) => {
    const enemyPath = enemyElem.previousSibling.id
    const index = Number(enemyPath.replace('path-', ''))
    return getEnemies().get(getCurrentRoomId())[index]
}

const isEnemyNotified = (enemyObj) => ![LOST, INVESTIGATE, MOVE_TO_POSITION, STUNNED].includes(enemyObj.state)

const hanldeRestOfInteractables = (int) => {
    const popup = int.children[1]
    handleStaticInteractablesIdealInteraction(int, popup)
    if ( !interactionPredicate(int) ) removePopup(popup)
    else setAsInteractingObject(popup, int)
}

const handleDoorWithCodeIdealInteraction = (int, popup) => {
    if ( !int.getAttribute('value') ) return
    refreshPopupIdealStyles(popup)
}

const refreshPopupIdealStyles = (popup) => {
    if ( isAble2Interact() ) removeClass(popup, 'not-ideal')
    else                     addClass(popup, 'not-ideal')
}

const handleStaticInteractablesIdealInteraction = (int, popup) => {
    if ( !['computer', 'stash', 'vendingMachine'].includes(int.getAttribute('name')) ) return
    refreshPopupIdealStyles(popup)
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
    for ( const bullet of getCurrentRoomBullets() ) {
        const x = getProperty(bullet, 'left', 'px')
        const y = getProperty(bullet, 'top', 'px')
        const speedX = Number(bullet.getAttribute('speed-x'))
        const speedY = Number(bullet.getAttribute('speed-y'))
        bullet.style.left = `${x + speedX}px`
        bullet.style.top = `${y + speedY}px`
        if ( collide(bullet, getPlayer().firstElementChild, 0) ) {
            if ( !getGrabbed() && getNoOffenseCounter() === 0 ) {
                damagePlayer(Number(bullet.getAttribute('damage')))
                if ( containsClass(bullet, 'scorcher-bullet') ) setPlayer2Fire()
                if ( containsClass(bullet, 'stinger-bullet') ) poisonPlayer()
                infectPlayer2SpecificVirus(bullet.getAttribute('virus'))
            }
            bullet.remove()
            continue
        }
        for ( const solid of getCurrentRoomSolid() )
            if ((!containsClass(solid, 'enemy-collider') && 
                 collide(bullet, solid, 0)) || 
                 !collide(bullet, getCurrentRoom(), 0) ) bullet.remove()
    }
}

const manageFlames = () => handleObstacles(getCurrentRoomFlames, 900, setPlayer2Fire)

const managePoisons = () => handleObstacles(getCurrentRoomPoisons, 600, poisonPlayer)

const handleObstacles = (getItems, time, harmPlayer) =>
    getItems().forEach(item => {
        const theTime = Number(item.getAttribute('time'))
        if ( theTime === time ) item.remove()
        item.setAttribute('time', theTime + 1)
        if ( collide(item, getPlayer(), 0) ) harmPlayer()
    })

const manageThrowables = () => {
    for ( const throwable of getCurrentRoomThrowables() ) {
        const throwableObj = element2Object(throwable)
        let { 
            deg,
            time, name,
            'speed-y': speedY, 'diff-x': diffX,
            'base-speed': baseSpeed, 'speed-x': speedX,
            'diff-y': diffY, 'acc-counter': accCounter } = throwableObj

        rotateThrowable(throwable, baseSpeed)
        handleInteractability(throwable, time, name)
        throwable.setAttribute('acc-counter', accCounter + 1)
        
        if ( accCounter === 15 && baseSpeed - 2 >= 0 ) {
            const newSpeed = calculateBulletSpeed(deg, diffY / diffX, diffX, diffY, baseSpeed - 2)
            speedX = Math.sign(speedX) * Math.abs(newSpeed.speedX)
            speedY = Math.sign(speedY) * Math.abs(newSpeed.speedY)
            addAllAttributes(
                throwable,
                'acc-counter', 0, 'speed-x', speedX, 
                'speed-y', speedY, 'base-speed', baseSpeed - 2)
        }

        throwable.style.left = `${getProperty(throwable, 'left', 'px') + speedX}px`
        throwable.style.top = `${getProperty(throwable, 'top', 'px') + speedY}px`
        wallIntersection(throwable, speedX, speedY)
    }
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
    const flashbang = createAndAddClass('div', 'flashbang', 'animation')
    document.getElementById('root').append(flashbang)
    const cloneShadow = getShadowContainer().firstElementChild.cloneNode()
    getShadowContainer().firstElementChild.remove()
    flashbang.addEventListener('animationend', () => {
        flashbang.remove()
        getShadowContainer().append(cloneShadow)
    })
}

const THROWABLE_FUNCTIONALITY = new Map([
    ['grenade', explodeGrenade],
    ['flashbang', blindEnemies]
])

const handleInteractability = (throwable, time, name) => {
    if ( time === 180 ) {
        THROWABLE_FUNCTIONALITY.get(name)(throwable)
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
    getCurrentRoomExplosions().forEach(explosion => {
        explodePlayer(explosion)
        explodeEnemies(explosion)
        explodeCrates(explosion)
        const time = Number(explosion.getAttribute('time'))
        const scale = getProperty(explosion, 'transform', 'scale(', ')')
        if ( time < 10 ) explosion.style.transform = `scale(${scale + 2})`
        else if ( time < 20 ) explosion.style.transform = `scale(${scale - 2})`
        if ( time === 30 ) explosion.remove()
        explosion.setAttribute('time', time + 1)
    })
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
        if ( !collide(enemy.sprite, explosion, 0) ) continue
        enemy.injuryService.damageEnemy('grenade', Math.min(getThrowableDetail('grenade', 'damage'), enemy.health))
    }
}

const explodeCrates = (explosion) => {
    for ( const int of getCurrentRoomInteractables() ) {
        if ( int.getAttribute('name') !== 'crate' ) continue
        if ( !collide(explosion, int, 0) ) continue
        dropLoot(int)
    }
}

let torchCounter = 0
const manageTorch = () => {
    if ( !getEquippedTorchId() ) return
    if ( torchCounter < 180 ) torchCounter++
    if ( torchCounter !== 180 ) return
    const torchOfInventory = findEquippedTorchById()
    torchOfInventory.health--
    const health = torchOfInventory.health
    const roomBrightness = getRooms().get(getCurrentRoomId()).brightness * 10
    if ( health === 0 ) killTorch(torchOfInventory.row, torchOfInventory.column, roomBrightness)
    else lightenEnvironment(health, roomBrightness)
    torchCounter = 0
}

const killTorch = (row, column, brightness) => {
    removeTorch()
    unequipTorch()
    getInventory()[row][column] = null
    renderShadow(brightness)
}

const lightenEnvironment = (health, roomBrightness) => {
    const brightness = (health / 100 * 40)
    renderShadow(Math.max(roomBrightness, brightness + 20))
}

const managePopovers = () => {
    [
        getDialogueContainer(),
        getRoomNameContainer(),
        getPopupContainer()
    ].forEach(container => {
        const popover = container?.firstElementChild
        if ( !popover ) return
        const timer = Number(popover.getAttribute('timer'))
        const duration = Number(popover.getAttribute('duration'))
        if ( timer === duration ) removePopover(popover)
        popover.setAttribute('timer', timer + 1)
    })
}

const removePopover = (popover) => {
    const progress2Active = popover.getAttribute('progress2active')
    addClass(popover, 'fade-out')
    const fadeOut = Number(popover.getAttribute('fade-out'))
    popover.style.animationDuration = `${fadeOut}ms`
    popover.addEventListener('animationend', () => {
        popover.remove()
        if ( containsClass(popover, 'dialogue') ) setPlayingDialogue(null)
        activateAllProgresses(progress2Active)
    })
}

const manageDialogues = () => {
    if ( !getPlayingDialogue() ) return

    const {x, y, width} = (() => {
        if ( getPlayingDialogue().source === sources.MAIN )                         var src = getPlayer()
        else if ( getSpeaker() && getPlayingDialogue().source === sources.SPEAKER ) var src = getSpeaker()
        return src.getBoundingClientRect()
    })()
    
    if ( x === undefined || y === undefined || width === undefined ) return
    const { width: dialogueWidth, height: dialogueHeight } = getDialogueContainer().firstElementChild.getBoundingClientRect()
    const newX = x + width < 10 ? 10 : x + width + dialogueWidth > innerWidth - 10 ? innerWidth - 10 - dialogueWidth : x + width
    const newY = y < 200 ? 200 : y + dialogueHeight > innerHeight + 20 ? innerHeight + 20 - dialogueHeight : y
    getDialogueContainer().firstElementChild.style.left = `${newX}px`
    getDialogueContainer().firstElementChild.style.top = `${newY}px`
}