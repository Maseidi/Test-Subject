import { addAllClasses, addClass, removeClass } from '../../../util.js'
import { getNoOffenseCounter } from '../../../variables.js'
import { damagePlayer, infectPlayer2SpecificVirus } from '../../../player-health.js'

export class AbstractOffenceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    hitPlayer() {
        const arm = this.enemy.sprite.firstElementChild.firstElementChild.firstElementChild
        if ( getNoOffenseCounter() === 0 ) addAllClasses(arm, 'attack', 'animation')
        damagePlayer(this.enemy.damage)
        arm.addEventListener('animationend', () => removeClass(arm, 'attack', 'animation'))
        this.infectPlayer()
    }

    infectPlayer() {
        infectPlayer2SpecificVirus(this.enemy.virus)
    }

}