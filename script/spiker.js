import { NormalEnemy } from './normal-enemy.js'
import { collide, getProperty } from './util.js'
import { getCurrentRoomEnemies } from './elements.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    SPIKER,
    TRACKER } from './enemy-constants.js'

export class Spiker extends NormalEnemy {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 25 + Math.random() * 5)
        const damage = Math.floor(level * 15 + Math.random() * 5)
        const maxSpeed = 6 + Math.random()
        super(SPIKER, 6, waypoint, health, damage, 75, maxSpeed, progress, 400, maxSpeed)
        this.axis = Math.random() < 0.5 ? 1 : 2
    }

    behave() {
        this.handleRotation()
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

    isPlayerVisible() {
        return this.wallInTheWay === false
    }

    handleRotation() {
        const angle = getProperty(this.htmlTag.firstElementChild.firstElementChild, 'transform', 'rotateZ(', 'deg)') || 0
        let newAngle = Number(angle) + 5
        if ( newAngle > 360 ) newAngle = 0
        this.htmlTag.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
    }

    handleInvestigationState() {
        if ( this.playerLocated() ) return
        const path = document.getElementById(this.path)
        const counter = this.investigationCounter
        if ( counter > 0 ) this.investigationCounter += 1
        if ( counter >= 300 ) this.investigationCounter = 0
        if ( counter !== 0 ) return
        const dest = path.children[this.pathPoint]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

    move2Destination() {
        if ( this.collidePlayer() ) return
        const enemyWidth = getProperty(this.htmlTag, 'width', 'px')
        const { destX, destY, destWidth } = this.destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyWidth, destX, destY, destWidth)
        this.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed(xMultiplier, yMultiplier)
        this.manageAxis(xMultiplier, yMultiplier)
        if ( !xMultiplier && !yMultiplier ) this.reachedDestination()
        this.x += (xMultiplier ? (speed * xMultiplier) : 0)
        this.y += (yMultiplier ? (speed * yMultiplier) : 0)
        this.htmlTag.style.left = `${this.x}px`
        this.htmlTag.style.top = `${this.y}px`
    }

    decideDirection(enemyWidth, destX, destY, destWidth) {
        let xMultiplier, yMultiplier
        if ( this.state === INVESTIGATE || ( this.pathFindingX !== null && this.pathFindingY !== null ) ) 
            return super.decideDirection(enemyWidth, destX, destY, destWidth)
        if ( this.axis === 1 ) {
            if ( this.x > destX + destWidth / 2 ) xMultiplier = -1
            else if ( this.x + enemyWidth <= destX + destWidth / 2 ) xMultiplier = 1
            yMultiplier = 0
        } else {
            if ( this.y > destY + destWidth / 2 ) yMultiplier = -1
            else if ( this.y + enemyWidth <= destY + destWidth / 2 ) yMultiplier = 1
            xMultiplier = 0
        }
        return { xMultiplier, yMultiplier }
    }

    manageAxis(xMultiplier, yMultiplier) {
        if ( xMultiplier === undefined ) this.axis = 2
        else if ( yMultiplier === undefined ) this.axis = 1
        if ( xMultiplier === undefined || yMultiplier === undefined ) this.resetAcceleration()
    }

    handleLostState() {
        if ( this.playerLocated() ) return
        if ( this.lostCounter === 600 ) {
            this.state = MOVE_TO_POSITION
            return
        }
        this.lostCounter += 1
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( collidingEnemy.type !== SPIKER ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.htmlTag !== this.htmlTag 
            && collide(this.htmlTag.firstElementChild.children[2], e.htmlTag.firstElementChild, 0) 
            && e.type !== TRACKER && e.type !== INVESTIGATE && e.type !== GO_FOR_RANGED)
        this.collidingEnemy = null
        return collidingEnemy
    }

}