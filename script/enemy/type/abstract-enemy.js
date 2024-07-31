export class AbstractEnemy {
    constructor(type, components, waypoint, health, damage, knock, maxSpeed, progress, vision, acceleration) {
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
        this.x = waypoint.points[0].x
        this.y = waypoint.points[0].y
    }

}