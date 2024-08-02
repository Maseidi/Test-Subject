import { collide } from '../../../util.js'
import { getCurrentRoomEnemies } from '../../../elements.js'
import { AbstractCollisionService } from '../abstract/collision.js'
import { GO_FOR_RANGED, INVESTIGATE, SPIKER, TRACKER } from '../../util/enemy-constants.js'

export class SpikerCollisionService extends AbstractCollisionService {
    constructor(enemy) {
        super(enemy)
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( collidingEnemy.type !== SPIKER ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.htmlTag !== this.enemy.htmlTag 
            && collide(this.enemy.htmlTag.firstElementChild.children[2], e.htmlTag.firstElementChild, 0) 
            && e.type !== TRACKER && e.type !== INVESTIGATE && e.type !== GO_FOR_RANGED)
        this.collidingEnemy = null
        return collidingEnemy
    }

}