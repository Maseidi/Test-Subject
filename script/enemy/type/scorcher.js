import { AbstractEnemy } from './abstract-enemy.js'
import { NormalLostService } from '../service/normal/lost.js'
import { GrabberGrabService } from '../service/grabber/grab.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalReturnService } from '../service/normal/return.js'
import { GrabberInjuryService } from '../service/grabber/injury.js'
import { ScorcherMovementService } from '../service/scorcher/movement.js'
import { ScorcherShootingService } from '../service/scorcher/shooting.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalInvestigationService } from '../service/normal/investigate.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GRAB,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    SCORCHER } from '../enemy-constants.js'

export class Scorcher extends AbstractEnemy {
    constructor(level, waypoint, loot, progress, virus) {
        const health = Math.floor(level * 135 + Math.random() * 15)
        const damage = Math.floor(level * 15 + Math.random() * 10)
        const maxSpeed = 2.5 + Math.random()
        super(SCORCHER, 5, waypoint, health, damage, maxSpeed, 600, 1.1, loot, progress, virus)
        this.injuryService = new GrabberInjuryService(this)
        this.movementService = new ScorcherMovementService(this)
        this.investigationService = new NormalInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.shootingService = new ScorcherShootingService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new NormalLostService(this)
        this.returnService = new NormalReturnService(this)
        this.grabService = new GrabberGrabService(this)
    }

    manageState() {
        this.shootingService.transferEnemy(false)
        switch ( this.state ) {
            case INVESTIGATE:
                this.investigationService.handleInvestigationState()
                break
            case CHASE:
                if ( Math.random() < 0.004 ) this.state = GO_FOR_RANGED
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