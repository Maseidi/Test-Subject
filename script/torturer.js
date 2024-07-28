import { AbstractEnemy } from './abstract-enemy.js'
import { 
    CHASE,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE, 
    TORTURER} from './enemy-constants.js'

export class Torturer extends AbstractEnemy {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 180 + Math.random() * 20)
        const damage = Math.floor(level * 20 + Math.random() * 10)
        const maxSpeed = 3.5 + Math.random()
        super(TORTURER, 4, waypoint, health, damage, 100, maxSpeed, progress, 600, 1.5)
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