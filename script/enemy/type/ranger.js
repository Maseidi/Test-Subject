import { AbstractEnemy } from './abstract-enemy.js'
import { manageAimModeAngle } from './player-angle.js'
import { getCurrentRoom, getCurrentRoomRangerBullets } from './elements.js'
import { getGrabbed, getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from './variables.js'
import { addAttribute, addClass, angleOfTwoPoints, createAndAddClass, getProperty, removeClass } from './util.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    RANGER, 
    STAND_AND_WATCH} from './enemy-constants.js'

export class Ranger extends AbstractEnemy {
    constructor(level, waypoint, progress) {
        const health = Math.floor(level * 112 + Math.random() * 17)
        const damage = Math.floor(level * 25 + Math.random() * 5)
        const maxSpeed = 4 + Math.random()
        const vision = Math.floor(500 + Math.random() * 300)
        super(RANGER, 6, waypoint, health, damage, 75, maxSpeed, progress, vision, 2)
    }

    behave() {
        this.transferEnemy(false)
        switch ( this.state ) {
            case INVESTIGATE:
                this.handleInvestigationState()
                break
            case CHASE:
                if ( Math.random() < 0.008 ) this.state = GO_FOR_RANGED
            case NO_OFFENCE:
                this.handleChaseState()
                break
            case GO_FOR_RANGED:
                this.handleRangedAttackState()
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

    transferEnemy(toggle) {
        const body = this.htmlTag.firstElementChild.firstElementChild
        if ( toggle ) addClass(body, 'no-transition')
        else removeClass(body, 'no-transition')
    }

    handleRangedAttackState() {
        this.transferEnemy(true)
        let shootCounter = this.shootCounter || 0
        shootCounter++
        if ( shootCounter === 90 ) {
            const d = this.distance2Player()
            if ( getGrabbed() ) this.state = STAND_AND_WATCH
            else if ( d > this.vision || d < 200 ||
                 this.wallInTheWay !== false || 
                 Math.random() < 0.2 ) this.state = CHASE
            this.shootCounter = -1
            return
        }
        if ( shootCounter > 29 ) this.updateAngle2Player()
        this.shootCounter = shootCounter
        this.shootAnimation()
        if ( shootCounter !== 15 ) return
        if ( this.health > 0 ) this.shoot()
    }

    updateAngle2Player() {
        manageAimModeAngle(
            this.htmlTag, 
            getProperty(this.htmlTag.firstElementChild.children[1], 'transform', 'rotateZ(', 'deg)'),
            () => this.angle,
            (val) => this.angle = val,
            (val) => this.angleState = val
        )
    }

    shootAnimation() {
        this.angle = this.angle || 0
        this.rotateBody(this.shootCounter < 15, 12)
        this.rotateBody(this.shootCounter >= 15 && this.shootCounter < 29, -12)
    }

    rotateBody(predicate, amount) {
        if ( !predicate ) return
        this.angle = this.angle + amount
        this.htmlTag.firstElementChild.firstElementChild.style.transform = `rotateZ(${this.angle}deg)`
    }

    shoot() {
        const { x: srcX, y: srcY } = 
            { x: getProperty(this.htmlTag, 'left', 'px') + 16, y: getProperty(this.htmlTag, 'top', 'px') + 16 }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOfTwoPoints(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = this.calculateBulletSpeed(deg, slope, diffY, diffX)
        const bullet = createAndAddClass('div', 'ranger-bullet')
        addAttribute(bullet, 'speed-x', speedX)
        addAttribute(bullet, 'speed-y', speedY)
        addAttribute(bullet, 'damage', this.damage)
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `${this.virus}`
        getCurrentRoom().append(bullet)
        getCurrentRoomRangerBullets().push(bullet)
        this.resetAcceleration()
    }

    calculateBulletSpeed(deg, slope, diffX, diffY) {
        let speedX
        let speedY
        const baseSpeed = 10
        if ( (deg < 45 && deg >= 0) || (deg < -135 && deg >= -180) ) {
            speedX = diffX < 0 ? baseSpeed * (1 / slope) : -baseSpeed * (1/ slope)
            speedY = diffY < 0 ? baseSpeed : -baseSpeed
        } else if ( (deg >= 135 && deg < 180) || (deg < 0 && deg >= -45) ) {
            speedX = diffX < 0 ? -baseSpeed * (1 / slope) : baseSpeed * (1/ slope)
            speedY = diffY < 0 ? -baseSpeed : baseSpeed
        } else if ( (deg >= 45 && deg < 90) || (deg < -90 && deg >= -135) ) {
            speedX = diffX < 0 ? baseSpeed : -baseSpeed
            speedY = diffY < 0 ? baseSpeed * slope : -baseSpeed * slope
        } else if ( (deg >= 90 && deg < 135) || (deg < -45 && deg >= -90) ) {
            speedX = diffX < 0 ? -baseSpeed : baseSpeed
            speedY = diffY < 0 ? -baseSpeed * slope : baseSpeed * slope
        }
        return { speedX, speedY }
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( this.wallInTheWay === false && !getGrabbed() ) this.state = GO_FOR_RANGED
        this.handleCollision(collidingEnemy)
    }

}