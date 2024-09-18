import { healthManager } from './user-interface.js'
import { CHASE, NO_OFFENCE } from './enemy/util/enemy-constants.js'
import { getInventory, useInventoryResource } from './inventory.js'
import { getCurrentRoomEnemies, getHealthStatusContainer, getMapEl, getPlayer } from './elements.js'
import { addClass, addFireEffect, isLowHealth, removeClass, findAttachmentsOnPlayer, createAndAddClass, addAllClasses } from './util.js'
import { 
    getBurning,
    getDownPressed,
    getExplosionDamageCounter,
    getHealth,
    getInfection,
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
    setInfection,
    setLeftPressed,
    setMaxHealth,
    setNoOffenseCounter, 
    setPoisoned, 
    setRightPressed,
    setUpPressed } from './variables.js'

export const manageHealthStatus = () => {
    manageBurningState()
    managePoisonedState()
    manageExplosionDamagedState()
    manageInfectedState()
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
    if ( isLowHealth() ) decideLowHealth(renderHealthStatusChildByClassName, addClass)
}

const managePoisonedState = () => {
    if ( !getPoisoned() ) return
    let newHealth = getHealth() - 0.01
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(renderHealthStatusChildByClassName, addClass)
}

export const heal = () => {
    if ( getHealth() === getMaxHealth() ) return
    const bandage = getInventory().flat().find(x => x && x.name === 'bandage')
    if ( !bandage ) return
    let newHealth = Math.min(getHealth() + getMaxHealth() / 5, getMaxHealth())
    useInventoryResource('bandage', 1)
    modifyHealth(newHealth)
    if ( !isLowHealth() ) decideLowHealth(removeHealthStatusChildByClassName, removeClass)
}

export const useBandage = (bandage) => {
    if ( getHealth() === getMaxHealth() ) return
    let newHealth = Math.min(getHealth() + getMaxHealth() / 5, getMaxHealth())
    bandage.amount -= 1
    modifyHealth(newHealth)
    if ( !isLowHealth() ) decideLowHealth(removeHealthStatusChildByClassName, removeClass)
}

export const useAntidote = (antidote) => {
    if ( !getPoisoned() ) return
    antidote.amount -= 1
    setPoisoned(false)
    removeHealthStatusChildByClassName('poisoned-container')
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
    addAllClasses(getMapEl(), 'camera-shake', 'animation')
    getMapEl().addEventListener('animationend', () => removeClass(getMapEl(), 'camera-shake'))
    if ( getInventory().flat().find(item => item && item.name === 'armor') ) damage /= 2
    let newHealth = getHealth() - damage
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(renderHealthStatusChildByClassName, addClass)
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

const decideLowHealth = (lowHealthContainerCallbackFn, classCallbackFn) => {
    lowHealthContainerCallbackFn('low-health-container')
    classCallbackFn(getPlayer(), 'low-health-player')
    classCallbackFn(getMapEl(), 'low-health')
}

const renderHealthStatusChildByClassName = (className) => {
    if ( findHealtStatusChildByClassName(className) ) return
    getHealthStatusContainer().append(createAndAddClass('div', className, 'animation'))
}

const removeHealthStatusChildByClassName = (className) => findHealtStatusChildByClassName(className)?.remove()

export const findHealtStatusChildByClassName = (className) =>
    Array.from(getHealthStatusContainer().children).find(child => child.classList[0] === className)

export const setPlayer2Fire = () => {
    const wasBurninig = getBurning() > 0
    setBurning(1)
    if ( wasBurninig ) return
    const fire = addFireEffect()
    getPlayer().firstElementChild.firstElementChild.append(fire)
}

export const poisonPlayer = () => {
    if ( getPoisoned() ) return
    setPoisoned(true)
    renderHealthStatusChildByClassName('poisoned-container')
    manageDizziness()
}

const manageExplosionDamagedState = () => {
    if ( getExplosionDamageCounter() === 0 ) return
    setExplosionDamageCounter(getExplosionDamageCounter() + 1)
    if ( getExplosionDamageCounter() === 100 ) setExplosionDamageCounter(0)
}

export const useHealthPotion = (potion) => {
    if ( getMaxHealth() === 200 ) return
    setMaxHealth(getMaxHealth() + 10)
    modifyHealth(getMaxHealth())
    if ( !isLowHealth() ) decideLowHealth(removeHealthStatusChildByClassName, removeClass)
    potion.amount -= 1
    clearAllInfection()
}

const clearAllInfection = () => {
    setInfection([])
    const infectedContainer = findHealtStatusChildByClassName('infected-container')    
    const virusBar = infectedContainer.firstElementChild
    Array.from(virusBar.children).forEach(virus => virus.remove())
}

const manageInfectedState = () => {
    if ( getInfection().length === 0 ) return
    let newHealth = getHealth() - ( 0.002 * getInfection().length )
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
    if ( isLowHealth() ) decideLowHealth(renderHealthStatusChildByClassName, addClass)
}

export const infectPlayer2SpecificVirus = (virusName) => {
    if ( getInfection().includes(virusName) ) return
    const infectedContainer = findHealtStatusChildByClassName('infected-container')    
    const virusBar = infectedContainer.firstElementChild
    const virusIcon = document.createElement('img')
    virusIcon.src = `/assets/images/${virusName}virus.png`
    addClass(virusIcon, 'animation')
    virusBar.append(virusIcon)
    setInfection([...getInfection(), virusName])
}

export const useVaccine = (vaccine) => {
    const antivirus = vaccine.name.replace('vaccine', '')
    if ( !getInfection().includes(antivirus) ) return 
    setInfection(getInfection().filter(virus => virus !== antivirus))
    const infectedContainer = findHealtStatusChildByClassName('infected-container')    
    const virusBar = infectedContainer.firstElementChild
    Array.from(virusBar.children).forEach(virus => {
        if ( virus.src.includes(antivirus) ) virus.remove()
    })
    vaccine.amount -= 1
}