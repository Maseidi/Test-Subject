import { CHASE } from '../../util/enemy-constants.js'
import { getNoOffenseCounter } from '../../../variables.js'
import { NormalInvestigationService } from '../normal/investigate.js'

export class TrackerInvestigationService extends NormalInvestigationService {
    constructor(enemy) {
        super(enemy)
    }

    handleInvestigationState() {
        if ( this.enemy.movementService.distance2Player() < 50 && getNoOffenseCounter() === 0 ) {
            this.enemy.state = CHASE
            return
        }
        const counter = this.enemy.investigationCounter
        if ( this.enemy.investigationCounter >= 0 ) this.enemy.investigationCounter += 1
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.enemy.angleService.checkSurroundings()
        if ( counter >= 300 ) this.enemy.investigationCounter = 0  
    }

}