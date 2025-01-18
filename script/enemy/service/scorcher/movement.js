import { setPlayer2Fire } from '../../../player-health.js'
import { CHASE, NO_OFFENCE } from '../../enemy-constants.js'
import { addClass, collide, isThrowing } from '../../../util.js'
import { AbstractMovementService } from '../abstract/movement.js'
import { getCurrentRoom, getCurrentRoomFlames, getPlayer } from '../../../elements.js'

export class ScorcherMovementService extends AbstractMovementService {
    constructor(enemy) {
        super(enemy)
    }

    displaceEnemy() {
        this.enemy.flameCounter = this.enemy.flameCounter || 0
        if ( this.enemy.flameCounter === 600 ) this.addFlame()
        this.enemy.flameCounter += 1
        this.enemy.pathFindingService.findPath()
        this.move2Destination()
    }

    addFlame() {
        if ( getCurrentRoomFlames().length >= 10 ) return
        const flame = document.createElement('img')
        addClass(flame, 'flame')
        flame.src = `../assets/images/fire.gif`
        flame.style.left = `${this.enemy.x}px` 
        flame.style.top = `${this.enemy.y}px`
        flame.setAttribute('time', 0) 
        getCurrentRoom().append(flame)
        getCurrentRoomFlames().push(flame)
        this.enemy.flameCounter = 0
    }

    playerInRange() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || 
             !collide(this.enemy.sprite, getPlayer(), 0) ) 
            return false
        if ( this.enemy.state === CHASE ) {
            const decision = Math.random()
            if ( isThrowing() || decision < 0.5 ) {
                if ( Math.random() < 0.5 ) setPlayer2Fire()
                this.enemy.offenceService.hitPlayer()
                return
            }
            if ( Math.random() < 0.5 ) setPlayer2Fire()
            this.enemy.grabService.grabPlayer()
        }
        return true
    }

}