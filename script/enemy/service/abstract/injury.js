import { enemies } from '../../util/enemies.js'
import { getPlayer } from '../../../elements.js'
import { dropLoot } from '../../../loot-manager.js'
import { CHASE } from '../../util/enemy-constants.js'
import { getCurrentRoomId } from '../../../variables.js'
import { addAllAttributes, addClass, removeClass } from '../../../util.js'
import { getWeaponDetail, getWeaponUpgradableDetail } from '../../../weapon-details.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
    }

    damageEnemy(equipped) {
        let damage = getWeaponUpgradableDetail(equipped.name, 'damage', equipped.damagelvl)
        if ( this.enemy.virus === getWeaponDetail(equipped.name, 'antivirus') ) damage *= 1.2
        if ( Math.random() < 0.01 ) damage *= (Math.random() + 1)
        const enemyHealth = this.enemy.health
        const newHealth = enemyHealth - damage
        this.enemy.health = newHealth
        if ( newHealth <= 0 ) {
            addAllAttributes(
                this.enemy.sprite, 
                'left', Number(this.enemy.sprite.style.left.replace('px', '')), 
                'top', Number(this.enemy.sprite.style.top.replace('px', ''))
            )
            dropLoot(this.enemy.sprite)
            enemies.get(getCurrentRoomId())[this.enemy.index].health = 0
            return
        }
        const knockback = getWeaponDetail(equipped.name, 'knockback')
        this.knockEnemy(knockback)
        addClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
        this.enemy.damagedCounter = 6
        this.enemy.state = CHASE
    }

    knockEnemy(knockback) {
        const enemyBound = this.enemy.sprite.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        let xAxis, yAxis
        if ( enemyBound.left < playerBound.left ) xAxis = -1
        else if ( enemyBound.left >= playerBound.left && enemyBound.right <= playerBound.right ) xAxis = 0
        else xAxis = 1
        if ( enemyBound.bottom < playerBound.top ) yAxis = -1
        else if ( enemyBound.bottom >= playerBound.top && enemyBound.top <= playerBound.bottom ) yAxis = 0
        else yAxis = 1
        this.enemy.x += (xAxis * knockback)
        this.enemy.y += (yAxis * knockback)
        this.enemy.sprite.style.left = `${this.enemy.x}px`
        this.enemy.sprite.style.top = `${this.enemy.y}px`
    }

    manageDamagedState() {
        if ( this.enemy.damagedCounter === 0 ) {
            removeClass(this.enemy.sprite.firstElementChild.firstElementChild, 'damaged')
            return
        }
        this.enemy.damagedCounter -= 1
    }

}