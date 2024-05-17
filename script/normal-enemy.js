import { addAttribute } from "./util.js"
import { getPlayer } from "./elements.js"
import { findPath, moveToDestination } from "./path-finding.js"

export const normalEnemyBehavior = (enemy) => {
    const path = findPath(enemy, getPlayer())
    addAttribute(enemy, 'destination', path[0])
    moveToDestination(enemy, document.getElementById(path[0]))
}