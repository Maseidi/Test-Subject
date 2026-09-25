import { knockPlayer as knockManagerKnockPlayer } from '../../../knock-manager.js'
import { damagePlayer } from '../../../player-health.js'
import { addAllClasses, addSplatter, removeClass } from '../../../util.js'
import { getNoOffenseCounter } from '../../../variables.js'

export class AbstractOffenceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    hitPlayer() {
        const arm = this.enemy.sprite.firstElementChild.firstElementChild.firstElementChild
        if (getNoOffenseCounter() === 0) addAllClasses(arm, 'attack', 'animation')
        damagePlayer(this.enemy.damage)
        arm.addEventListener('animationend', () => removeClass(arm, 'attack', 'animation'))
        this.knockPlayer()
        addSplatter()
    }

    knockPlayer() {
        const knock = this.enemy.knock
        switch (this.enemy.angleState) {
            case 0:
                knockManagerKnockPlayer('D', knock)
                break
            case 1:
            case 2:
            case 3:
                knockManagerKnockPlayer('L', knock)
                break
            case 4:
                knockManagerKnockPlayer('U', knock)
                break
            case 5:
            case 6:
            case 7:
                knockManagerKnockPlayer('R', knock)
                break
        }
    }
}
