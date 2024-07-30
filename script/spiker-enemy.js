import { addAttribute, collide, getProperty } from './util.js'
import { NormalEnemy } from './normal-enemy.js'
import { CHASE, GO_FOR_RANGED, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE, SPIKER, TRACKER } from './enemy-constants.js'
import { getCurrentRoomEnemies } from './elements.js'

export class SpikerEnemy extends NormalEnemy {
    constructor(enemy) {
        super(enemy)
    }

    behave() {
        this.handleRotation()
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

    isPlayerVisible() {
        return this.enemy.getAttribute('wall-in-the-way') === 'false'
    }

    handleRotation() {
        const angle = this.enemy.firstElementChild.firstElementChild.style.transform.replace('rotateZ(', '').replace('deg)', '') || 0
        let newAngle = Number(angle) + 5
        if ( newAngle > 360 ) newAngle = 0
        this.enemy.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
    }

    handleInvestigationState() {
        if ( this.playerLocated() ) return
        const path = document.getElementById(this.enemy.getAttribute('path'))
        const counter = Number(this.enemy.getAttribute('investigation-counter'))
        if ( counter > 0 ) addAttribute(this.enemy, 'investigation-counter', counter + 1)
        if ( counter >= 300 ) addAttribute(this.enemy, 'investigation-counter', 0)
        if ( counter !== 0 ) return
        const dest = path.children[Number(this.enemy.getAttribute('path-point'))]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

    move2Destination() {
        if ( this.collidePlayer() ) return
        const { enemyLeft, enemyTop, enemyW } = this.enemyCoordinates()
        const { destLeft, destTop, destW } = this.destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyLeft, destLeft, enemyTop, destTop, enemyW, destW)
        this.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed(xMultiplier, yMultiplier)
        this.manageAxis(xMultiplier, yMultiplier)
        if ( !xMultiplier && !yMultiplier ) this.reachedDestination()
        const currentX = getProperty(this.enemy, 'left', 'px')
        const currentY = getProperty(this.enemy, 'top', 'px')
        this.enemy.style.left = `${currentX + speed * xMultiplier}px`
        this.enemy.style.top = `${currentY + speed * yMultiplier}px`
    }

    decideDirection(enemyLeft, destLeft, enemyTop, destTop, enemyW, destW) {
        const axis = Number(this.enemy.getAttribute('axis'))
        let xMultiplier, yMultiplier
        const pathFindingX = this.enemy.getAttribute('path-finding-x')
        const pathFindingY = this.enemy.getAttribute('path-finding-y')
        if ( this.getEnemyState() === INVESTIGATE || ( pathFindingX !== 'null' && pathFindingY !== 'null' ) ) 
            return super.decideDirection(enemyLeft, destLeft, enemyTop, destTop, enemyW, destW)
        if ( axis === 1 ) {
            if ( enemyLeft > destLeft + destW / 2 ) xMultiplier = -1
            else if ( enemyLeft + enemyW <= destLeft + destW / 2 ) xMultiplier = 1
            yMultiplier = 0
        } else {
            if ( enemyTop > destTop + destW / 2 ) yMultiplier = -1
            else if ( enemyTop + enemyW <= destTop + destW / 2 ) yMultiplier = 1
            xMultiplier = 0
        }
        return { xMultiplier, yMultiplier }
    }

    manageAxis(xMultiplier, yMultiplier) {
        if ( xMultiplier === undefined ) addAttribute(this.enemy, 'axis', 2)
        else if ( yMultiplier === undefined ) addAttribute(this.enemy, 'axis', 1)
        if ( xMultiplier === undefined || yMultiplier === undefined ) this.resetAcceleration()
    }

    handleLostState() {
        if ( this.playerLocated() ) return
        const counter = Number(this.enemy.getAttribute('lost-counter'))
        if ( counter === 600 ) {
            this.setEnemyState(MOVE_TO_POSITION)
            return
        }
        addAttribute(this.enemy, 'lost-counter', counter + 1)
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( collidingEnemy.enemy.getAttribute('type') !== SPIKER ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.enemy !== this.enemy 
            && collide(this.enemy.firstElementChild.children[2], e.enemy.firstElementChild, 0) 
            && e.enemy.getAttribute('type') !== TRACKER
            && e.getEnemyState() !== INVESTIGATE && e.getEnemyState() !== GO_FOR_RANGED)
        addAttribute(this.enemy, 'colliding-enemy', null)
        return collidingEnemy
    }

}