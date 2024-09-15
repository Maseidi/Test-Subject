export class NormalReturnService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleMove2PositionState() {
        this.enemy.movementService.accelerateEnemy()
        if ( this.enemy.visionService.playerSpotted() ) return
        const dest = this.enemy.sprite.previousSibling.children[this.enemy.pathPoint]
        this.enemy.notificationService.updateDestination2Path(dest)
        this.enemy.movementService.displaceEnemy()
    }

}