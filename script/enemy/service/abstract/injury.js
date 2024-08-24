import { enemies } from '../../util/enemies.js'
import { dropLoot } from '../../../loot-manager.js'
import { CHASE, STUNNED } from '../../util/enemy-constants.js'
import { getWeaponDetail, isWeapon } from '../../../weapon-details.js'
import { getCriticalChance, getCurrentRoomId } from '../../../variables.js'
import { activateProgress, updateKillAllDoors, updateKillAllInteractables } from '../../../progress.js'
import { addAllAttributes, addClass, getEquippedItemDetail, removeClass } from '../../../util.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
        this.enemy.explosionCounter = 0
        this.enemy.damagedCounter = 0
    }

    damageEnemy(equipped) {        
        const name = equipped.name
        let damage = getEquippedItemDetail(equipped, 'damage')
        if ( isWeapon(name) && this.enemy.virus === getWeaponDetail(name, 'antivirus') ) damage *= 1.2
        if ( Math.random() <= getCriticalChance() ) damage *= 2
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

    killEnemy() {
        addAllAttributes(
            this.enemy.sprite, 
            'left', Number(this.enemy.sprite.style.left.replace('px', '')), 
            'top', Number(this.enemy.sprite.style.top.replace('px', ''))
        )
        dropLoot(this.enemy.sprite)
        enemies.get(getCurrentRoomId())[this.enemy.index].health = 0
        activateProgress(this.enemy.progress2Active)
        updateKillAllDoors()
        updateKillAllInteractables()
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