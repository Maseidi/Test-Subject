import { manageAimModeAngle } from '../../../angle-manager.js'
import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import { getPredictedShot } from '../../../player-targeting.js'
import {
    addAllAttributes,
    addClass,
    angleOf2Points,
    createAndAddClass,
    getProperty,
    getSpeedPerFrame,
    removeClass,
    useDeltaTime,
} from '../../../util.js'
import {
    getAnimatedElements,
    getGrabbed,
    getStunnedCounter,
    setAnimatedElements,
} from '../../../variables.js'
import { CHASE, STAND_AND_WATCH, STUNNED } from '../../enemy-constants.js'

export class RangerShootingService {
    constructor(enemy) {
        this.enemy = enemy
        this.relativeFireRate = 30
    }

    transferEnemy(toggle) {
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        if (toggle) addClass(body, 'no-transition')
        else removeClass(body, 'no-transition')
    }

    handleRangedAttackState() {
        const fireRate = useDeltaTime(this.relativeFireRate)
        this.transferEnemy(true)
        if (this.enemy.visionService.isPlayerVisible())
            this.enemy.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER)
        let shootCounter = this.enemy.shootCounter || 0
        shootCounter++
        if (shootCounter === 3 * fireRate) {
            const d = this.enemy.movementService.distance2Player()
            if (getGrabbed()) this.enemy.state = STAND_AND_WATCH
            else if (getStunnedCounter() > 0) this.enemy.state = STUNNED
            else if (d > this.enemy.vision || d < 200 || this.enemy.wallInTheWay !== false || Math.random() < 0.2)
                this.enemy.state = CHASE
            this.enemy.shootCounter = -1
            return
        }
        if (shootCounter > fireRate - 1 && getStunnedCounter() === 0) this.updateAngle2Player()
        this.enemy.shootCounter = shootCounter
        if (shootCounter !== Math.floor(fireRate / 2)) return
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
        const animatedBody1 = body.animate(
            [{ transform: `rotateZ(${currentAngle}deg)` }, { transform: `rotateZ(${currentAngle + 180}deg)` }],
            {
                duration: 250,
            },
        )
        setAnimatedElements([...getAnimatedElements(), animatedBody1])
        animatedBody1.addEventListener('finish', () => {
            this.shoot()
            setAnimatedElements(getAnimatedElements().filter(item => item !== animatedBody1))
            const animatedBody2 = body.animate(
                [{ transform: `rotateZ(${currentAngle + 180}deg)` }, { transform: `rotateZ(${currentAngle}deg)` }],
                {
                    duration: 250,
                },
            )
            setAnimatedElements([...getAnimatedElements(), animatedBody2])
            animatedBody2.addEventListener('finish', () => {
                setAnimatedElements(getAnimatedElements().filter(item => item !== animatedBody2))
            })
        })
    }

    shoot() {
        const { x: srcX, y: srcY } = {
            x: getProperty(this.enemy.sprite, 'left', 'px') + 16,
            y: getProperty(this.enemy.sprite, 'top', 'px') + 16,
        }
        const bulletSpeed = getSpeedPerFrame(10)
        const { destinationX, destinationY, speedX, speedY } = getPredictedShot(srcX, srcY, bulletSpeed)
        const deg = angleOf2Points(srcX, srcY, destinationX, destinationY)
        const bullet = createAndAddClass('div', 'ranger-bullet')
        addAllAttributes(
            bullet,
            'speed-x',
            speedX,
            'speed-y',
            speedY,
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
