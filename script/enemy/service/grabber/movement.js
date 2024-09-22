import { getPlayer } from '../../../elements.js'
import { collide, isThrowing } from '../../../util.js'
import { CHASE, NO_OFFENCE } from '../../enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class GrabberMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    playerInRange() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || !collide(this.enemy.sprite, getPlayer(), 0) ) 
            return false
        if ( this.enemy.state === CHASE ) {
            const decision = Math.random()
            if ( isThrowing() || decision < 0.2 ) {
                this.enemy.offenceService.hitPlayer()
                return
            }
            this.enemy.grabService.grabPlayer()
        }
        return true
    }

}