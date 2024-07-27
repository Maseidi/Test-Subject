import { collide } from './util.js'
import { getPlayer } from './elements.js'
import { GrabberEnemy } from './grabber-enemy.js'
import { setPlayer2Fire } from './player-health.js'
import { CHASE, NO_OFFENCE } from './enemy-constants.js'

export class ScorcherEnemy extends GrabberEnemy {
    constructor(enemy) {
        super(enemy)
    }

    collidePlayer() {
        const state = this.getEnemyState()
        if ( ( state !== CHASE && state !== NO_OFFENCE ) || !collide(this.enemy, getPlayer(), 0) ) return false
        if ( state === CHASE ) {
            const decision = Math.random()
            if ( decision < 0.5 ) {
                if ( Math.random() < 0.5 ) setPlayer2Fire()
                this.hitPlayer()
                return
            }
            this.grabPlayer()
        }
        return true
    }

}