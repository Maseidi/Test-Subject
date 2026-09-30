import { getPlayer } from '../../../elements.js'
import { collide, distance, getProperty, getSpeedPerFrame, useDeltaTime } from '../../../util.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from '../../enemy-constants.js'
import { isEnemyPositionBlocked } from './path-finding.js'

const enemySize = enemy => {
    const width = getProperty(enemy.sprite, 'width', 'px') || enemy.sprite.offsetWidth || 40
    const height = getProperty(enemy.sprite, 'height', 'px') || enemy.sprite.offsetHeight || width
    return { width, height }
}

export const moveEnemyWithCollisions = (enemy, dx, dy) => {
    const { width, height } = enemySize(enemy)
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 3))
    const stepX = dx / steps
    const stepY = dy / steps
    let movedX = false
    let movedY = false

    for (let step = 0; step < steps; step++) {
        const nextX = enemy.x + stepX
        const nextY = enemy.y + stepY
        if (!isEnemyPositionBlocked(nextX, nextY, width, height)) {
            enemy.x = nextX
            enemy.y = nextY
            movedX ||= stepX !== 0
            movedY ||= stepY !== 0
            continue
        }

        let movedThisStep = false
        if (stepX && !isEnemyPositionBlocked(nextX, enemy.y, width, height)) {
            enemy.x = nextX
            movedX = true
            movedThisStep = true
        }
        if (stepY && !isEnemyPositionBlocked(enemy.x, nextY, width, height)) {
            enemy.y = nextY
            movedY = true
            movedThisStep = true
        }
        if (!movedThisStep) break
    }

    enemy.sprite.style.left = `${enemy.x}px`
    enemy.sprite.style.top = `${enemy.y}px`
    return { movedX, movedY }
}

export class AbstractMovementService {
    constructor(enemy) {
        this.enemy = enemy
    }

    move2Destination() {
        if (this.playerInRange()) return
        const enemyWidth = getProperty(this.enemy.sprite, 'width', 'px') || this.enemy.sprite.offsetWidth || 40
        const { destX, destY, destWidth } = this.destinationCoordinates(enemyWidth)
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyWidth, destX, destY, destWidth)
        this.enemy.angleService.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed(xMultiplier, yMultiplier)
        if (!xMultiplier && !yMultiplier) {
            this.reachedDestination()
            return
        }
        moveEnemyWithCollisions(
            this.enemy,
            xMultiplier ? speed * xMultiplier : 0,
            yMultiplier ? speed * yMultiplier : 0,
        )
    }

    playerInRange() {
        if (
            (this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE) ||
            !collide(this.enemy.sprite, getPlayer(), 0)
        )
            return false
        if (this.enemy.state === CHASE) this.enemy.offenceService.hitPlayer()
        return true
    }

    destinationCoordinates(enemyWidth) {
        const followingPath = Number.isFinite(this.enemy.pathFindingX)
        const destX = followingPath ? this.enemy.pathFindingX : this.enemy.destX
        const destY = followingPath ? this.enemy.pathFindingY : this.enemy.destY
        const destWidth = followingPath ? enemyWidth : this.enemy.destWidth
        return { destX, destY, destWidth }
    }

    decideDirection(enemyWidth, destX, destY, destWidth) {
        let xMultiplier = null
        let yMultiplier = null
        const targetCenterX = destX + destWidth / 2
        const targetCenterY = destY + destWidth / 2
        const xDifference = targetCenterX - (this.enemy.x + enemyWidth / 2)
        const yDifference = targetCenterY - (this.enemy.y + enemyWidth / 2)
        if (Math.abs(xDifference) > 2) xMultiplier = Math.sign(xDifference)
        if (Math.abs(yDifference) > 2) yMultiplier = Math.sign(yDifference)
        return { xMultiplier, yMultiplier }
    }

    calculateSpeed(xMultiplier, yMultiplier) {
        let speed = this.enemy.currentSpeed
        if (this.enemy.state === NO_OFFENCE) speed /= 2
        else if (this.enemy.state === INVESTIGATE) speed = this.enemy.maxSpeed / 5
        if (xMultiplier && yMultiplier) speed /= Math.SQRT2
        return getSpeedPerFrame(speed)
    }

    reachedDestination() {
        if (Number.isFinite(this.enemy.pathFindingX)) {
            this.enemy.pathFindingX = null
            this.enemy.pathFindingY = null
            return
        }
        switch (this.enemy.state) {
            case INVESTIGATE: {
                const path = this.enemy.sprite.previousSibling
                const numOfPoints = path.children.length
                const currentPathPoint = this.enemy.pathPoint
                let nextPathPoint = currentPathPoint + 1
                if (nextPathPoint > numOfPoints - 1) nextPathPoint = 0
                this.enemy.pathPoint = nextPathPoint
                this.enemy.investigationCounter = 1
                break
            }
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
        if (this.enemy.accelerationCounter >= useDeltaTime(60)) {
            let newSpeed = this.enemy.currentSpeed + this.enemy.acceleration
            if (newSpeed > this.enemy.maxSpeed) newSpeed = this.enemy.maxSpeed
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
        return distance(this.enemy.sprite, target)
    }
}
