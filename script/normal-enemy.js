import { moveToDestination } from "./path-finding.js"
import { addAttribute, collide } from "./util.js"
import { getPlayer } from "./elements.js"

let lastPlayerPosition
export const normalEnemyBehavior = (enemy) => {
    if ( enemy.getAttribute('state') !== 'chase' && collide(enemy.firstElementChild.children[1], getPlayer(), 0) ) addAttribute(enemy, 'state', 'chase')
    if ( enemy.getAttribute('state') === 'chase') lastPlayerPosition = getPlayer()
    else return
    moveToDestination(enemy, lastPlayerPosition)
}