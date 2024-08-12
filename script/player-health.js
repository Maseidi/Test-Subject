import { healthManager } from './user-interface.js'
import { CHASE, NO_OFFENCE } from './enemy/util/enemy-constants.js'
import { getInventory, useInventoryResource } from './inventory.js'
import { getCurrentRoomEnemies, getMapEl, getPlayer } from './elements.js'
import { addClass, addFireEffect, isLowHealth, containsClass, removeClass } from './util.js'
import { 
    getBurning,
    getHealth,
    getMaxHealth,
    getNoOffenseCounter,
    getPoisoned,
    setBurning,
    setHealth,
    setNoOffenseCounter, 
    setPoisoned} from './variables.js'

export const manageHealthStatus = () => {
    manageBurningState()
    managePoisonedState()
}

const manageBurningState = () => {
    if ( getBurning() === 0 ) return
    setBurning(getBurning() + 1)
    if ( getBurning() === 900 ) {
        setBurning(0)
        Array.from(getPlayer().firstElementChild.firstElementChild.children)
            .find(child => containsClass(child, 'fire')).remove()
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
    let newHealth = Math.min(getHealth() + 20, getMaxHealth())
    useInventoryResource('bandage', 1)
    modifyHealth(newHealth)
    if ( !isLowHealth() ) decideLowHealth(removeClass)
}

export const useBandage = (bandage) => {
    if ( getHealth() === getMaxHealth() ) return
    let newHealth = Math.min(getHealth() + 20, getMaxHealth())
    bandage.amount -= 1
    modifyHealth(newHealth)
    if ( !isLowHealth() ) decideLowHealth(removeClass)
}

export const useAntidote = (antidote) => {
    if ( !getPoisoned() ) return
    antidote.amount -= 1
    setPoisoned(false)
    removeClass(getMapEl(), 'poisoned')
}

export const damagePlayer = (damage) => {
    if ( getNoOffenseCounter() !== 0 ) return
    addClass(getMapEl(), 'camera-shake')
    setTimeout(() => removeClass(getMapEl(), 'camera-shake'), 300)
    let newHealth = getHealth() - damage
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(addClass)
    noOffenceAllEnemies()
}

const noOffenceAllEnemies = () => {
    Array.from(getCurrentRoomEnemies())
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
}