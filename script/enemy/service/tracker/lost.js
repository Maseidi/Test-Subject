import { useDeltaTime } from '../../../util.js'
import { NormalLostService } from '../normal/lost.js'

export class TrackerLostService extends NormalLostService {
    constructor(enemy) {
        super(enemy)
    }

    handleLostState() {
        this.enemy.lostCounter = this.enemy.lostCounter || 0
        if (this.enemy.lostCounter === useDeltaTime(600)) {
            this.enemy.lostCounter = 0
            return
        }
        if (this.enemy.lostCounter % useDeltaTime(120) === 0 && this.enemy.lostCounter !== 0)
            this.enemy.angleService.checkSurroundings()
        this.enemy.lostCounter += 1
    }
}
