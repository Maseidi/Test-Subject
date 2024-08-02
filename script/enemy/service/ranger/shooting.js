import { manageAimModeAngle } from '../../../player-angle.js'
import { CHASE, STAND_AND_WATCH } from '../../util/enemy-constants.js'
import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import { getGrabbed, getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'
import { addAttribute, addClass, angleOfTwoPoints, createAndAddClass, getProperty, removeClass } from '../../../util.js'

export class RangerShootingService {
    constructor(enemy) {
        this.enemy = enemy
        this.fireRate = 30
    }

    transferEnemy(toggle) {
        const body = this.enemy.htmlTag.firstElementChild.firstElementChild
        if ( toggle ) addClass(body, 'no-transition')
        else removeClass(body, 'no-transition')
    }

    handleRangedAttackState() {
        this.transferEnemy(true)
        let shootCounter = this.enemy.shootCounter || 0
        shootCounter++
        if ( shootCounter === 3 * this.fireRate ) {
            const d = this.enemy.movementService.distance2Player()
            if ( getGrabbed() ) this.enemy.state = STAND_AND_WATCH
            else if ( d > this.enemy.vision || d < 200 ||
                 this.enemy.wallInTheWay !== false || 
                 Math.random() < 0.2 ) this.enemy.state = CHASE
            this.enemy.shootCounter = -1
            return
        }
        if ( shootCounter > this.fireRate - 1 ) this.updateAngle2Player()
        this.enemy.shootCounter = shootCounter
        this.shootAnimation()
        if ( shootCounter !== this.fireRate / 2 ) return
        if ( this.enemy.health > 0 ) this.shoot()
    }

    updateAngle2Player() {
        manageAimModeAngle(
            this.enemy.htmlTag, 
            getProperty(this.enemy.htmlTag.firstElementChild.children[1], 'transform', 'rotateZ(', 'deg)'),
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
        this.enemy.htmlTag.firstElementChild.firstElementChild.style.transform = `rotateZ(${this.enemy.angle}deg)`
    }

    shoot() {
        const { x: srcX, y: srcY } = { 
            x: getProperty(this.enemy.htmlTag, 'left', 'px') + 16, 
            y: getProperty(this.enemy.htmlTag, 'top', 'px') + 16 
        }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOfTwoPoints(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = this.calculateBulletSpeed(deg, slope, diffY, diffX)
        const bullet = createAndAddClass('div', 'ranger-bullet')
        addAttribute(bullet, 'speed-x', speedX)
        addAttribute(bullet, 'speed-y', speedY)
        addAttribute(bullet, 'damage', this.enemy.damage)
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `${this.enemy.virus}`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
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

}