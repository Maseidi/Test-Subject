import { addClass, collide } from '../../util.js'
import { takeDamage } from '../../player-health.js'
import { manageKnock } from '../../knock-manager.js'
import { getMapEl, getPlayer } from '../../elements.js'
import { CHASE, NO_OFFENCE } from '../util/enemy-constants.js'
import { getMapX, getMapY, getPlayerX, getPlayerY, setMapX, setMapY, setPlayerX, setPlayerY } from '../../variables'

export class AbstractOffeceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    collidePlayer() {
        if ( ( this.enemy.state !== CHASE && this.enemy.state !== NO_OFFENCE ) || 
             !collide(this.enemy.htmlTag, getPlayer(), 0) ) return false
        if ( this.enemy.state === CHASE ) this.hitPlayer()
        return true
    }

    hitPlayer() {
        addClass(this.enemy.htmlTag.firstElementChild.firstElementChild.firstElementChild, 'attack')
        takeDamage(this.enemy.damage)
        this.knockPlayer()
    }

    knockPlayer() {
        const knock = this.enemy.knock
        let xAxis, yAxis
        let finalKnock
        switch ( this.enemy.angleState ) {
            case 0: 
                xAxis = 0
                yAxis = -1
                finalKnock = manageKnock('to-down', getPlayer(), knock)
                break
            case 1:
            case 2:
            case 3:
                xAxis = 1
                yAxis = 0
                finalKnock = manageKnock('to-left', getPlayer(), knock)
                break
            case 4:
                xAxis = 0
                yAxis = 1
                finalKnock = manageKnock('to-up', getPlayer(), knock)
                break
            case 5:
            case 6:
            case 7:
                xAxis = -1
                yAxis = 0
                finalKnock = manageKnock('to-right', getPlayer(), knock)
                break                
        }
        if ( xAxis === null && yAxis === null ) return
        setMapX(xAxis * finalKnock + getMapX())
        setMapY(yAxis * finalKnock + getMapY())
        setPlayerX(-xAxis * finalKnock + getPlayerX())
        setPlayerY(-yAxis * finalKnock + getPlayerY())
        getMapEl().style.left = `${getMapX()}px`
        getMapEl().style.top = `${getMapY()}px`
        getPlayer().style.left = `${getPlayerX()}px`
        getPlayer().style.top = `${getPlayerY()}px`
    }

}