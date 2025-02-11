import {
    getCurrentRoomEnemies,
    getCurrentRoomInteractables,
    setCurrentRoomEnemies,
    setCurrentRoomInteractables,
} from '../../../elements.js'
import { getEnemies } from '../../../entities.js'
import { isGun } from '../../../gun-details.js'
import { knockEnemy } from '../../../knock-manager.js'
import { dropLoot } from '../../../loot-manager.js'
import {
    activateAllProgresses,
    deactivateAllProgresses,
    updateKillAllDoors,
    updateKillAllEnemies,
    updateKillAllInteractables,
} from '../../../progress-manager.js'
import { endChaos } from '../../../survival/chaos-manager.js'
import {
    getCurrentChaosEnemies,
    getCurrentChaosSpawned,
    getEnemiseKilled,
    setEnemiesKilled,
} from '../../../survival/variables.js'
import {
    addAllAttributes,
    addAllClasses,
    addClass,
    containsClass,
    createAndAddClass,
    removeAllClasses,
    removeClass,
    useDeltaTime,
} from '../../../util.js'
import {
    getAnimatedElements,
    getCriticalChance,
    getCurrentRoomId,
    getIsSurvival,
    setAnimatedElements,
} from '../../../variables.js'
import { CHASE, STUNNED } from '../../enemy-constants.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
        this.enemy.damagedCounter = 0
    }

    damageEnemy(name, damage, antivirus, knock = false) {
        if (isGun(name) && this.enemy.virus === antivirus) {
            damage *= 1.2
            var sameVirus = this.enemy.virus
        }
        if (Math.random() <= getCriticalChance()) {
            damage *= 2
            var critical = true
        }
        this.addDamagePopup(damage, critical, sameVirus)
        const enemyHealth = this.enemy.health
        const newHealth = enemyHealth - damage
        this.enemy.health = newHealth
        if (newHealth <= 0) this.killEnemy()
        else {
            if (knock) knockEnemy(this.enemy, knock)
            addClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
            this.enemy.damagedCounter = 1
            if (this.enemy.state === STUNNED) this.enemy.state = CHASE
        }
    }

    addDamagePopup(damage, critical, virus) {
        const damageEl = createAndAddClass('p', 'enemy-damage-container')
        if (critical) addClass(damageEl, 'critical')
        if (virus) damageEl.style.color = virus
        if (virus === 'yellow') addClass(damageEl, 'yellow')
        damageEl.textContent = Math.floor(damage)
        addAllClasses(damageEl, `enemy-damage-container-${Math.ceil(Math.random() * 6)}`, 'animation')
        this.enemy.sprite.append(damageEl)
        damageEl.addEventListener('animationend', () => damageEl.remove())
    }

    killEnemy() {
        addAllAttributes(
            this.enemy.sprite,
            'left',
            Number(this.enemy.sprite.style.left.replace('px', '')),
            'top',
            Number(this.enemy.sprite.style.top.replace('px', '')),
        )
        dropLoot(this.enemy.sprite, true)
        this.deathAnimation()
        getEnemies().get(getCurrentRoomId())[this.enemy.index].health = 0
        activateAllProgresses(this.enemy.progress2Active)
        deactivateAllProgresses(this.enemy.progress2Deactive)
        updateKillAllEnemies()
        updateKillAllDoors()
        updateKillAllInteractables()
        this.removePopup()
        this.enemy.sprite.style.zIndex = '34'
        if (getIsSurvival()) {
            setEnemiesKilled(getEnemiseKilled() + 1)
            setCurrentRoomEnemies(getCurrentRoomEnemies().filter(enemy => enemy !== this.enemy))
        }
        if (
            getIsSurvival() &&
            getCurrentChaosEnemies() === getCurrentChaosSpawned() &&
            getEnemiseKilled() === getCurrentChaosEnemies()
        ) {
            endChaos()
        }
    }

    removePopup() {
        const backwardDetector = this.enemy.sprite.firstElementChild.lastElementChild
        setCurrentRoomInteractables(getCurrentRoomInteractables().filter(int => int !== backwardDetector))
        backwardDetector.remove()
    }

    deathAnimation() {
        addAllClasses(this.enemy.sprite, 'dead', 'animation')
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        removeAllClasses(body, 'body-transition', 'no-transition')
        Array.from(body.children).forEach(limb => {
            if (containsClass(limb, 'fire')) limb.style.opacity = 0
            const animatedLimb = limb.animate(
                [{ transform: 'rotateZ(0deg)' }, { transform: `rotateZ(${Math.floor(Math.random() * 360 - 180)}deg)` }],
                {
                    duration: 500,
                    fill: 'forwards',
                },
            )
            addClass(limb, 'animation')
            setAnimatedElements([...getAnimatedElements(), animatedLimb])
            animatedLimb.addEventListener('finish', () => {
                setAnimatedElements(getAnimatedElements().filter(elem => elem !== animatedLimb))
            })
        })
    }

    manageDamagedMode() {
        if (this.enemy.damagedCounter === 0) return
        this.enemy.damagedCounter += 1
        if (this.enemy.damagedCounter < useDeltaTime(6)) return
        removeClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
        this.enemy.damagedCounter = 0
    }
}
