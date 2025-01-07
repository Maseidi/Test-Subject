import { distance, getProperty } from '../../../util.js'
import { getCurrentRoomEnemies, getPlayer } from '../../../elements.js'
import { CHASE, GO_FOR_RANGED, GRAB, NO_OFFENCE, STAND_AND_WATCH, STUNNED, TRACKER } from '../../enemy-constants.js'
import { getIsSurvival, getNoOffenseCounter, getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'

export class AbstractNotificationService {
    constructor(enemy) {
        this.enemy = enemy
    }

    updateDestination2Player() { 
        this.#updateDestination(Math.floor(getPlayerX() - getRoomLeft()), Math.floor(getPlayerY() - getRoomTop()), 34)
    }

    updateDestination2Path(path) {
        this.#updateDestination(getProperty(path, 'left', 'px'), getProperty(path, 'top', 'px'), 10)
    }

    #updateDestination(x, y, width) {
        this.enemy.destX = x
        this.enemy.destY = y
        this.enemy.destWidth = width
    }

    notifyEnemy(dist) {
        if ( getIsSurvival() && this.enemy.type !== TRACKER ) this.updateDestination2Player()
        if ( [STUNNED, STAND_AND_WATCH, GRAB].includes(this.enemy.state) ) return
        if ( distance(getPlayer(), this.enemy.sprite) <= dist ) {
            this.switch2ChaseMode()
            this.updateDestination2Player()
            this.notifyNearbyEnemies()
        }
    }

    switch2ChaseMode() {
        if ( this.enemy.state === GO_FOR_RANGED ) return
        this.enemy.state = getNoOffenseCounter() === 0 ? CHASE : NO_OFFENCE
    }

    notifyNearbyEnemies() {
        getCurrentRoomEnemies()
            .filter(e => e.sprite !== this.enemy.sprite &&
                         e.state !== CHASE && e.state !== NO_OFFENCE && 
                         e.state !== GO_FOR_RANGED && e.type !== TRACKER &&
                         (distance(this.enemy.sprite, e.sprite) < 500 )
            ).forEach(e => e.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER))
    }

}