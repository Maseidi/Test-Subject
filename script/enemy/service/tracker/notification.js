import { getNoOffenseCounter } from '../../../variables.js'
import { GUESS_SEARCH } from '../../util/enemy-constants.js'
import { AbstractNotificationService } from '../abstract/notification.js'

export class TrackerNotificationService extends AbstractNotificationService {
    constructor(enemy) {
        super(enemy)
    }

    switch2ChaseMode() {
        if ( getNoOffenseCounter() !== 0 ) return
        this.enemy.state = GUESS_SEARCH
        this.enemy.guessCounter = 1
    }

}