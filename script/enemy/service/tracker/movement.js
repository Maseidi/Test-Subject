import { collide } from '../../../util.js'
import { getPlayer } from '../../../elements.js'
import { INVESTIGATE } from '../../util/enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class TrackerMovemenetService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    collidePlayer() {
        if ( !collide(this.enemy.htmlTag, getPlayer(), 0) ) return false
        this.enemy.offenceService.hitPlayer()
        this.enemy.state = INVESTIGATE
        return true
    }

}