import { AbstractEnemy } from '../type/abstract-enemy.js'
import { NormalLostService } from '../service/normal/lost.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalReturnService } from '../service/normal/return.js'
import { RangerShootingService } from '../service/ranger/shooting.js'
import { RangerCollisionService } from '../service/ranger/collision.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalInvestigationService } from '../service/normal/investigate.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    RANGER } from '../util/enemy-constants.js'

export class Ranger extends AbstractEnemy {
    constructor(level, waypoint, progress, loot, progress2Active) {
        const health = Math.floor(level * 112 + Math.random() * 17)
        const damage = Math.floor(level * 25 + Math.random() * 5)
        const maxSpeed = 4 + Math.random()
        const vision = Math.floor(500 + Math.random() * 300)
        super(RANGER, 6, waypoint, health, damage, 75, maxSpeed, progress, vision, 2, loot, progress2Active)
        this.collisionService = new RangerCollisionService(this)
        this.investigationService = new NormalInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.shootingService = new RangerShootingService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new NormalLostService(this)
        this.returnService = new NormalReturnService(this)
    }

    manageState() {
        this.shootingService.transferEnemy(false)
        switch ( this.state ) {
            case INVESTIGATE:
                this.investigationService.handleInvestigationState()
                break
            case CHASE:
                if ( Math.random() < 0.008 ) this.state = GO_FOR_RANGED
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
        }
    }

}