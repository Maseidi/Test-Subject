import { collide } from '../../../util.js'
import { getCurrentRoomEnemies } from '../../../elements.js'
import { AbstractCollisionService } from '../abstract/collision.js'
import { GO_FOR_RANGED, INVESTIGATE, SPIKER, TRACKER } from '../../util/enemy-constants.js'

export class SpikerCollisionService extends AbstractCollisionService {
    constructor(enemy) {
        super(enemy)
    }

    manageCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( collidingEnemy.type !== SPIKER ) return
        this.react2Collision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = getCurrentRoomEnemies()
            .find(e => 
                e.health !== 0 &&
                e.sprite !== this.enemy.sprite 
                && collide(this.enemy.sprite.firstElementChild.children[2], e.sprite.firstElementChild, 0) 
                && e.type !== TRACKER && e.type !== INVESTIGATE && e.type !== GO_FOR_RANGED)
        this.collidingEnemy = null
        return collidingEnemy
    }

}