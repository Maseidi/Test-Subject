import {
    getCurrentRoom,
    getCurrentRoomBullets,
    getCurrentRoomEnemies,
    getCurrentRoomExplosions,
    getCurrentRoomFlames,
    getCurrentRoomLoaders,
    getCurrentRoomPoisons,
    getCurrentRoomPowerUps,
    getCurrentRoomSolid,
    getCurrentRoomThrowables,
    getPlayer,
    setCurrentRoomBullets,
    setCurrentRoomExplosions,
    setCurrentRoomFlames,
    setCurrentRoomPoisons,
    setCurrentRoomPowerUps,
    setCurrentRoomThrowables,
} from './elements.js'
import { CHASE, GRAB, LOST, NO_OFFENCE, STUNNED } from './enemy/enemy-constants.js'
import { getLoaders, getRooms } from './entities.js'
import { refillAllAmmo } from './loadout.js'
import { knockPlayer } from './knock-manager.js'
import { damagePlayer, poisonPlayer, restoreHealth, setPlayer2Fire } from './player-health.js'
import { loadCurrentRoom } from './room-loader.js'
import { playFlashbang, playPickup } from './sound-manager.js'
import { noOffenseCounterLimit } from './startup.js'
import { getThrowableDetail } from './throwable-details.js'
import { renderThrowableButtons, renderWeaponUi } from './user-interface.js'
import {
    addAllClasses,
    addExplosion,
    addSplatter,
    collide,
    containsClass,
    createAndAddClass,
    getProperty,
    getSpeedPerFrame,
    removeClass,
    useDeltaTime,
} from './util.js'
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
    setNoOffenseCounter,
    setRoomLeft,
    setRoomTop,
    setStunnedCounter,
} from './variables.js'

export const manageEntities = () => {
    manageSolidObjects()
    manageLoaders()
    manageEnemies()
    manageBullets()
    manageFlames()
    managePoisons()
    manageThrowables()
    manageExplosions()
    managePowerUps()
}

const manageSolidObjects = () => {
    const blockingSolid = getCurrentRoomSolid().find(
        solid => !containsClass(solid, 'enemy-collider') && collide(getPlayer().firstElementChild.children[1], solid, 12),
    )
    setAllowMove(!blockingSolid)
}

let previousRoomId = null
const manageLoaders = () => {
    const loader = getCurrentRoomLoaders().find(
        candidate => candidate.dataset.open === 'true' && collide(getPlayer().firstElementChild, candidate, 0),
    )
    if (!loader) return
    previousRoomId = getCurrentRoomId()
    setCurrentRoomId(Number(loader.classList[0]))
    calculateNewRoomPosition(loader)
    getCurrentRoom().remove()
    loadCurrentRoom()
}

const calculateNewRoomPosition = previousLoader => {
    const room = getRooms().get(getCurrentRoomId())
    const matchingLoader = getLoaders()
        .get(getCurrentRoomId())
        .find(loader => loader.className === previousRoomId)
    let top
    let left
    if (matchingLoader.bottom !== null)
        top = matchingLoader.bottom === -26 ? room.height - matchingLoader.height - 26 : room.height - matchingLoader.height - matchingLoader.bottom
    if (matchingLoader.right !== null)
        left = matchingLoader.right === -26 ? room.width - matchingLoader.width - 26 : room.width - matchingLoader.width - matchingLoader.right
    if (matchingLoader.top !== null) top = matchingLoader.top === -26 ? 26 : matchingLoader.top
    if (matchingLoader.left !== null) left = matchingLoader.left === -26 ? 26 : matchingLoader.left
    setRoomLeft(getRoomLeft() - left + getProperty(previousLoader, 'left', 'px'))
    setRoomTop(getRoomTop() - top + getProperty(previousLoader, 'top', 'px'))
}

const manageEnemies = () => {
    if (getNoOffenseCounter() > 0) setNoOffenseCounter(getNoOffenseCounter() + 1)
    if (getNoOffenseCounter() >= noOffenseCounterLimit) {
        getCurrentRoomEnemies()
            .filter(enemy => enemy.state === NO_OFFENCE)
            .forEach(enemy => (enemy.state = CHASE))
        setNoOffenseCounter(0)
    }
    if (getStunnedCounter() > 0) setStunnedCounter(getStunnedCounter() + 1)
    if (getStunnedCounter() >= useDeltaTime(600)) {
        getCurrentRoomEnemies().forEach(enemy => {
            enemy.state = LOST
            enemy.lostCounter = 1
        })
        setStunnedCounter(0)
    }
    getCurrentRoomEnemies().forEach(enemy => enemy.behave())
}

const manageBullets = () => {
    const survivors = []
    for (const bullet of getCurrentRoomBullets()) {
        bullet.style.left = `${getProperty(bullet, 'left', 'px') + Number(bullet.getAttribute('speed-x'))}px`
        bullet.style.top = `${getProperty(bullet, 'top', 'px') + Number(bullet.getAttribute('speed-y'))}px`
        let removed = false
        if (collide(bullet, getPlayer().firstElementChild, 0)) {
            if (!getGrabbed() && getNoOffenseCounter() === 0) {
                damagePlayer(Number(bullet.getAttribute('damage')))
                addSplatter()
                if (containsClass(bullet, 'scorcher-bullet')) setPlayer2Fire()
                if (containsClass(bullet, 'stinger-bullet')) poisonPlayer()
            }
            removed = true
        } else if (
            getCurrentRoomSolid().some(
                solid => !containsClass(solid, 'enemy-collider') && collide(bullet, solid, 0),
            ) ||
            !collide(bullet, getCurrentRoom(), 0)
        )
            removed = true
        if (removed) bullet.remove()
        else survivors.push(bullet)
    }
    setCurrentRoomBullets(survivors)
}

const manageFlames = () => manageHazards(getCurrentRoomFlames, setCurrentRoomFlames, 900, setPlayer2Fire)
const managePoisons = () => manageHazards(getCurrentRoomPoisons, setCurrentRoomPoisons, 600, poisonPlayer)

const manageHazards = (getter, setter, duration, harmPlayer) => {
    const survivors = []
    getter().forEach(item => {
        const time = Number(item.getAttribute('time')) + 1
        item.setAttribute('time', time)
        if (time >= useDeltaTime(duration)) item.remove()
        else {
            if (collide(item, getPlayer(), 0)) harmPlayer()
            survivors.push(item)
        }
    })
    setter(survivors)
}

const manageThrowables = () => {
    for (const throwable of [...getCurrentRoomThrowables()]) {
        const speedX = Number(throwable.getAttribute('speed-x'))
        const speedY = Number(throwable.getAttribute('speed-y'))
        throwable.style.left = `${getProperty(throwable, 'left', 'px') + speedX}px`
        throwable.style.top = `${getProperty(throwable, 'top', 'px') + speedY}px`
        throwable.setAttribute('distance', Number(throwable.getAttribute('distance')) + Math.hypot(speedX, speedY))
        const hitSolid = getCurrentRoomSolid().some(solid => collide(throwable, solid, 0))
        const outside = !collide(throwable, getCurrentRoom(), 0)
        if (!hitSolid && !outside) continue
        impactThrowable(throwable)
    }
}

const impactThrowable = throwable => {
    const name = throwable.getAttribute('name')
    if (name === 'grenade') addExplosion(getProperty(throwable, 'left', 'px'), getProperty(throwable, 'top', 'px'))
    else blindEnemies()
    throwable.remove()
    setCurrentRoomThrowables(getCurrentRoomThrowables().filter(item => item !== throwable))
}

const blindEnemies = () => {
    playFlashbang()
    getCurrentRoomEnemies().forEach(enemy => {
        if (enemy.state === GRAB) enemy.grabService?.releasePlayer()
        enemy.state = STUNNED
    })
    setStunnedCounter(1)
    const flash = createAndAddClass('div', 'flashbang', 'animation')
    document.getElementById('root').append(flash)
    flash.addEventListener(
        'animationend',
        () => {
            flash.remove()
        },
        { once: true },
    )
}

const manageExplosions = () => {
    getCurrentRoomExplosions().forEach(explosion => {
        explodePlayer(explosion)
        explodeEnemies(explosion)
        const time = Number(explosion.getAttribute('time'))
        const scale = getProperty(explosion, 'transform', 'scale(', ')') || 1
        const limit = useDeltaTime(30)
        if (time < limit / 3) explosion.style.transform = `scale(${scale + getSpeedPerFrame(2)})`
        else if (time < (limit * 2) / 3) explosion.style.transform = `scale(${scale - getSpeedPerFrame(2)})`
        if (time >= limit) explosion.remove()
        explosion.setAttribute('time', time + 1)
    })
    setCurrentRoomExplosions(getCurrentRoomExplosions().filter(explosion => explosion.isConnected))
}

const explodePlayer = explosion => {
    if (getExplosionDamageCounter() !== 0 || !collide(getPlayer(), explosion, 0)) return
    damagePlayer((80 * getMaxHealth()) / 100)
    knockPlayer(['U', 'L', 'R', 'D'][Math.floor(Math.random() * 4)], 500)
    addSplatter()
    setExplosionDamageCounter(1)
    setNoOffenseCounter(1)
}

const explodeEnemies = explosion => {
    explosion.hitEnemies ??= new WeakSet()
    getCurrentRoomEnemies().forEach(enemy => {
        if (enemy.health <= 0 || explosion.hitEnemies.has(enemy) || !collide(enemy.sprite, explosion, 0)) return
        explosion.hitEnemies.add(enemy)
        enemy.injuryService.damageEnemy('grenade', Math.min(getThrowableDetail('grenade', 'damage'), enemy.health))
    })
}

const managePowerUps = () => {
    const remaining = []
    getCurrentRoomPowerUps().forEach(powerUp => {
        if (!collide(powerUp, getPlayer(), 0)) {
            remaining.push(powerUp)
            return
        }
        if (powerUp.dataset.powerUp === 'health') {
            restoreHealth()
            playPickup('bandage')
        } else {
            refillAllAmmo()
            renderWeaponUi()
            renderThrowableButtons()
            playPickup('smgAmmo')
        }
        addAllClasses(powerUp, 'power-up-collected')
        powerUp.remove()
    })
    setCurrentRoomPowerUps(remaining)
}
