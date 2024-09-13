import { getHealthStatusContainer } from '../../../elements.js'
import { getNoOffenseCounter, setInfection } from '../../../variables.js'
import { addClass, createAndAddClass, removeClass } from '../../../util.js'
import { damagePlayer, findHealtStatusChildByClassName } from '../../../player-health.js'

export class AbstractOffenceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    hitPlayer() {
        const arm = this.enemy.sprite.firstElementChild.firstElementChild.firstElementChild
        if ( getNoOffenseCounter() === 0 ) addClass(arm, 'attack')
        damagePlayer(this.enemy.damage)
        arm.addEventListener('animationend', () => removeClass(arm, 'attack'))
        this.infectPlayer()
    }

    infectPlayer() {
        // TODO: Fix later
        if ( Math.random() > 1 || findHealtStatusChildByClassName('infected-container') ) return
        const infectionContainer = createAndAddClass('div', 'infected-container')
        const virusIcon = document.createElement('img')
        virusIcon.src = `/assets/images/${this.enemy.virus}virus.png`
        infectionContainer.append(virusIcon)
        getHealthStatusContainer().append(infectionContainer)
        setInfection(this.enemy.virus)
    }

}