import { getCurrentRoomEnemies } from "./elements.js"
import { addClass, collide, removeClass } from "./util.js"

export const detectCollision = (enemy) => {
    const fwDetector = enemy.firstElementChild.children[2]
    const collidingEnemy = getCurrentRoomEnemies()
        .find(x => x !== enemy && collide(fwDetector, x, 0))
    if ( collidingEnemy ) addClass(enemy, 'stop')
    else removeClass(enemy, 'stop')
}