import { poisonPlayer } from '../../../player-health.js'
import { CHASE, NO_OFFENCE } from '../../util/enemy-constants.js'
import { AbstractMovementService } from '../abstract/movement.js'
import { addAttribute, addClass, collide, isThrowing } from '../../../util.js'
import { getCurrentRoom, getCurrentRoomPoisons, getPlayer } from '../../../elements.js'

export class StingerMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    displaceEnemy() {
        this.enemy.poisonCounter = this.enemy.poisonCounter || 0
        if ( this.enemy.poisonCounter === 900 ) this.addPoison()
        this.enemy.poisonCounter += 1
        this.enemy.pathFindingService.findPath()
        this.move2Destination()
    }

    addPoison() {
        const posion = document.createElement('img')
        addClass(posion, 'poison')
        posion.src = `../assets/images/poison.png`
        posion.style.left = `${this.enemy.x}px`
        posion.style.top = `${this.enemy.y}px`
        addAttribute(posion, 'time', 0) 
        getCurrentRoom().append(posion)
        getCurrentRoomPoisons().push(posion)
        this.enemy.poisonCounter = 0
    }

    playerInRange() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || 
             !collide(this.enemy.sprite, getPlayer(), 0) ) 
            return false
        if ( this.enemy.state === CHASE ) {
            const decision = Math.random()
            if ( isThrowing() || decision < 0.5 ) {
                if ( Math.random() < 0.5 ) poisonPlayer()
                this.enemy.offenceService.hitPlayer()
                return
            }
            if ( Math.random() < 0.5 ) poisonPlayer()
            this.enemy.grabService.grabPlayer()
        }
        return true
    }

}