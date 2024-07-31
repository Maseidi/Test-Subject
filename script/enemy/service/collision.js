import { collide } from '../../util.js'
import { getCurrentRoomEnemies } from '../../elements.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    NO_OFFENCE,
    SPIKER,
    TRACKER } from '../util/enemy-constants.js'

export class AbstractCollisionService {
    constructor(enemy) {
        this.enemy = enemy
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.htmlTag !== this.enemy.htmlTag 
                  && collide(this.enemy.htmlTag.firstElementChild.children[2], e.htmlTag.firstElementChild, 0) 
                  && e.type !== TRACKER && e.type !== SPIKER
                  && e.state !== INVESTIGATE && e.state !== GO_FOR_RANGED)
        this.enemy.collidingEnemy = null
        return collidingEnemy
    }

    handleCollision(collidingEnemy) {
        this.collidingEnemy = collidingEnemy.index
        if ( collidingEnemy.state === LOST && 
           ( this.enemy.state === CHASE || this.enemy.state === NO_OFFENCE || this.enemy.state === GUESS_SEARCH ) ) {
            this.enemy.state = LOST
            this.enemy.lostCounter = 1
            this.resetAcceleration()
        }
        else if ( collidingEnemy.state === LOST && ( this.enemy.state === MOVE_TO_POSITION ) ) 
            collidingEnemy.state = MOVE_TO_POSITION
        else {
            if ( this.collidingEnemy === collidingEnemy.index && this.enemy.index === collidingEnemy.collidingEnemy ) return
            this.enemy.accelerationCounter = 45
            this.enemy.currentSpeed = 0
        }
    }

}