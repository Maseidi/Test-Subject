import { collide } from '../../util.js'
import { Grabber } from './grabber.js'
import { getPlayer } from '../../elements.js'
import { setPlayer2Fire } from '../../player-health.js'
import { CHASE, NO_OFFENCE, SCORCHER } from '../util/enemy-constants.js'

export class Scorcher extends Grabber {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 135 + Math.random() * 15)
        const damage = Math.floor(level * 15 + Math.random() * 10)
        const maxSpeed = 2.5 + Math.random()
        super(SCORCHER, 5, waypoint, health, damage, 100, maxSpeed, progress, 600, 1.1)
    }

    collidePlayer() {
        if ( ( this.state !== CHASE && this.state !== NO_OFFENCE ) || !collide(this.htmlTag, getPlayer(), 0) ) return false
        if ( this.state === CHASE ) {
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