import { GRAB } from '../../enemy-constants.js'
import { AbstractInjuryService } from '../abstract/injury.js'

export class GrabberInjuryService extends AbstractInjuryService {
    constructor(enemy) {
        super(enemy)
    }

    killEnemy() {
        super.killEnemy()
        if ( this.enemy.state === GRAB ) this.enemy.grabService.releasePlayer()    
    }

}