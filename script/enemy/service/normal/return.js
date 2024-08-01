export class NormalReturnService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleMove2PositionState() {
        this.enemy.movementService.accelerateEnemy()
        if ( this.enemy.visionService.playerLocated() ) return
        const dest = document.getElementById(this.enemy.path).children[this.enemy.pathPoint]
        this.enemy.notificationService.updateDestination2Path(dest)
        this.enemy.movementService.displaceEnemy()
    }

}