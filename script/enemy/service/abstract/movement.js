import { getPlayer } from '../../../elements.js'
import { collide, distance, getProperty } from '../../../util.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from '../../util/enemy-constants.js'

export class AbstractMovementService {
    constructor(enemy) {
        this.enemy = enemy
    }

    move2Destination() {
        if ( this.playerInRange() ) return
        const enemyWidth = getProperty(this.enemy.sprite, 'width', 'px')
        const { destX, destY, destWidth } = this.destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyWidth, destX, destY, destWidth)
        this.enemy.angleService.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed(xMultiplier, yMultiplier)
        if ( !xMultiplier && !yMultiplier ) this.reachedDestination()
        this.enemy.x += (xMultiplier ? (speed * xMultiplier) : 0)
        this.enemy.y += (yMultiplier ? (speed * yMultiplier) : 0)
        this.enemy.sprite.style.left = `${this.enemy.x}px`
        this.enemy.sprite.style.top = `${this.enemy.y}px`
    }

    playerInRange() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || !collide(this.enemy.sprite, getPlayer(), 0) ) 
            return false
        if ( this.enemy.state === CHASE ) this.enemy.offenceService.hitPlayer()
        return true
    }

    destinationCoordinates() {
        const destX = this.enemy.pathFindingX === null ? this.enemy.destX : this.enemy.pathFindingX
        const destY = this.enemy.pathFindingY === null ? this.enemy.destY : this.enemy.pathFindingY
        const destWidth = this.enemy.pathFindingX === null ? this.enemy.destWidth : 10
        return {destX, destY, destWidth}
    }

    decideDirection(enemyWidth, destX, destY, destWidth) {
        let xMultiplier = null, yMultiplier = null
        if ( this.enemy.x > destX + destWidth / 2 ) xMultiplier = -1
        else if ( this.enemy.x + enemyWidth <= destX + destWidth / 2 ) xMultiplier = 1
        if ( this.enemy.y > destY + destWidth / 2 ) yMultiplier = -1
        else if ( this.enemy.y + enemyWidth <= destY + destWidth / 2 ) yMultiplier = 1
        return { xMultiplier, yMultiplier }
    }

    calculateSpeed(xMultiplier, yMultiplier) {
        let speed = this.enemy.currentSpeed
        if ( this.enemy.state === NO_OFFENCE ) speed /= 2
        else if ( this.enemy.state === INVESTIGATE ) speed = this.enemy.maxSpeed / 5
        if ( xMultiplier && yMultiplier ) speed /= 1.41
        return speed
    }

    reachedDestination() {
        if ( this.enemy.pathFindingX !== null ) {
            this.enemy.pathFindingX = null
            this.enemy.pathFindingY = null
            return
        }
        switch ( this.enemy.state ) {
            case INVESTIGATE:
                const path = this.enemy.sprite.previousSibling
                const numOfPoints = path.children.length
                const currentPathPoint = this.enemy.pathPoint
                let nextPathPoint = currentPathPoint + 1
                if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
                this.enemy.pathPoint = nextPathPoint
                this.enemy.investigationCounter = 1
                break
            case GUESS_SEARCH:
                this.enemy.state = LOST
                this.enemy.lostCounter = 0
                this.resetAcceleration()
                break
            case MOVE_TO_POSITION:
                this.enemy.state = INVESTIGATE
                this.resetAcceleration()
                break                 
        }
    }

    accelerateEnemy() {
        this.enemy.accelerationCounter += 1
        if ( this.enemy.accelerationCounter === 60 ) {
            let newSpeed = this.enemy.currentSpeed + this.enemy.acceleration
            if ( newSpeed > this.enemy.maxSpeed ) newSpeed = this.enemy.maxSpeed
            this.enemy.currentSpeed = newSpeed
            this.enemy.accelerationCounter = 0
        }  
    }

    resetAcceleration() {
        this.enemy.accelerationCounter = 0
        this.enemy.currentSpeed = this.enemy.acceleration 
    }

    displaceEnemy() {
        this.enemy.pathFindingService.findPath()
        this.move2Destination()
    }

    distance2Player() {
        return this.distance2Target(getPlayer())
    }

    distance2Target(target) {
        const { x: enemyX, y: enemyY } = this.enemy.sprite.getBoundingClientRect()
        const { x: targetX, y: targetY } = target.getBoundingClientRect()
        return distance(enemyX, enemyY, targetX, targetY)
    }

}