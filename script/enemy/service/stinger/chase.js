import { NormalChaseService } from '../normal/chase.js'
import { addAttribute, addClass } from '../../../util.js'
import { getCurrentRoom, getCurrentRoomPoisons } from '../../../elements.js'

export class StingerChaseService extends NormalChaseService {
    constructor(enemy) {
        super(enemy)
    }

    handleChaseState() {
        this.enemy.poisonCounter = this.enemy.poisonCounter || 0
        if ( this.enemy.poisonCounter === 900 ) this.addPoison()
        this.enemy.poisonCounter += 1
        super.handleChaseState()
    }

    addPoison() {
        const posion = document.createElement('img')
        addClass(posion, 'poison')
        posion.src = `../assets/images/poison.png`
        posion.style.left = `${this.enemy.x}px`
        posion.style.top = `${this.enemy.y}px`
        addAttribute(posion, 'time', 0) 
        getCurrentRoom().append(posion)
        getCurrentRoomPoisons().push(posion)
        this.enemy.poisonCounter = 0
    }

}