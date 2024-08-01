import { getGrabbed } from '../../../variables.js'
import { GO_FOR_RANGED } from '../../util/enemy-constants.js'
import { AbstractCollisionService } from '../abstract/collision.js'

export class RangerCollisionService extends AbstractCollisionService {
    constructor(enemy) {
        super(enemy)
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( this.enemy.wallInTheWay === false && !getGrabbed() ) this.enemy.state = GO_FOR_RANGED
        this.handleCollision(collidingEnemy)
    }

}