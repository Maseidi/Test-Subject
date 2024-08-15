import { collide } from '../../../util.js'
import { getCurrentRoomEnemies } from '../../../elements.js'
import { AbstractCollisionService } from '../abstract/collision.js'
import { CHASE, GUESS_SEARCH, LOST, TRACKER } from '../../util/enemy-constants.js'

export class TrackerCollisionService extends AbstractCollisionService {
    constructor(enemy) {
        super(enemy)
    }

    manageCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        this.react2Collision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.sprite !== this.enemy.sprite 
                 && collide(this.enemy.sprite.firstElementChild.children[2], e.sprite.firstElementChild, 0)
                 && e.type === TRACKER )
        this.enemy.collidingEnemy = null
        return collidingEnemy
    }

    react2Collision(collidingEnemy) {
        this.enemy.collidingEnemy = collidingEnemy.index
        if ( LOST === collidingEnemy.state && 
           ( this.enemy.state === CHASE || this.enemy.state === GUESS_SEARCH ) ) {
            this.enemy.state = LOST
            this.enemy.lostCounter = 1
            return
        }
        if ( this.enemy.collidingEnemy === collidingEnemy.index && this.enemy.index === collidingEnemy.collidingEnemy ) return
        this.enemy.accelerationCounter = 45
        this.enemy.currentSpeed = 0
    }

}