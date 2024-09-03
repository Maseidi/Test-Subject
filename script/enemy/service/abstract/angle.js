import { getPlayer } from '../../../elements.js'
import { angleOf2Points } from '../../../util.js'

export class AbstractAngleService {
    constructor(enemy) {
        this.enemy = enemy
    }

    calculateAngle = (x, y) => {
        const currState = this.enemy.angleState || 0
        const currAngle = this.enemy.angle || 0
        let newState = currState
        if ( x === 1 && y === 1 )        newState = this.changeEnemyAngleState(7, '0', '0')
        else if ( x === 1 && y === -1 )  newState = this.changeEnemyAngleState(5, '0', '-100%')
        else if ( x === -1 && y === 1 )  newState = this.changeEnemyAngleState(1, '-100%', '0')    
        else if ( x === -1 && y === -1 ) newState = this.changeEnemyAngleState(3, '-100%', '-100%')
        else if ( x === 1 && !y )        newState = this.changeEnemyAngleState(6, '0', '-50%')
        else if ( x === -1 && !y )       newState = this.changeEnemyAngleState(2, '-100%', '-50%')
        else if ( !x && y === 1 )        newState = this.changeEnemyAngleState(0, '-50%', '0')
        else if ( !x && y === -1 )       newState = this.changeEnemyAngleState(4, '-50%', '-100%')
        if ( newState === currState ) return
        let diff = newState - currState
        if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
        else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
        const newAngle = currAngle + diff * 45    
        this.enemy.angle = newAngle
        this.enemy.angleState = newState
        this.enemy.sprite.firstElementChild.firstElementChild.style.transform = `rotateZ(${this.enemy.angle}deg)`
    }

    changeEnemyAngleState(state, translateX, translateY) {
        this.updateForwardDetector(translateX, translateY)
        this.updateBackwardDetector(translateX, translateY)
        return state
    }

    updateForwardDetector(translateX, translateY) {
        const forwardDetector = this.enemy.sprite.firstElementChild.children[2]
        forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
    }

    updateBackwardDetector(translateX, translateY) {
        const backwardDetector = this.enemy.sprite.firstElementChild.children[3]
        // TODO : implement later
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