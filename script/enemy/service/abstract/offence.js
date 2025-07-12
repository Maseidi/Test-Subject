import { getPopups } from '../../../entities.js'
import { knockPlayer as knockManagerKnockPlayer } from '../../../knock-manager.js'
import { damagePlayer, findHealtStatusChildByClassName, infectPlayer2SpecificVirus } from '../../../player-health.js'
import { Popup } from '../../../popup-manager.js'
import { activateAllProgresses, getProgressValueByNumber } from '../../../progress-manager.js'
import { Progress } from '../../../progress.js'
import { IS_MOBILE } from '../../../script.js'
import { addAllClasses, addClass, addSplatter, removeClass } from '../../../util.js'
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
        this.infectPlayer()
        this.knockPlayer()
        addSplatter()
    }

    infectPlayer() {
        infectPlayer2SpecificVirus(this.enemy.virus)
        if (getProgressValueByNumber(5002) && !getProgressValueByNumber(100000000)) {
            getPopups().push(
                new Popup(() => {
                    const infectedContainer = findHealtStatusChildByClassName('infected-container')
                    const virusBar = infectedContainer.firstElementChild
                    addClass(virusBar, 'glow')
                    return `You are infected to a ${
                        this.enemy.virus
                    }. You can view which viruses you are infected to at the ${
                        IS_MOBILE ? `top` : `bottom left`
                    } of the screen. Use appropriate vaccines to defuse the desired infections.`
                }, Progress.builder().setRenderProgress(100000000)),
            )
            activateAllProgresses(100000000)
        }
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
