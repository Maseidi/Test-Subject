import { useDeltaTime } from '../../../util.js'
import { MOVE_TO_POSITION } from '../../enemy-constants.js'

export class NormalLostService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleLostState() {
        if (this.enemy.visionService.playerSpotted()) return
        if (this.enemy.lostCounter >= useDeltaTime(600)) {
            this.enemy.state = MOVE_TO_POSITION
            return
        }
        if (this.enemy.lostCounter % useDeltaTime(120) === 0 && this.enemy.lostCounter !== 0)
            this.enemy.angleService.checkSurroundings()
        this.enemy.lostCounter += 1
    }
}
