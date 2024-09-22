import { GO_FOR_RANGED } from '../../enemy-constants.js'
import { getGrabbed, getStunnedCounter } from '../../../variables.js'
import { AbstractCollisionService } from '../abstract/collision.js'

export class RangerCollisionService extends AbstractCollisionService {
    constructor(enemy) {
        super(enemy)
    }

    manageCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( this.enemy.wallInTheWay === false && !getGrabbed() && getStunnedCounter() === 0 ) 
            this.enemy.state = GO_FOR_RANGED
        this.react2Collision(collidingEnemy)
    }

}