import { AbstractAngleService } from '../service/abstract/angle.js'
import { AbstractVisionService } from '../service/abstract/vision.js'
import { AbstractInjuryService } from '../service/abstract/injury.js'
import { AbstractOffenceService } from '../service/abstract/offence.js'
import { AbstractMovementService } from '../service/abstract/movement.js'
import { AbstractCollisionService } from '../service/abstract/collision.js'
import { AbstractPathFindingService } from '../service/abstract/path-finding.js'
import { AbstractNotificationService } from '../service/abstract/notification.js'

export class AbstractEnemy {
    constructor(type, components, waypoint, health, damage, knock, maxSpeed, progress, vision, acceleration, loot, activeProgress) {
        this.type = type
        this.components = components
        this.waypoint = waypoint
        this.health = health
        this.damage = damage
        this.knock = knock
        this.maxSpeed = maxSpeed
        this.progress = progress
        this.virus = ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        this.vision = vision
        this.acceleration = acceleration
        this.loot = loot
        this.activeProgress = activeProgress
        this.x = waypoint.points[0].x
        this.y = waypoint.points[0].y
        this.angleService = new AbstractAngleService(this)
        this.injuryService = new AbstractInjuryService(this)
        this.offenceService = new AbstractOffenceService(this)
        this.pathFindingService = new AbstractPathFindingService(this)
        this.notificationService = new AbstractNotificationService(this)
        this.visionService = new AbstractVisionService(this)
        this.movementService = new AbstractMovementService(this)
        this.collisionService = new AbstractCollisionService(this)
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