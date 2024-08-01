export class NormalGuessSearchService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleGuessSearchState() {
        this.enemy.movementService.accelerateEnemy()
        if ( this.enemy.visionService.playerLocated() ) return
        if ( this.enemy.guessCounter > 0 ) this.enemy.guessCounter += 1
        if ( this.enemy.guessCounter !== 0 && this.enemy.guessCounter <= 15 ) this.enemy.notificationService.updateDestination2Player()
        else this.enemy.guessCounter = 0
        this.enemy.movementService.displaceEnemy()
    }    

}