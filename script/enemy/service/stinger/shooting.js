import { RangerShootingService } from '../ranger/shooting.js'
import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'
import { addAttribute, angleOf2Points, calculateBulletSpeed, createAndAddClass, getProperty } from '../../../util.js'

export class StingerShootingService extends RangerShootingService {
    constructor(enemy) {
        super(enemy)
        this.fireRate = 50
    }

    shoot() {
        const { x: srcX, y: srcY } = { 
            x: getProperty(this.enemy.htmlTag, 'left', 'px') + 25, 
            y: getProperty(this.enemy.htmlTag, 'top', 'px') + 25 
        }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOf2Points(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX, 10)
        const bullet = createAndAddClass('div', 'stinger-bullet')
        addAttribute(bullet, 'speed-x', speedX)
        addAttribute(bullet, 'speed-y', speedY)
        addAttribute(bullet, 'damage', this.enemy.damage)
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `rgb(177,151,5)`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }

}