import { renderStash } from "./stash.js"
import { heal } from "./player-health.js"
import { getStat } from "./weapon-specs.js"
import { dropLoot } from "./loot-manager.js"
import { centralizePlayer } from "./startup.js"
import { setupReload } from "./weapon-actions.js"
import { renderStore } from "./vending-machine.js"
import { removeWeapon, renderWeapon } from "./weapon-loader.js"
import { getPauseContainer, getPlayer, getUiEl } from "./elements.js"
import { addClass, angleOfTwoPoints, isMoving, removeClass } from "./util.js"
import { renderUi, renderEquippedWeapon, quitPage } from "./user-interface.js"
import { equippedWeaponFromInventory, pickupDrop, removeInventory, renderInventory } from "./inventory.js"
import { 
    getAimMode,
    getDraggedItem,
    getEquippedWeapon,
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
    setAimingPlayerAngle,
    setDownPressed,
    setEquippedWeapon,
    setLeftPressed,
    setMouseX,
    setMouseY,
    setPause,
    setPauseCause,
    setRightPressed,
    setShootCounter,
    setShootPressed,
    setSprintPressed,
    setUpPressed } from "./variables.js"

export const control = () => {
    onkeydown = (e) => {
        e.preventDefault()
        if ( !e.repeat ) {
            switch ( e.key ) {
                case "w":
                case "W":
                    wDown()
                    break
                case "a":
                case "A":
                    aDown()
                    break
                case "s":
                case "S":
                    sDown()
                    break
                case "d":
                case "D":
                    dDown()
                    break
                case "e":                
                case "E":
                    eDown()
                    break
                case "1":                    
                case "2":                    
                case "3":                    
                case "4":
                    weaponSlotDown(e.key)
                    break  
                case "Shift":
                    shiftDown()
                    break
                case "F":
                case "f":
                    fDown()
                    break   
                case "Tab":
                    openInventory()
                    break
                case "R":
                case "r":
                    rDown()
                    break
                case "Escape":
                    escapeDown()
                    break
                case "H":
                case "h":
                    hDown()
                    break        
            }
        }
    }
    
    onkeyup = (e) => {
        switch ( e.key ) {
            case "w":
            case "W":
                wUp()
                break
            case "a":
            case "A":
                aUp()
                break
            case "s":
            case "S":
                sUp()
                break
            case "d":
            case "D":
                dUp()
                break
            case "Shift":
                ShiftUp()
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
    if ( !getAimMode() && !getPause() ) addClass(getPlayer(), 'walk')
}

const eDown = () => {
    if ( getPause() ) return
    if ( getEquippedWeapon() !== null  ) {
        setAimMode(!getAimMode())
        if ( getAimMode() ) {
            removeClass(getPlayer(), 'walk')
            removeClass(getPlayer(), 'run')
            addClass(getPlayer(), 'aim')
            renderWeapon()
            return
        }
        removeClass(getPlayer(), 'aim')
        removeWeapon()
        if ( isMoving() ) addClass(getPlayer(), 'walk')
    }
}

const weaponSlotDown = (key) => {
    if ( getPause() ) return
    if ( getReloading() ) return
    if ( getShooting() ) return
    removeWeapon()
    if ( getWeaponWheel()[Number(key) - 1] === getEquippedWeapon() ) {
        setEquippedWeapon(null)
        setAimMode(false)
        removeClass(getPlayer(), 'aim')
        renderEquippedWeapon()
        if (isMoving()) addClass(getPlayer(), 'walk')
        return
    }
    setEquippedWeapon(getWeaponWheel()[Number(key) - 1])
    renderEquippedWeapon()
    if ( getEquippedWeapon() ) {
        const equippedWeapon = equippedWeaponFromInventory()
        setShootCounter(getStat(equippedWeapon.name, 'firerate', equippedWeapon.fireratelvl) * 60)
    }
    if ( getEquippedWeapon() && getAimMode() ) {
        renderWeapon()
        return
    }
    removeClass(getPlayer(), 'aim')
    if (isMoving()) addClass(getPlayer(), 'walk')
    setAimMode(false)
}

const shiftDown = () => {
    setSprintPressed(true)
    if ( getPause() ) return
    startSprint()
}

const startSprint = () => {
    if ( !isMoving() ) return
    setAimMode(false)
    removeClass(getPlayer(), 'aim')
    removeWeapon()
}

const fDown = () => {
    if ( getPause() ) return
    if ( !getIntObj() ) return
    if ( getIntObj().getAttribute('amount') ) pickupDrop()
    if ( getShooting() || getReloading() ) return    
    if ( getIntObj().getAttribute('name') === 'stash' ) openStash()    
    if ( getIntObj().getAttribute('name') === 'vendingMachine' ) openVendingMachine()    
    if ( getIntObj().getAttribute('name') === 'crate' ) breakCrate()    
}

const openStash = () => openPause('stash', renderStash)

const openVendingMachine = () => openPause('store', renderStore)

const breakCrate = () => dropLoot(getIntObj())

const openPause = (cause, func) => {
    setPauseCause(cause)
    managePause()
    func()
}

const openInventory = () => {
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
    if ( getPause() ) return
    if ( !getEquippedWeapon() ) return
    setupReload()
}

const escapeDown = () => {
    if ( !getPause() ) return
    quitPage()
}

const hDown = () => {
    if ( getPause() ) return
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

const ShiftUp = () => {
    setSprintPressed(false)
    stopWalkingAnimation()
    if ( isMoving() && !getAimMode() ) addClass(getPlayer(), 'walk')
}

const stopWalkingAnimation = () => {
    if ( isMoving() ) return
    removeClass(getPlayer(), 'walk')
    removeClass(getPlayer(), 'run')
}

const aimAngle = (event) => {
    manageDragItem(event)
    if ( getPause() ) return
    const angle = angleOfTwoPoints(
            getPlayer().getBoundingClientRect().x + 17, 
            getPlayer().getBoundingClientRect().y + 17,
            event.clientX,
            event.clientY
        )
    if ( angle ) setAimingPlayerAngle(angle)
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