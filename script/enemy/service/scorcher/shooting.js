import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import {
    addAllAttributes,
    addFireEffect,
    angleOf2Points,
    calculateBulletSpeed,
    createAndAddClass,
    getProperty,
    getSpeedPerFrame,
} from '../../../util.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'
import { RangerShootingService } from '../ranger/shooting.js'

export class ScorcherShootingService extends RangerShootingService {
    constructor(enemy) {
        super(enemy)
        this.fireRate = 30
    }

    shoot() {
        this.playShootAnimation()
        const { x: srcX, y: srcY } = {
            x: getProperty(this.enemy.sprite, 'left', 'px') + 18.5,
            y: getProperty(this.enemy.sprite, 'top', 'px') + 18.5,
        }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOf2Points(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX, 10)
        const bullet = createAndAddClass('div', 'scorcher-bullet')
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
        bullet.style.backgroundColor = `crimson`
        const fire = addFireEffect()
        bullet.append(fire)
        bullet.style.transform = `rotateZ(${deg}deg)`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }

    playShootAnimation() {
        const arm = this.enemy.sprite.firstElementChild.firstElementChild.firstElementChild
        const currentAngle = getProperty(arm, 'transform', 'rotateZ(', 'deg)')
        arm.animate(
            [
                { transform: `rotateZ(${currentAngle}deg)` },
                { transform: `rotateZ(${currentAngle + 20}deg)` },
                { transform: `rotateZ(${currentAngle}deg)` },
            ],
            {
                duration: 500,
            },
        )
    }
}
