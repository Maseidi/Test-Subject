import { addAttribute } from './util.js'
import { AbstractEnemy } from './abstract-enemy.js'
import { 
    CHASE,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE } from './enemy-constants.js'

export class NormalEnemy extends AbstractEnemy {
    constructor(enemy) {
        super(enemy)
    }

    behave() {
        switch ( this.getEnemyState() ) {
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
        const path = document.getElementById(this.enemy.getAttribute('path'))
        const counter = Number(this.enemy.getAttribute('investigation-counter'))
        if ( counter > 0 ) addAttribute(this.enemy, 'investigation-counter', counter + 1)
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.checkSurroundings()
        if ( counter >= 300 ) addAttribute(this.enemy, 'investigation-counter', 0)
        if ( counter !== 0 ) return
        if ( path.children.length === 1 ) this.checkSurroundings()
        const dest = path.children[Number(this.enemy.getAttribute('path-point'))]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

    handleChaseState() {  
        this.accelerateEnemy()
        if ( this.isPlayerVisible() ) this.notifyEnemy(Number.MAX_SAFE_INTEGER)
        else {
            this.setEnemyState(GUESS_SEARCH)
            addAttribute(this.enemy, 'guess-counter', 1)
        }
        this.displaceEnemy()
    }

    handleGuessSearchState() {
        this.accelerateEnemy()
        if ( this.playerLocated() ) return
        let guessCounter = Number(this.enemy.getAttribute('guess-counter'))
        if ( guessCounter > 0 ) {
            guessCounter++
            addAttribute(this.enemy, 'guess-counter', guessCounter)
        }
        if ( guessCounter !== 0 && guessCounter <= 15 ) this.updateDestination2Player()
        else addAttribute(this.enemy, 'guess-counter', 0)
        this.displaceEnemy()
    }

    handleLostState() {
        if ( this.playerLocated() ) return
        const counter = Number(this.enemy.getAttribute('lost-counter'))
        if ( counter === 600 ) {
            this.setEnemyState(MOVE_TO_POSITION)
            return
        }
        if ( counter % 120 === 0 ) this.checkSurroundings()
        addAttribute(this.enemy, 'lost-counter', counter + 1)
    }
    
    handleMove2PositionState() {
        this.accelerateEnemy()
        if ( this.playerLocated() ) return
        const dest = document.getElementById(this.enemy.getAttribute('path')).children[Number(this.enemy.getAttribute('path-point'))]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

}