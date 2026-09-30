import { getCurrentRoomEnemies, getPlayer } from '../../../elements.js'
import { getRooms } from '../../../entities.js'
import { distance, getProperty } from '../../../util.js'
import {
    getAimMode,
    getCurrentRoomId,
    getDownPressed,
    getLeftPressed,
    getNoOffenseCounter,
    getPlayerSpeed,
    getPlayerX,
    getPlayerY,
    getRightPressed,
    getRoomLeft,
    getRoomTop,
    getSprint,
    getUpPressed,
} from '../../../variables.js'
import { CHASE, GO_FOR_RANGED, GRAB, NO_OFFENCE, STAND_AND_WATCH, STUNNED, TRACKER } from '../../enemy-constants.js'
import { hasLineOfSight } from './path-finding.js'

const projectedPlayerDestination = (playerX, playerY, room) => {
    let directionX = Number(getRightPressed()) - Number(getLeftPressed())
    let directionY = Number(getDownPressed()) - Number(getUpPressed())
    if (!directionX && !directionY) return null
    if (directionX && directionY) {
        directionX /= Math.SQRT2
        directionY /= Math.SQRT2
    }

    const movementMultiplier = (getSprint() ? 2 : 1) * (getAimMode() ? 1 / 3 : 1)
    const lookAhead = Math.min(450, Math.max(160, getPlayerSpeed() * movementMultiplier * 45))
    const x = playerX + directionX * lookAhead
    const y = playerY + directionY * lookAhead
    const centerX = x + 17
    const centerY = y + 17

    if (x < 20 || y < 20 || x + 34 > room.width - 20 || y + 34 > room.height - 20) return null
    if (!hasLineOfSight(playerX + 17, playerY + 17, centerX, centerY, 18)) return null
    return { x, y }
}

export class AbstractNotificationService {
    constructor(enemy) {
        this.enemy = enemy
    }

    updateDestination2Player() {
        const playerX = getPlayerX() - getRoomLeft()
        const playerY = getPlayerY() - getRoomTop()
        const room = getRooms().get(getCurrentRoomId())
        const projected = projectedPlayerDestination(playerX, playerY, room)
        let target = { x: playerX, y: playerY }

        if (projected) {
            const enemyCenterX = this.enemy.x + (this.enemy.sprite?.offsetWidth || 40) / 2
            const enemyCenterY = this.enemy.y + (this.enemy.sprite?.offsetHeight || 40) / 2
            const playerDistance = Math.hypot(playerX + 17 - enemyCenterX, playerY + 17 - enemyCenterY)
            const projectedDistance = Math.hypot(projected.x + 17 - enemyCenterX, projected.y + 17 - enemyCenterY)
            if (projectedDistance < playerDistance) target = projected
        }

        this.updateDestination(target.x, target.y, 34)
    }

    updateDestination2Path(path) {
        this.updateDestination(getProperty(path, 'left', 'px'), getProperty(path, 'top', 'px'), 10)
    }

    updateDestination(x, y, width) {
        this.enemy.destX = x
        this.enemy.destY = y
        this.enemy.destWidth = width
    }

    notifyEnemy(range) {
        if ([STUNNED, STAND_AND_WATCH, GRAB].includes(this.enemy.state)) return
        if (distance(getPlayer(), this.enemy.sprite) > range) return
        this.switch2ChaseMode()
        this.updateDestination2Player()
        this.notifyNearbyEnemies()
    }

    switch2ChaseMode() {
        if (this.enemy.state === GO_FOR_RANGED) return
        this.enemy.state = getNoOffenseCounter() === 0 ? CHASE : NO_OFFENCE
    }

    notifyNearbyEnemies() {
        getCurrentRoomEnemies()
            .filter(
                enemy =>
                    enemy !== this.enemy &&
                    ![CHASE, NO_OFFENCE, GO_FOR_RANGED].includes(enemy.state) &&
                    enemy.type !== TRACKER &&
                    distance(this.enemy.sprite, enemy.sprite) < 500,
            )
            .forEach(enemy => enemy.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER))
    }
}
