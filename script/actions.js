import { renderStash } from './stash.js'
import { isGun } from './gun-details.js'
import { renderGun } from './gun-loader.js'
import { dropLoot } from './loot-manager.js'
import { turnOnComputer } from './computer.js'
import { centralizePlayer } from './startup.js'
import { renderPauseMenu } from './pause-menu.js'
import { getEnemies, rooms } from './entities.js'
import { setupReload } from './weapon-manager.js'
import { renderStore } from './vending-machine.js'
import { isThrowable } from './throwable-details.js'
import { renderThrowable } from './throwable-loader.js'
import { renderPasswordInput } from './password-manager.js'
import { removeTorch, renderTorch } from './torch-loader.js'
import { renderUi, renderWeaponUi, quitPage } from './user-interface.js'
import { heal, damagePlayer, findHealtStatusChildByClassName } from './player-health.js'
import { activateAllProgresses, deactivateAllProgresses, getProgress } from './progress-manager.js'
import { 
    getDialogueContainer,
    getGrabBar,
    getPauseContainer,
    getPlayer,
    getPopupContainer,
    getRoomNameContainer,
    getUiEl } from './elements.js'
import { 
    countItem,
    findEquippedTorchById,
    findEquippedWeaponById,
    getInventory,
    pickupDrop,
    removeInventory,
    renderInventory,
    updateInteractablePopups,
    useInventoryResource } from './inventory.js'
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
    renderShadow} from './util.js'
import { 
    getAimMode,
    getDownPressed,
    getDraggedItem,
    getEquippedWeaponId,
    getGrabbed,
    getElementInteractedWith,
    getLeftPressed,
    getMouseX,
    getMouseY,
    getPause,
    getPauseCause,
    getPoisoned,
    getReloading,
    getRightPressed,
    getShooting,
    getSprintPressed,
    getUpPressed,
    getWeaponWheel,
    setAimMode,
    setDownPressed,
    setEquippedWeaponId,
    setLeftPressed,
    setMouseX,
    setMouseY,
    setPause,
    setPauseCause,
    setPlayerAimAngle,
    setRightPressed,
    setShootCounter,
    setShootPressed,
    setSprintPressed,
    setUpPressed, 
    getCurrentRoomId,
    getAnimatedLimbs, 
    setEquippedTorchId,
    getEquippedTorchId,
    getWaitingFunctions,
    setWaitingFunctions,
    getRefillStamina } from './variables.js'

export const wDown = () => enableDirection(getUpPressed, getDownPressed, setUpPressed, setDownPressed)

export const aDown = () => enableDirection(getLeftPressed, getRightPressed, setLeftPressed, setRightPressed)

export const sDown = () => enableDirection(getDownPressed, getUpPressed, setDownPressed, setUpPressed)

export const dDown = () => enableDirection(getRightPressed, getLeftPressed, setRightPressed, setLeftPressed)

const enableDirection = (getPressed, getOppositePressed, setPressed, setOppositePressed) => {
    if ( getPoisoned() && getPressed() ) return
    if ( getOppositePressed() ) return 
    if ( getPoisoned() ) setOppositePressed(true)
    else setPressed(true)
    if ( !getAimMode() && !getPause() && !getGrabbed() ) addClass(getPlayer(), 'walk')
}

export const eDown = () => {
    if ( getPause() || getGrabbed() || isThrowing() || !getEquippedWeaponId() ) return
    toggleWeaponAim()
}

const toggleWeaponAim = () => {
    setAimMode(!getAimMode())
    if ( getAimMode() ) aimWeapon()
    else exitAim()
}

const aimWeapon = () => {
    removeAllClasses(getPlayer(), 'walk', 'run')
    const equipped = findEquippedWeaponById()
    if ( isGun(equipped.name) ) aimGun()
    else if ( isThrowable(equipped.name) ) aimThrowable()
}

const aimGun = () => {
    addClass(getPlayer(), 'aim')
    renderGun()
}

const aimThrowable = () => {
    addClass(getPlayer(), 'throwable-aim')
    renderThrowable()
}

const exitAim = () => {
    exitAimModeAnimation()
    removeEquipped()
    if ( isMoving() ) addClass(getPlayer(), 'walk')
}

export const weaponSlotDown = (key) => {
    if ( getPause() || getReloading() || getShooting() || getGrabbed() ) return
    removeEquipped()
    if ( getWeaponWheel()[Number(key) - 1] === getEquippedWeaponId() ) unEquipWeapon()
    else equipWeapon(key) 
}

const unEquipWeapon = () => {
    setEquippedWeaponId(null)
    setAimMode(false)
    exitAimModeAnimation()
    renderWeaponUi()
    if (isMoving()) addClass(getPlayer(), 'walk')
}

const equipWeapon = (key) => {
    setEquippedWeaponId(getWeaponWheel()[Number(key) - 1])
    renderWeaponUi()
    unequipTorch()
    setEquippedTorchId(null)
    if ( getEquippedWeaponId() ) setShootCounter(getEquippedItemDetail(findEquippedWeaponById(), 'firerate') * 60)
    if ( getEquippedWeaponId() && getAimMode() ) equipWeaponOnAimMode()
    else equipNothing()
}

const equipWeaponOnAimMode = () => {
    const equipped = findEquippedWeaponById()
    if ( isGun(equipped.name) ) equipGunOnAimMode()
    else if ( isThrowable(equipped.name) ) equipThrowableOnAimMode()
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
    if ( getRefillStamina() ) addClass(getPlayer(), 'walk')
    setSprintPressed(true)
    startSprint()
}

const startSprint = () => {
    if ( !isMoving() || getPause() || getGrabbed() || isThrowing() ) return
    setAimMode(false)
    exitAimModeAnimation()
    removeEquipped()
}

export const fDown = () => {
    if ( getGrabbed() ) breakFree()
    else if ( getElementInteractedWith() ) {
        const { name, amount } = element2Object(getElementInteractedWith())        
        if ( getPause() || !getElementInteractedWith() ) return
        if ( amount ) pickupDrop(getElementInteractedWith())
        if ( getShooting() || getReloading() ) return    
        if ( name === 'lever' )          toggleLever()
        if ( name === 'crate' )          breakCrate()
        if ( name === 'enemy-back' )     stealthKill()
        if ( !isAble2Interact() ) return
        if ( name === 'stash' )          openStash()
        if ( name === 'door' )           renderPasswordInput()
        if ( name === 'vendingMachine' ) openVendingMachine()
        if ( name === 'computer' )       turnOnComputer()
    }
}

const breakFree = () => {
    const slider = getGrabBar().lastElementChild
    const left = getProperty(slider, 'left', '%') * 10
    const first = Number(getGrabBar().getAttribute('first'))
    const second = Number(getGrabBar().getAttribute('second'))
    const third = Number(getGrabBar().getAttribute('third'))
    if ( left >= first && left <= first + 100 )        processPart('first-done', 'first-ok')
    else if ( left >= second && left <= second + 100 ) processPart('second-done', 'second-ok')
    else if ( left >= third && left <= third + 100 )   processPart('third-done', 'third-ok')
    else damagePlayer(Number(getGrabBar().getAttribute('damage')))
}

const processPart = (predicate, className) => {
    if ( getGrabBar().getAttribute(predicate) === 'true' ) return
    getGrabBar().setAttribute(predicate, true)
    addClass(getGrabBar(), className)
}

const openStash = () => openPause('stash', renderStash)

const openVendingMachine = () => openPause('store', renderStore)

const breakCrate = () => dropLoot(getElementInteractedWith())

const openPause = (cause, func) => {
    setPauseCause(cause)
    managePause()
    func()
}

const toggleLever = () => {
    const toggle1 = getElementInteractedWith().getAttribute('progress2Active')
    const toggle2 = getElementInteractedWith().getAttribute('progress2Deactive')
    
    if ( !getProgress()[toggle1] ) {
        activateAllProgresses(toggle1)
        deactivateAllProgresses(toggle2)
        getElementInteractedWith().firstElementChild.style.transform = `scale(-1, 1)`
    }
    else {
        activateAllProgresses(toggle2)
        deactivateAllProgresses(toggle1)
        getElementInteractedWith().firstElementChild.style.transform = `scale(1, 1)`
    }
}

const stealthKill = () => {
    const intObj = element2Object(getElementInteractedWith())
    const neededVaccine = intObj.popup
    if ( countItem(neededVaccine) === 0 ) return
    useInventoryResource(intObj.popup, 1)
    const enemy = getElementInteractedWith().parentElement.parentElement
    const path = enemy.previousSibling
    const index = Number(path.id.replace('path-', ''))
    const enemyObj = getEnemies().get(getCurrentRoomId())[index]
    enemyObj.injuryService.damageEnemy(null, Math.min(800, enemyObj.health))
}

export const tabDown = () => {
    if ( getGrabbed() ) return
    if ( getPause() && getPauseCause() !== 'inventory' ) return
    if ( getPause() && getPauseCause() === 'inventory' && getDraggedItem() ) return
    if ( getPauseContainer().children.length > 1 ) return
    managePause()
    if ( getPause() ) {
        setPauseCause('inventory')
        renderInventory()
        return
    }
    removeInventory()
}

export const managePause = () => {
    setPause(!getPause())
    if ( getPause() ) gamePaused()
    else gamePlaying()
}

const gamePaused = () => {
    removeAllClasses(getPlayer(), 'run', 'walk')
    stopAnimations()
    removeUi()
}

const stopAnimations = () => {
    document.querySelectorAll('.animation').forEach(elem => elem.style.animationPlayState = 'paused')
    getAnimatedLimbs().forEach(elem => elem.pause())
}

const removeUi = () => {
    getUiEl().remove()
    getPopupContainer().style.opacity = '0'
    getRoomNameContainer().style.opacity = '0'
    getDialogueContainer().style.opacity = '0'
    findHealtStatusChildByClassName('infected-container').style.opacity = '0'
    if ( getElementInteractedWith()?.children[1] )      getElementInteractedWith().children[1].style.visibility = 'hidden'
    else if ( getElementInteractedWith()?.children[0] ) getElementInteractedWith().children[0].style.visibility = 'hidden'
}

const gamePlaying = () => {
    setPauseCause(null)
    resumeAnimations()
    showUi()
    resumePlayerActions()
    getWaitingFunctions().forEach(elem => elem.fn(...elem.args))
    setWaitingFunctions([])
}

const resumeAnimations = () => {
    document.querySelectorAll('.animation').forEach(elem => elem.style.animationPlayState = 'running')
    getAnimatedLimbs().forEach(elem => elem.play())
}

const showUi = () => {
    renderUi()
    getPopupContainer().style.opacity = '1'
    getRoomNameContainer().style.opacity = '1'
    getDialogueContainer().style.opacity = '1'
    findHealtStatusChildByClassName('infected-container').style.opacity = '1'
    if ( getElementInteractedWith()?.children[1] )      getElementInteractedWith().children[1].style.visibility = 'visible'
    else if ( getElementInteractedWith()?.children[0] ) getElementInteractedWith().children[0].style.visibility = 'visible'
}

const resumePlayerActions = () => {
    if ( !isMoving() ) return
    if ( !getAimMode() ) addClass(getPlayer(), 'walk')
    else if ( getSprintPressed() ) startSprint()
}

export const rDown = () => {
    if ( getPause() || getGrabbed() ) return
    if ( !getEquippedWeaponId() ) return
    setupReload()
}

export const escapeDown = () => {
    if ( getPauseCause() === 'game-over' && !getPauseContainer().children[1] ) return
    if ( !getPause() ) {
        managePause()
        setPauseCause('pause')
        renderPauseMenu()
        return
    }
    quitPage()
}

export const hDown = () => {
    if ( getPause() || getGrabbed() ) return
    heal()
    updateInteractablePopups()
}

export const qDown = () => {
    if ( getPause() || getReloading() || getShooting() || getGrabbed() ) return
    const stick = getInventory().flat().filter(item => item?.name === 'stick').sort((a, b) => a.health - b.health)
    if ( stick.length === 0 ) return
    setEquippedTorchId(getEquippedTorchId() ? null : stick[0].id)
    if ( getEquippedTorchId() ) equipTorch()
    else unequipTorch()
}

export const equipTorch = () => {
    const lighter = getInventory().flat().find(item => item?.name === 'lighter')
    if ( !lighter ) return
    if ( getEquippedWeaponId() ) switchWeapon2Torch()
    else takeOutTorch()
}

const switchWeapon2Torch = () => {
    setEquippedWeaponId(null)
    renderWeaponUi()
    if ( isMoving() ) addClass(getPlayer(), 'walk')
    setAimMode(false)
    removeEquipped()
    exitAimModeAnimation()
    takeOutTorch()
}

const takeOutTorch = () => {
    renderTorch()
    const health = findEquippedTorchById().health
    const brightness = (health / 100 * 40)
    renderShadow(Math.max(brightness + 20, rooms.get(getCurrentRoomId()).darkness * 10))
}

export const unequipTorch = () => {
    removeClass(getPlayer(), 'torch')
    setEquippedTorchId(null)
    removeTorch()
    renderShadow(rooms.get(getCurrentRoomId()).darkness * 10)
}

export const wUp = () => disableDirection(setUpPressed, setDownPressed)

export const aUp = () => disableDirection(setLeftPressed, setRightPressed)

export const sUp = () => disableDirection(setDownPressed, setUpPressed)

export const dUp = () => disableDirection(setRightPressed, setLeftPressed)

const disableDirection = (setPressed, setOppositePressed) => {
    if ( getPoisoned() ) setOppositePressed(false) 
    else setPressed(false)
    stopWalkingAnimation()
}

export const shiftUp = () => {
    setSprintPressed(false)
    stopWalkingAnimation()
    if ( isMoving() && !getAimMode() && !getGrabbed() && !getPause() ) addClass(getPlayer(), 'walk')
}

const stopWalkingAnimation = () => {
    if ( isMoving() ) return
    removeAllClasses(getPlayer(), 'run', 'walk')
}

export const aimAngle = (event) => {
    manageDragItem(event)
    if ( getPause() ) return
    const angle = angleOf2Points(
            getPlayer().getBoundingClientRect().x + 17, 
            getPlayer().getBoundingClientRect().y + 17,
            event.clientX,
            event.clientY
        )
    if ( angle ) setPlayerAimAngle(angle)
}

const manageDragItem = (event) => {
    setMouseX(event.clientX)
    setMouseY(event.clientY)
    if ( !getDraggedItem() ) return
    getDraggedItem().style.left = `${getMouseX() + 10}px`
    getDraggedItem().style.top = `${getMouseY() - 35}px`
}

export const clickDown = (event) => {
    if ( event.buttons === 1 ) setShootPressed(true)
}

export const clickUp = (event) => {
    if ( event.buttons === 0 ) setShootPressed(false)
}

export const resizeWindow = () => centralizePlayer()