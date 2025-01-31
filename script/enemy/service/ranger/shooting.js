import { manageAimModeAngle } from '../../../angle-manager.js'
import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import {
    addAllAttributes,
    addClass,
    angleOf2Points,
    calculateBulletSpeed,
    createAndAddClass,
    getProperty,
    getSpeedPerFrame,
    removeClass,
    useDeltaTime,
} from '../../../util.js'
import { getGrabbed, getPlayerX, getPlayerY, getRoomLeft, getRoomTop, getStunnedCounter } from '../../../variables.js'
import { CHASE, STAND_AND_WATCH, STUNNED } from '../../enemy-constants.js'

export class RangerShootingService {
    constructor(enemy) {
        this.enemy = enemy
        this.fireRate = useDeltaTime(30)
    }

    transferEnemy(toggle) {
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        if (toggle) addClass(body, 'no-transition')
        else removeClass(body, 'no-transition')
    }

    handleRangedAttackState() {
        this.transferEnemy(true)
        if (this.enemy.visionService.isPlayerVisible())
            this.enemy.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER)
        let shootCounter = this.enemy.shootCounter || 0
        shootCounter++
        if (shootCounter === 3 * this.fireRate) {
            const d = this.enemy.movementService.distance2Player()
            if (getGrabbed()) this.enemy.state = STAND_AND_WATCH
            else if (getStunnedCounter() > 0) this.enemy.state = STUNNED
            else if (d > this.enemy.vision || d < 200 || this.enemy.wallInTheWay !== false || Math.random() < 0.2)
                this.enemy.state = CHASE
            this.enemy.shootCounter = -1
            return
        }
        if (shootCounter > this.fireRate - 1 && getStunnedCounter() === 0) this.updateAngle2Player()
        this.enemy.shootCounter = shootCounter
        if (shootCounter !== Math.floor(this.fireRate / 2)) return
        if (this.enemy.health > 0) this.playShootAnimation()
    }

    updateAngle2Player() {
        manageAimModeAngle(
            this.enemy.sprite,
            getProperty(this.enemy.sprite.firstElementChild.children[1], 'transform', 'rotateZ(', 'deg)'),
            () => this.enemy.angle,
            val => (this.enemy.angle = val),
            val => (this.enemy.angleState = val),
        )
    }

    playShootAnimation() {
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        const currentAngle = getProperty(body, 'transform', 'rotateZ(', 'deg)')
        body.animate(
            [{ transform: `rotateZ(${currentAngle}deg)` }, { transform: `rotateZ(${currentAngle + 180}deg)` }],
            {
                duration: 250,
            },
        ).addEventListener('finish', () => {
            this.shoot()
            body.animate(
                [{ transform: `rotateZ(${currentAngle + 180}deg)` }, { transform: `rotateZ(${currentAngle}deg)` }],
                {
                    duration: 250,
                },
            )
        })
    }

    shoot() {
        const { x: srcX, y: srcY } = {
            x: getProperty(this.enemy.sprite, 'left', 'px') + 16,
            y: getProperty(this.enemy.sprite, 'top', 'px') + 16,
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
            'speed-x',
            getSpeedPerFrame(speedX),
            'speed-y',
            getSpeedPerFrame(speedY),
            'damage',
            this.enemy.damage,
            'virus',
            this.enemy.virus,
        )
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `${this.enemy.virus}`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }
}
