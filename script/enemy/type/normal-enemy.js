import { AbstractEnemy } from './abstract-enemy.js'
import { 
    CHASE,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE, 
    ROCK_CRUSHER, 
    SOUL_DRINKER, 
    TORTURER} from '../util/enemy-constants.js'

export class NormalEnemy extends AbstractEnemy {
    constructor(type, level, waypoint, health, damage, knock, maxSpeed, progress, vision, acceleration) {
        super(type, level, waypoint, health, damage, knock, maxSpeed, progress, vision, acceleration)
    }

    behave() {
        switch ( this.state ) {
            case INVESTIGATE:
                this.handleInvestigationState()
                break
            case CHASE:
            case NO_OFFENCE:
                this.handleChaseState()
                break
            case GUESS_SEARCH:
                this.handleGuessSearchState()
                break    
            case LOST:
                this.handleLostState()
                break
            case MOVE_TO_POSITION:
                this.handleMove2PositionState()
                break
        }
    }

    handleInvestigationState() {
        if ( this.playerLocated() ) return
        const path = document.getElementById(this.path)
        const counter = this.investigationCounter
        if ( counter > 0 ) this.investigationCounter += 1
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.checkSurroundings()
        if ( counter >= 300 ) this.investigationCounter = 0
        if ( counter !== 0 ) return
        if ( path.children.length === 1 ) this.checkSurroundings()    
        const dest = path.children[this.pathPoint]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

    handleChaseState() {  
        this.accelerateEnemy()
        if ( this.isPlayerVisible() ) this.notifyEnemy(Number.MAX_SAFE_INTEGER)
        else {
            this.state = GUESS_SEARCH
            this.guessCounter = 1
        }
        this.displaceEnemy()
    }

    handleGuessSearchState() {
        this.accelerateEnemy()
        if ( this.playerLocated() ) return
        if ( this.guessCounter > 0 ) this.guessCounter += 1
        if ( this.guessCounter !== 0 && this.guessCounter <= 15 ) this.updateDestination2Player()
        else this.guessCounter = 0
        this.displaceEnemy()
    }

    handleLostState() {
        if ( this.playerLocated() ) return
        if ( this.lostCounter === 600 ) {
            this.state = MOVE_TO_POSITION
            return
        }
        if ( this.lostCounter % 120 === 0 ) this.checkSurroundings()
        this.lostCounter += 1
    }
    
    handleMove2PositionState() {
        this.accelerateEnemy()
        if ( this.playerLocated() ) return
        const dest = document.getElementById(this.path).children[this.pathPoint]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

}

export class Torturer extends NormalEnemy {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 180 + Math.random() * 20)
        const damage = Math.floor(level * 20 + Math.random() * 10)
        const maxSpeed = 3.5 + Math.random()
        super(TORTURER, 4, waypoint, health, damage, 100, maxSpeed, progress, 600, 1.5)
    }
}

export class SoulDrinker extends NormalEnemy {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 90 + Math.random() * 15)
        const damage = Math.floor(level * 10 + Math.random() * 5)
        const maxSpeed = 4.5 + Math.random()
        super(SOUL_DRINKER, 4, waypoint, health, damage, 50, maxSpeed, progress, 400, 0.9)
    }
}

export class RockCrusher extends NormalEnemy {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 360 + Math.random() * 45)
        const damage = Math.floor(level * 40 + Math.random() * 20)
        const maxSpeed = 2.5 + Math.random()
        super(ROCK_CRUSHER, 4, waypoint, health, damage, 200, maxSpeed, progress, 800, 1.8)
    }
}