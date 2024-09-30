import { SinglePointPath } from '../../path.js'
import { getDifficulty } from '../../variables.js'
import { difficulties as difficultyMap } from '../../util.js'
import { AbstractAngleService } from '../service/abstract/angle.js'
import { AbstractVisionService } from '../service/abstract/vision.js'
import { AbstractInjuryService } from '../service/abstract/injury.js'
import { AbstractOffenceService } from '../service/abstract/offence.js'
import { AbstractMovementService } from '../service/abstract/movement.js'
import { AbstractCollisionService } from '../service/abstract/collision.js'
import { AbstractPathFindingService } from '../service/abstract/path-finding.js'
import { AbstractNotificationService } from '../service/abstract/notification.js'

export class AbstractEnemy {
    constructor(type, components, waypoint, health, damage, 
        maxSpeed, vision, acceleration, loot, progress, virus, difficulties) {
        this.type =                type ?? null
        this.components =          components ?? 0
        this.waypoint =            waypoint ?? new SinglePointPath(0, 0)
        this.health =              health ?? 0
        this.damage =              damage ?? 0
        this.maxSpeed =            maxSpeed ?? 0
        this.virus =               virus ?? ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        this.vision =              vision ?? 0
        this.acceleration =        acceleration ?? 0
        this.loot =                loot ?? null
        this.renderProgress =      progress?.renderProgress ?? String(Number.MAX_SAFE_INTEGER)
        this.progress2Active =     progress?.progress2Active ?? []
        this.progress2Deactive =   progress?.progress2Deactive ?? []
        this.killAll =             progress?.killAll ?? null
        this.x =                   waypoint.points[0].x ?? 0
        this.y =                   waypoint.points[0].y ?? 0
        this.difficulties =        difficulties ?? [difficultyMap.MILD, difficultyMap.MIDDLE, difficultyMap.SURVIVAL]
        this.angleService =        new AbstractAngleService(this)
        this.injuryService =       new AbstractInjuryService(this)
        this.offenceService =      new AbstractOffenceService(this)
        this.pathFindingService =  new AbstractPathFindingService(this)
        this.notificationService = new AbstractNotificationService(this)
        this.visionService =       new AbstractVisionService(this)
        this.movementService =     new AbstractMovementService(this)
        this.collisionService =    new AbstractCollisionService(this)
        this.handleDifficulty()
    }

    handleDifficulty() {
        if ( getDifficulty() === difficultyMap.MILD )     var times = 0.5
        if ( getDifficulty() === difficultyMap.MIDDLE )   var times = 1
        if ( getDifficulty() === difficultyMap.SURVIVAL ) var times = 1.5
        this.damage *= times
        this.health *= times
    }

    behave() {
        if ( this.health === 0 ) return
        this.visionService.look4Player()
        this.injuryService.manageDamagedMode()
        this.injuryService.manageExplosionMode()
        this.collisionService.manageCollision()
        this.manageState()
    }
    
    manageState() { /*signature*/ }

}