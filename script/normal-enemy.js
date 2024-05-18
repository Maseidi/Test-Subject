import { moveToDestination } from "./path-finding.js"

export const normalEnemyBehavior = (enemy) => {
    moveToDestination(enemy, document.getElementById('player'))
}