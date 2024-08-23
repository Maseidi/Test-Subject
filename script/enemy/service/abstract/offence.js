import { addClass } from '../../../util.js'
import { damagePlayer } from '../../../player-health.js'

export class AbstractOffenceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    hitPlayer() {
        addClass(this.enemy.sprite.firstElementChild.firstElementChild.firstElementChild, 'attack')
        damagePlayer(this.enemy.damage)
    }

}