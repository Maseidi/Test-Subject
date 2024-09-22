import { getPlayer } from '../../../elements.js'
import { angleOf2Points } from '../../../util.js'
import { SPIKER, TRACKER } from '../../enemy-constants.js'

export class AbstractAngleService {
    constructor(enemy) {
        this.enemy = enemy
    }

    DETECTOR_MAP = new Map([
        [0, {fwX: '-50%',  fwY: '0'    }],
        [1, {fwX: '-100%', fwY: '0'    }],
        [2, {fwX: '-100%', fwY: '-50%' }],
        [3, {fwX: '-100%', fwY: '-100%'}],
        [4, {fwX: '-50%',  fwY: '-100%'}],
        [5, {fwX: '0',     fwY: '-100%'}],
        [6, {fwX: '0',     fwY: '-50%' }],
        [7, {fwX: '0',     fwY: '0'    }],
    ])

    calculateAngle = (x, y) => {
        const currState = this.enemy.angleState || 0
        const currAngle = this.enemy.angle || 0
        let newState = this.#getNewState(x, y, currState)
        if ( newState === currState ) return
        this.updateDetectors(newState)
        let diff = newState - currState
        if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
        else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
        const newAngle = currAngle + diff * 45
        this.enemy.angle = newAngle
        this.enemy.angleState = newState
        this.enemy.sprite.firstElementChild.firstElementChild.style.transform = `rotateZ(${this.enemy.angle}deg)`
    }

    #getNewState(x, y, currState) {
        let result
        if ( !x && y === 1 )             result = 0
        else if ( x === -1 && y === 1 )  result = 1
        else if ( x === -1 && !y )       result = 2
        else if ( x === -1 && y === -1 ) result = 3
        else if ( !x && y === -1 )       result = 4
        else if ( x === 1 && y === -1 )  result = 5
        else if ( x === 1 && !y )        result = 6
        else if ( x === 1 && y === 1 )   result = 7
        else result = currState
        return result
    }

    updateDetectors(state) {
        const {fwX, fwY} = this.DETECTOR_MAP.get(state)
        const {fwX: bwX, fwY: bwY} = this.DETECTOR_MAP.get((state + 4) % 8)
        this.#updateForwardDetector(fwX, fwY)
        this.#updateBackwardDetector(bwX, bwY)
    }

    #updateForwardDetector(x, y) {
        this.#applyDetectorUpdate(this.enemy.sprite.firstElementChild.children[2], x, y)
    }

    #updateBackwardDetector(x, y) {
        if ( [SPIKER, TRACKER].includes(this.enemy.type) ) return
        this.#applyDetectorUpdate(this.enemy.sprite.firstElementChild.children[3], x, y)
    }

    #applyDetectorUpdate(detector, x, y) {
        detector.style.transform = `translateX(${x}) translateY(${y})`
    }

    angle2Player() {
        return this.angle2Target(getPlayer())
    }

    angle2Target(target) {
        const enemyBound = this.enemy.sprite.getBoundingClientRect()
        const targetBound = target.getBoundingClientRect()
        return angleOf2Points(enemyBound.x + enemyBound.width / 2, enemyBound.y + enemyBound.height / 2, 
                                targetBound.x + targetBound.width / 2, targetBound.y + targetBound.height / 2)
    }

    checkSurroundings() {
        const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        this.calculateAngle(x, y)
    }

}