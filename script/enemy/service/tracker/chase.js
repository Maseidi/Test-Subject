import { NormalChaseService } from '../normal/chase.js'
import { GUESS_SEARCH } from '../../util/enemy-constants.js'

export class TrackerChaseService extends NormalChaseService {
    constructor(enemy) {
        super(enemy)
    }

    handleChaseState() {
        this.enemy.state = GUESS_SEARCH
        this.enemy.guessCounter = 1
    }

}