import { NormalEnemy } from './normal-enemy.js'
import { addAttribute, collide } from './util.js'
import { getNoOffenseCounter } from './variables.js'
import { getCurrentRoomEnemies, getPlayer } from './elements.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, TRACKER } from './enemy-constants.js'
import { SinglePointPath } from './path.js'

export class Tracker extends NormalEnemy {
    constructor(level, x, y, progress) {
        const health = Math.floor(level * 135 + Math.random() * 15)
        const damage = Math.floor(level * 30 + Math.random() * 15)
        const maxSpeed = 8 + Math.random()
        super(TRACKER, 8, new SinglePointPath(x, y), health, damage, 50, maxSpeed, progress, 500, maxSpeed)
    }

    behave() {
        switch ( this.state ) {
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
            this.state = CHASE
            return
        }
        const counter = this.investigationCounter
        if ( this.investigationCounter >= 0 ) this.investigationCounter += 1
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.checkSurroundings()
        if ( counter >= 300 ) this.investigationCounter = 0  
    }

    handleChaseState() {
        this.state = GUESS_SEARCH
        this.guessCounter = 1
    }

    handleGuessSearchState() {
        if ( this.guessCounter > 0 ) this.guessCounter += 1
        if ( this.guessCounter !== 0 && this.guessCounter <= 45 ) this.updateDestination2Player()
        else this.guessCounter = 0
        this.stopCounter = this.stopCounter ?? 0
        if ( this.stopCounter > 0 ) this.stopCounter += 1
        if ( this.stopCounter === 10 ) this.stopCounter = 0
        if ( this.stopCounter > 0 ) return 
        this.displaceEnemy()
    }

    handleLostState() {
        this.state = INVESTIGATE
    }

    collidePlayer() {
        if ( !collide(this.htmlTag, getPlayer(), 0) ) return false
        this.hitPlayer()
        this.state = INVESTIGATE
        return true
    }

    switch2ChaseMode() {
        if ( getNoOffenseCounter() !== 0 ) return
        this.state = GUESS_SEARCH
        this.guessCounter = 1
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.htmlTag !== this.htmlTag 
                 && collide(this.htmlTag.firstElementChild.children[2], e.htmlTag.firstElementChild, 0)
                 && e.type === TRACKER )
        this.collidingEnemy = null
        return collidingEnemy
    }

    handleCollision(collidingEnemy) {
        this.collidingEnemy = collidingEnemy.index
        if ( [INVESTIGATE, LOST].includes(collidingEnemy.state) && 
             ( this.state === CHASE || this.state === GUESS_SEARCH ) ) {
            this.state = INVESTIGATE
        }
        else {
            if ( this.collidingEnemy === collidingEnemy.index && collidingEnemy.collidingEnemy === this.index ) return
            if ( this.stopCounter > 0 ) return
            this.stopCounter = 1
        }
    }

    wallsInTheWay() {
        return
    }

    vision2Player() {
        return
    }

}