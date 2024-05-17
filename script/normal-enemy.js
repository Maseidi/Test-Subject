import { addAttribute } from "./util.js"
import { getPlayer } from "./elements.js"
import { findNextBestMove, moveToDestination } from "./path-finding.js"

export const normalEnemyBehavior = (enemy) => {
    const nextMove = findNextBestMove(enemy, getPlayer())
    addAttribute(enemy, 'destination', nextMove)
    moveToDestination(enemy, document.getElementById(nextMove))
}