import { getPlayer } from '../../../elements.js'
import { collide } from '../../../util.js'
import { getNoOffenseCounter } from '../../../variables.js'
import { LOST } from '../../enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class TrackerMovemenetService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    playerInRange() {
        if (!collide(this.enemy.sprite, getPlayer(), 0)) return false
        if (getNoOffenseCounter() === 0) this.enemy.offenceService.hitPlayer()
        this.enemy.state = LOST
        return true
    }
}
