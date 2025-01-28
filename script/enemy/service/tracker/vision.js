import { IS_MOBILE } from '../../../script.js'
import { AbstractVisionService } from '../abstract/vision.js'

export class TrackerVisionService extends AbstractVisionService {
    constructor(enemy) {
        super(enemy)
    }

    getWallInTheWay() {
        if ( IS_MOBILE ) super.getWallInTheWay()
    }

    vision2Player() {
        if ( IS_MOBILE ) super.vision2Player()
        return
    }
}
