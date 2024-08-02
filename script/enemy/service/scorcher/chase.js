import { NormalChaseService } from '../normal/chase.js'
import { addAttribute, addClass } from '../../../util.js'
import { getCurrentRoom, getCurrentRoomFlames } from '../../../elements.js'

export class ScorcherChaseService extends NormalChaseService {
    constructor(enemy) {
        super(enemy)
    }

    handleChaseState() {
        this.enemy.flameCounter = this.enemy.flameCounter || 0
        if ( this.enemy.flameCounter === 600 ) this.addFlame()
        this.enemy.flameCounter += 1
        super.handleChaseState()
    }

    addFlame() {
        const flame = document.createElement('img')
        addClass(flame, 'flame')
        flame.src = `../assets/images/fire.gif`
        flame.style.left = `${this.enemy.x}px` 
        flame.style.top = `${this.enemy.y}px`
        addAttribute(flame, 'time', 0) 
        getCurrentRoom().append(flame)
        getCurrentRoomFlames().push(flame)
        this.enemy.flameCounter = 0
    }

}