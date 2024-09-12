import { getInventory } from './inventory.js'
import { staminaManager } from './user-interface.js'
import { TRACKER } from './enemy/util/enemy-constants.js'
import { addClass, isMoving, removeClass } from './util.js'
import { getCurrentRoomEnemies, getPlayer } from './elements.js'
import { 
    getAimMode,
    getAllowMove,
    getGrabbed,
    getMaxStamina,
    getNoOffenseCounter,
    getRefillStamina,
    getSprint,
    getSprintPressed,
    getStamina,
    setMaxStamina,
    setRefillStamina,
    setSprint,
    setStamina } from './variables.js'

export const manageSprint = () => {
    if ( getSprintPressed() && !getAimMode() && isMoving() && !getGrabbed()) {
        if ( !getRefillStamina() && getAllowMove()) {
            handleSprintAndStamina(true, addClass, -2, getRefillStamina())
            if ( getStamina() <= 0 ) handleSprintAndStamina(getSprint(), removeClass, -getStamina(), true)
            return
        }
        handleSprintAndStamina(false, removeClass, 1, getRefillStamina())
        if ( getStamina() >= getMaxStamina() ) handleSprintAndStamina(getSprint(), null, getMaxStamina() - getStamina(), false)    
        return
    } 
    handleSprintAndStamina(false, removeClass, 1, getRefillStamina())
    if ( getStamina() >= getMaxStamina() ) handleSprintAndStamina(getSprint(), null, getMaxStamina() - getStamina(), getRefillStamina())
}

const handleSprintAndStamina = (sprint, animator, stamina, refill) => {
    setSprint(sprint)
    if (animator) animator(getPlayer(), 'run')
    setStamina(getStamina() + stamina)
    setRefillStamina(refill)
    staminaManager(getStamina())
    if ( sprint ) 
        getCurrentRoomEnemies().forEach(elem => {
            if ( elem.type === TRACKER ) {
                if ( getNoOffenseCounter() === 0 ) elem.notificationService.notifyEnemy(1500)
            }
            else elem.notificationService.notifyEnemy(400)
        })
}

export const useEnergyDrink = (energydrink) => {
    if ( getMaxStamina() === 1200 ) return
    setMaxStamina(getMaxStamina() + 60)
    setStamina(getMaxStamina())
    getInventory()[energydrink.row][energydrink.column] = null
}