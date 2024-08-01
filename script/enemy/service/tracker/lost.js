import { INVESTIGATE } from '../../util/enemy-constants.js'

export class TrackerLostService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleLostState() {
        this.enemy.state = INVESTIGATE
    }

}