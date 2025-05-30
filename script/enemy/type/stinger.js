import { getIsSurvival, getRoundsFinished } from '../../variables.js'
import {
    CHASE,
    GO_FOR_RANGED,
    GRAB,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    STINGER,
} from '../enemy-constants.js'
import { GrabberGrabService } from '../service/grabber/grab.js'
import { GrabberInjuryService } from '../service/grabber/injury.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalInvestigationService } from '../service/normal/investigate.js'
import { NormalLostService } from '../service/normal/lost.js'
import { NormalReturnService } from '../service/normal/return.js'
import { StingerMovementService } from '../service/stinger/movement.js'
import { StingerShootingService } from '../service/stinger/shooting.js'
import { AbstractEnemy } from './abstract-enemy.js'

export class Stinger extends AbstractEnemy {
    constructor(level, waypoint, loot, progress, virus, difficulties) {
        const base = level + getRoundsFinished() * 5
        const health = Math.floor(base * 66 + Math.random() * 5)
        const damage = Math.floor(base * 10 + Math.random() * 10)
        const maxSpeed = 2.75 + Math.random()

        super(STINGER, 5, waypoint, health, damage, maxSpeed, 700, 1.3, loot, progress, virus, difficulties, level, 150)

        this.injuryService = new GrabberInjuryService(this)
        this.movementService = new StingerMovementService(this)
        this.investigationService = new NormalInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.shootingService = new StingerShootingService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new NormalLostService(this)
        this.returnService = new NormalReturnService(this)
        this.grabService = new GrabberGrabService(this)
    }

    manageState() {
        this.shootingService.transferEnemy(false)
        switch (this.state) {
            case INVESTIGATE:
                this.investigationService.handleInvestigationState()
                break
            case CHASE:
                if (getIsSurvival() && this.wallInTheWay !== false) {
                    this.chaseService.handleChaseState()
                    return
                }
                if (Math.random() < 0.002) this.state = GO_FOR_RANGED
            case NO_OFFENCE:
                this.chaseService.handleChaseState()
                break
            case GO_FOR_RANGED:
                this.shootingService.handleRangedAttackState()
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
