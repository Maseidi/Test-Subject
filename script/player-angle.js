import { getPlayer } from "./elements.js"
import {
    getDownPressed,
    getLeftPressed,
    getPlayerAngle,
    getPlayerAngleState,
    getRightPressed,
    getUpPressed,
    setPlayerAngle,
    setPlayerAngleState } from "./variables.js"

export const managePlayerAngle = () => {
    if ( getUpPressed() || getDownPressed() || getLeftPressed() || getRightPressed() ) {
        let newState = getPlayerAngleState()
        if (getUpPressed() && getRightPressed()) {
            newState = 5        
            replaceForwardDetector('100%', '-4px')
        } else if (getUpPressed() && getLeftPressed()) {
            newState = 3
            replaceForwardDetector('-4px', '-4px')
        } else if (getDownPressed() && getRightPressed()) {
            newState = 7
            replaceForwardDetector('100%', 'calc(100% + 4px)')
        } else if (getDownPressed() && getLeftPressed()) {
            newState = 1
            replaceForwardDetector('-4px', 'calc(100% + 4px)')
        } else if (getDownPressed()) {
            newState = 0
            replaceForwardDetector('calc(50% - 2px)', '100%')
        } else if (getLeftPressed()) {
            newState = 2
            replaceForwardDetector('-4px', 'calc(50% - 2px)')
        } else if (getUpPressed()) {
            newState = 4
            replaceForwardDetector('calc(50% - 2px)', '-4px')
        } else if (getRightPressed()) {
            newState = 6
            replaceForwardDetector('100%', 'calc(50% - 2px)')
        }

        if ( newState === getPlayerAngleState() ) return
      
        let diff = newState - getPlayerAngleState()
        
        if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
        else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff)
        
        setPlayerAngle(getPlayerAngle() + diff * 45)
        getPlayer().firstElementChild.firstElementChild.style.transform = `rotateZ(${getPlayerAngle()}deg)`
        setPlayerAngleState(newState)
    }
}        

const replaceForwardDetector = (left, top) => {
    const forwardDetector = getPlayer().firstElementChild.children[1]
    forwardDetector.style.left = left
    forwardDetector.style.top = top
}