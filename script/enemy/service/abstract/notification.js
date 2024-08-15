import { distance, getProperty } from '../../../util.js'
import { getCurrentRoomEnemies, getPlayer } from '../../../elements.js'
import { CHASE, GO_FOR_RANGED, NO_OFFENCE, STUNNED, TRACKER } from '../../util/enemy-constants.js'
import { getNoOffenseCounter, getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'

export class AbstractNotificationService {
    constructor(enemy) {
        this.enemy = enemy
    }

    updateDestination2Player() { 
        this.updateDestination(Math.floor(getPlayerX() - getRoomLeft()), Math.floor(getPlayerY() - getRoomTop()), 34)
    } 

    updateDestination2Path = (path) => {
        this.updateDestination(getProperty(path, 'left', 'px'), getProperty(path, 'top', 'px'), 10)
    }

    updateDestination(x, y, width) {
        this.enemy.destX = x
        this.enemy.destY = y
        this.enemy.destWidth = width
    }

    notifyEnemy(dist) {
        if ( this.enemy.state === STUNNED ) return
        const enemyBound = this.enemy.htmlTag.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        if ( distance(playerBound.x, playerBound.y, enemyBound.x, enemyBound.y) <= dist ) {
            this.switch2ChaseMode()
            this.updateDestination2Player()
        }
        this.notifyNearbyEnemies()
    }

    switch2ChaseMode() {
        if ( this.enemy.state === GO_FOR_RANGED ) return
        this.enemy.state = getNoOffenseCounter() === 0 ? CHASE : NO_OFFENCE
    }

    notifyNearbyEnemies() {
        getCurrentRoomEnemies()
            .filter(e => e.htmlTag !== this.enemy.htmlTag &&
                     (distance(this.enemy.htmlTag.getBoundingClientRect().x, this.enemy.htmlTag.getBoundingClientRect().y,
                     e.htmlTag.getBoundingClientRect().x, e.htmlTag.getBoundingClientRect().y) < 500 ) &&
                     e.state !== CHASE && e.state !== NO_OFFENCE && 
                     e.state !== GO_FOR_RANGED && e.type !== TRACKER
            ).forEach(e => e.notificationService.notifyEnemy(Number.MAX_SAFE_INTEGER))
    }

}