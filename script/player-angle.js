import { getPlayer } from "./elements.js"
import { isMoving } from "./util.js"
import {
    getAimMode,
    getAimingPlayerAngle,
    getDownPressed,
    getLeftPressed,
    getPlayerAngle,
    getPlayerAngleState,
    getRightPressed,
    getUpPressed,
    setAimingPlayerAngle,
    setPlayerAngle,
    setPlayerAngleState } from "./variables.js"

const ANGLE_STATE_MAP = new Map([
    [0, 0],
    [45, 1],
    [90, 2],
    [135, 3],
    [180, 4],
    [-180, 4],
    [-135, 5],
    [-90, 6],
    [-45, 7]
])    

export const managePlayerAngle = () => {
    manageAimModeAngle()
    manageNonAimModeAngle()
}  

const manageAimModeAngle = () => {
    if ( getAimMode() ) {
        setAimingPlayerAngle(getAimingPlayerAngle() || 1)
        getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getAimingPlayerAngle()}deg)`
        handleBreakpoints()
    }
}

const handleBreakpoints = () => {
    const sign = getAimingPlayerAngle() < 0 ? -1 : 1
    const q = getAimingPlayerAngle() / (sign * 45)
    if ( (q - Math.floor(q)) < 0.5 )
        setPlayerAngle(sign * Math.floor(q) * 45)
    else
        setPlayerAngle(sign * (Math.floor(q) + 1) * 45)
    setPlayerAngleState(ANGLE_STATE_MAP.get(getPlayerAngle()))
}

const manageNonAimModeAngle = () => {
    if ( isMoving() ) {
        let newState = getPlayerAngleState()
        if (getUpPressed() && getRightPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 5       
            replaceForwardDetector('100%', '-4px')
        } else if (getUpPressed() && getLeftPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 3
            replaceForwardDetector('-4px', '-4px')
        } else if (getDownPressed() && getRightPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 7
            replaceForwardDetector('100%', 'calc(100% + 4px)')
        } else if (getDownPressed() && getLeftPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 1
            replaceForwardDetector('-4px', 'calc(100% + 4px)')
        } else if (getDownPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 0
            replaceForwardDetector('calc(50% - 2px)', '100%')
        } else if (getLeftPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 2
            replaceForwardDetector('-4px', 'calc(50% - 2px)')
        } else if (getUpPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 4
            replaceForwardDetector('calc(50% - 2px)', '-4px')
        } else if (getRightPressed()) {
            newState = getAimMode() ? getPlayerAngleState() : 6
            replaceForwardDetector('100%', 'calc(50% - 2px)')
        }
      
        if ( !getAimMode() ) {
            let diff = newState - getPlayerAngleState()
        
            if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
            else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff)
        
            setPlayerAngle(getPlayerAngle() + diff * 45)
            getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getPlayerAngle()}deg)`
            setPlayerAngleState(newState)
        }
    }
}

const replaceForwardDetector = (left, top) => {
    const forwardDetector = getPlayer().firstElementChild.children[1]
    forwardDetector.style.left = left
    forwardDetector.style.top = top
}