import { NormalLostService } from '../normal/lost.js'
import { MOVE_TO_POSITION } from '../../util/enemy-constants.js'

export class SpikerLostService extends NormalLostService {
    constructor(enemy) {
        super(enemy)
    }

    handleLostState() {
        if ( this.enemy.visionService.playerSpotted() ) return
        if ( this.enemy.lostCounter === 600 ) {
            this.enemy.state = MOVE_TO_POSITION
            return
        }
        this.enemy.lostCounter += 1
    }

}