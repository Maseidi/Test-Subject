import { healthManager } from './user-interface.js'
import { CHASE, NO_OFFENCE } from './enemy/util/enemy-constants.js'
import { getInventory, useInventoryResource } from './inventory.js'
import { getCurrentRoomEnemies, getMapEl, getPlayer } from './elements.js'
import { addClass, addFireEffect, isLowHealth, removeClass, findAttachmentsOnPlayer } from './util.js'
import { 
    getBurning,
    getDownPressed,
    getExplosionDamageCounter,
    getHealth,
    getLeftPressed,
    getMaxHealth,
    getNoOffenseCounter,
    getPoisoned,
    getRightPressed,
    getUpPressed,
    setBurning,
    setDownPressed,
    setExplosionDamageCounter,
    setHealth,
    setLeftPressed,
    setMaxHealth,
    setNoOffenseCounter, 
    setPoisoned, 
    setRightPressed,
    setUpPressed} from './variables.js'

export const manageHealthStatus = () => {
    manageBurningState()
    managePoisonedState()
    manageExplosionDamagedState()
}

const manageBurningState = () => {
    if ( getBurning() === 0 ) return
    setBurning(getBurning() + 1)
    if ( getBurning() === 900 ) {
        setBurning(0)
        findAttachmentsOnPlayer('fire').remove()
        return
    }
    let newHealth = getHealth() - 0.02
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(addClass)
}

const managePoisonedState = () => {
    if ( !getPoisoned() ) return
    let newHealth = getHealth() - 0.01
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(addClass)
}

export const heal = () => {
    if ( getHealth() === getMaxHealth() ) return
    const bandage = getInventory().flat().find(x => x && x.name === 'bandage')
    if ( !bandage ) return
    let newHealth = Math.min(getHealth() + getMaxHealth() / 5, getMaxHealth())
    useInventoryResource('bandage', 1)
    modifyHealth(newHealth)
    if ( !isLowHealth() ) decideLowHealth(removeClass)
}

export const useBandage = (bandage) => {
    if ( getHealth() === getMaxHealth() ) return
    let newHealth = Math.min(getHealth() + getMaxHealth() / 5, getMaxHealth())
    bandage.amount -= 1
    modifyHealth(newHealth)
    if ( !isLowHealth() ) decideLowHealth(removeClass)
}

export const useAntidote = (antidote) => {
    if ( !getPoisoned() ) return
    antidote.amount -= 1
    setPoisoned(false)
    removeClass(getMapEl(), 'poisoned')
    manageDizziness()
}

const manageDizziness = () => {
    if ( getLeftPressed() )       negateDirection(setRightPressed, setLeftPressed)
    else if ( getRightPressed() ) negateDirection(setLeftPressed,  setRightPressed)
    if ( getDownPressed() )       negateDirection(setUpPressed,    setDownPressed)
    else if ( getUpPressed() )    negateDirection(setDownPressed,  setUpPressed)
}

const negateDirection = (setOppositeDir, setDir) => {
    setOppositeDir(true)
    setDir(false)
}

export const damagePlayer = (damage) => {    
    if ( getNoOffenseCounter() !== 0 ) return
    addClass(getMapEl(), 'camera-shake')
    setTimeout(() => removeClass(getMapEl(), 'camera-shake'), 300)
    if ( getInventory().flat().find(item => item && item.name === 'armor') ) damage /= 2
    let newHealth = getHealth() - damage
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(addClass)
    noOffenceAllEnemies()
}

const noOffenceAllEnemies = () => {
    getCurrentRoomEnemies()
        .filter(elem => elem.state === CHASE )
        .forEach(elem => elem.state = NO_OFFENCE)
    setNoOffenseCounter(1)
}

const modifyHealth = (val) => {
    setHealth(val)
    healthManager(getHealth())
}

const decideLowHealth = (func) => {
    func(getMapEl(), 'low-health')
    func(getPlayer(), 'low-health-player')
}

export const setPlayer2Fire = () => {
    const wasBurninig = getBurning() > 0
    setBurning(1)
    if ( wasBurninig ) return
    const fire = addFireEffect()
    getPlayer().firstElementChild.firstElementChild.append(fire)
}

export const poisonPlayer = () => {
    setPoisoned(true)
    addClass(getMapEl(), 'poisoned')
    manageDizziness()
}

const manageExplosionDamagedState = () => {
    if ( getExplosionDamageCounter() === 0 ) return
    setExplosionDamageCounter(getExplosionDamageCounter() + 1)
    if ( getExplosionDamageCounter() === 100 ) setExplosionDamageCounter(0)
}

export const useHealthPotion = (item) => {
    if ( getMaxHealth() === 200 ) return
    setMaxHealth(getMaxHealth() + 10)
    modifyHealth(getMaxHealth())
    if ( !isLowHealth() ) decideLowHealth(removeClass)
    getInventory()[item.row][item.column] = null
}