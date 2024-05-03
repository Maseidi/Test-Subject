import { getPlayer } from "./elements.js"
import { removeInventory, renderInventory } from "./inventory-ui.js"
import { pickupDrop } from "./inventory.js"
import { addClass, angleOfTwoPoints, isMoving, removeClass } from "./util.js"
import { 
    getAimMode,
    getDraggedItem,
    getEquippedWeapon,
    getIntObj,
    getMouseX,
    getMouseY,
    getPause,
    getPauseCause,
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
    setSprintPressed,
    setUpPressed } from "./variables.js"
import { removeWeapon, renderWeapon } from "./weapon-loader.js"

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

}

const wDown = () => {
    enableDirection(setUpPressed)
}

const aDown = () => {
    enableDirection(setLeftPressed)
}

const sDown = () => {
    enableDirection(setDownPressed)
}

const dDown = () => {
    enableDirection(setRightPressed)
}

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
    removeWeapon()
    if ( getWeaponWheel()[Number(key) - 1] === getEquippedWeapon() ) {
        setEquippedWeapon(null)
        setAimMode(false)
        removeClass(getPlayer(), 'aim')
        if (isMoving()) addClass(getPlayer(), 'walk')
        return
    }
    setEquippedWeapon(getWeaponWheel()[Number(key) - 1])
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
    setAimMode(false)
    removeClass(getPlayer(), 'aim')
    removeWeapon()
}

const fDown = () => {
    if ( !getPause() && getIntObj() && getIntObj().getAttribute("amount") ) pickupDrop()
}

const openInventory = () => {
    if ( getPause() && getPauseCause() !== "inventory" ) return
    if ( getPause() && getPauseCause() === "inventory" && getDraggedItem() ) return
    managePause()
    if ( getPause() ) {
        setPauseCause("inventory")
        renderInventory()
        return
    }
    setPauseCause(null)
    removeInventory()
}

const managePause = () => {
    setPause(!getPause())
    if ( getPause() ) {
        removeClass(getPlayer(), 'run')
        removeClass(getPlayer(), 'walk')
        return
    }
    if ( isMoving() ) {
        if ( !getAimMode() ) {
            addClass(getPlayer(), 'walk')
            return
        }
        if ( getSprintPressed() ) startSprint()
    } 
}

const wUp = () => {
    disableDirection(setUpPressed)
}

const aUp = () => {
    disableDirection(setLeftPressed)
}

const sUp = () => {
    disableDirection(setDownPressed)
}

const dUp = () => {
    disableDirection(setRightPressed)
}

const disableDirection = (setPressed) => {
    setPressed(false)
    stopWalkingAnimation()
}

const ShiftUp = () => {
    setSprintPressed(false)
    stopWalkingAnimation()
}

const stopWalkingAnimation = () => {
    if ( !isMoving() ) {
        removeClass(getPlayer(), 'walk')
        removeClass(getPlayer(), 'run')
    }
}

const aimAngle = (e) => {
    manageDragItem(e)
    if ( getPause() ) return
    const angle = angleOfTwoPoints(
            getPlayer().getBoundingClientRect().x + 17, 
            getPlayer().getBoundingClientRect().y + 17,
            e.clientX,
            e.clientY
        )
    if ( angle ) setAimingPlayerAngle(angle)
}

const manageDragItem = (e) => {
    setMouseX(e.clientX)
    setMouseY(e.clientY)
    if ( !getDraggedItem() ) return
    getDraggedItem().style.left = `${getMouseX() + 10}px`
    getDraggedItem().style.top = `${getMouseY() - 35}px`
}