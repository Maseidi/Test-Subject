import { getRoundsFinished } from '../../variables.js'
import {
    CHASE,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    ROCK_CRUSHER,
    SOUL_DRINKER,
    TORTURER,
} from '../enemy-constants.js'
import { NormalChaseService } from '../service/normal/chase.js'
import { NormalGuessSearchService } from '../service/normal/guess-search.js'
import { NormalInvestigationService } from '../service/normal/investigate.js'
import { NormalLostService } from '../service/normal/lost.js'
import { NormalReturnService } from '../service/normal/return.js'
import { AbstractEnemy } from './abstract-enemy.js'

class NormalEnemy extends AbstractEnemy {
    constructor(
        type,
        components,
        waypoint,
        health,
        damage,
        maxSpeed,
        vision,
        acceleration,
        loot,
        progress,
        virus,
        difficulties,
        level,
        knock,
    ) {
        super(
            type,
            components,
            waypoint,
            health,
            damage,
            maxSpeed,
            vision,
            acceleration,
            loot,
            progress,
            virus,
            difficulties,
            level,
            knock,
        )

        this.investigationService = new NormalInvestigationService(this)
        this.chaseService = new NormalChaseService(this)
        this.guessSearchService = new NormalGuessSearchService(this)
        this.lostService = new NormalLostService(this)
        this.returnService = new NormalReturnService(this)
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
        }
    }
}

export class Torturer extends NormalEnemy {
    constructor(level, waypoint, loot, progress, virus, difficulties) {
        const base = level + getRoundsFinished() * 5
        const health = Math.floor(base * 135 + Math.random() * 15)
        const damage = Math.floor(base * 8 + Math.random() * 8)
        const maxSpeed = 3.5 + Math.random()

        super(
            TORTURER,
            4,
            waypoint,
            health,
            damage,
            maxSpeed,
            600,
            1.5,
            loot,
            progress,
            virus,
            difficulties,
            level,
            100,
        )
    }
}

export class SoulDrinker extends NormalEnemy {
    constructor(level, waypoint, loot, progress, virus, difficulties) {
        const base = level + getRoundsFinished() * 5
        const health = Math.floor(base * 68 + Math.random() * 12)
        const damage = Math.floor(base * 5 + Math.random() * 5)
        const maxSpeed = 4.5 + Math.random()

        super(
            SOUL_DRINKER,
            4,
            waypoint,
            health,
            damage,
            maxSpeed,
            400,
            0.9,
            loot,
            progress,
            virus,
            difficulties,
            level,
            50,
        )
    }
}

export class RockCrusher extends NormalEnemy {
    constructor(level, waypoint, loot, progress, virus, difficulties) {
        const base = level + getRoundsFinished() * 5
        const health = Math.floor(base * 270 + Math.random() * 35)
        const damage = Math.floor(base * 23 + Math.random() * 15)
        const maxSpeed = 2.5 + Math.random()

        super(
            ROCK_CRUSHER,
            4,
            waypoint,
            health,
            damage,
            maxSpeed,
            800,
            1.8,
            loot,
            progress,
            virus,
            difficulties,
            level,
            300,
        )
    }
}
