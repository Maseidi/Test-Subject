import { addAttribute, collide } from "./util.js"
import { getCurrentRoomSolid, getMapEl, getPlayer } from "./elements.js"
import { getHealth, getMapX, getMapY, getPlayerX, getPlayerY, getRoomLeft, getRoomTop, setHealth, setMapX, setMapY, setNoOffenseCounter, setPlayerX, setPlayerY } from "./variables.js"
import { healthManager } from "./user-interface.js"
import { replaceForwardDetector } from "./player-angle.js"
import { moveToPlayer } from "./path-finding.js"

export const torturerBehavior = (enemy) => {
    updateDestination(enemy)
    moveToPlayer(enemy)
    switch ( enemy.getAttribute('state') ) {
        case 'investigate':
            handleInvestigationMode(enemy)
            break                     
    }
}

const handleInvestigationMode = (enemy) => {
    
}

const updateDestination = (enemy) => {
    addAttribute(enemy, 'player-x', Math.floor(getPlayerX() - getRoomLeft()))
    addAttribute(enemy, 'player-y', Math.floor(getPlayerY() - getRoomTop()))
}

const manageReached = (enemy) => {
    if ( collide(enemy, getPlayer(), 0) ) hitPlayer(enemy)
}

const hitPlayer = (enemy) => {
    let newHealth = getHealth() - Number(enemy.getAttribute('damage'))
    newHealth = newHealth < 0 ? 0 : newHealth
    setHealth(newHealth)
    healthManager(getHealth())
    knockPlayer(enemy)
    setNoOffenseCounter(1)
}

const knockPlayer = (enemy) => {
    const knock = Number(enemy.getAttribute('knock'))
    const angle = Number(enemy.getAttribute('angle-state'))
    let xAxis, yAxis
    switch ( angle ) {
        case 0:
            xAxis = 0
            yAxis = -1
            replaceForwardDetector('calc(50% - 2px)', '100%')
            break
        case 1:
        case 2:
        case 3:
            xAxis = 1
            yAxis = 0
            replaceForwardDetector('-4px', 'calc(50% - 2px)')
            break
        case 4:
            xAxis = 0
            yAxis = 1
            replaceForwardDetector('calc(50% - 2px)', '-4px')
            break
        case 5:
        case 6:
        case 7:
            xAxis = -1
            yAxis = 0
            replaceForwardDetector('100%', 'calc(50% - 2px)')
            break                
    }
    if ( xAxis === undefined && yAxis === undefined ) return
    if ( getCurrentRoomSolid().find(x => collide(x, getPlayer().firstElementChild.lastElementChild, 12)) !== undefined ) return
    setMapX(xAxis * knock + getMapX())
    setMapY(yAxis * knock + getMapY())
    setPlayerX(-xAxis * knock + getPlayerX())
    setPlayerY(-yAxis * knock + getPlayerY())
    getMapEl().style.left = `${getMapX()}px`
    getMapEl().style.top = `${getMapY()}px`
    getPlayer().style.left = `${getPlayerX()}px`
    getPlayer().style.top = `${getPlayerY()}px`
}