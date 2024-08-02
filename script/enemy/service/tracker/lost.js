import { NormalLostService } from '../normal/lost.js'
import { INVESTIGATE } from '../../util/enemy-constants.js'

export class TrackerLostService extends NormalLostService {
    constructor(enemy) {
        super(enemy)
    }

    handleLostState() {
        this.enemy.state = INVESTIGATE
    }

}