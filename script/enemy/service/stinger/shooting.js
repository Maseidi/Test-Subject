import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import { getPredictedShot } from '../../../player-targeting.js'
import {
    addAllAttributes,
    angleOf2Points,
    createAndAddClass,
    getProperty,
    getSpeedPerFrame,
    useDeltaTime,
} from '../../../util.js'
import { RangerShootingService } from '../ranger/shooting.js'

export class StingerShootingService extends RangerShootingService {
    constructor(enemy) {
        super(enemy)
        this.relativeFireRate = 50
    }

    shoot() {
        const { x: srcX, y: srcY } = {
            x: getProperty(this.enemy.sprite, 'left', 'px') + 25,
            y: getProperty(this.enemy.sprite, 'top', 'px') + 25,
        }
        const bulletSpeed = getSpeedPerFrame(10)
        const { speedX, speedY } = getPredictedShot(srcX, srcY, bulletSpeed)
        const bullet = createAndAddClass('div', 'stinger-bullet')
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
        bullet.style.backgroundColor = `rgb(177,151,5)`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }
}
