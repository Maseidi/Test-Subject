class Enemy {
    constructor(type, components, left, top, health, damage, speed, progress, virus, vision) {
        this.type = type
        this.components = components
        this.left = left
        this.top = top
        this.health = health
        this.damage = damage
        this.speed = speed
        this.progress = progress
        this.virus = virus
        this.vision = vision
    }
}

class Torturer extends Enemy {
    constructor(left, top, progress) {
        const health = Math.floor(90 + Math.random() * 20)
        const damage = Math.floor(17 + Math.random() * 6)
        const virus = ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        super('torturer', 4, left, top, health, damage, 4, progress, virus, 600)
    }
}

export const enemies = new Map([
    [37, [
        new Torturer(1000, 400, 0)
    ]]
])