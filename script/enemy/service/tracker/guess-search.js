import { useDeltaTime } from '../../../util.js'
import { NormalChaseService } from '../normal/chase.js'

export class TrackerGuessSearchService extends NormalChaseService {
    constructor(enemy) {
        super(enemy)
    }

    handleGuessSearchState() {
        this.enemy.movementService.accelerateEnemy()
        if (this.enemy.guessCounter > 0) this.enemy.guessCounter += 1
        if (this.enemy.guessCounter !== 0 && this.enemy.guessCounter <= useDeltaTime(45))
            this.enemy.notificationService.updateDestination2Player()
        else this.enemy.guessCounter = 0
        this.enemy.movementService.displaceEnemy()
    }
}
