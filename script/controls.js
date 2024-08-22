import { renderStash } from './stash.js'
import { dropLoot } from './loot-manager.js'
import { isWeapon } from './weapon-details.js'
import { centralizePlayer } from './startup.js'
import { setupReload } from './weapon-actions.js'
import { renderWeapon } from './weapon-loader.js'
import { renderStore } from './vending-machine.js'
import { isThrowable } from './throwable-details.js'
import { heal, damagePlayer } from './player-health.js'
import { renderThrowable } from './throwable-loader.js'
import { renderUi, renderWeaponUi, quitPage } from './user-interface.js'
import { getGrabBar, getPauseContainer, getPlayer, getUiEl } from './elements.js'
import { equippedWeaponObj, pickupDrop, removeInventory, renderInventory } from './inventory.js'
import { 
    addClass,
    angleOf2Points,
    exitAimMode,
    getEquippedItemDetail,
    getProperty,
    isMoving,
    isThrowing,
    removeClass, 
    removeEquipped} from './util.js'
import { 
    getAimMode,
    getDraggedItem,
    getEquippedWeaponId,
    getGrabbed,
    getIntObj,
    getMouseX,
    getMouseY,
    getPause,
    getPauseCause,
    getReloading,
    getShooting,
    getSprintPressed,
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
    setUpPressed } from './variables.js'

export const control = () => {
    onkeydown = (e) => {
        e.preventDefault()
        if ( !e.repeat ) {
            switch ( e.key ) {
                case 'w':
                case 'W':
                    wDown()
                    break
                case 'a':
                case 'A':
                    aDown()
                    break
                case 's':
                case 'S':
                    sDown()
                    break
                case 'd':
                case 'D':
                    dDown()
                    break
                case 'e':                
                case 'E':
                    eDown()
                    break
                case '1':                    
                case '2':                    
                case '3':                    
                case '4':
                    weaponSlotDown(e.key)
                    break  
                case 'Shift':
                    shiftDown()
                    break
                case 'F':
                case 'f':
                    fDown()
                    break   
                case 'Tab':
                    tabDown()
                    break
                case 'R':
                case 'r':
                    rDown()
                    break
                case 'Escape':
                    escapeDown()
                    break
                case 'H':
                case 'h':
                    hDown()
                    break        
            }
        }
    }
    
    onkeyup = (e) => {
        switch ( e.key ) {
            case 'w':
            case 'W':
                wUp()
                break
            case 'a':
            case 'A':
                aUp()
                break
            case 's':
            case 'S':
                sUp()
                break
            case 'd':
            case 'D':
                dUp()
                break
            case 'Shift':
                shiftUp()
                break                      
            }
    }

    onmousemove = (e) => aimAngle(e)
    onmousedown = (e) => clickDown(e)
    onmouseup = (e) => clickUp(e)
    onresize = () => centralizePlayer()

}

const wDown = () => enableDirection(setUpPressed)

const aDown = () => enableDirection(setLeftPressed)

const sDown = () => enableDirection(setDownPressed)

const dDown = () => enableDirection(setRightPressed)

const enableDirection = (setPressed) => {
    setPressed(true)
    if ( !getAimMode() && !getPause() && !getGrabbed() ) addClass(getPlayer(), 'walk')
}

const eDown = () => {
    if ( getPause() || getGrabbed() || isThrowing() ) return
    if ( getEquippedWeaponId() !== null  ) {
        setAimMode(!getAimMode())
        if ( getAimMode() ) {
            removeClass(getPlayer(), 'walk')
            removeClass(getPlayer(), 'run')
            const equipped = equippedWeaponObj()
            if ( isWeapon(equipped.name) ) {
                addClass(getPlayer(), 'aim')
                renderWeapon()
            }
            else if ( isThrowable(equipped.name) ) {
                addClass(getPlayer(), 'throwable-aim')
                renderThrowable()
            }
            return
        }
        exitAimModeAnimation()
        if ( isMoving() ) addClass(getPlayer(), 'walk')
    }
}

const weaponSlotDown = (key) => {
    if ( getPause() || getReloading() || getShooting() || getGrabbed() ) return
    removeEquipped()
    if ( getWeaponWheel()[Number(key) - 1] === getEquippedWeaponId() ) {
        setEquippedWeaponId(null)
        setAimMode(false)
        exitAimModeAnimation()
        renderWeaponUi()
        if (isMoving()) addClass(getPlayer(), 'walk')
        return
    }
    setEquippedWeaponId(getWeaponWheel()[Number(key) - 1])
    renderWeaponUi()
    if ( getEquippedWeaponId() ) setShootCounter(getEquippedItemDetail(equippedWeaponObj(), 'firerate') * 60)
    if ( getEquippedWeaponId() && getAimMode() ) {
        const equipped = equippedWeaponObj()
        if ( isWeapon(equipped.name) ) {
            removeClass(getPlayer(), 'throwable-aim')
            addClass(getPlayer(), 'aim')
            renderWeapon()
        }
        else if ( isThrowable(equipped.name) ) {
            exitAimModeAnimation()
            renderThrowable()
        }  
        return
    }
    exitAimModeAnimation()
    if (isMoving()) addClass(getPlayer(), 'walk')
    setAimMode(false)
}

const shiftDown = () => {
    setSprintPressed(true)
    startSprint()
}

const startSprint = () => {
    if ( !isMoving() || getPause() || getGrabbed() || isThrowing() ) return
    setAimMode(false)
    exitAimModeAnimation()
}

const fDown = () => {
    if ( getGrabbed() ) {
        breakFree()
        return
    }
    if ( getPause() || !getIntObj() ) return
    if ( getIntObj().getAttribute('amount') ) pickupDrop()
    if ( getShooting() || getReloading() ) return    
    if ( getIntObj().getAttribute('name') === 'stash' ) openStash()    
    if ( getIntObj().getAttribute('name') === 'vendingMachine' ) openVendingMachine()    
    if ( getIntObj().getAttribute('name') === 'crate' ) breakCrate()    
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

const breakCrate = () => dropLoot(getIntObj())

const openPause = (cause, func) => {
    setPauseCause(cause)
    managePause()
    func()
}

const tabDown = () => {
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
    if ( getPause() ) {
        removeClass(getPlayer(), 'run')
        removeClass(getPlayer(), 'walk')
        getUiEl().remove()
        return
    }
    setPauseCause(null)
    renderUi()
    if ( !isMoving() ) return
    if ( !getAimMode() ) addClass(getPlayer(), 'walk')
    else if ( getSprintPressed() ) startSprint()
}

const rDown = () => {
    if ( getPause() || getGrabbed() ) return
    if ( !getEquippedWeaponId() ) return
    setupReload()
}

const escapeDown = () => {
    if ( !getPause() ) return
    quitPage()
}

const hDown = () => {
    if ( getPause() || getGrabbed() ) return
    heal()
}

const wUp = () => disableDirection(setUpPressed)

const aUp = () => disableDirection(setLeftPressed)

const sUp = () => disableDirection(setDownPressed)

const dUp = () => disableDirection(setRightPressed)

const disableDirection = (setPressed) => {
    setPressed(false)
    stopWalkingAnimation()
}

const shiftUp = () => {
    setSprintPressed(false)
    stopWalkingAnimation()
    if ( isMoving() && !getAimMode() && !getGrabbed() ) addClass(getPlayer(), 'walk')
}

const stopWalkingAnimation = () => {
    if ( isMoving() ) return
    removeClass(getPlayer(), 'walk')
    removeClass(getPlayer(), 'run')
}

const aimAngle = (event) => {
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

const clickDown = (event) => {
    if ( event.buttons === 1 ) setShootPressed(true)
}

const clickUp = (event) => {
    if ( event.buttons === 0 ) setShootPressed(false)
}