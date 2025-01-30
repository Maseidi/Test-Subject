import { useDeltaTime } from '../../../util.js'

export class NormalInvestigationService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleInvestigationState() {
        if (this.enemy.visionService.playerSpotted()) return
        const path = this.enemy.sprite.previousSibling
        const counter = this.enemy.investigationCounter
        if (counter > 0) this.enemy.investigationCounter += 1
        const limit = useDeltaTime(300)
        if (counter && counter !== limit && counter % Math.floor(limit / 3) === 0)
            this.enemy.angleService.checkSurroundings()
        if (counter >= limit) this.enemy.investigationCounter = 0
        if (counter !== 0) return
        if (path.children.length === 1) this.enemy.angleService.checkSurroundings()
        const dest = path.children[this.enemy.pathPoint]
        this.enemy.notificationService.updateDestination2Path(dest)
        this.enemy.movementService.displaceEnemy()
    }
}
