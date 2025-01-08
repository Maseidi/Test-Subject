import { AbstractEnemy } from '../type/abstract-enemy.js'
import { NormalLostService } from '../service/normal/lost.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalReturnService } from '../service/normal/return.js'
import { RangerShootingService } from '../service/ranger/shooting.js'
import { getIsSurvival, getRoundsFinished } from '../../variables.js'
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
    RANGER } from '../enemy-constants.js'

export class Ranger extends AbstractEnemy {
    constructor(level, waypoint, loot, progress, virus, difficulties) {
        const base = level + (getRoundsFinished() * 5)
        const health = Math.floor(base * 112 + Math.random() * 17)
        const damage = Math.floor(base * 15 + Math.random() * 5)
        const maxSpeed = 4 + Math.random()
        const vision = Math.floor(500 + Math.random() * 300)
        super(RANGER, 6, waypoint, health, damage, maxSpeed, vision, 2, loot, progress, virus, difficulties, level)
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
                if ( getIsSurvival() && this.wallInTheWay !== false ) {
                    this.chaseService.handleChaseState()
                    return
                }
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