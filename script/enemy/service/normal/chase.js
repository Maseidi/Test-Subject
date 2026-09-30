export class NormalChaseService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleChaseState() {
        this.enemy.movementService.accelerateEnemy()
        this.enemy.notificationService.updateDestination2Player()
        this.enemy.movementService.displaceEnemy()
    }
}
