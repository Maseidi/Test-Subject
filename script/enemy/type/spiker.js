import { getProperty } from '../../util.js'
import { AbstractEnemy } from './abstract-enemy.js'
import { SpikerLostService } from '../service/spiker/lost.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalReturnService } from '../service/normal/return.js'
import { SpikerVisionService } from '../service/spiker/vision.js'
import { SpikerMovementService } from '../service/spiker/movement.js'
import { SpikerCollisionService } from '../service/spiker/collision.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { SpikerInvestigationService } from '../service/spiker/investigate.js'
import { 
    CHASE,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    SPIKER } from '../util/enemy-constants.js'
import { SpikerAngleService } from '../service/spiker/angle.js'

export class Spiker extends AbstractEnemy {
    constructor(level, waypoint, loot, progress, virus) {
        const health = Math.floor(level * 25 + Math.random() * 5)
        const damage = Math.floor(level * 15 + Math.random() * 5)
        const maxSpeed = 6 + Math.random()
        super(SPIKER, 6, waypoint, health, damage, maxSpeed, 400, maxSpeed, loot, progress, virus)
        this.axis = Math.random() < 0.5 ? 1 : 2
        this.angleService = new SpikerAngleService(this)
        this.visionService = new SpikerVisionService(this)
        this.movementService = new SpikerMovementService(this)
        this.collisionService = new SpikerCollisionService(this)
        this.investigationService = new SpikerInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new SpikerLostService(this)
        this.returnService = new NormalReturnService(this)
    }

    manageState() {
        this.handleRotation()
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
        }
    }

    handleRotation() {
        const angle = getProperty(this.sprite.firstElementChild.firstElementChild, 
            'transform', 'rotateZ(', 'deg)') || 0
        let newAngle = Number(angle) + 5
        if ( newAngle > 360 ) newAngle = 0
        this.sprite.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
    }

}