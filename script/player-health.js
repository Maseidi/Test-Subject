import { healthManager } from './user-interface.js'
import { getInventory, useInventoryResource } from './inventory.js'
import { getHealth, getMaxHealth, getNoOffenseCounter, setHealth, setNoOffenseCounter } from './variables.js'
import { addClass, checkLowHealth, removeClass } from './util.js'
import { getCurrentRoomEnemies, getMapEl, getPlayer } from './elements.js'
import { getEnemyState, setEnemyState } from './enemy-actions.js'
import { CHASE, GO_FOR_MELEE, NO_OFFENCE } from './enemy-state.js'

export const heal = () => {
    if ( getHealth() === getMaxHealth() ) return
    const bandage = getInventory().flat().find(x => x && x.name === 'bandage')
    if ( !bandage ) return
    let newHealth = Math.min(getHealth() + 20, getMaxHealth())
    useInventoryResource('bandage', 1)
    modifyHealth(newHealth)
    if ( !checkLowHealth() ) decideLowHealth(removeClass)
}

export const useBandage = (bandage) => {
    if ( getHealth() === getMaxHealth() ) return
    let newHealth = Math.min(getHealth() + 20, getMaxHealth())
    bandage.amount -= 1
    modifyHealth(newHealth)
    if ( !checkLowHealth() ) decideLowHealth(removeClass)
}

export const takeDamage = (damage) => {
    if ( getNoOffenseCounter() !== 0 ) return
    addClass(getMapEl(), 'camera-shake')
    setTimeout(() => removeClass(getMapEl(), 'camera-shake'), 300)
    let newHealth = getHealth() - damage
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( checkLowHealth() ) decideLowHealth(addClass)
    noOffenceAllEnemies()    
}

const noOffenceAllEnemies = () => {
    Array.from(getCurrentRoomEnemies())
        .filter(enemy => getEnemyState(enemy) === CHASE || getEnemyState(enemy) === GO_FOR_MELEE )
        .forEach(enemy => setEnemyState(enemy, NO_OFFENCE))
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