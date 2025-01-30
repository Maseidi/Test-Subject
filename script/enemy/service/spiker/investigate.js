import { useDeltaTime } from '../../../util.js'
import { NormalInvestigationService } from '../normal/investigate.js'

export class SpikerInvestigationService extends NormalInvestigationService {
    constructor(enemy) {
        super(enemy)
    }

    handleInvestigationState() {
        if (this.enemy.visionService.playerSpotted()) return
        const path = this.enemy.sprite.previousSibling
        const counter = this.enemy.investigationCounter
        if (counter > 0) this.enemy.investigationCounter += 1
        if (counter >= useDeltaTime(30)) this.enemy.investigationCounter = 0
        if (counter !== 0) return
        const dest = path.children[this.enemy.pathPoint]
        this.enemy.notificationService.updateDestination2Path(dest)
        this.enemy.movementService.displaceEnemy()
    }
}
