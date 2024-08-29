import { addClass, removeClass } from '../../../util.js'
import { damagePlayer } from '../../../player-health.js'
import { getNoOffenseCounter } from '../../../variables.js'

export class AbstractOffenceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    hitPlayer() {
        const arm = this.enemy.sprite.firstElementChild.firstElementChild.firstElementChild
        if ( getNoOffenseCounter() === 0 ) addClass(arm, 'attack')
        damagePlayer(this.enemy.damage)
        setTimeout(() => removeClass(arm, 'attack'), 2000)
    }

}