export class TrackerGuessSearchService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleGuessSearchState() {
        if ( this.enemy.guessCounter > 0 ) this.enemy.guessCounter += 1
        if ( this.enemy.guessCounter !== 0 && this.enemy.guessCounter <= 45 ) this.enemy.notificationService.updateDestination2Player()
        else this.enemy.guessCounter = 0
        this.enemy.stopCounter = this.enemy.stopCounter ?? 0
        if ( this.enemy.stopCounter > 0 ) this.enemy.stopCounter += 1
        if ( this.enemy.stopCounter === 10 ) this.enemy.stopCounter = 0
        if ( this.enemy.stopCounter > 0 ) return 
        this.enemy.movementService.displaceEnemy()
    }
    
}