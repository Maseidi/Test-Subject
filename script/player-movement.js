import { getCurrentRoom, getMapEl, getPlayer } from "./elements.js"
import { managePlayerAngle } from "./player-angle.js"
import { addClass, collide, removeClass } from "./util.js"
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
    setAllowMove,
    setMapX,
    setMapY, 
    setPlayerX, 
    setPlayerY} from "./variables.js"

export const playerMovementAndDirection = () => {
    if ( getUpPressed() || getDownPressed() || getLeftPressed() || getRightPressed() ) {
        animatePlayer(true)
        managePlayerAngle()
        playerFrontCollision()
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

const playerFrontCollision = () => {
    setAllowMove(true)
    Array.from(getCurrentRoom().children).filter((elem) => {
        return elem.classList.contains('solid')
    }).forEach((solid) => {
        if ( collide(getPlayer().firstElementChild.children[1], solid, 12) ) {
            setAllowMove(false)
            return
        }       
    })  
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