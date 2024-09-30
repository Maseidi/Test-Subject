import { AbstractEnemy } from './abstract-enemy.js'
import { NormalLostService } from '../service/normal/lost.js'
import { GrabberGrabService } from '../service/grabber/grab.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalReturnService } from '../service/normal/return.js'
import { GrabberInjuryService } from '../service/grabber/injury.js'
import { GrabberMovementService } from '../service/grabber/movement.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalInvestigationService } from '../service/normal/investigate.js'
import { 
    CHASE,
    GRAB,
    GRABBER,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE } from '../enemy-constants.js'
import { getRoundsFinished } from '../../variables.js'

export class Grabber extends AbstractEnemy {
    constructor(level, path, loot, progress, virus, difficulties) {
        const base = level + (getRoundsFinished() * 5)        
        const health = Math.floor(base * 100 + Math.random() * 50)
        const damage = Math.floor(base * 20 + Math.random() * 10)
        const maxSpeed = 3 + Math.random()
        super(GRABBER, 4, path, health, damage, maxSpeed, 400, 1.4, loot, progress, virus, difficulties)
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
        switch ( this.state ) {
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