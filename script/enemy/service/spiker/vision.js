import { getIsSurvival } from '../../../variables.js'
import { AbstractVisionService } from '../abstract/vision.js'

export class SpikerVisionService extends AbstractVisionService {
    constructor(enemy) {
        super(enemy)
    }

    isPlayerVisible() {
        if ( getIsSurvival() ) return true
        return this.enemy.wallInTheWay === false
    }

}