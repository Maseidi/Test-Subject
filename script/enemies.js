import { IRON_MASTER, RANGER, ROCK_CRUSHER, SOUL_DRINKER, SPIKER, TORTURER } from './enemy-constants.js'

class Enemy {
    constructor(type, components, path, health, damage, knock, maxSpeed, progress, vision, acceleration) {
        this.type = type
        this.components = components
        this.path = path
        this.health = health
        this.damage = damage
        this.knock = knock
        this.maxSpeed = maxSpeed
        this.progress = progress
        this.virus = ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        this.vision = vision
        this.acceleration = acceleration
    }
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Path {
    constructor(points) {
        this.points = points
    }
}

class SinglePointPath extends Path {
    constructor(x, y) {
        super([new Point(x, y)])
    }
}

class DoublePointPath extends Path {
    constructor(x1, y1, x2, y2) {
        super([
            new Point(x1, y1),
            new Point(x2, y2)
        ])
    }
}

class VerDoublePointPath extends DoublePointPath {
    constructor(x, y, distance) {
        super(x, y, x, y + distance)
    }
}

class HorDoublePointPath extends DoublePointPath {
    constructor(x, y, distance) {
        super(x, y, x + distance, y)
    }
}

class RectPath extends Path {
    constructor(x, y, width, height) {
        super([
            new Point(x, y),
            new Point(x + width, y),
            new Point(x + width, y + height),
            new Point(x, y + height)
        ])
    }
}

class SquarePath extends RectPath {
    constructor(x, y, width) {
        super(x, y, width, width)
    }
}

class Torturer extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 180 + Math.random() * 20)
        const damage = Math.floor(level * 20 + Math.random() * 10)
        const maxSpeed = 3.5 + Math.random()
        super(TORTURER, 4, path, health, damage, 100, maxSpeed, progress, 600, 1.5)
    }
}

class SoulDrinker extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 90 + Math.random() * 15)
        const damage = Math.floor(level * 10 + Math.random() * 5)
        const maxSpeed = 4.5 + Math.random()
        super(SOUL_DRINKER, 4, path, health, damage, 50, maxSpeed, progress, 400, 0.9)
    }
}

class RockCrusher extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 360 + Math.random() * 45)
        const damage = Math.floor(level * 40 + Math.random() * 20)
        const maxSpeed = 2.5 + Math.random()
        super(ROCK_CRUSHER, 4, path, health, damage, 200, maxSpeed, progress, 800, 1.8)
    }
}

class IronMaster extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 135 + Math.random() * 15)
        const damage = Math.floor(level * 30 + Math.random() * 15)
        const maxSpeed = 3 + Math.random()
        super(IRON_MASTER, 8, path, health, damage, 150, maxSpeed, progress, 500, 1.2)
    }
}

class Ranger extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 112 + Math.random() * 17)
        const damage = Math.floor(level * 25 + Math.random() * 5)
        const maxSpeed = 4 + Math.random()
        const vision = Math.floor(500 + Math.random() * 300)
        super(RANGER, 6, path, health, damage, 75, maxSpeed, progress, vision, 2)
    }
}

class Spiker extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 25 + Math.random() * 5)
        const damage = Math.floor(level * 15 + Math.random() * 5)
        const maxSpeed = 6 + Math.random()
        super(SPIKER, 6, path, health, damage, 100, maxSpeed, progress, 1000, maxSpeed)
        this.axis = Math.random() < 0.5 ? 1 : 2
    }
}

export const enemies = new Map([
    [37, [
        new Torturer(1, new SquarePath(650, 240, 300), '1'),
        new Torturer(1, new VerDoublePointPath(800, 100, 300), '2'),
        new Torturer(1, new SquarePath(650, 240, 300), '3'),
        new SoulDrinker(1, new SinglePointPath(650, 140), '3'),
        new RockCrusher(1, new SinglePointPath(850, 140), '3'),
        new IronMaster(1, new HorDoublePointPath(1000, 140, 500), '3'),
        new Ranger(1, new SquarePath(600, 100, 300), '3'),
        new Ranger(1, new SquarePath(700, 100, 300), '3'),
        new Ranger(1, new SquarePath(800, 100, 300), '3'),
        new Spiker(1, new SquarePath(600, 600, 100), '3'),
        new Spiker(1, new SquarePath(700, 600, 100), '3'),
        new Spiker(1, new SquarePath(800, 600, 100), '3'),
    ]]
])