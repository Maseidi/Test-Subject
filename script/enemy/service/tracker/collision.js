import { collide } from '../../../util.js'
import { getCurrentRoomEnemies } from '../../../elements.js'
import { AbstractCollisionService } from '../abstract/collision.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, TRACKER } from '../../util/enemy-constants.js'

export class TrackerCollisionService extends AbstractCollisionService {
    constructor(enemy) {
        super(enemy)
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
                 && e.type === TRACKER )
        this.enemy.collidingEnemy = null
        return collidingEnemy
    }

    handleCollision(collidingEnemy) {
        this.enemy.collidingEnemy = collidingEnemy.index
        if ( [INVESTIGATE, LOST].includes(collidingEnemy.state) && 
             ( this.enemy.state === CHASE || this.enemy.state === GUESS_SEARCH ) ) {
            this.enemy.state = INVESTIGATE
        }
        else {
            if ( this.enemy.collidingEnemy === collidingEnemy.index && collidingEnemy.collidingEnemy === this.enemy.index ) return
            if ( this.enemy.stopCounter > 0 ) return
            this.enemy.stopCounter = 1
        }
    }

}