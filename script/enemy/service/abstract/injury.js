import { enemies } from '../../util/enemies.js'
import { getPlayer } from '../../../elements.js'
import { dropLoot } from '../../../loot-manager.js'
import { getCurrentRoomId } from '../../../variables.js'
import { getSpecification, getStat } from '../../../weapon-specs.js'
import { addAttribute, addClass, removeClass } from '../../../util.js'

export class AbstractInjuryService {
    constructor(enemy) {
        this.enemy = enemy
    }

    damageEnemy(equipped) {
        let damage = getStat(equipped.name, 'damage', equipped.damagelvl)
        if ( this.enemy.virus === getSpecification(equipped.name, 'antivirus') ) damage *= 1.2
        if ( Math.random() < 0.01 ) damage *= (Math.random() + 1)
        const enemyHealth = this.enemy.health
        const newHealth = enemyHealth - damage
        this.enemy.health = newHealth
        if ( newHealth <= 0 ) {
            addAttribute(this.enemy.htmlTag, 'left', Number(this.enemy.htmlTag.style.left.replace('px', '')))
            addAttribute(this.enemy.htmlTag, 'top', Number(this.enemy.htmlTag.style.top.replace('px', '')))
            dropLoot(this.enemy.htmlTag)
            const enemiesCopy = enemies.get(getCurrentRoomId())
            enemiesCopy[this.enemy.index].health = 0
            return
        }
        const knockback = getSpecification(equipped.name, 'knockback')
        this.knockEnemy(knockback)
        addClass(this.enemy.htmlTag.firstElementChild.firstElementChild, 'damaged')
        this.enemy.damagedCounter = 6
    }

    knockEnemy(knockback) {
        const enemyBound = this.enemy.htmlTag.getBoundingClientRect()
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
        this.enemy.htmlTag.style.left = `${this.enemy.x}px`
        this.enemy.htmlTag.style.top = `${this.enemy.y}px`
    }

    manageDamagedState() {
        if ( this.enemy.damagedCounter === 0 ) {
            removeClass(this.enemy.htmlTag.firstElementChild.firstElementChild, 'damaged')
            return
        }
        this.enemy.damagedCounter -= 1
    }

}