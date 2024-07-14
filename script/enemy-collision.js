import { addAttribute, collide } from './util.js'
import { getCurrentRoomEnemies } from './elements.js'
import { getEnemyState, resetAcceleration, setEnemyState } from './enemy-actions.js'
import { CHASE, GO_FOR_RANGED, GUESS_SEARCH, INVESTIGATE, LOST, MAKE_DECISION, MOVE_TO_POSITION, NO_OFFENCE } from './enemy-state.js'
import { wallsInTheWay } from './ranger-enemy.js'

export const checkCollision = (enemy) => {
    const collidingEnemy = Array.from(getCurrentRoomEnemies())
        .find(e => e !== enemy 
                && collide(enemy.firstElementChild.children[2], e.firstElementChild, 0) 
                && getEnemyState(e) != INVESTIGATE && getEnemyState(e) != MAKE_DECISION && getEnemyState(e) != GO_FOR_RANGED)
    addAttribute(enemy, 'colliding-enemy', null)
    if ( !collidingEnemy ) return
    handleRangerEnemy(enemy)
    addAttribute(enemy, 'colliding-enemy', collidingEnemy.getAttribute('index'))
    const enemyState = getEnemyState(enemy)
    const collidingState = getEnemyState(collidingEnemy)
    if ( collidingState == LOST && ( enemyState == CHASE || enemyState == NO_OFFENCE || enemyState == GUESS_SEARCH ) ) {
        setEnemyState(enemy, LOST)
        resetAcceleration(enemy)
    } 
    else if ( collidingState == LOST && ( enemyState == MOVE_TO_POSITION ) ) 
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

const handleRangerEnemy = (enemy) => {
    if ( enemy.getAttribute('type') != 'ranger' ) return
    wallsInTheWay(enemy)
    if ( enemy.getAttribute('wall-in-the-way') == 'false' ) setEnemyState(enemy, GO_FOR_RANGED)
}