import { getCurrentRoomSolid, setCurrentRoomSolid } from '../../../elements.js'
import { getEnemies } from '../../../entities.js'
import { getGunDetail, isGun } from '../../../gun-details.js'
import { knockEnemy } from '../../../knock-manager.js'
import { spawnPowerUp } from '../../../room-loader.js'
import {
    addAllClasses,
    addClass,
    createAndAddClass,
    removeAllClasses,
    removeClass,
    useDeltaTime,
} from '../../../util.js'
import {
    getAnimatedElements,
    getCriticalChance,
    getCurrentRoomId,
    setAnimatedElements,
} from '../../../variables.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
        this.enemy.damagedCounter = 0
    }

    damageEnemy(name, damage, knock = false) {
        let colorMatch = false
        if (isGun(name)) {
            colorMatch = this.enemy.virus === getGunDetail(name, 'antivirus')
            damage *= colorMatch ? 10 : 0.1
        }
        const critical = Math.random() <= getCriticalChance()
        if (critical) damage *= 2
        this.addDamagePopup(damage, critical, colorMatch)
        this.enemy.health = Math.max(0, this.enemy.health - damage)
        if (this.enemy.health <= 0) this.killEnemy()
        else {
            if (knock && !this.enemy.knockImmune) knockEnemy(this.enemy, knock)
            addClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
            this.enemy.damagedCounter = 1
        }
    }

    addDamagePopup(damage, critical, colorMatch) {
        const damageElement = createAndAddClass('p', 'enemy-damage-container')
        if (critical) addClass(damageElement, 'critical')
        if (colorMatch) {
            damageElement.style.color = this.enemy.virus
            if (this.enemy.virus === 'yellow') addClass(damageElement, 'yellow')
        }
        damageElement.textContent = Math.max(1, Math.floor(damage))
        addAllClasses(damageElement, `enemy-damage-container-${Math.ceil(Math.random() * 6)}`, 'animation')
        this.enemy.sprite.append(damageElement)
        damageElement.addEventListener('animationend', () => damageElement.remove(), { once: true })
    }

    killEnemy() {
        if (this.enemy.spawnState === 'dead') return
        this.enemy.health = 0
        this.enemy.spawnState = 'dead'
        const roomEnemies = getEnemies().get(getCurrentRoomId())
        if (roomEnemies[this.enemy.index]) {
            roomEnemies[this.enemy.index].health = 0
            roomEnemies[this.enemy.index].spawnState = 'dead'
        }
        setCurrentRoomSolid(
            getCurrentRoomSolid().filter(solid => solid !== this.enemy.sprite.firstElementChild),
        )
        if (Math.random() < 0.01) {
            const type = Math.random() < 0.5 ? 'health' : 'ammo'
            spawnPowerUp(type, this.enemy.x, this.enemy.y)
        }
        this.deathAnimation()
        this.enemy.sprite.style.zIndex = '34'
    }

    deathAnimation() {
        addAllClasses(this.enemy.sprite, 'dead', 'animation')
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        removeAllClasses(body, 'body-transition', 'no-transition')
        Array.from(body.children).forEach(limb => {
            const animation = limb.animate(
                [{ transform: 'rotateZ(0deg)' }, { transform: `rotateZ(${Math.floor(Math.random() * 360 - 180)}deg)` }],
                { duration: 500, fill: 'forwards' },
            )
            setAnimatedElements([...getAnimatedElements(), animation])
            animation.addEventListener(
                'finish',
                () => setAnimatedElements(getAnimatedElements().filter(item => item !== animation)),
                { once: true },
            )
        })
    }

    manageDamagedMode() {
        if (this.enemy.damagedCounter === 0) return
        this.enemy.damagedCounter++
        if (this.enemy.damagedCounter < useDeltaTime(6)) return
        removeClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
        this.enemy.damagedCounter = 0
    }
}
