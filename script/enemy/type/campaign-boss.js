import {
    getCurrentRoom,
    getCurrentRoomBullets,
    getCurrentRoomEnemies,
    getCurrentRoomInteractables,
    getCurrentRoomSolid,
    getGrabBar,
    getHealthStatusContainer,
    setCurrentRoomEnemies,
    setCurrentRoomInteractables,
    setCurrentRoomSolid,
} from '../../elements.js'
import { getEnemies } from '../../entities.js'
import { activateAllProgresses } from '../../progress-manager.js'
import { damagePlayer } from '../../player-health.js'
import { addAllAttributes, createAndAddClass, getSpeedPerFrame, removeClass } from '../../util.js'
import { getCurrentRoomId, getGrabbed, getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../variables.js'
import { AbstractEnemy } from './abstract-enemy.js'

const MAX_HEALTH = 50000
const DEFEATED_PROGRESS = '10419'
const phaseFlag = phase => String(10410 + (phase === 1 ? 0 : phase === 2 ? 2 : 4))

export class CampaignBoss extends AbstractEnemy {
    constructor(level, waypoint, loot, progress, virus) {
        super('campaign-boss', 1, waypoint, MAX_HEALTH, 12, 4, 0, 4, loot, progress, virus, null, level, 0)
        this.health = MAX_HEALTH
        this.knockImmune = true
        this.phase = 1
        this.mode = 0
        this.modeUntil = 0
        this.directionX = 1
        this.directionY = 1
        this.shotTime = 0
        this.spin = 0
        this.contactTime = 0
        this.contactUntil = 0
        const originalKill = this.injuryService.killEnemy.bind(this.injuryService)
        this.injuryService.killEnemy = () => {
            removeClass(this.sprite.firstElementChild.firstElementChild, 'damaged')
            this.clearAdds()
            originalKill()
            this.updateHealthBar()
            activateAllProgresses(DEFEATED_PROGRESS)
        }
    }

    behave() {
        if (this.health <= 0) return
        this.injuryService.manageDamagedMode()
        this.updatePhase()
        this.updateHealthBar()
        if (getGrabbed()) return
        const now = performance.now()
        if (now >= this.modeUntil) {
            this.mode = (this.mode + 1 + Math.floor(Math.random() * 2)) % 3
            this.modeUntil = now + 10000 + Math.random() * 10000
        }
        this.move(now)
        if (now < this.contactUntil) return
        if (now >= this.shotTime) {
            this.fire()
            this.shotTime = now + [0, 1600, 1250, 1000][this.phase]
        }
    }

    updatePhase() {
        const next = this.health <= MAX_HEALTH / 3 ? 3 : this.health <= MAX_HEALTH * 2 / 3 ? 2 : 1
        while (this.phase < next) {
            this.phase++
            activateAllProgresses(phaseFlag(this.phase))
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
        root.querySelector('.campaign-boss-health-fill').style.width = `${Math.max(0, this.health) / MAX_HEALTH * 100}%`
        if (this.health <= 0) root.classList.add('defeated')
    }

    clearAdds() {
        for (const enemy of getEnemies().get(getCurrentRoomId())) {
            if (enemy !== this) enemy.health = 0
        }
        const adds = getCurrentRoomEnemies().filter(enemy => enemy !== this)
        for (const add of adds) {
            if (getGrabbed() && add.grabService?.grabBar && add.grabService.grabBar === getGrabBar())
                add.grabService.releasePlayer()
        }
        for (const add of adds) add.sprite?.remove()
        const colliders = new Set(adds.map(add => add.sprite?.firstElementChild))
        setCurrentRoomSolid(getCurrentRoomSolid().filter(solid => !colliders.has(solid)))
        setCurrentRoomInteractables(getCurrentRoomInteractables().filter(int => !adds.some(add => add.sprite?.contains(int))))
        setCurrentRoomEnemies(getCurrentRoomEnemies().filter(enemy => enemy === this))
    }

    move(now) {
        const playerX = getPlayerX() - getRoomLeft() + 17
        const playerY = getPlayerY() - getRoomTop() + 17
        const centerX = this.x + 45
        const centerY = this.y + 45
        const clearance = 76
        const distance = Math.hypot(playerX - centerX, playerY - centerY)
        if (distance <= clearance) {
            if (distance < clearance) this.separateFromPlayer(playerX, playerY, clearance)
            this.contact(now)
            return
        }
        if (now < this.contactUntil) return
        const speed = getSpeedPerFrame([0, 2.4, 3.6, 4.8][this.phase])
        let dx = 0, dy = 0
        if (this.mode === 0) { // Torturer: pursue the player directly.
            dx = (playerX - centerX) / distance * speed
            dy = (playerY - centerY) / distance * speed
        } else if (this.mode === 1) { // Spiker: move on one axis at a time.
            if (Math.abs(playerX - centerX) > Math.abs(playerY - centerY)) dx = Math.sign(playerX - centerX) * speed
            else dy = Math.sign(playerY - centerY) * speed
        } else { // Ricochet diagonally from the room walls.
            dx = this.directionX * speed * 0.707
            dy = this.directionY * speed * 0.707
            if (this.x + dx < 20 || this.x + dx > 900) { this.directionX *= -1; dx *= -1 }
            if (this.y + dy < 20 || this.y + dy > 900) { this.directionY *= -1; dy *= -1 }
        }
        const nextX = Math.max(20, Math.min(900, this.x + dx))
        const nextY = Math.max(20, Math.min(900, this.y + dy))
        if (Math.hypot(playerX - nextX - 45, playerY - nextY - 45) <= clearance) {
            if (this.mode === 2) {
                this.directionX *= -1
                this.directionY *= -1
            }
            this.contact(now)
            return
        }
        this.x = nextX
        this.y = nextY
        this.sprite.style.left = `${this.x}px`
        this.sprite.style.top = `${this.y}px`
    }

    contact(now) {
        this.contactUntil = now + 650
        if (now >= this.contactTime) {
            damagePlayer(this.damage)
            this.contactTime = now + 900
        }
    }

    separateFromPlayer(playerX, playerY, clearance) {
        const candidates = [
            [playerX + clearance - 45, playerY - 45],
            [playerX - clearance - 45, playerY - 45],
            [playerX - 45, playerY + clearance - 45],
            [playerX - 45, playerY - clearance - 45],
        ].filter(([x, y]) => x >= 20 && x <= 900 && y >= 20 && y <= 900)
        candidates.sort(([ax, ay], [bx, by]) =>
            Math.hypot(ax - this.x, ay - this.y) - Math.hypot(bx - this.x, by - this.y))
        if (!candidates.length) return
        ;[this.x, this.y] = candidates[0]
        this.sprite.style.left = `${this.x}px`
        this.sprite.style.top = `${this.y}px`
    }

    fire() {
        const cx = this.x + 45, cy = this.y + 45
        const target = Math.atan2(getPlayerY() - getRoomTop() - cy, getPlayerX() - getRoomLeft() - cx)
        // Alternating aimed fans and rotating spiral arms.
        if (Math.floor(performance.now() / 4000) % 2 === 0) {
            const count = 5 + this.phase * 2
            for (let i = 0; i < count; i++) this.bullet(cx, cy, target + (i - (count - 1) / 2) * 0.18)
        } else {
            const arms = 5 + this.phase
            for (let i = 0; i < arms; i++) this.bullet(cx, cy, this.spin + i * Math.PI * 2 / arms)
            this.spin += 0.24
        }
    }

    bullet(x, y, angle) {
        const bullet = createAndAddClass('div', 'campaign-boss-bullet')
        const speed = getSpeedPerFrame(4 + this.phase * 1.5)
        addAllAttributes(bullet, 'speed-x', Math.cos(angle) * speed, 'speed-y', Math.sin(angle) * speed,
            'damage', 8 + this.phase * 4)
        bullet.style.left = `${x}px`
        bullet.style.top = `${y}px`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
    }
}
