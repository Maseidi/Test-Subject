import { getMapEl, getPlayer } from "./elements.js"
import { addClass, removeClass } from "./util.js"
import { 
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
    if ( getUpPressed() || getDownPressed() || getLeftPressed() || getRightPressed() ) {
        animatePlayer(true)
        move()
        return
    }
    animatePlayer(false)
}

const animatePlayer = (input) => {
    if ( input ) {
        if ( getSprint() ) {  
            addClass(getPlayer(), 'run')
            removeClass(getPlayer(), 'walk')
            return
        }
        addClass(getPlayer(), 'walk')
        removeClass(getPlayer(), 'run')
        return
    }
    removeClass(getPlayer(), 'walk')
    removeClass(getPlayer(), 'run')
}

const move = () => {
    if ( getAllowMove() ) {
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
        return
    }
    animatePlayer(false)
}

const normalizeSpeed = () => {
    let speed = getSprint() ? 2 * getPlayerSpeed() : getPlayerSpeed()
    if ((getUpPressed() && getLeftPressed()) || (getUpPressed() && getRightPressed()) || 
        (getDownPressed() && getLeftPressed()) || (getDownPressed() && getRightPressed()) ) {
            speed /= 1.41
    }
    return speed
}