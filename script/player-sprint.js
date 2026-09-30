import { getCurrentRoomEnemies, getPlayer, getSprintButton } from './elements.js'
import { TRACKER } from './enemy/enemy-constants.js'
import { staminaManager } from './user-interface.js'
import { addClass, getSpeedPerFrame, isMoving, removeClass } from './util.js'
import {
    getAimMode,
    getAllowMove,
    getGrabbed,
    getMaxStamina,
    getNoOffenseCounter,
    getRefillStamina,
    getSprintPressed,
    getStamina,
    setRefillStamina,
    setSprint,
    setStamina,
} from './variables.js'

const RECOVERY_THRESHOLD = 0.05

export const manageSprint = () => {
    const minimumRecovery = getMaxStamina() * RECOVERY_THRESHOLD
    if (getRefillStamina() && getStamina() >= minimumRecovery) setRefillStamina(false)

    const canSprint =
        getSprintPressed() &&
        !getAimMode() &&
        isMoving() &&
        !getGrabbed() &&
        !getRefillStamina() &&
        getAllowMove()

    if (canSprint) {
        setSprint(true)
        addClass(getPlayer(), 'run')
        setStamina(Math.max(0, getStamina() - getSpeedPerFrame(2)))
        if (getStamina() <= 0) {
            setSprint(false)
            setRefillStamina(true)
            removeClass(getPlayer(), 'run')
        }
        notifyEnemies()
    } else {
        setSprint(false)
        removeClass(getPlayer(), 'run')
        setStamina(Math.min(getMaxStamina(), getStamina() + getSpeedPerFrame(1)))
    }

    if (getSprintButton()) {
        if (getRefillStamina()) addClass(getSprintButton(), 'disabled')
        else removeClass(getSprintButton(), 'disabled')
    }
    staminaManager(getStamina())
}

const notifyEnemies = () =>
    getCurrentRoomEnemies().forEach(enemy => {
        if (enemy.type !== TRACKER || getNoOffenseCounter() === 0)
            enemy.notificationService.notifyEnemy(enemy.type === TRACKER ? 1500 : 400)
    })
