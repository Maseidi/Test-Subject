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
    if (getUpPressed() && getRightPressed())        newState = changeState(5, '100%', '0', '0', '-100%')     
    else if (getUpPressed() && getLeftPressed())    newState = changeState(3, '0', '-100%', '0', '-100%')
    else if (getDownPressed() && getRightPressed()) newState = changeState(7, '100%', '0', '100%', '0')
    else if (getDownPressed() && getLeftPressed())  newState = changeState(1, '0', '-100%', '100%', '0') 
    else if (getDownPressed())                      newState = changeState(0, '50%', '-50%', '100%', '0')
    else if (getLeftPressed())                      newState = changeState(2, '0', '-100%', '50%', '-50%')
    else if (getUpPressed())                        newState = changeState(4, '50%', '-50%', '0', '-100%')
    else if (getRightPressed())                     newState = changeState(6, '100%', '0', '50%', '-50%')
    if ( getAimMode() ) return
    let diff = newState - getPlayerAngleState()   
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff)   
    setPlayerAngle(getPlayerAngle() + diff * 45)
    getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getPlayerAngle()}deg)`
    setPlayerAngleState(newState)          
}

const changeState = (state, left, translateX, top, translateY) => {
    replaceForwardDetector(left, top, translateX, translateY)
    return getAimMode() ? getPlayerAngleState() : state
}

const replaceForwardDetector = (left, top, translateX, translateY) => {
    const forwardDetector = getPlayer().firstElementChild.lastElementChild
    forwardDetector.style.left = left
    forwardDetector.style.top = top
    forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
}