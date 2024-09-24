import { getCurrentRoomSolid, getPlayer } from '../../../elements.js'
import { collide, containsClass, getProperty } from '../../../util.js'

export class AbstractVisionService {
    constructor(enemy) {
        this.enemy = enemy
    }

    playerSpotted() {
        const visible = this.isPlayerVisible()
        if ( visible ) this.enemy.notificationService.switch2ChaseMode()
        return visible
    }

    look4Player() {
        this.getWallInTheWay()
        this.vision2Player()
    }

    getWallInTheWay() {
        this.enemy.wallCheckCounter = this.enemy.wallCheckCounter ?? 1
        this.enemy.wallCheckCounter = this.enemy.wallCheckCounter + 1 === 21 ? 0 : this.enemy.wallCheckCounter + 1
        if ( this.enemy.wallCheckCounter !== 20 ) return
        const walls = getCurrentRoomSolid().filter(solid => !containsClass(solid, 'enemy-collider') )
        const vision = this.enemy.sprite.firstElementChild.children[1]
        for ( const component of vision.children ) {
            if ( collide(component, getPlayer(), 0) ) {
                this.enemy.wallInTheWay = false
                return
            }
            for ( const wall of walls )
                if ( collide(component, wall, 0) ) {
                    this.enemy.wallInTheWay = wall.id
                    return
                }
        }
        this.enemy.wallInTheWay = 'out-of-range'
    }

    vision2Player() {
        const vision = this.enemy.sprite.firstElementChild.children[1]
        vision.style.transform = `rotateZ(${this.enemy.angleService.angle2Player()}deg)`
    }

    isPlayerVisible() {
        let result = false
        return result
        if ( this.enemy.wallInTheWay !== false ) return result
        const angle = getProperty(this.enemy.sprite.firstElementChild.children[1], 'transform', 'rotateZ(', 'deg)')
        const predicateRunner = this.predicate(this.enemy.angleState, angle)
        const runners = [
            predicateRunner(0, 80, -80, 0),
            predicateRunner(0, 125, -35, 0),
            predicateRunner(10, 90, 90, 170),
            predicateRunner(55, 180, -180, -145),
            predicateRunner(100, 180, -180, -100),
            predicateRunner(145, 180, -180, -55),
            predicateRunner(-170, -90, -90, -10),
            predicateRunner(0, 35, -125, 0)
        ]
        return runners.reduce((a, b) => a || b)
    }
    
    predicate(state, angle) {
        let stateCounter = -1
        return (s1, e1, s2, e2) => {
            stateCounter++
            return state === stateCounter && ((angle > s1 && angle < e1) || (angle > s2 && angle <= e2)) 
        }
    }

}