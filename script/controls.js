import { getPlayer } from "./elements.js"
import { pickupDrop } from "./inventory.js"
import { addClass, angleOfTwoPoints, isMoving, removeClass } from "./util.js"
import { 
    getAimMode,
    getEquippedWeapon,
    getIntObj,
    getWeaponWheel,
    setAimMode,
    setAimingPlayerAngle,
    setDownPressed,
    setEquippedWeapon,
    setLeftPressed,
    setRightPressed,
    setSprintPressed,
    setUpPressed } from "./variables.js"

export const control = () => {
    onkeydown = (e) => {
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
    if ( !getAimMode() ) addClass(getPlayer(), 'walk')
}

const eDown = () => {
    if ( getEquippedWeapon() !== null  ) {
        setAimMode(!getAimMode())
        if ( getAimMode() ) {
            removeClass(getPlayer(), 'walk')
            removeClass(getPlayer(), 'run')
            addClass(getPlayer(), 'aim')
        }
        else {
            removeClass(getPlayer(), 'aim')
            if ( isMoving() ) addClass(getPlayer(), 'walk')
        }
    }
}

const weaponSlotDown = (key) => {
    if ( getWeaponWheel()[Number(key) - 1] === getEquippedWeapon() ) {
        setEquippedWeapon(null)
        setAimMode(false)
        removeClass(getPlayer(), 'aim')
        return
    }
    setEquippedWeapon(getWeaponWheel()[Number(key) - 1])
}

const shiftDown = () => {
    setSprintPressed(true)
    setAimMode(false)
    removeClass(getPlayer(), 'aim')
}

const fDown = () => {
    if ( getIntObj() && getIntObj().getAttribute("amount") ) pickupDrop()
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
    const angle = angleOfTwoPoints(
            getPlayer().getBoundingClientRect().x + 17, 
            getPlayer().getBoundingClientRect().y + 17,
            e.clientX,
            e.clientY
        )
    if ( angle ) setAimingPlayerAngle(angle)
}