import { GUESS_SEARCH } from '../../util/enemy-constants.js'

export class NormalChaseService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleChaseState() {  
        this.enemy.movementService.accelerateEnemy()
        if ( this.enemy.visionService.isPlayerVisible() ) this.enemy.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER)
        else {
            this.enemy.state = GUESS_SEARCH
            this.enemy.guessCounter = 1
        }
        this.enemy.movementService.displaceEnemy()
    }

}