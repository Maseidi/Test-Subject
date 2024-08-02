import { addClass } from '../../../util.js'
import { knockObject } from '../../../knock-manager.js'
import { damagePlayer } from '../../../player-health.js'
import { getMapEl, getPlayer } from '../../../elements.js'
import { getMapX, getMapY, getPlayerX, getPlayerY, setMapX, setMapY, setPlayerX, setPlayerY } from '../../../variables.js'

export class AbstractOffenceService {
    constructor(enemy) {
        this.enemy = enemy
    }

    hitPlayer() {
        addClass(this.enemy.htmlTag.firstElementChild.firstElementChild.firstElementChild, 'attack')
        damagePlayer(this.enemy.damage)
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
                finalKnock = knockObject('to-down', getPlayer(), knock)
                break
            case 1:
            case 2:
            case 3:
                xAxis = 1
                yAxis = 0
                finalKnock = knockObject('to-left', getPlayer(), knock)
                break
            case 4:
                xAxis = 0
                yAxis = 1
                finalKnock = knockObject('to-up', getPlayer(), knock)
                break
            case 5:
            case 6:
            case 7:
                xAxis = -1
                yAxis = 0
                finalKnock = knockObject('to-right', getPlayer(), knock)
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