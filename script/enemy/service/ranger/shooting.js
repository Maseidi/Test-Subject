import { manageAimModeAngle } from '../../../angle-manager.js'
import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import { CHASE, STAND_AND_WATCH, STUNNED } from '../../util/enemy-constants.js'
import { getGrabbed, getPlayerX, getPlayerY, getRoomLeft, getRoomTop, getStunnedCounter } from '../../../variables.js'
import { 
    addAllAttributes,
    addClass,
    angleOf2Points,
    calculateBulletSpeed,
    createAndAddClass,
    getProperty,
    removeClass } from '../../../util.js'

export class RangerShootingService {
    constructor(enemy) {
        this.enemy = enemy
        this.fireRate = 30
    }

    transferEnemy(toggle) {
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        if ( toggle ) addClass(body, 'no-transition')
        else removeClass(body, 'no-transition')
    }

    handleRangedAttackState() {
        this.transferEnemy(true)
        if ( this.enemy.visionService.isPlayerVisible() ) 
            this.enemy.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER)
        let shootCounter = this.enemy.shootCounter || 0
        shootCounter++
        if ( shootCounter === 3 * this.fireRate ) {            
            const d = this.enemy.movementService.distance2Player()
            if ( getGrabbed() ) this.enemy.state = STAND_AND_WATCH
            else if ( getStunnedCounter() > 0 ) this.enemy.state = STUNNED
            else if ( d > this.enemy.vision || d < 200 ||
                 this.enemy.wallInTheWay !== false || 
                 Math.random() < 0.2 ) this.enemy.state = CHASE
            this.enemy.shootCounter = -1
            return
        }
        if ( shootCounter > this.fireRate - 1 && getStunnedCounter() === 0 ) this.updateAngle2Player()
        this.enemy.shootCounter = shootCounter
        this.shootAnimation()
        if ( shootCounter !== this.fireRate / 2 ) return
        if ( this.enemy.health > 0 ) this.shoot()
    }

    updateAngle2Player() {
        manageAimModeAngle(
            this.enemy.sprite, 
            getProperty(this.enemy.sprite.firstElementChild.children[1], 'transform', 'rotateZ(', 'deg)'),
            () => this.enemy.angle,
            (val) => this.enemy.angle = val,
            (val) => this.enemy.angleState = val
        )
    }

    shootAnimation() {
        this.enemy.angle = this.enemy.angle || 0
        this.rotateBody(this.enemy.shootCounter < this.fireRate / 2, 12)
        this.rotateBody(this.enemy.shootCounter >= this.fireRate / 2 && this.enemy.shootCounter < this.fireRate - 1, -12)
    }

    rotateBody(predicate, amount) {
        if ( !predicate ) return
        this.enemy.angle = this.enemy.angle + amount
        this.enemy.sprite.firstElementChild.firstElementChild.style.transform = `rotateZ(${this.enemy.angle}deg)`
    }

    shoot() {
        const { x: srcX, y: srcY } = { 
            x: getProperty(this.enemy.sprite, 'left', 'px') + 16, 
            y: getProperty(this.enemy.sprite, 'top', 'px') + 16 
        }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOf2Points(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX, 10)
        const bullet = createAndAddClass('div', 'ranger-bullet')
        addAllAttributes(
            bullet, 
            'speed-x', speedX, 
            'speed-y', speedY, 
            'damage',  this.enemy.damage,
            'virus',   this.enemy.virus
        )
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `${this.enemy.virus}`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }

}