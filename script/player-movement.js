import { containsClass, isMoving, removeClass } from "./util.js"
import { getMapEl, getPlayer } from "./elements.js"
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

let damagedCounter = 0
const normalizeSpeed = () => {
    const damaged = containsClass(getPlayer(), 'damaged-player')
    if ( damaged ) damagedCounter++
    if ( damagedCounter === 120 ) {
        damagedCounter = 0
        removeClass(getPlayer(), 'damaged-player')
    }
    let speed
    speed = getSprint() ? 2 * getPlayerSpeed() : getPlayerSpeed()
    speed = getAimMode() ? speed / 3 : speed
    speed = !getAimMode() && damaged ? speed / 2 : speed
    if ((getUpPressed() && getLeftPressed()) || (getUpPressed() && getRightPressed()) || 
        (getDownPressed() && getLeftPressed()) || (getDownPressed() && getRightPressed()) ) {
            speed /= 1.41
    }
    return speed
}