import { turnOnComputer } from './computer.js'
import {
    getDialogueContainer,
    getGrabBar,
    getPauseContainer,
    getPlayer,
    getPopupContainer,
    getRoomNameContainer,
    getUiEl,
} from './elements.js'
import { getEnemies, getRooms } from './entities.js'
import { isGun } from './gun-details.js'
import { renderGun } from './gun-loader.js'
import {
    countItem,
    findEquippedTorchById,
    findEquippedWeaponById,
    getInventory,
    isEnoughSpace,
    pickupDrop,
    removeInventory,
    renderInventory,
    updateInteractablePopups,
    useInventoryResource,
} from './inventory.js'
import { dropLoot } from './loot-manager.js'
import { renderPasswordInput } from './password-manager.js'
import { renderPauseMenu } from './pause-menu.js'
import { damagePlayer, findHealtStatusChildByClassName, heal } from './player-health.js'
import { activateAllProgresses, deactivateAllProgresses, getProgress } from './progress-manager.js'
import {
    getPlayingEquipSoundEffect,
    getPlayingSoundEffects,
    playEquip,
    playPickup,
    setPlayingSoundEffects,
} from './sound-manager.js'
import { centralizePlayer } from './startup.js'
import { renderStash } from './stash.js'
import { startChaos } from './survival/chaos-manager.js'
import { isThrowable } from './throwable-details.js'
import { renderThrowable } from './throwable-loader.js'
import { removeTorch, renderTorch } from './torch-loader.js'
import { quitPage, renderUi, renderWeaponUi } from './user-interface.js'
import {
    addClass,
    angleOf2Points,
    element2Object,
    exitAimModeAnimation,
    getEquippedItemDetail,
    getProperty,
    isAble2Interact,
    isMoving,
    isThrowing,
    removeAllClasses,
    removeClass,
    removeEquipped,
    renderShadow,
} from './util.js'
import {
    getAimMode,
    getAnimatedLimbs,
    getCurrentRoomId,
    getDownPressed,
    getDraggedItem,
    getElementInteractedWith,
    getEquippedTorchId,
    getEquippedWeaponId,
    getGrabbed,
    getIsSurvival,
    getLeftPressed,
    getMouseX,
    getMouseY,
    getPause,
    getPauseCause,
    getPoisoned,
    getRefillStamina,
    getReloading,
    getRightPressed,
    getShooting,
    getSprintPressed,
    getUpPressed,
    getWaitingFunctions,
    getWeaponWheel,
    setAimMode,
    setDownPressed,
    setEquippedTorchId,
    setEquippedWeaponId,
    setLeftPressed,
    setMouseX,
    setMouseY,
    setNoAimAfterThrow,
    setPause,
    setPauseCause,
    setPlayerAimAngle,
    setRightPressed,
    setShootCounter,
    setShootPressed,
    setSprintPressed,
    setUpPressed,
    setWaitingFunctions,
} from './variables.js'
import { renderStore } from './vending-machine.js'
import { setupReload } from './weapon-manager.js'

export const wDown = () => enableDirection(getUpPressed, getDownPressed, setUpPressed, setDownPressed)

export const aDown = () => enableDirection(getLeftPressed, getRightPressed, setLeftPressed, setRightPressed)

export const sDown = () => enableDirection(getDownPressed, getUpPressed, setDownPressed, setUpPressed)

export const dDown = () => enableDirection(getRightPressed, getLeftPressed, setRightPressed, setLeftPressed)

const enableDirection = (getPressed, getOppositePressed, setPressed, setOppositePressed) => {
    if (getPoisoned() && getPressed()) return
    if (getOppositePressed()) return
    if (getPoisoned()) setOppositePressed(true)
    else setPressed(true)
    if (!getAimMode() && !getPause() && !getGrabbed()) addClass(getPlayer(), 'walk')
}

const aimWeapon = () => {
    setAimMode(true)
    removeAllClasses(getPlayer(), 'walk', 'run')
    const equipped = findEquippedWeaponById()
    if (isGun(equipped.name)) aimGun()
    else if (isThrowable(equipped.name)) aimThrowable()
}

const aimGun = () => {
    addClass(getPlayer(), 'aim')
    renderGun()
}

const aimThrowable = () => {
    addClass(getPlayer(), 'throwable-aim')
    renderThrowable()
}

export const exitAim = () => {
    setAimMode(false)
    exitAimModeAnimation()
    removeEquipped()
    if (isMoving()) addClass(getPlayer(), 'walk')
}

export const weaponSlotDown = key => {
    if (getPause() || getReloading() || getShooting() || getGrabbed()) return
    const newId = getWeaponWheel()[Number(key) - 1]
    if (getEquippedWeaponId() === newId) return
    getPlayingEquipSoundEffect()?.pause()
    setPlayingSoundEffects(getPlayingSoundEffects().filter(effect => effect !== getPlayingEquipSoundEffect()))
    removeEquipped()
    equipWeapon(newId)
}

const equipWeapon = id => {
    setEquippedWeaponId(id)
    renderWeaponUi()
    unequipTorch()
    setEquippedTorchId(null)
    if (getEquippedWeaponId()) {
        const equipped = findEquippedWeaponById()
        setShootCounter(getEquippedItemDetail(equipped, 'firerate') * 60)
        playEquip(equipped.name)
    }
    if (getEquippedWeaponId() && getAimMode()) equipWeaponOnAimMode()
    else equipNothing()
}

const equipWeaponOnAimMode = () => {
    const equipped = findEquippedWeaponById()
    if (isGun(equipped.name)) equipGunOnAimMode()
    else if (isThrowable(equipped.name)) equipThrowableOnAimMode()
}

const equipGunOnAimMode = () => {
    removeClass(getPlayer(), 'throwable-aim')
    addClass(getPlayer(), 'aim')
    renderGun()
}

const equipThrowableOnAimMode = () => {
    removeClass(getPlayer(), 'aim')
    addClass(getPlayer(), 'throwable-aim')
    renderThrowable()
}

const equipNothing = () => {
    exitAimModeAnimation()
    if (isMoving()) addClass(getPlayer(), 'walk')
    setAimMode(false)
}

export const shiftDown = () => {
    if (getRefillStamina()) addClass(getPlayer(), 'walk')
    setSprintPressed(true)
    startSprint()
}

const startSprint = () => {
    if (!isMoving() || getPause() || getGrabbed() || isThrowing()) return
    setAimMode(false)
    exitAimModeAnimation()
    removeEquipped()
}

export const fDown = () => {
    if (getGrabbed()) breakFree()
    else if (getElementInteractedWith()) {
        const { name, amount, space } = element2Object(getElementInteractedWith())
        if (getPause() || !getElementInteractedWith()) return
        if (amount) {
            if (isEnoughSpace(name, space)) playPickup(name)
            pickupDrop(getElementInteractedWith())
        }
        if (getShooting() || getReloading()) return
        if (name === 'lever') toggleLever()
        if (name === 'crate') breakCrate()
        if (name === 'enemy-back') stealthKill()
        if (!isAble2Interact()) return
        if (name === 'stash') openStash()
        if (name === 'door') renderPasswordInput()
        if (name === 'vendingMachine') openVendingMachine()
        if (name === 'computer') turnOnComputer()
    }
}

const breakFree = () => {
    const slider = getGrabBar().lastElementChild
    const left = getProperty(slider, 'left', '%') * 10
    const first = Number(getGrabBar().getAttribute('first'))
    const second = Number(getGrabBar().getAttribute('second'))
    const third = Number(getGrabBar().getAttribute('third'))
    if (left >= first && left <= first + 100) processPart('first-done', 'first-ok')
    else if (left >= second && left <= second + 100) processPart('second-done', 'second-ok')
    else if (left >= third && left <= third + 100) processPart('third-done', 'third-ok')
    else damagePlayer(Number(getGrabBar().getAttribute('damage')))
}

const processPart = (predicate, className) => {
    if (getGrabBar().getAttribute(predicate) === 'true') return
    getGrabBar().setAttribute(predicate, true)
    addClass(getGrabBar(), className)
}

const openStash = () => openPause('stash', renderStash)

const openVendingMachine = () => openPause('store', renderStore)

const breakCrate = () => {
    dropLoot(getElementInteractedWith())
}

const openPause = (cause, func) => {
    setPauseCause(cause)
    managePause()
    func()
}

const toggleLever = () => {
    const toggle1 = getElementInteractedWith().getAttribute('progress2Active')
    const toggle2 = getElementInteractedWith().getAttribute('progress2Deactive')
    if (!getProgress()[toggle1]) {
        activateAllProgresses(toggle1)
        deactivateAllProgresses(toggle2)
        getElementInteractedWith().firstElementChild.style.transform = `scale(-1, 1)`
        if (getIsSurvival()) startChaos()
    } else {
        activateAllProgresses(toggle2)
        deactivateAllProgresses(toggle1)
        getElementInteractedWith().firstElementChild.style.transform = `scale(1, 1)`
    }
}

const stealthKill = () => {
    // if ( !getProgressValueByNumber('3002') ) return
    const intObj = element2Object(getElementInteractedWith())
    const neededVaccine = intObj.popup
    if (countItem(neededVaccine) === 0) return
    useInventoryResource(intObj.popup, 1)
    const enemy = getElementInteractedWith().parentElement.parentElement
    const path = enemy.previousSibling
    const index = Number(path.id.replace('path-', ''))
    const enemyObj = getEnemies().get(getCurrentRoomId())[index]
    enemyObj.injuryService.damageEnemy(null, Math.min(800, enemyObj.health))
}

export const tabDown = () => {
    if (getGrabbed()) return
    if (getPause() && getPauseCause() !== 'inventory') return
    if (getPause() && getPauseCause() === 'inventory' && getDraggedItem()) return
    if (getPauseContainer().children.length > 1) return
    managePause()
    if (getPause()) {
        setPauseCause('inventory')
        renderInventory()
        return
    }
    removeInventory()
}

export const managePause = () => {
    if (!getPlayer()) return // for map-maker
    setPause(!getPause())
    if (getPause()) gamePaused()
    else gamePlaying()
}

const gamePaused = () => {
    removeAllClasses(getPlayer(), 'run', 'walk')
    stopAnimations()
    removeUi()
    getPlayingSoundEffects().forEach(effect => effect.pause())
}

const stopAnimations = () => {
    document.querySelectorAll('.animation').forEach(elem => (elem.style.animationPlayState = 'paused'))
    getAnimatedLimbs().forEach(elem => elem.pause())
}

const removeUi = () => {
    getUiEl().remove()
    getPopupContainer().style.opacity = '0'
    getRoomNameContainer().style.opacity = '0'
    getDialogueContainer().style.opacity = '0'
    findHealtStatusChildByClassName('infected-container').style.opacity = '0'
    if (getElementInteractedWith()?.children[1]) getElementInteractedWith().children[1].style.visibility = 'hidden'
    else if (getElementInteractedWith()?.children[0]) getElementInteractedWith().children[0].style.visibility = 'hidden'
    if (document.querySelector('.chaos-container')) document.querySelector('.chaos-container').style.display = 'none'
}

const gamePlaying = () => {
    setPauseCause(null)
    resumeAnimations()
    showUi()
    resumePlayerActions()
    getWaitingFunctions().forEach(elem => elem.fn(...elem.args))
    setWaitingFunctions([])
    getPlayingSoundEffects().forEach(effect => effect.play())
}

const resumeAnimations = () => {
    document.querySelectorAll('.animation').forEach(elem => (elem.style.animationPlayState = 'running'))
    getAnimatedLimbs().forEach(elem => elem.play())
}

const showUi = () => {
    renderUi()
    getPopupContainer().style.opacity = '1'
    getRoomNameContainer().style.opacity = '1'
    getDialogueContainer().style.opacity = '1'
    findHealtStatusChildByClassName('infected-container').style.opacity = '1'
    if (getElementInteractedWith()?.children[1]) getElementInteractedWith().children[1].style.visibility = 'visible'
    else if (getElementInteractedWith()?.children[0])
        getElementInteractedWith().children[0].style.visibility = 'visible'
    if (document.querySelector('.chaos-container')) document.querySelector('.chaos-container').style.display = 'block'
}

const resumePlayerActions = () => {
    if (!isMoving()) return
    if (!getAimMode()) addClass(getPlayer(), 'walk')
    else if (getSprintPressed()) startSprint()
}

export const rDown = () => {
    if (getPause() || getGrabbed()) return
    if (!getEquippedWeaponId()) return
    setupReload()
}

export const escapeDown = () => {
    if (getPauseCause() === 'game-over' && !getPauseContainer().children[1]) return
    if (!getPause()) {
        managePause()
        setPauseCause('pause')
        renderPauseMenu()
        return
    }
    quitPage()
}

export const hDown = () => {
    if (getPause() || getGrabbed()) return
    heal()
    updateInteractablePopups()
}

export const qDown = () => {
    if (getPause() || getReloading() || getShooting() || getGrabbed()) return
    const stick = getInventory()
        .flat()
        .filter(item => item?.name === 'stick')
        .sort((a, b) => a.health - b.health)
    if (stick.length === 0) return
    setEquippedTorchId(getEquippedTorchId() ? null : stick[0].id)
    if (getEquippedTorchId()) equipTorch()
    else unequipTorch()
}

export const equipTorch = () => {
    const lighter = getInventory()
        .flat()
        .find(item => item?.name === 'lighter')
    if (!lighter) return
    if (getEquippedWeaponId()) switchWeapon2Torch()
    else takeOutTorch()
}

const switchWeapon2Torch = () => {
    setEquippedWeaponId(null)
    renderWeaponUi()
    if (isMoving()) addClass(getPlayer(), 'walk')
    setAimMode(false)
    removeEquipped()
    exitAimModeAnimation()
    takeOutTorch()
}

const takeOutTorch = () => {
    renderTorch()
    const health = findEquippedTorchById().health
    const brightness = (health / 100) * 40
    renderShadow(Math.max(brightness + 20, getRooms().get(getCurrentRoomId()).brightness * 10))
}

export const unequipTorch = () => {
    removeClass(getPlayer(), 'torch')
    setEquippedTorchId(null)
    removeTorch()
    renderShadow(getRooms().get(getCurrentRoomId()).brightness * 10)
}

export const wUp = () => disableDirection(setUpPressed, setDownPressed)

export const aUp = () => disableDirection(setLeftPressed, setRightPressed)

export const sUp = () => disableDirection(setDownPressed, setUpPressed)

export const dUp = () => disableDirection(setRightPressed, setLeftPressed)

const disableDirection = (setPressed, setOppositePressed) => {
    if (getPoisoned()) setOppositePressed(false)
    else setPressed(false)
    stopWalkingAnimation()
}

export const shiftUp = () => {
    setSprintPressed(false)
    stopWalkingAnimation()
    if (isMoving() && !getAimMode() && !getGrabbed() && !getPause()) addClass(getPlayer(), 'walk')
}

const stopWalkingAnimation = () => {
    if (isMoving()) return
    removeAllClasses(getPlayer(), 'run', 'walk')
}

export const aimAngle = event => {
    manageDragItem(event)
    if (getPause()) return
    const angle = angleOf2Points(
        getPlayer().getBoundingClientRect().x + 17,
        getPlayer().getBoundingClientRect().y + 17,
        event.clientX,
        event.clientY,
    )
    if (angle) setPlayerAimAngle(angle)
}

const manageDragItem = event => {
    setMouseX(event.clientX)
    setMouseY(event.clientY)
    if (!getDraggedItem()) return
    getDraggedItem().style.left = `${getMouseX() + 10}px`
    getDraggedItem().style.top = `${getMouseY() - 35}px`
}

export const clickDown = event => {
    // left click
    if (event.button === 0) setShootPressed(true)
    // right click
    else if (event.button === 2) {
        if (getGrabbed() || !getEquippedWeaponId()) return
        setNoAimAfterThrow(false)
        if (getPause()) {
            setWaitingFunctions(getWaitingFunctions().filter(item => item.id !== 'aim-waiting-function'))
        } else aimWeapon()
    }
}

export const clickUp = event => {
    // left click
    if (event.button === 0) setShootPressed(false)
    // right click
    else if (event.button === 2) {
        if (getGrabbed() || !getEquippedWeaponId()) return
        if (isThrowing()) {
            setNoAimAfterThrow(true)
            return
        }
        if (getPause()) {
            setWaitingFunctions([...getWaitingFunctions(), { fn: exitAim, args: [], id: 'aim-waiting-function' }])
        } else exitAim()
    }
}

export const wheelChange = event => {
    if (getEquippedWeaponId() === null) {
        const wheelIndex = getWeaponWheel().findIndex(weapon => weapon !== null)
        if (wheelIndex !== -1) weaponSlotDown(wheelIndex + 1)
        return
    }
    const index = getWeaponWheel().findIndex(weaponId => weaponId === getEquippedWeaponId())

    if (event.deltaY > 0)
        var wheelMap = {
            0: [1, 2, 3],
            1: [2, 3, 0],
            2: [3, 0, 1],
            3: [0, 1, 2],
        }
    else
        var wheelMap = {
            0: [3, 2, 1],
            1: [0, 3, 2],
            2: [1, 0, 3],
            3: [2, 1, 0],
        }

    const newIndex = wheelMap[index].find(item => getWeaponWheel()[item] !== null)
    if (newIndex === undefined) return
    weaponSlotDown(newIndex + 1)
}

export const resizeWindow = () => centralizePlayer()
