import { AbstractVisionService } from '../abstract/vision.js'

export class SpikerVisionService extends AbstractVisionService {
    constructor(enemy) {
        super(enemy)
    }

    isPlayerVisible() {
        return this.enemy.wallInTheWay === false
    }

}