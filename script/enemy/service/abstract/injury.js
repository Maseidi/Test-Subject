import { enemies } from '../../util/enemies.js'
import { dropLoot } from '../../../loot-manager.js'
import { CHASE, STUNNED } from '../../util/enemy-constants.js'
import { getWeaponDetail, isWeapon } from '../../../weapon-details.js'
import { getCriticalChance, getCurrentRoomId } from '../../../variables.js'
import { addAllAttributes, addClass, containsClass, createAndAddClass, getEquippedItemDetail, removeClass } from '../../../util.js'
import { activateProgress, updateKillAllDoors, updateKillAllEnemies, updateKillAllInteractables } from '../../../progress-manager.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
        this.enemy.explosionCounter = 0
        this.enemy.damagedCounter = 0
    }

    damageEnemy(equipped) {
        const name = equipped.name
        let damage = getEquippedItemDetail(equipped, 'damage')
        if ( isWeapon(name) && this.enemy.virus === getWeaponDetail(name, 'antivirus') ) {
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
        addClass(damageEl, `enemy-damage-container-${Math.ceil(Math.random() * 4)}`)
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
        updateKillAllDoors()
        updateKillAllInteractables()
        updateKillAllEnemies()
    }

    deathAnimation() {
        addClass(this.enemy.sprite, 'dead')
        const body = this.enemy.sprite.firstElementChild.firstElementChild
        removeClass(body, 'body-transition')
        body.style.transform = `rotateZ(${(Math.random() * 5) - 10}deg)`
        Array.from(body.children).forEach(limb => {
            if ( Math.random() < 0.5 || containsClass(limb, 'fire') ) limb.style.opacity = 0    
            limb.style.transform = `
                translateX(${(Math.random() * 5) - 10}px) 
                translateY(${(Math.random() * 5) - 10}px) 
                rotateZ(${(Math.random() * 5) - 10}deg)
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