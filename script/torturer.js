import { moveToPlayer } from "./path-finding.js"
import { addAttribute, addClass, collide } from "./util.js"
import { getPlayer } from "./elements.js"
import { getHealth, getPlayerX, getPlayerY, getRoomLeft, getRoomTop, setHealth, setNoOffenseCounter } from "./variables.js"
import { healthManager } from "./user-interface.js"

export const torturerBehavior = (enemy) => {
    const collision = collide(enemy.firstElementChild.children[1], getPlayer(), 0)
    if ( enemy.getAttribute('state') !== 'chase' &&
         enemy.getAttribute('state') !== 'reached' &&
         collision ) 
        addAttribute(enemy, 'state', 'chase')
    if ( enemy.getAttribute('state') === 'chase' && collision) updateDestination(enemy)
    if ( enemy.getAttribute('state') === 'reached' ) manageReached(enemy)
    if ( enemy.getAttribute('state') !== 'chase' ) return 
    moveToPlayer(enemy)
}

const updateDestination = (enemy) => {
    addAttribute(enemy, 'player-x', Math.floor(getPlayerX() - getRoomLeft()))
    addAttribute(enemy, 'player-y', Math.floor(getPlayerY() - getRoomTop()))
}

const manageReached = (enemy) => {
    if ( collide(enemy, getPlayer(), 0) ) hitPlayer(enemy)
}

const hitPlayer = (enemy) => {
    addClass(enemy.firstElementChild.firstElementChild.firstElementChild, 'attack')
    let newHealth = getHealth() - Number(enemy.getAttribute('damage'))
    newHealth = newHealth < 0 ? 0 : newHealth
    setHealth(newHealth)
    healthManager(getHealth())
    setNoOffenseCounter(1)
}