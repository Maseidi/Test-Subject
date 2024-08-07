import { collide } from '../../../util.js'
import { getPlayer } from '../../../elements.js'
import { poisonPlayer } from '../../../player-health.js'
import { CHASE, NO_OFFENCE } from '../../util/enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class StingerMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    playerInRange() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || 
             !collide(this.enemy.htmlTag, getPlayer(), 0) ) 
            return false
        if ( this.enemy.state === CHASE ) {
            const decision = Math.random()
            if ( decision < 0.5 ) {
                if ( Math.random() < 0.5 ) poisonPlayer()
                this.enemy.offenceService.hitPlayer()
                return
            }
            if ( Math.random() < 0.5 ) poisonPlayer()
            this.enemy.grabService.grabPlayer()
        }
        return true
    }

}