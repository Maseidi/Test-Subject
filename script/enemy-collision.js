import { addAttribute, collide } from './util.js'
import { getCurrentRoomEnemies } from './elements.js'
import { getEnemyState, resetAcceleration } from './enemy-actions.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from './normal-enemy.js'

export const checkCollision = (enemy) => {
    const collidingEnemy = Array.from(getCurrentRoomEnemies())
        .find(e => e !== enemy 
                && collide(enemy.firstElementChild.children[2], e.firstElementChild, 0) 
                && getEnemyState(e) !== INVESTIGATE)
    addAttribute(enemy, 'colliding-enemy', null)
    if ( !collidingEnemy ) return
    addAttribute(enemy, 'colliding-enemy', collidingEnemy.getAttribute('index'))
    const enemyState = getEnemyState(enemy)
    const collidingState = getEnemyState(collidingEnemy)
    if ( collidingState === LOST && ( enemyState === CHASE || enemyState === NO_OFFENCE || enemyState === GUESS_SEARCH ) ) {
        addAttribute(enemy, 'state', LOST)
        resetAcceleration(enemy)
    } 
    else if ( collidingState === LOST && ( enemyState === MOVE_TO_POSITION ) ) 
        addAttribute(collidingEnemy, 'state', MOVE_TO_POSITION)
    else {
        const c1 = enemy.getAttribute('colliding-enemy')
        const c2 = collidingEnemy.getAttribute('colliding-enemy')
        const i1 = enemy.getAttribute('index')
        const i2 = collidingEnemy.getAttribute('index')
        if ( c1 === i2 && c2 === i1 ) return
        addAttribute(enemy, 'acc-counter', 45)
        addAttribute(enemy, 'curr-speed', 0)
    }
}