import { getCurrentRoomEnemies, getHealthStatusContainer, getMapEl, getPlayer } from './elements.js'
import { CHASE, NO_OFFENCE } from './enemy/enemy-constants.js'
import { recordCampaignDamage } from './campaign-stats.js'
import { healthManager } from './user-interface.js'
import {
    addAllClasses,
    addClass,
    addFireEffect,
    containsClass,
    createAndAddClass,
    findAttachmentsOnPlayer,
    getSpeedPerFrame,
    isLowHealth,
    removeAllClasses,
    removeClass,
    useDeltaTime,
} from './util.js'
import {
    getBurning,
    getExplosionDamageCounter,
    getHealth,
    getMaxHealth,
    getNoOffenseCounter,
    getPoisonCounter,
    getPoisoned,
    setBurning,
    setDownPressed,
    setExplosionDamageCounter,
    setHealth,
    setLeftPressed,
    setNoOffenseCounter,
    setPoisonCounter,
    setPoisoned,
    setRightPressed,
    setUpPressed,
} from './variables.js'

let regenerationDelay = 0
let regenerationTick = 0

export const manageHealthStatus = () => {
    manageBurningState()
    managePoisonedState()
    manageExplosionDamagedState()
    manageAutoHeal()
}

const manageBurningState = () => {
    if (getBurning() === 0) return
    setBurning(getBurning() + 1)
    if (getBurning() >= useDeltaTime(900)) {
        setBurning(0)
        findAttachmentsOnPlayer('fire')?.remove()
        return
    }
    applyDamageOverTime(getSpeedPerFrame(0.02))
}

const managePoisonedState = () => {
    if (!getPoisoned()) return
    setPoisonCounter(getPoisonCounter() + 1)
    applyDamageOverTime(getSpeedPerFrame(0.01))
    if (getPoisonCounter() < useDeltaTime(600)) return
    setPoisoned(false)
    setPoisonCounter(0)
    removeHealthStatusChildByClassName('poisoned-container')
    stopMovementAfterPoison()
}

const stopMovementAfterPoison = () => {
    setUpPressed(false)
    setDownPressed(false)
    setLeftPressed(false)
    setRightPressed(false)
}

const manageAutoHeal = () => {
    if (getHealth() <= 0 || getHealth() >= getMaxHealth()) {
        regenerationTick = 0
        return
    }
    regenerationDelay++
    if (regenerationDelay < useDeltaTime(300)) return
    regenerationTick++
    if (regenerationTick < useDeltaTime(60)) return
    regenerationTick = 0
    modifyHealth(Math.min(getMaxHealth(), getHealth() + 10))
}

const resetRegeneration = () => {
    regenerationDelay = 0
    regenerationTick = 0
}

const applyDamageOverTime = damage => {
    resetRegeneration()
    modifyHealth(Math.max(0, getHealth() - damage))
    if (isLowHealth()) renderDangerStateEffect(renderHealthStatusChildByClassName, addClass)
}

export const restoreHealth = () => {
    resetRegeneration()
    modifyHealth(getMaxHealth())
    renderDangerStateEffect(removeHealthStatusChildByClassName, removeClass)
}

export const clearPlayerStatusEffects = () => {
    setBurning(0)
    findAttachmentsOnPlayer('fire')?.remove()
    setPoisoned(false)
    setPoisonCounter(0)
    removeHealthStatusChildByClassName('poisoned-container')
}

export const damagePlayer = damage => {
    if (getNoOffenseCounter() !== 0) return
    resetRegeneration()
    recordCampaignDamage()
    addAllClasses(getMapEl(), 'camera-shake', 'animation')
    getMapEl().addEventListener('animationend', () => removeAllClasses(getMapEl(), 'camera-shake', 'animation'), {
        once: true,
    })
    modifyHealth(Math.max(0, getHealth() - damage))
    if (isLowHealth()) renderDangerStateEffect(renderHealthStatusChildByClassName, addClass)
    noOffenceAllEnemies()
}

const noOffenceAllEnemies = () => {
    getCurrentRoomEnemies()
        .filter(enemy => enemy.state === CHASE)
        .forEach(enemy => (enemy.state = NO_OFFENCE))
    setNoOffenseCounter(1)
}

const modifyHealth = value => {
    setHealth(value)
    healthManager(value)
    if (!isLowHealth()) renderDangerStateEffect(removeHealthStatusChildByClassName, removeClass)
}

const renderDangerStateEffect = (containerAction, classAction) => {
    containerAction('low-health-container')
    if (getPlayer()) classAction(getPlayer(), 'low-health-player')
    if (getMapEl()) classAction(getMapEl(), 'low-health')
}

const renderHealthStatusChildByClassName = className => {
    if (!getHealthStatusContainer() || findHealtStatusChildByClassName(className)) return
    getHealthStatusContainer().append(createAndAddClass('div', className, 'animation'))
}

const removeHealthStatusChildByClassName = className => findHealtStatusChildByClassName(className)?.remove()

export const findHealtStatusChildByClassName = className =>
    Array.from(getHealthStatusContainer()?.children ?? []).find(child => containsClass(child, className))

export const setPlayer2Fire = () => {
    const alreadyBurning = getBurning() > 0
    setBurning(1)
    resetRegeneration()
    if (alreadyBurning) return
    getPlayer().firstElementChild.firstElementChild.append(addFireEffect())
}

export const poisonPlayer = () => {
    setPoisoned(true)
    setPoisonCounter(0)
    resetRegeneration()
    renderHealthStatusChildByClassName('poisoned-container')
}

const manageExplosionDamagedState = () => {
    if (getExplosionDamageCounter() === 0) return
    setExplosionDamageCounter(getExplosionDamageCounter() + 1)
    if (getExplosionDamageCounter() >= useDeltaTime(100)) setExplosionDamageCounter(0)
}
