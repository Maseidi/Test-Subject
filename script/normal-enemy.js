import { moveToDestination } from "./path-finding.js"
import { getPlayer } from "./elements.js"

export const normalEnemyBehavior = (enemy) => {
    moveToDestination(enemy, getPlayer())
}