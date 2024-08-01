import { MOVE_TO_POSITION } from '../../util/enemy-constants.js'

export class NormalLostService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleLostState() {
        if ( this.enemy.visionService.playerLocated() ) return
        if ( this.enemy.lostCounter === 600 ) {
            this.enemy.state = MOVE_TO_POSITION
            return
        }
        if ( this.enemy.lostCounter % 120 === 0 ) this.enemy.angleService.checkSurroundings()
        this.enemy.lostCounter += 1
    }

}