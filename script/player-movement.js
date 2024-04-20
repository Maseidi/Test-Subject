import { getMapEl, getPlayer } from "./elements.js"
import { isMoving } from "./util.js"
import { 
    getAimMode,
    getAllowMove,
    getDownPressed,
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
    setPlayerY} from "./variables.js"

export const managePlayerMovement = () => {
    if ( isMoving() && getAllowMove() ) move()
}

const move = () => {
    let speed = normalizeSpeed()
    if ( getUpPressed() ) {
        setMapY(getMapY() + speed)
        setPlayerY(getPlayerY() - speed)
    }
    if ( getDownPressed() ) {
        setMapY(getMapY() - speed)
        setPlayerY(getPlayerY() + speed)
    }
    if ( getLeftPressed() ) {
        setMapX(getMapX() + speed)
        setPlayerX(getPlayerX() - speed)
    }
    if ( getRightPressed() ) {
        setMapX(getMapX() - speed)
        setPlayerX(getPlayerX() + speed)
    }
    getMapEl().style.left = `${getMapX()}px`
    getMapEl().style.top = `${getMapY()}px`
    getPlayer().style.left = `${getPlayerX()}px`
    getPlayer().style.top = `${getPlayerY()}px`        
}

const normalizeSpeed = () => {
    let speed
    speed = getSprint() ? 2 * getPlayerSpeed() : getPlayerSpeed()
    speed = getAimMode() ? speed / 3 : speed
    if ((getUpPressed() && getLeftPressed()) || (getUpPressed() && getRightPressed()) || 
        (getDownPressed() && getLeftPressed()) || (getDownPressed() && getRightPressed()) ) {
            speed /= 1.41
    }
    return speed
}