import { SinglePointPath } from '../../path.js'
import { AbstractEnemy } from './abstract-enemy.js'
import { TrackerLostService } from '../service/tracker/lost.js'
import { TrackerChaseService } from '../service/tracker/chase.js'
import { TrackerVisionService } from '../service/tracker/vision.js'
import { TrackerMovemenetService } from '../service/tracker/movement.js'
import { TrackerCollisionService } from '../service/tracker/collision.js'
import { TrackerGuessSearchService } from '../service/tracker/guess-search.js'
import { TrackerNotificationService } from '../service/tracker/notification.js'
import { CHASE, GUESS_SEARCH, LOST, TRACKER } from '../util/enemy-constants.js'

export class Tracker extends AbstractEnemy {
    constructor(level, x, y, progress) {
        const health = Math.floor(level * 135 + Math.random() * 15)
        const damage = Math.floor(level * 30 + Math.random() * 15)
        const maxSpeed = 8 + Math.random()
        super(TRACKER, 8, new SinglePointPath(x, y), health, damage, 50, maxSpeed, progress, 500, maxSpeed * 0.8)
        this.notificationService = new TrackerNotificationService(this)
        this.lostService = new TrackerLostService(this)
        this.visionService = new TrackerVisionService(this)
        this.movementService = new TrackerMovemenetService(this)
        this.collisionService = new TrackerCollisionService(this)
        this.chaseService = new TrackerChaseService(this)
        this.guessSearchService = new TrackerGuessSearchService(this)
    }

    behave() {
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