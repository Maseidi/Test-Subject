class Enemy {
    constructor(type, components, path, health, damage, knock, speed, progress, vision) {
        this.type = type
        this.components = components
        this.path = path
        this.health = health
        this.damage = damage
        this.knock = knock
        this.speed = speed
        this.progress = progress
        this.virus = ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        this.vision = vision
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
        const speed = 3.5 + Math.random()
        super('torturer', 4, path, health, damage, 100, speed, progress, 600)
    }
}

class SoulDrinker extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 90 + Math.random() * 15)
        const damage = Math.floor(level * 10 + Math.random() * 5)
        const speed = 4.5 + Math.random()
        super('soul-drinker', 4, path, health, damage, 50, speed, progress, 400)
    }
}

class RockCrusher extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 360 + Math.random() * 45)
        const damage = Math.floor(level * 40 + Math.random() * 20)
        const speed = 2.5 + Math.random()
        super('rock-crusher', 4, path, health, damage, 200, speed, progress, 800)
    }
}

class IronMaster extends Enemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 135 + Math.random() * 15)
        const damage = Math.floor(level * 30 + Math.random() * 15)
        const speed = 3 + Math.random()
        super('iron-master', 8, path, health, damage, 150, speed, progress, 500)
    }
}

export const enemies = new Map([
    [37, [
        new Torturer(1, new SquarePath(650, 240, 300), '1'),
        new Torturer(1, new VerDoublePointPath(800, 100, 300), '2'),
        new Torturer(1, new SquarePath(650, 240, 300), '3'),
        new SoulDrinker(1, new SinglePointPath(650, 140), '3'),
        new RockCrusher(1, new SinglePointPath(850, 140), '3'),
        new IronMaster(1, new HorDoublePointPath(1000, 140, 500), '3')
    ]]
])