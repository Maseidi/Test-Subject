import { collide } from '../../../util.js'
import { getPlayer } from '../../../elements.js'
import { LOST } from '../../util/enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class TrackerMovemenetService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    playerInRange() {
        if ( !collide(this.enemy.sprite, getPlayer(), 0) ) return false
        this.enemy.offenceService.hitPlayer()
        this.enemy.state = LOST
        return true
    }

}