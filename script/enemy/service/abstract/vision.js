import { getPlayer } from '../../../elements.js'
import { distance, useDeltaTime } from '../../../util.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'
import { findBlockingWall } from './path-finding.js'

export class AbstractVisionService {
    constructor(enemy) {
        this.enemy = enemy
        this.visionCounter = 0
    }

    playerSpotted() {
        const visible = this.isPlayerVisible()
        if (visible) this.enemy.notificationService.switch2ChaseMode()
        return visible
    }

    look4Player() {
        this.getWallInTheWay()
        this.vision2Player()
    }

    getWallInTheWay() {
        this.visionCounter++
        if (this.visionCounter < useDeltaTime(4)) return
        this.visionCounter = 0
        if (distance(this.enemy.sprite, getPlayer()) > this.enemy.vision) {
            this.enemy.wallInTheWay = 'out-of-range'
            return
        }
        const x1 = this.enemy.x + this.enemy.sprite.offsetWidth / 2
        const y1 = this.enemy.y + this.enemy.sprite.offsetHeight / 2
        const x2 = getPlayerX() - getRoomLeft() + 17
        const y2 = getPlayerY() - getRoomTop() + 17
        this.enemy.wallInTheWay = findBlockingWall(x1, y1, x2, y2, 2) || false
    }

    vision2Player() {
        const vision = this.enemy.sprite.firstElementChild.children[1]
        vision.style.transform = `rotateZ(${this.enemy.angleService.angle2Player()}deg)`
    }

    isPlayerVisible() {
        return this.enemy.wallInTheWay === false
    }
}
