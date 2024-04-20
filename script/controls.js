import { getPlayer } from "./elements.js"
import { addClass, angleOfTwoPoints, checkMoving, removeClass } from "./util.js"
import { 
    getAimMode,
    getEquippedWeapon,
    getSprint,
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
                shiftUp()
                break                      
        }
    }

}

const wDown = () => {
    setUpPressed(true)
    startWalkingAnimation()
}

const aDown = () => {
    setLeftPressed(true)
    startWalkingAnimation()
}

const sDown = () => {
    setDownPressed(true)
    startWalkingAnimation()
}

const dDown = () => {
    setRightPressed(true)
    startWalkingAnimation()
}

const startWalkingAnimation = () => {
    if ( !getAimMode() ) {
        if ( getSprint() ) {
            addClass(getPlayer(), 'run')
            removeClass(getPlayer(), 'walk')
        }
        else {
            addClass(getPlayer(), 'walk')
            removeClass(getPlayer(), 'run')
        }
    }
}

const shiftDown = () => {
    setAimMode(false)
    setSprintPressed(true)
    removeClass(getPlayer(), 'aim')
    if (checkMoving() && getSprint()) {
        addClass(getPlayer(), 'run')
        removeClass(getPlayer(), 'walk')
    }
}

const eDown = () => {
    if ( getEquippedWeapon() !== null  ) {
        setAimMode(!getAimMode())
        if ( getAimMode() ) {
            onmousemove = (e) => setAimingPlayerAngle(
                angleOfTwoPoints(
                    getPlayer().getBoundingClientRect().x + 17, 
                    getPlayer().getBoundingClientRect().y + 17,
                    e.clientX,
                    e.clientY
                )
            )
            addClass(getPlayer(), 'aim')
            removeClass(getPlayer(), 'walk')
            removeClass(getPlayer(), 'run')
        }
        else removeClass(getPlayer(), 'aim')
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

const wUp = () => {
    setUpPressed(false)
    stopWalkAnimation()
}

const aUp = () => {
    setLeftPressed(false)
    stopWalkAnimation()
}

const sUp = () => {
    setDownPressed(false)
    stopWalkAnimation()
}

const dUp = () => {
    setRightPressed(false)
    stopWalkAnimation()
}

const shiftUp = () => {
    setSprintPressed(false)
    removeClass(getPlayer(), 'run')
}

const stopWalkAnimation = () => {
    if ( !checkMoving() ) {
        removeClass(getPlayer(), 'walk')
        removeClass(getPlayer(), 'run')
    }
}