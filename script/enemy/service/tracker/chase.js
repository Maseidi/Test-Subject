import { GUESS_SEARCH } from '../../util/enemy-constants.js'

export class TrackerChaseService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleChaseState() {
        this.enemy.state = GUESS_SEARCH
        this.enemy.guessCounter = 1
    }

}