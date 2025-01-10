import { collide } from '../../../util.js'
import { LOST } from '../../enemy-constants.js'
import { getPlayer } from '../../../elements.js'
import { AbstractMovementService } from '../abstract/movement.js'
import { getNoOffenseCounter } from '../../../variables.js'

export class TrackerMovemenetService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    playerInRange() {
        if ( !collide(this.enemy.sprite, getPlayer(), 0) ) return false
        if ( getNoOffenseCounter() === 0 ) this.enemy.offenceService.hitPlayer()
        this.enemy.state = LOST
        return true
    }

}