import { getPlayer } from './elements.js'
import { NormalEnemy } from './normal-enemy.js'
import { addAttribute, collide } from './util.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, NO_OFFENCE, TRACKER } from './enemy-constants.js'
import { getNoOffenseCounter } from './variables.js'

export class TrackerEnemy extends NormalEnemy {
    constructor(enemy) {
        super(enemy)
    }

    behave() {
        this.handleCollision2Player()
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
        }
    }

    handleCollision2Player() {
        if ( !(this.getEnemyState() !== NO_OFFENCE && collide(this.enemy, getPlayer(), 0)) ) return
        this.hitPlayer()
        this.setEnemyState(LOST)
    }

    handleInvestigationState() {
        if ( this.distance2Player() < 100 && getNoOffenseCounter() === 0 ) {
            this.setEnemyState(CHASE)
            return
        }
        const counter = Number(this.enemy.getAttribute('investigation-counter'))
        if ( counter >= 0 ) addAttribute(this.enemy, 'investigation-counter', counter + 1)
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.checkSuroundings()
        if ( counter >= 300 ) addAttribute(this.enemy, 'investigation-counter', 0)       
    }

    handleChaseState() {
        this.accelerateEnemy()
        this.displaceEnemy()
        this.setEnemyState(GUESS_SEARCH)
        addAttribute(this.enemy, 'guess-counter', 1)
    }

    handleGuessSearchState() {
        this.accelerateEnemy()
        let guessCounter = Number(this.enemy.getAttribute('guess-counter'))
        if ( guessCounter > 0 ) {
            guessCounter++
            addAttribute(this.enemy, 'guess-counter', guessCounter)
        }
        if ( guessCounter !== 0 && guessCounter <= 45 ) this.updateDestination2Player()
        else addAttribute(this.enemy, 'guess-counter', 0)
        this.displaceEnemy()
    }

    handleLostState() {
        const counter = Number(this.enemy.getAttribute('lost-counter'))
        if ( counter === 600 ) {
            this.setEnemyState(INVESTIGATE)
            return
        }
        if ( counter % 120 === 0 ) this.checkSuroundings()
        addAttribute(this.enemy, 'lost-counter', counter + 1)
    }

    wallsInTheWay() {
        return
    }

    vision2Player() {
        return
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( collidingEnemy.enemy.getAttribute('type') !== TRACKER ) return
        this.handleCollision(collidingEnemy)
    }

}