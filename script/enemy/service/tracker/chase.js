import { GUESS_SEARCH } from '../../enemy-constants.js'
import { NormalChaseService } from '../normal/chase.js'

export class TrackerChaseService extends NormalChaseService {
    constructor(enemy) {
        super(enemy)
    }

    handleChaseState() {
        this.enemy.state = GUESS_SEARCH
        this.enemy.guessCounter = 1
    }
}
