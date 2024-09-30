import { SinglePointPath } from '../../path.js'
import { AbstractEnemy } from './abstract-enemy.js'
import { TrackerLostService } from '../service/tracker/lost.js'
import { TrackerChaseService } from '../service/tracker/chase.js'
import { TrackerVisionService } from '../service/tracker/vision.js'
import { TrackerMovemenetService } from '../service/tracker/movement.js'
import { TrackerCollisionService } from '../service/tracker/collision.js'
import { TrackerGuessSearchService } from '../service/tracker/guess-search.js'
import { TrackerNotificationService } from '../service/tracker/notification.js'
import { CHASE, GUESS_SEARCH, LOST, TRACKER } from '../enemy-constants.js'
import { getRoundsFinished } from '../../variables.js'

export class Tracker extends AbstractEnemy {
    constructor(level, x, y, loot, progress, virus, difficulties) {
        const base = level + (getRoundsFinished() * 5)
        const health = Math.floor(base * 270 + Math.random() * 15)
        const damage = Math.floor(base * 30 + Math.random() * 15)
        const maxSpeed = 8 + Math.random()

        super(TRACKER, 4, new SinglePointPath(x, y), 
              health, damage, maxSpeed, 500, maxSpeed * 0.8, loot, progress, virus, difficulties)

        this.notificationService = new TrackerNotificationService(this)
        this.lostService = new TrackerLostService(this)
        this.visionService = new TrackerVisionService(this)
        this.movementService = new TrackerMovemenetService(this)
        this.collisionService = new TrackerCollisionService(this)
        this.chaseService = new TrackerChaseService(this)
        this.guessSearchService = new TrackerGuessSearchService(this)
    }

    manageState() {
        switch ( this.state ) {
            case CHASE:
                this.chaseService.handleChaseState()
                break
            case GUESS_SEARCH:
                this.guessSearchService.handleGuessSearchState()
                break 
            case LOST:
                this.lostService.handleLostState()
                break
        }
    }

}