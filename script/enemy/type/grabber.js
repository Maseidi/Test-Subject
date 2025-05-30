import { getRoundsFinished } from '../../variables.js'
import {
    CHASE,
    GRAB,
    GRABBER,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
} from '../enemy-constants.js'
import { GrabberGrabService } from '../service/grabber/grab.js'
import { GrabberInjuryService } from '../service/grabber/injury.js'
import { GrabberMovementService } from '../service/grabber/movement.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalInvestigationService } from '../service/normal/investigate.js'
import { NormalLostService } from '../service/normal/lost.js'
import { NormalReturnService } from '../service/normal/return.js'
import { AbstractEnemy } from './abstract-enemy.js'

export class Grabber extends AbstractEnemy {
    constructor(level, path, loot, progress, virus, difficulties) {
        const base = level + getRoundsFinished() * 5
        const health = Math.floor(base * 75 + Math.random() * 38)
        const damage = Math.floor(base * 8 + Math.random() * 8)
        const maxSpeed = 3 + Math.random()

        super(GRABBER, 4, path, health, damage, maxSpeed, 400, 1.4, loot, progress, virus, difficulties, level, 125)

        this.injuryService = new GrabberInjuryService(this)
        this.movementService = new GrabberMovementService(this)
        this.investigationService = new NormalInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new NormalLostService(this)
        this.returnService = new NormalReturnService(this)
        this.grabService = new GrabberGrabService(this)
    }

    manageState() {
        switch (this.state) {
            case INVESTIGATE:
                this.investigationService.handleInvestigationState()
                break
            case CHASE:
            case NO_OFFENCE:
                this.chaseService.handleChaseState()
                break
            case GUESS_SEARCH:
                this.guessSearchService.handleGuessSearchState()
                break
            case LOST:
                this.lostService.handleLostState()
                break
            case MOVE_TO_POSITION:
                this.returnService.handleMove2PositionState()
                break
            case GRAB:
                this.grabService.handleGrabState()
                break
        }
    }
}
