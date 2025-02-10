import { getProperty, getSpeedPerFrame, useDeltaTime } from '../../util.js'
import { getRoundsFinished } from '../../variables.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE, SPIKER } from '../enemy-constants.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalReturnService } from '../service/normal/return.js'
import { SpikerInvestigationService } from '../service/spiker/investigate.js'
import { SpikerLostService } from '../service/spiker/lost.js'
import { SpikerMovementService } from '../service/spiker/movement.js'
import { SpikerVisionService } from '../service/spiker/vision.js'
import { AbstractEnemy } from './abstract-enemy.js'

export class Spiker extends AbstractEnemy {
    constructor(level, waypoint, loot, progress, virus, difficulties) {
        const base = level + getRoundsFinished() * 5
        const health = Math.floor(base * 13 + Math.random() * 3)
        const damage = Math.floor(base * 3 + Math.random() * 3)
        const maxSpeed = 6 + Math.random()

        super(
            SPIKER,
            6,
            waypoint,
            health,
            damage,
            maxSpeed,
            400,
            maxSpeed,
            loot,
            progress,
            virus,
            difficulties,
            level,
            25,
        )

        this.axis = Math.random() < 0.5 ? 1 : 2
        this.visionService = new SpikerVisionService(this)
        this.movementService = new SpikerMovementService(this)
        this.investigationService = new SpikerInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new SpikerLostService(this)
        this.returnService = new NormalReturnService(this)
    }

    manageState() {
        this.handleRotation()
        this.handleAxis()
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
        }
    }

    handleRotation() {
        const angle = getProperty(this.sprite.firstElementChild.firstElementChild, 'transform', 'rotateZ(', 'deg)') || 0
        let newAngle = Number(angle) + getSpeedPerFrame(5)
        if (newAngle > 360) newAngle = 0
        this.sprite.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
    }

    handleAxis() {
        this.axisCounter = this.axisCounter || 0
        this.axisCounter++
        if (this.axisCounter !== useDeltaTime(60)) return
        if (this.prevX === this.x && this.prevY === this.y) {
            if (this.axis === 1) this.axis = 2
            else this.axis = 1
        }
        this.prevX = this.x
        this.prevY = this.y
        this.axisCounter = 0
    }
}
