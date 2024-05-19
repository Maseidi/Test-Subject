import { moveToPlayer } from "./path-finding.js"
import { addAttribute, collide } from "./util.js"
import { getPlayer } from "./elements.js"
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from "./variables.js"

export const torturerBehavior = (enemy) => {
    const collision = collide(enemy.firstElementChild.children[1], getPlayer(), 0)
    if ( enemy.getAttribute('state') !== 'chase' && collision ) 
        addAttribute(enemy, 'state', 'chase')
    if ( enemy.getAttribute('state') === 'chase' && collision) updateDestination(enemy)
    if ( enemy.getAttribute('state') !== 'chase' ) return 
    moveToPlayer(enemy)
}

const updateDestination = (enemy) => {
    addAttribute(enemy, 'player-x', Math.floor(getPlayerX() - getRoomLeft()))
    addAttribute(enemy, 'player-y', Math.floor(getPlayerY() - getRoomTop()))
}