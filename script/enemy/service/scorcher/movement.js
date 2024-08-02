import { collide } from '../../../util.js'
import { getPlayer } from '../../../elements.js'
import { setPlayer2Fire } from '../../../player-health.js'
import { CHASE, NO_OFFENCE } from '../../util/enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class ScorcherMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    collidePlayer() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || !collide(this.enemy.htmlTag, getPlayer(), 0) ) 
            return false
        if ( this.enemy.state === CHASE ) {
            const decision = Math.random()
            if ( decision < 0.5 ) {
                if ( Math.random() < 0.5 ) setPlayer2Fire()
                this.enemy.offenceService.hitPlayer()
                return
            }
            this.enemy.grabService.grabPlayer()
        }
        return true
    }

}