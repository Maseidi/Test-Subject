class Enemy {
    constructor(type, components, path, health, damage, knock, speed, progress, virus, vision) {
        this.type = type
        this.components = components
        this.path = path
        this.health = health
        this.damage = damage
        this.knock = knock
        this.speed = speed
        this.progress = progress
        this.virus = virus
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
    constructor(path, progress) {
        const health = Math.floor(90 + Math.random() * 20)
        const damage = Math.floor(17 + Math.random() * 6)
        const virus = ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        super('torturer', 4, path, health, damage, 20, 4, progress, virus, 600)
    }
}

export const enemies = new Map([
    [37, [
        new Torturer(new SquarePath(650, 240, 300), 'a1'),
        new Torturer(new VerDoublePointPath(800, 100, 300), 'b2'),
        new Torturer(new SinglePointPath(100, 100), 'c3'),
    ]]
])