import { getPlayer } from './elements.js'
import { ANGLE_STATE_MAP, isMoving } from './util.js'
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
        manageAimModeAngle(getPlayer(), getPlayerAimAngle(), getPlayerAngle, setPlayerAngle, setPlayerAngleState)
    if ( !getGrabbed() ) manageNonAimModeAngle()
}

export const manageAimModeAngle = (elem, aimAngle, getAngle, setAngle, setAngleState) => {
    elem.firstElementChild.firstElementChild.style.transform = `rotateZ(${aimAngle}deg)`
    handleBreakpoints(aimAngle, getAngle, setAngle, setAngleState)
}

const handleBreakpoints = (aimAngle, getAngle, setAngle, setAngleState) => {
    const sign = aimAngle < 0 ? -1 : 1
    const q = aimAngle / (sign * 45)
    if ( (q - Math.floor(q)) < 0.5 ) setAngle(sign * Math.floor(q) * 45)
    else setAngle(sign * (Math.floor(q) + 1) * 45)
    setAngleState(ANGLE_STATE_MAP.get(getAngle()))
}

const DETECTOR_MAP = new Map([
    [0, {left: '50%',   top: '100%', x: '-50%',  y: '0'     }],
    [1, {left: '0',     top: '100%', x: '-100%', y: '0'     }],
    [2, {left: '0',     top: '50%',  x: '-100%', y: '-50%'  }],
    [3, {left: '0',     top: '0'  ,  x: '-100%', y: '-100%' }],
    [4, {left: '50%',   top: '0'  ,  x: '-50%',  y: '-100%' }],
    [5, {left: '100%',  top: '0'  ,  x: '0',     y: '-100%' }],
    [6, {left: '100%',  top: '50%' , x: '0',     y: '-50%'  }],
    [7, {left: '100%',  top: '100%', x: '0',     y: '0'     }],
])

const manageNonAimModeAngle = () => {
    if ( !isMoving() ) return
    const newState = getNewState()
    replaceForwardDetector(newState)
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

const getNewState = () => {
    let result
    if ( getUpPressed() && getRightPressed() )        result = 5
    else if ( getUpPressed() && getLeftPressed() )    result = 3
    else if ( getDownPressed() && getRightPressed() ) result = 7
    else if ( getDownPressed() && getLeftPressed() )  result = 1
    else if ( getDownPressed() )                      result = 0
    else if ( getLeftPressed() )                      result = 2
    else if ( getUpPressed() )                        result = 4
    else if ( getRightPressed() )                     result = 6
    else if ( getAimMode() )                          result = Number(getPlayer().getAttribute('angle-state'))
    return result
}

const replaceForwardDetector = (state) => {
    const { left, top, x, y } = DETECTOR_MAP.get(state)
    const forwardDetector = getPlayer().firstElementChild.children[1]
    forwardDetector.style.left = left
    forwardDetector.style.top = top
    forwardDetector.style.transform = `translateX(${x}) translateY(${y})`
}