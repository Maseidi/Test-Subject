import { AbstractAngleService } from '../abstract/angle.js'

export class SpikerAngleService extends AbstractAngleService {
    constructor(enemy) {
        super(enemy)
    }

    updateDetectors(state) {
        if ( this.enemy.axis === 1 ) {
            if ( [5, 6, 7].includes(state) ) super.updateDetectors(6)
            else if ( [1, 2, 3].includes(state) ) super.updateDetectors(2)
        } else {
            if ( [3, 4, 5].includes(state) ) super.updateDetectors(4)
            else if ( [0, 1, 7].includes(state) ) super.updateDetectors(0)    
        }
    }

}