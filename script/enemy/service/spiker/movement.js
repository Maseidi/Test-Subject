import { getProperty } from '../../../util.js'
import { AbstractMovementService } from '../abstract/movement.js'
import { INVESTIGATE, NO_OFFENCE } from '../../util/enemy-constants.js'

export class SpikerMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    move2Destination() {
        if ( this.playerInRange() ) return
        const enemyWidth = getProperty(this.enemy.htmlTag, 'width', 'px')
        const { destX, destY, destWidth } = this.destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyWidth, destX, destY, destWidth)
        if ( xMultiplier === undefined && xMultiplier !== this.xMultiplier && this.enemy.axis === 1 ) {
            this.enemy.axis = 2
        } else if ( yMultiplier === undefined && yMultiplier !== this.yMultiplier && this.enemy.axis === 2 ) {
            this.enemy.axis = 1
        }
        this.xMultiplier = xMultiplier
        this.yMultiplier = yMultiplier
        this.enemy.angleService.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed()
        if ( !xMultiplier && !yMultiplier ) this.reachedDestination()  
        this.enemy.x += this.enemy.axis === 2 ? 0 : (xMultiplier ? (speed * xMultiplier) : 0)
        this.enemy.y += this.enemy.axis === 1 ? 0 : (yMultiplier ? (speed * yMultiplier) : 0)
        this.enemy.htmlTag.style.left = `${this.enemy.x}px`
        this.enemy.htmlTag.style.top = `${this.enemy.y}px`
    }

    calculateSpeed() {
        let speed = this.enemy.currentSpeed
        if ( this.enemy.state === NO_OFFENCE ) speed /= 2
        else if ( this.enemy.state === INVESTIGATE ) speed = this.enemy.maxSpeed / 5
        return speed
    }

}