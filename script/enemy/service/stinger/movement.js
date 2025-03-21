import { getCurrentRoom, getCurrentRoomPoisons, getPlayer } from '../../../elements.js'
import { poisonPlayer } from '../../../player-health.js'
import { addClass, collide, isThrowing, useDeltaTime } from '../../../util.js'
import { CHASE, NO_OFFENCE } from '../../enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'

export class StingerMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    displaceEnemy() {
        this.enemy.poisonCounter = this.enemy.poisonCounter || 0
        if (this.enemy.poisonCounter >= useDeltaTime(900)) this.addPoison()
        this.enemy.poisonCounter += 1
        this.enemy.pathFindingService.findPath()
        this.move2Destination()
    }

    addPoison() {
        if (getCurrentRoomPoisons().length >= 10) return
        const poison = document.createElement('img')
        addClass(poison, 'poison')
        poison.src = `./assets/images/poison.png`
        poison.style.left = `${this.enemy.x}px`
        poison.style.top = `${this.enemy.y}px`
        poison.setAttribute('time', 0)
        getCurrentRoom().append(poison)
        getCurrentRoomPoisons().push(poison)
        this.enemy.poisonCounter = 0
    }

    playerInRange() {
        if (
            (this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE) ||
            !collide(this.enemy.sprite, getPlayer(), 0)
        )
            return false
        if (this.enemy.state === CHASE) {
            const decision = Math.random()
            if (isThrowing() || decision < 0.5) {
                if (Math.random() < 0.5) poisonPlayer()
                this.enemy.offenceService.hitPlayer()
                return
            }
            if (Math.random() < 0.5) poisonPlayer()
            this.enemy.grabService.grabPlayer()
        }
        return true
    }
}
