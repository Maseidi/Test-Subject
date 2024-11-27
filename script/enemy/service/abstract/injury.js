import { getEnemies } from '../../../entities.js'
import { isGun } from '../../../gun-details.js'
import { dropLoot } from '../../../loot-manager.js'
import { CHASE, STUNNED } from '../../enemy-constants.js'
import { getCurrentRoomInteractables, setCurrentRoomInteractables } from '../../../elements.js'
import { getAnimatedLimbs, getCriticalChance, getCurrentRoomId, setAnimatedLimbs } from '../../../variables.js'
import { 
    addAllAttributes,
    addAllClasses,
    addClass,
    containsClass,
    createAndAddClass,
    removeAllClasses,
    removeClass } from '../../../util.js'
import { 
    activateAllProgresses,
    deactivateAllProgresses,
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
        if ( isGun(name) && this.enemy.virus === antivirus ) {
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
        damageEl.textContent = Math.floor(damage)
        addAllClasses(damageEl, `enemy-damage-container-${Math.ceil(Math.random() * 6)}`, 'animation')
        this.enemy.sprite.append(damageEl)
        damageEl.addEventListener('animationend', () => damageEl.remove())
    }

    killEnemy() {
        addAllAttributes(
            this.enemy.sprite, 
            'left', Number(this.enemy.sprite.style.left.replace('px', '')), 
            'top', Number(this.enemy.sprite.style.top.replace('px', ''))
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
            if ( containsClass(limb, 'fire') ) limb.style.opacity = 0
            const animatedLimb = limb.animate([
                {transform: 'rotateZ(0deg)'},
                {transform: `rotateZ(${Math.floor((Math.random() * 360) - 180)}deg)`}
            ], {
                duration: 500,
                fill: 'forwards'
            })
            addClass(limb, 'animation')
            setAnimatedLimbs([...getAnimatedLimbs(), animatedLimb])
            animatedLimb.addEventListener('finish', () => {
                setAnimatedLimbs(getAnimatedLimbs().filter(elem => elem !== animatedLimb))                
            })
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