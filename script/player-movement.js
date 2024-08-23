import { isLowHealth, isMoving } from './util.js'
import { getMapEl, getPlayer } from './elements.js'
import { 
    getAimMode,
    getAllowMove,
    getDownPressed,
    getGrabbed,
    getLeftPressed,
    getMapX,
    getMapY,
    getPlayerSpeed,
    getPlayerX,
    getPlayerY,
    getRightPressed,
    getSprint,
    getUpPressed,
    setMapX,
    setMapY, 
    setPlayerX, 
    setPlayerY} from './variables.js'

export const managePlayerMovement = () => {
    if ( isMoving() && getAllowMove() && !getGrabbed() ) move()
}

const move = () => {
    let speed = normalizeSpeed()
    if ( getUpPressed() )    changePosition(setMapY, getMapY, setPlayerY, getPlayerY, speed)
    if ( getDownPressed() )  changePosition(setMapY, getMapY, setPlayerY, getPlayerY, -speed)
    if ( getLeftPressed() )  changePosition(setMapX, getMapX, setPlayerX, getPlayerX, speed)
    if ( getRightPressed() ) changePosition(setMapX, getMapX, setPlayerX, getPlayerX, -speed)
    getMapEl().style.left = `${getMapX()}px`
    getMapEl().style.top = `${getMapY()}px`
    getPlayer().style.left = `${getPlayerX()}px`
    getPlayer().style.top = `${getPlayerY()}px`
}

const changePosition = (setMap, getMap, setPlayer, getPlayer, speed) => {
    setMap(getMap() + speed)
    setPlayer(getPlayer() - speed)
}

const normalizeSpeed = () => {
    let speed
    speed = getSprint() ? 2 * getPlayerSpeed() : getPlayerSpeed()
    speed = getAimMode() ? speed / 3 : speed
    speed = !getAimMode() && isLowHealth() ? speed / 1.25 : speed
    if ((getUpPressed() && getLeftPressed()) || (getUpPressed() && getRightPressed()) || 
        (getDownPressed() && getLeftPressed()) || (getDownPressed() && getRightPressed()) ) {
            speed /= 1.41
    }
    return speed
}