import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import {
    addAllAttributes,
    angleOf2Points,
    calculateBulletSpeed,
    createAndAddClass,
    getProperty,
    getSpeedPerFrame,
    useDeltaTime,
} from '../../../util.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'
import { RangerShootingService } from '../ranger/shooting.js'

export class StingerShootingService extends RangerShootingService {
    constructor(enemy) {
        super(enemy)
        this.fireRate = useDeltaTime(50)
    }

    shoot() {
        const { x: srcX, y: srcY } = {
            x: getProperty(this.enemy.sprite, 'left', 'px') + 25,
            y: getProperty(this.enemy.sprite, 'top', 'px') + 25,
        }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOf2Points(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX, 10)
        const bullet = createAndAddClass('div', 'stinger-bullet')
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
        bullet.style.backgroundColor = `rgb(177,151,5)`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }
}
