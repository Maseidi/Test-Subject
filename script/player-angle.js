import { isMoving } from "./util.js"
import { getPlayer } from "./elements.js"
import {
    getAimMode,
    getAimingPlayerAngle,
    getDownPressed,
    getLeftPressed,
    getPlayerAngle,
    getPlayerAngleState,
    getRightPressed,
    getUpPressed,
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
    if ( !getAimMode() ) return
    getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getAimingPlayerAngle()}deg)`
    handleBreakpoints()
}

const handleBreakpoints = () => {
    const sign = getAimingPlayerAngle() < 0 ? -1 : 1
    const q = getAimingPlayerAngle() / (sign * 45)
    if ( (q - Math.floor(q)) < 0.5 ) setPlayerAngle(sign * Math.floor(q) * 45)
    else setPlayerAngle(sign * (Math.floor(q) + 1) * 45)
    setPlayerAngleState(ANGLE_STATE_MAP.get(getPlayerAngle()))
}

const manageNonAimModeAngle = () => {
    if ( !isMoving() ) return
    let newState
    if (getUpPressed() && getRightPressed())        newState = changeState(5, '100%', '-4px')      
    else if (getUpPressed() && getLeftPressed())    newState = changeState(3, '-4px', '-4px')
    else if (getDownPressed() && getRightPressed()) newState = changeState(7, '100%', 'calc(100% + 4px)')
    else if (getDownPressed() && getLeftPressed())  newState = changeState(1, '-4px', 'calc(100% + 4px)')
    else if (getDownPressed())                      newState = changeState(0, 'calc(50% - 2px)', '100%')
    else if (getLeftPressed())                      newState = changeState(2, '-4px', 'calc(50% - 2px)')
    else if (getUpPressed())                        newState = changeState(4, 'calc(50% - 2px)', '-4px')
    else if (getRightPressed())                     newState = changeState(6, '100%', 'calc(50% - 2px)')
    if ( getAimMode() ) return
    let diff = newState - getPlayerAngleState()   
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff)   
    setPlayerAngle(getPlayerAngle() + diff * 45)
    getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getPlayerAngle()}deg)`
    setPlayerAngleState(newState)          
}

const changeState = (state, left, top) => {
    replaceForwardDetector(left, top)
    return getAimMode() ? getPlayerAngleState() : state
}

export const replaceForwardDetector = (left, top) => {
    const forwardDetector = getPlayer().firstElementChild.lastElementChild
    forwardDetector.style.left = left
    forwardDetector.style.top = top
}