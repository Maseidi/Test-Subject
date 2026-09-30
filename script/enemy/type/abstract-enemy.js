import { SinglePointPath } from '../../path.js'
import { AbstractAngleService } from '../service/abstract/angle.js'
import { AbstractInjuryService } from '../service/abstract/injury.js'
import { AbstractMovementService } from '../service/abstract/movement.js'
import { AbstractNotificationService } from '../service/abstract/notification.js'
import { AbstractOffenceService } from '../service/abstract/offence.js'
import { AbstractPathFindingService } from '../service/abstract/path-finding.js'
import { AbstractVisionService } from '../service/abstract/vision.js'

export class AbstractEnemy {
    constructor(
        type,
        components,
        waypoint,
        health,
        damage,
        maxSpeed,
        vision,
        acceleration,
        virus,
        level,
        knock,
    ) {
        this.type = type ?? null
        this.components = components ?? 0
        this.waypoint = waypoint ?? new SinglePointPath(0, 0)
        this.health = health ?? 0
        this.damage = damage ?? 0
        this.maxSpeed = maxSpeed ?? 0
        this.virus = virus ?? ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        this.vision = vision ?? 0
        this.acceleration = acceleration ?? 0
        this.x = this.waypoint.points[0].x ?? 0
        this.y = this.waypoint.points[0].y ?? 0
        this.level = level ?? 1
        this.knock = knock ?? 100
        this.knockImmune = false
        this.healthMultiplier = 1
        this.maxHealth = this.health
    
        this.angleService = new AbstractAngleService(this)
        this.injuryService = new AbstractInjuryService(this)
        this.offenceService = new AbstractOffenceService(this)
        this.pathFindingService = new AbstractPathFindingService(this)
        this.notificationService = new AbstractNotificationService(this)
        this.visionService = new AbstractVisionService(this)
        this.movementService = new AbstractMovementService(this)
    }

    behave() {
        if (this.health === 0) return
        this.visionService.look4Player()
        this.injuryService.manageDamagedMode()
        this.manageState()
    }

    manageState() {
        /*signature*/
    }
}
