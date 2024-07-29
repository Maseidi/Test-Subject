import { getPlayer } from './elements.js'
import { ANGLE_STATE_MAP, addAttribute, isMoving } from './util.js'
import {
    getAimMode,
    getDownPressed,
    getGrabbed,
    getLeftPressed,
    getPlayerAimAngle,
    getPlayerAngle,
    getPlayerAngleState,
    getRightPressed,
    getUpPressed, 
    setPlayerAngle,
    setPlayerAngleState} from './variables.js'

export const managePlayerAngle = () => {
    if ( getAimMode() ) 
        manageAimModeAngle(getPlayer(), getPlayerAimAngle(), getPlayerAngle(), setPlayerAngle, setPlayerAngleState)
    if ( !getGrabbed() ) manageNonAimModeAngle()
}

export const manageAimModeAngle = (elem, aimAngle, angle, setAngle, setAngleState) => {
    elem.firstElementChild.firstElementChild.style.transform = `rotateZ(${aimAngle}deg)`
    handleBreakpoints(aimAngle, angle, setAngle, setAngleState)
}

const handleBreakpoints = (aimAngle, angle, setAngle, setAngleState) => {
    const sign = aimAngle < 0 ? -1 : 1
    const q = aimAngle / (sign * 45)
    if ( (q - Math.floor(q)) < 0.5 ) setAngle(sign * Math.floor(q) * 45)
    else setAngle(sign * (Math.floor(q) + 1) * 45)
    setAngleState(ANGLE_STATE_MAP.get(angle))
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
    const angleState = getPlayerAngleState()
    const angle = getPlayerAngle()
    let diff = newState - angleState
    if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
    else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff)  
    setPlayerAngle(angle + diff * 45)
    getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getPlayerAngle()}deg)`
    setPlayerAngleState(newState)
}

const changeState = (state, left, translateX, top, translateY) => {
    replaceForwardDetector(left, top, translateX, translateY)
    return getAimMode() ? Number(getPlayer().getAttribute('angle-state')) : state
}

const replaceForwardDetector = (left, top, translateX, translateY) => {
    const forwardDetector = getPlayer().firstElementChild.children[1]
    forwardDetector.style.left = left
    forwardDetector.style.top = top
    forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
}