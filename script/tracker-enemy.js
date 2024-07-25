import { getCurrentRoomEnemies, getPlayer } from './elements.js'
import { NormalEnemy } from './normal-enemy.js'
import { addAttribute, collide } from './util.js'
import { getNoOffenseCounter } from './variables.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, NO_OFFENCE, TRACKER } from './enemy-constants.js'

export class TrackerEnemy extends NormalEnemy {
    constructor(enemy) {
        super(enemy)
    }

    behave() {
        switch ( this.getEnemyState() ) {
            case INVESTIGATE:
                this.handleInvestigationState()
                break
            case CHASE:
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

    handleInvestigationState() {
        if ( this.distance2Player() < 50 && getNoOffenseCounter() === 0 ) {
            this.setEnemyState(CHASE)
            return
        }
        const counter = Number(this.enemy.getAttribute('investigation-counter'))
        if ( counter >= 0 ) addAttribute(this.enemy, 'investigation-counter', counter + 1)
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.checkSurroundings()
        if ( counter >= 300 ) addAttribute(this.enemy, 'investigation-counter', 0)       
    }

    handleChaseState() {
        this.setEnemyState(GUESS_SEARCH)
        addAttribute(this.enemy, 'guess-counter', 1)
    }

    handleGuessSearchState() {
        let guessCounter = Number(this.enemy.getAttribute('guess-counter'))
        if ( guessCounter > 0 ) {
            guessCounter++
            addAttribute(this.enemy, 'guess-counter', guessCounter)
        }
        if ( guessCounter !== 0 && guessCounter <= 45 ) this.updateDestination2Player()
        else addAttribute(this.enemy, 'guess-counter', 0)
        const stopCounter = Number(this.enemy.getAttribute('stop-counter'))
        if ( stopCounter > 0 ) addAttribute(this.enemy, 'stop-counter', stopCounter + 1)
        if ( stopCounter === 10 ) addAttribute(this.enemy, 'stop-counter', 0)
        if ( stopCounter > 0 ) return 
        this.displaceEnemy()
    }

    handleLostState() {
        this.setEnemyState(INVESTIGATE)
    }

    collidePlayer() {
        if ( !collide(this.enemy, getPlayer(), 0) ) return false
        this.hitPlayer()
        this.setEnemyState(INVESTIGATE)
        return true
    }

    switch2ChaseMode() {
        if ( getNoOffenseCounter() !== 0 ) return
        this.setEnemyState(GUESS_SEARCH)
        addAttribute(this.enemy, 'guess-counter', 1)
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.enemy !== this.enemy 
            && collide(this.enemy.firstElementChild.children[2], e.enemy.firstElementChild, 0)
            && e.enemy.getAttribute('type') === TRACKER )
        addAttribute(this.enemy, 'colliding-enemy', null)
        return collidingEnemy
    }

    handleCollision(collidingEnemy) {
        addAttribute(this.enemy, 'colliding-enemy', collidingEnemy.enemy.getAttribute('index'))
        const enemyState = this.getEnemyState()
        const collidingState = collidingEnemy.getEnemyState()
        if ( [INVESTIGATE, LOST].includes(collidingState) && 
             ( enemyState === CHASE || enemyState === GUESS_SEARCH ) ) {
            this.setEnemyState(INVESTIGATE)
        }
        else {
            const c1 = this.enemy.getAttribute('colliding-enemy')
            const c2 = collidingEnemy.enemy.getAttribute('colliding-enemy')
            const i1 = this.enemy.getAttribute('index')
            const i2 = collidingEnemy.enemy.getAttribute('index')
            if ( c1 === i2 && c2 === i1 ) return
            if ( Number(collidingEnemy.enemy.getAttribute('stop-counter')) > 0 ) return
            addAttribute(this.enemy, 'stop-counter', 1)
        }
    }

    wallsInTheWay() {
        return
    }

    vision2Player() {
        return
    }

}