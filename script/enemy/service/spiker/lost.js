import { useDeltaTime } from '../../../util.js'
import { MOVE_TO_POSITION } from '../../enemy-constants.js'
import { NormalLostService } from '../normal/lost.js'

export class SpikerLostService extends NormalLostService {
    constructor(enemy) {
        super(enemy)
    }

    handleLostState() {
        if (this.enemy.visionService.playerSpotted()) return
        if (this.enemy.lostCounter === useDeltaTime(600)) {
            this.enemy.state = MOVE_TO_POSITION
            return
        }
        this.enemy.lostCounter += 1
    }
}
