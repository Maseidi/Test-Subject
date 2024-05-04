import { getPlayer, getUiEl } from "./elements.js"
import { removeWeapon, renderWeapon } from "./weapon-loader.js"
import { renderUi, renderEquippedWeapon } from "./user-interface.js"
import { calculateTotalAmmo, pickupDrop, removeInventory, renderInventory } from "./inventory.js"
import { addClass, angleOfTwoPoints, containsClass, isMoving, removeClass } from "./util.js"
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
    setReloading,
    setRightPressed,
    setShootPressed,
    setSprintPressed,
    setUpPressed } from "./variables.js"
import { getOwnedWeapons } from "./owned-weapons.js"

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
    if ( getReloading() ) return
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
        getUiEl().remove()
        return
    }
    renderUi()
    if ( isMoving() ) {
        if ( !getAimMode() ) {
            addClass(getPlayer(), 'walk')
            return
        }
        if ( getSprintPressed() ) startSprint()
    } 
}

const rDown = () => {
    if ( getPause() ) return
    if ( !getEquippedWeapon() ) return
    const equippedWeapon = getOwnedWeapons().get(getEquippedWeapon())
    if ( equippedWeapon.getCurrMag() === equippedWeapon.getMagazine() ) return
    if ( calculateTotalAmmo() === 0 ) return
    setReloading(true)
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