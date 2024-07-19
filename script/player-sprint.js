import { staminaManager } from './user-interface.js'
import { addClass, isMoving, removeClass } from './util.js'
import { getCurrentRoomEnemies, getPlayer } from './elements.js'
import { 
    getAimMode,
    getAllowMove,
    getRefillStamina,
    getSprint,
    getSprintPressed,
    getStamina,
    setRefillStamina,
    setSprint,
    setStamina } from './variables.js'

export const manageSprint = () => {
    if ( getSprintPressed() && !getAimMode() && isMoving()) {
        if ( !getRefillStamina() && getAllowMove()) {
            handleSprintAndStamina(true, addClass, -2, getRefillStamina())
            if ( getStamina() <= 0 ) handleSprintAndStamina(getSprint(), removeClass, -getStamina(), true)
            return
        }
        handleSprintAndStamina(false, removeClass, 1, getRefillStamina())
        if ( getStamina() >= 600 ) handleSprintAndStamina(getSprint(), null, 600 - getStamina(), false)    
        return
    } 
    handleSprintAndStamina(false, removeClass, 1, getRefillStamina())
    if ( getStamina() >= 600 ) handleSprintAndStamina(getSprint(), null, 600 - getStamina(), getRefillStamina())
}

const handleSprintAndStamina = (sprint, animator, stamina, refill) => {
    setSprint(sprint)
    if (animator) animator(getPlayer(), 'run')
    setStamina(getStamina() + stamina)
    setRefillStamina(refill)
    staminaManager(getStamina())
    if ( sprint ) getCurrentRoomEnemies().forEach(elem => elem.notifyEnemy(400))
}