import { enemies } from '../../util/enemies.js'
import { dropLoot } from '../../../loot-manager.js'
import { isWeapon } from '../../../weapon-details.js'
import { CHASE, STUNNED } from '../../util/enemy-constants.js'
import { getCriticalChance, getCurrentRoomId } from '../../../variables.js'
import { addAllAttributes, addClass, containsClass, createAndAddClass, removeClass } from '../../../util.js'
import { 
    activateProgress,
    deactivateProgress,
    updateKillAllDoors,
    updateKillAllEnemies,
    updateKillAllInteractables } from '../../../progress-manager.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
        this.enemy.explosionCounter = 0
        this.enemy.damagedCounter = 0
    }

    damageEnemy(name, damage, antivirus) {
        if ( isWeapon(name) && this.enemy.virus === antivirus ) {
            damage *= 1.2
            var sameVirus = this.enemy.virus
        }
        if ( Math.random() <= getCriticalChance() ) {
            damage *= 2
            var critical = true
        }
        this.addDamagePopup(damage, critical, sameVirus)
        const enemyHealth = this.enemy.health
        const newHealth = enemyHealth - damage
        this.enemy.health = newHealth
        if ( newHealth <= 0 ) this.killEnemy()
        else {
            addClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
            this.enemy.damagedCounter = 1
            if ( this.enemy.state === STUNNED ) this.enemy.state = CHASE
        }
    }

    addDamagePopup(damage, critical, virus) {
        const damageEl = createAndAddClass('p', 'enemy-damage-container')
        if ( critical ) addClass(damageEl, 'critical')
        if ( virus ) damageEl.style.color = virus
        if ( virus === 'yellow' ) addClass(damageEl, 'yellow')
        damageEl.textContent = damage
        addClass(damageEl, `enemy-damage-container-${Math.ceil(Math.random() * 6)}`)
        this.enemy.sprite.append(damageEl)
        setTimeout(() => damageEl.remove(), 1000)
    }

    killEnemy() {
        addAllAttributes(
            this.enemy.sprite, 
            'left', Number(this.enemy.sprite.style.left.replace('px', '')), 
            'top', Number(this.enemy.sprite.style.top.replace('px', ''))
        )
        dropLoot(this.enemy.sprite, true)
        this.deathAnimation()
        enemies.get(getCurrentRoomId())[this.enemy.index].health = 0
        activateProgress(this.enemy.progress2Active)
        deactivateProgress(this.enemy.progress2Deactive)
        updateKillAllDoors()
        updateKillAllInteractables()
        updateKillAllEnemies()
    }

    deathAnimation() {
        addClass(this.enemy.sprite, 'dead')
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        removeClass(body, 'body-transition')
        this.enemy.sprite.style.transform = `rotateZ(${(Math.random() * 5) - 15}deg)`
        Array.from(body.children).forEach(limb => {
            if ( containsClass(limb, 'fire') ) limb.style.opacity = 0
            limb.style.transformOrigin = 'top'
            limb.style.transform = `
                translateX(${Math.floor(Math.random() * 5) - 15}px)
                translateY(${Math.floor(Math.random() * 5) - 15}px)
                rotateZ(${Math.floor(Math.random() * 90) - 270}deg)
                `
        })
    }

    manageDamagedMode() {
        if ( this.enemy.damagedCounter === 0 ) return
        this.enemy.damagedCounter += 1
        if ( this.enemy.damagedCounter !== 6 ) return
        removeClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
        this.enemy.damagedCounter = 0
    }

    manageExplosionMode() {
        if ( this.enemy.explosionCounter === 0 ) return
        this.enemy.explosionCounter += 1
        if ( this.enemy.explosionCounter === 100 ) this.enemy.explosionCounter = 0
    }

}