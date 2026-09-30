import { getCurrentRoom, getCurrentRoomBullets, getHealthStatusContainer } from '../../elements.js'
import { getRooms } from '../../entities.js'
import { damagePlayer } from '../../player-health.js'
import { addAllAttributes, createAndAddClass, getSpeedPerFrame } from '../../util.js'
import { getCurrentRoomId, getGrabbed, getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../variables.js'
import { AbstractEnemy } from './abstract-enemy.js'
import { moveEnemyWithCollisions } from '../service/abstract/movement.js'

export class CampaignBoss extends AbstractEnemy {
    constructor(level, waypoint, virus) {
        const maxHealth = Math.floor(20000 * level)
        super('campaign-boss', 1, waypoint, maxHealth, 8 * level, 4, 0, 4, virus, level, 0)
        this.maxHealth = maxHealth
        this.knockImmune = true
        this.phase = 1
        this.mode = 0
        this.modeUntil = 0
        this.directionX = 1
        this.directionY = 1
        this.shotTime = 0
        this.spin = 0
        this.contactTime = 0
    }

    behave() {
        if (this.health <= 0) {
            this.updateHealthBar()
            return
        }
        this.injuryService.manageDamagedMode()
        this.phase = this.health <= this.maxHealth / 3 ? 3 : this.health <= (this.maxHealth * 2) / 3 ? 2 : 1
        this.updateHealthBar()
        if (getGrabbed()) return
        const now = performance.now()
        if (now >= this.modeUntil) {
            this.mode = (this.mode + 1) % 3
            this.modeUntil = now + 8000
        }
        this.move(now)
        if (now >= this.shotTime) {
            this.fire()
            this.shotTime = now + [0, 1600, 1250, 1000][this.phase]
        }
    }

    updateHealthBar() {
        let root = document.querySelector('.campaign-boss-health')
        if (!root) {
            root = createAndAddClass('div', 'campaign-boss-health')
            const track = createAndAddClass('div', 'campaign-boss-health-track')
            track.append(createAndAddClass('div', 'campaign-boss-health-fill'))
            root.append(track)
            getHealthStatusContainer().append(root)
        }
        root.querySelector('.campaign-boss-health-fill').style.width = `${(Math.max(0, this.health) / this.maxHealth) * 100}%`
        root.classList.toggle('defeated', this.health <= 0)
    }

    move(now) {
        const room = getRooms().get(getCurrentRoomId())
        this.notificationService.updateDestination2Player()
        this.pathFindingService.findPath()
        const followingPath = Number.isFinite(this.pathFindingX)
        const targetX = followingPath ? this.pathFindingX + 45 : this.destX + this.destWidth / 2
        const targetY = followingPath ? this.pathFindingY + 45 : this.destY + this.destWidth / 2
        const playerX = getPlayerX() - getRoomLeft() + 17
        const playerY = getPlayerY() - getRoomTop() + 17
        const centerX = this.x + 45
        const centerY = this.y + 45
        const playerDistance = Math.hypot(playerX - centerX, playerY - centerY) || 1
        if (playerDistance <= 76) {
            if (now >= this.contactTime) {
                damagePlayer(this.damage)
                this.contactTime = now + 900
            }
            return
        }
        const targetDistance = Math.hypot(targetX - centerX, targetY - centerY) || 1
        const speed = getSpeedPerFrame([0, 2.4, 3.6, 4.8][this.phase])
        let dx = 0
        let dy = 0
        if (this.mode === 0) {
            dx = ((targetX - centerX) / targetDistance) * speed
            dy = ((targetY - centerY) / targetDistance) * speed
        } else if (this.mode === 1) {
            if (Math.abs(targetX - centerX) > Math.abs(targetY - centerY)) dx = Math.sign(targetX - centerX) * speed
            else dy = Math.sign(targetY - centerY) * speed
        } else {
            dx = this.directionX * speed * 0.707
            dy = this.directionY * speed * 0.707
        }
        const boundedX = Math.max(20, Math.min(room.width - 110, this.x + dx)) - this.x
        const boundedY = Math.max(20, Math.min(room.height - 110, this.y + dy)) - this.y
        const moved = moveEnemyWithCollisions(this, boundedX, boundedY)
        if (this.mode === 2 && !moved.movedX) this.directionX *= -1
        if (this.mode === 2 && !moved.movedY) this.directionY *= -1
    }

    fire() {
        const x = this.x + 45
        const y = this.y + 45
        const target = Math.atan2(getPlayerY() - getRoomTop() - y, getPlayerX() - getRoomLeft() - x)
        const count = 5 + this.phase * 2
        for (let index = 0; index < count; index++)
            this.bullet(x, y, target + (index - (count - 1) / 2) * 0.18 + this.spin)
        this.spin = (this.spin + 0.08) % (Math.PI * 2)
    }

    bullet(x, y, angle) {
        const bullet = createAndAddClass('div', 'campaign-boss-bullet')
        const speed = getSpeedPerFrame(4 + this.phase * 1.5)
        addAllAttributes(
            bullet,
            'speed-x',
            Math.cos(angle) * speed,
            'speed-y',
            Math.sin(angle) * speed,
            'damage',
            8 + this.phase * 4,
        )
        bullet.style.left = `${x}px`
        bullet.style.top = `${y}px`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
    }
}
